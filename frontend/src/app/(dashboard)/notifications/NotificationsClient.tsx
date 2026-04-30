'use client'

import React from 'react'
import Link from 'next/link'
import { Bell, Briefcase, Info, CheckCircle, AlertTriangle, Check } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils/cn'
import { useNotificationStore } from '@/features/notifications/store/notificationStore'
import type { Notification, NotificationType } from '@/features/notifications/types/notification.types'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

const TYPE_CONFIG: Record<NotificationType, { icon: React.ElementType; color: string; bg: string; badge: string }> = {
  job:     { icon: Briefcase,     color: 'text-primary',   bg: 'bg-primary-100', badge: 'Offre' },
  info:    { icon: Info,          color: 'text-blue-500',  bg: 'bg-blue-50',     badge: 'Info' },
  success: { icon: CheckCircle,   color: 'text-green-600', bg: 'bg-green-50',    badge: 'Succès' },
  warning: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50',    badge: 'Alerte' },
}

function NotifCard({ notif, onRead }: { notif: Notification; onRead: (id: string) => void }) {
  const { icon: Icon, color, bg, badge } = TYPE_CONFIG[notif.type]
  const timeAgo = formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: fr })

  const inner = (
    <CardContent
      className={cn(
        'flex gap-4 py-4 cursor-pointer group',
        !notif.read && 'bg-primary-50/30'
      )}
      onClick={() => onRead(notif.id)}
    >
      <div className={cn('mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', bg)}>
        <Icon className={cn('h-5 w-5', color)} aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <p className={cn('text-sm font-medium text-text-primary', !notif.read && 'font-semibold')}>
              {notif.title}
            </p>
            <Badge variant="secondary" className="text-xs">{badge}</Badge>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {!notif.read && <span className="h-2 w-2 rounded-full bg-primary" aria-label="Non lu" />}
            <span className="text-xs text-text-disabled whitespace-nowrap">{timeAgo}</span>
          </div>
        </div>
        <p className="mt-1 text-sm text-text-secondary">{notif.message}</p>
        {notif.href && (
          <span className="mt-2 inline-block text-xs font-medium text-primary group-hover:underline">
            Voir →
          </span>
        )}
      </div>
    </CardContent>
  )

  return (
    <Card className="overflow-hidden hover:shadow-card-hover transition-shadow">
      {notif.href ? <Link href={notif.href}>{inner}</Link> : inner}
    </Card>
  )
}

export function NotificationsClient() {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotificationStore()
  const count = unreadCount()

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Notifications</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {count > 0 ? `${count} notification${count > 1 ? 's' : ''} non lue${count > 1 ? 's' : ''}` : 'Tout est à jour'}
          </p>
        </div>
        {count > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <Check className="h-3.5 w-3.5 mr-1.5" />
            Tout marquer comme lu
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="py-20 text-center">
          <Bell className="mx-auto h-12 w-12 text-text-disabled mb-3" />
          <p className="text-text-secondary font-medium">Aucune notification</p>
          <p className="text-sm text-text-disabled mt-1">Vous êtes à jour !</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <NotifCard key={notif.id} notif={notif} onRead={markAsRead} />
          ))}
        </div>
      )}
    </div>
  )
}
