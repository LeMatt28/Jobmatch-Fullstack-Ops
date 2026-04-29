'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Briefcase, User, BarChart2,
  Sparkles, Shield, Users, FileText, X,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants/routes'

interface SidebarLink {
  href: string
  label: string
  icon: React.ElementType
}

const USER_LINKS: SidebarLink[] = [
  { href: ROUTES.dashboard, label: 'Dashboard',      icon: LayoutDashboard },
  { href: ROUTES.jobs,      label: 'Offres',          icon: Briefcase },
  { href: ROUTES.profile,   label: 'Mon profil',      icon: User },
]

const DATA_LINKS: SidebarLink[] = [
  { href: '/dashboard#analytics', label: 'Analytiques', icon: BarChart2 },
  { href: '/dashboard#ai',        label: 'Recommandations', icon: Sparkles },
]

const ADMIN_LINKS: SidebarLink[] = [
  { href: ROUTES.admin.dashboard, label: 'Vue admin',    icon: Shield },
  { href: ROUTES.admin.users,     label: 'Utilisateurs', icon: Users },
  { href: ROUTES.admin.offers,    label: 'Offres',       icon: FileText },
]

export interface SidebarProps {
  isAdmin?: boolean
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isAdmin = false, isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname()

  const NavItem = ({ href, label, icon: Icon }: SidebarLink) => {
    const active = pathname === href || (href !== '/' && pathname.startsWith(href))
    return (
      <li>
        <Link
          href={href}
          onClick={onClose}
          aria-current={active ? 'page' : undefined}
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
            active
              ? 'bg-primary-50 text-primary'
              : 'text-text-secondary hover:bg-muted hover:text-text-primary'
          )}
        >
          <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
          {label}
        </Link>
      </li>
    )
  }

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        id="sidebar"
        aria-label="Navigation latérale"
        className={cn(
          'fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r border-border bg-surface',
          'flex flex-col transition-transform duration-300',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Close button (mobile) */}
        {onClose && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute right-3 top-3 lg:hidden"
            onClick={onClose}
            aria-label="Fermer la navigation"
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col gap-0.5" role="list">
            <li className="mb-1">
              <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-text-disabled">
                Principal
              </p>
            </li>
            {USER_LINKS.map((link) => <NavItem key={link.href} {...link} />)}

            <li className="mt-4 mb-1">
              <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-text-disabled">
                Insights
              </p>
            </li>
            {DATA_LINKS.map((link) => <NavItem key={link.href} {...link} />)}

            {isAdmin && (
              <>
                <li className="mt-4 mb-1">
                  <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-text-disabled">
                    Administration
                  </p>
                </li>
                {ADMIN_LINKS.map((link) => <NavItem key={link.href} {...link} />)}
              </>
            )}
          </ul>
        </nav>

        {/* Version tag */}
        <div className="px-4 py-3 border-t border-border">
          <p className="text-xs text-text-disabled">JobAggregator v1.0</p>
        </div>
      </aside>
    </>
  )
}
