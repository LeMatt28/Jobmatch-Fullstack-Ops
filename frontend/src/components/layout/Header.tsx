'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu, X, Briefcase, Bell, User, LogOut,
  LayoutDashboard, Shield, ChevronDown, MessageSquare,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'
import { ROUTES } from '@/lib/constants/routes'
import { NotificationDropdown } from './NotificationDropdown'
import { useNotificationStore } from '@/features/notifications/store/notificationStore'
import { useMessagesStore } from '@/features/messages/store/messagesStore'

interface NavLink {
  href: string
  label: string
  icon: React.ElementType
  badge?: () => number
}

// Notifications handled separately via NotificationDropdown (desktop) / Link (mobile)
const USER_NAV: NavLink[] = [
  { href: ROUTES.dashboard,  label: 'Dashboard',  icon: LayoutDashboard },
  { href: ROUTES.jobs,       label: 'Offres',     icon: Briefcase },
  { href: ROUTES.profile,    label: 'Mon espace', icon: User },
  { href: ROUTES.messages,   label: 'Messages',   icon: MessageSquare },
]

export interface HeaderProps {
  isAuthenticated?: boolean
  userName?: string
  isAdmin?: boolean
  onLogout?: () => void
}

export function Header({ isAuthenticated = false, userName, isAdmin = false, onLogout }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const pathname = usePathname()
  const unreadCount = useNotificationStore((s) => s.unreadCount())
  const unreadMessages = useMessagesStore((s) => s.totalUnread())

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href))

  const navLinkClass = (href: string) => cn(
    'flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
    isActive(href)
      ? 'bg-primary-50 text-primary'
      : 'text-text-secondary hover:text-text-primary hover:bg-muted'
  )

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/90 backdrop-blur-sm">
      <a href="#main-content" className="skip-link">
        Aller au contenu principal
      </a>

      <div className="page-container">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Logo */}
          <Link
            href={isAuthenticated ? ROUTES.dashboard : ROUTES.home}
            className="flex items-center gap-2 font-bold text-xl text-text-primary focus-visible:ring-2 focus-visible:ring-primary rounded-md shrink-0"
            aria-label="JobAggregator — accueil"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Briefcase className="h-4 w-4 text-white" aria-hidden="true" />
            </div>
            <span className="hidden sm:block">
              Job<span className="text-primary">Aggregator</span>
            </span>
          </Link>

          {/* Desktop & tablet nav */}
          {isAuthenticated && (
            <nav aria-label="Navigation principale" className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
              {USER_NAV.map(({ href, label, icon: Icon }) => {
                const msgBadge = href === ROUTES.messages && unreadMessages > 0
                return (
                  <Link
                    key={href}
                    href={href}
                    className={navLinkClass(href)}
                    aria-current={isActive(href) ? 'page' : undefined}
                  >
                    <span className="relative">
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {msgBadge && (
                        <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-white">
                          {unreadMessages > 9 ? '9+' : unreadMessages}
                        </span>
                      )}
                    </span>
                    <span className="hidden lg:block">{label}</span>
                  </Link>
                )
              })}

              {/* Notifications dropdown (desktop/tablet) */}
              <NotificationDropdown />

              {isAdmin && (
                <div className="relative">
                  <button
                    onClick={() => setAdminOpen(!adminOpen)}
                    onBlur={() => setTimeout(() => setAdminOpen(false), 150)}
                    className={cn(navLinkClass('/admin'), 'gap-1')}
                    aria-haspopup="menu"
                    aria-expanded={adminOpen}
                  >
                    <Shield className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="hidden lg:block">Admin</span>
                    <ChevronDown className={cn('h-3 w-3 hidden lg:block transition-transform', adminOpen && 'rotate-180')} />
                  </button>

                  {adminOpen && (
                    <div
                      role="menu"
                      className="absolute left-0 top-full mt-1 w-44 rounded-lg border border-border bg-surface shadow-modal py-1 z-50 animate-fade-in"
                    >
                      {[
                        { href: ROUTES.admin.dashboard, label: 'Vue admin' },
                        { href: ROUTES.admin.users,     label: 'Utilisateurs' },
                        { href: ROUTES.admin.offers,    label: 'Offres admin' },
                      ].map(({ href, label }) => (
                        <Link
                          key={href}
                          href={href}
                          role="menuitem"
                          className="block px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-muted transition-colors"
                          onClick={() => setAdminOpen(false)}
                        >
                          {label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </nav>
          )}

          {/* Desktop user menu */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {isAuthenticated ? (
              <div className="relative group">
                <Button variant="ghost" size="sm" className="gap-2" aria-haspopup="menu">
                  <div className="h-7 w-7 rounded-full bg-primary-100 flex items-center justify-center">
                    <User className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  </div>
                  <span className="text-sm font-medium text-text-primary hidden lg:block">
                    {userName ?? 'Mon compte'}
                  </span>
                </Button>
                <div className="absolute right-0 top-full mt-1 hidden group-hover:block w-48 rounded-lg border border-border bg-surface shadow-modal py-1 z-50">
                  <button
                    onClick={onLogout}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={ROUTES.login}>Connexion</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href={ROUTES.register}>S&apos;inscrire</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile burger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav
          id="mobile-menu"
          aria-label="Navigation mobile"
          className="md:hidden border-t border-border bg-surface animate-fade-in"
        >
          <div className="page-container py-3 flex flex-col gap-1">
            {isAuthenticated ? (
              <>
                {USER_NAV.map(({ href, label, icon: Icon }) => {
                  const msgBadge = href === ROUTES.messages && unreadMessages > 0
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                        isActive(href)
                          ? 'bg-primary-50 text-primary'
                          : 'text-text-secondary hover:text-text-primary hover:bg-muted'
                      )}
                      aria-current={isActive(href) ? 'page' : undefined}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {label}
                      {msgBadge && (
                        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[11px] font-bold text-white">
                          {unreadMessages}
                        </span>
                      )}
                    </Link>
                  )
                })}

                {/* Notifications → page dédiée sur mobile */}
                <Link
                  href={ROUTES.notifications}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                    isActive(ROUTES.notifications)
                      ? 'bg-primary-50 text-primary'
                      : 'text-text-secondary hover:text-text-primary hover:bg-muted'
                  )}
                >
                  <span className="relative">
                    <Bell className="h-4 w-4" aria-hidden="true" />
                    {unreadCount > 0 && (
                      <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </span>
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {isAdmin && (
                  <>
                    <div className="my-1 border-t border-border" />
                    <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-text-disabled">
                      Administration
                    </p>
                    {[
                      { href: ROUTES.admin.dashboard, label: 'Vue admin' },
                      { href: ROUTES.admin.users,     label: 'Utilisateurs' },
                      { href: ROUTES.admin.offers,    label: 'Offres admin' },
                    ].map(({ href, label }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                          isActive(href)
                            ? 'bg-accent-100 text-accent-500'
                            : 'text-text-secondary hover:text-text-primary hover:bg-muted'
                        )}
                      >
                        <Shield className="h-4 w-4" aria-hidden="true" />
                        {label}
                      </Link>
                    ))}
                  </>
                )}

                <div className="my-1 border-t border-border" />
                <div className="px-3 py-2 flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                    <User className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  </div>
                  <span className="text-sm font-medium text-text-primary">{userName ?? 'Mon compte'}</span>
                </div>
                <button
                  onClick={() => { onLogout?.(); setMobileOpen(false) }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-destructive hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" /> Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href={ROUTES.login} onClick={() => setMobileOpen(false)} className="px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary rounded-md hover:bg-muted">
                  Connexion
                </Link>
                <Link href={ROUTES.register} onClick={() => setMobileOpen(false)} className="px-3 py-2.5 text-sm font-medium text-primary hover:bg-primary-50 rounded-md">
                  S&apos;inscrire
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
