'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Bell, Briefcase, Info, CheckCircle, AlertTriangle, Check } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useNotificationStore } from '@/features/notifications/store/notificationStore'
import type { Notification, NotificationType } from '@/features/notifications/types/notification.types'
import { ROUTES } from '@/lib/constants/routes'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

const TYPE_CONFIG: Record<NotificationType, { icon: React.ElementType; color: string; bg: string }> = {
  job:     { icon: Briefcase,     color: 'text-primary',    bg: 'bg-primary-100' },
  info:    { icon: Info,          color: 'text-blue-500',   bg: 'bg-blue-50' },
  success: { icon: CheckCircle,   color: 'text-green-600',  bg: 'bg-green-50' },
  warning: { icon: AlertTriangle, color: 'text-amber-600',  bg: 'bg-amber-50' },
}

function NotifItem({ notif, onRead }: { notif: Notification; onRead: (id: string) => void }) {
  const { icon: Icon, color, bg } = TYPE_CONFIG[notif.type]
  const timeAgo = formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: fr })

  const content = (
    <div
      className={cn(
        'flex gap-3 px-4 py-3 transition-colors hover:bg-muted cursor-pointer',
        !notif.read && 'bg-primary-50/40'
      )}
      onClick={() => onRead(notif.id)}
    >
      <div className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full', bg)}>
        <Icon className={cn('h-4 w-4', color)} aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className={cn('text-sm font-medium text-text-primary leading-tight', !notif.read && 'font-semibold')}>
            {notif.title}
          </p>
          {!notif.read && (
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" aria-label="Non lu" />
          )}
        </div>
        <p className="mt-0.5 text-xs text-text-secondary line-clamp-2">{notif.message}</p>
        <p className="mt-1 text-xs text-text-disabled">{timeAgo}</p>
      </div>
    </div>
  )

  return notif.href ? (
    <Link href={notif.href}>{content}</Link>
  ) : (
    <div>{content}</div>
  )
}

interface NotificationDropdownProps {
  className?: string
}

export function NotificationDropdown({ className }: NotificationDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotificationStore()
  const count = unreadCount()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        onClick={() => setOpen(!open)}
        aria-label={`Notifications${count > 0 ? ` — ${count} non lues` : ''}`}
        aria-expanded={open}
        aria-haspopup="true"
        className={cn(
          'flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          open
            ? 'bg-primary-50 text-primary'
            : 'text-text-secondary hover:text-text-primary hover:bg-muted'
        )}
      >
        <span className="relative">
          <Bell className="h-4 w-4 shrink-0" aria-hidden="true" />
          {count > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
              {count > 9 ? '9+' : count}
            </span>
          )}
        </span>
        <span className="hidden lg:block">Notifications</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Panneau de notifications"
          className={cn(
            'absolute right-0 top-full mt-2 z-50 w-80 sm:w-96',
            'rounded-xl border border-border bg-surface shadow-modal',
            'animate-fade-in overflow-hidden'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h2 className="text-sm font-semibold text-text-primary">
              Notifications
              {count > 0 && (
                <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">
                  {count}
                </span>
              )}
            </h2>
            {count > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary-600 transition-colors font-medium"
              >
                <Check className="h-3.5 w-3.5" />
                Tout lire
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-border">
            {notifications.length === 0 ? (
              <div className="py-10 text-center">
                <Bell className="mx-auto h-8 w-8 text-text-disabled mb-2" />
                <p className="text-sm text-text-secondary">Aucune notification</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <NotifItem
                  key={notif.id}
                  notif={notif}
                  onRead={(id) => { markAsRead(id); if (notif.href) setOpen(false) }}
                />
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border px-4 py-2.5">
            <Link
              href={ROUTES.notifications}
              onClick={() => setOpen(false)}
              className="block text-center text-xs font-medium text-primary hover:text-primary-600 transition-colors"
            >
              Voir toutes les notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
