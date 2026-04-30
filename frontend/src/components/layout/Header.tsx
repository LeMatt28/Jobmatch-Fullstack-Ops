'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Briefcase, Bell, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'
import { ROUTES } from '@/lib/constants/routes'

interface NavLink {
  href: string
  label: string
}

const NAV_LINKS: NavLink[] = [
  { href: ROUTES.dashboard, label: 'Dashboard' },
  { href: ROUTES.jobs,      label: 'Offres' },
]

export interface HeaderProps {
  isAuthenticated?: boolean
  userName?: string
  isAdmin?: boolean
  onLogout?: () => void
}

export function Header({ isAuthenticated = false, userName, isAdmin = false, onLogout }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/90 backdrop-blur-sm">
      <a href="#main-content" className="skip-link">
        Aller au contenu principal
      </a>

      <div className="page-container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href={isAuthenticated ? ROUTES.dashboard : ROUTES.home}
            className="flex items-center gap-2 font-bold text-xl text-text-primary focus-visible:ring-2 focus-visible:ring-primary rounded-md"
            aria-label="JobAggregator — accueil"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Briefcase className="h-4 w-4 text-white" aria-hidden="true" />
            </div>
            <span>Job<span className="text-primary">Aggregator</span></span>
          </Link>

          {/* Desktop nav */}
          {isAuthenticated && (
            <nav aria-label="Navigation principale" className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                    pathname === link.href
                      ? 'bg-primary-50 text-primary'
                      : 'text-text-secondary hover:text-text-primary hover:bg-muted'
                  )}
                  aria-current={pathname === link.href ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  href={ROUTES.admin.dashboard}
                  className={cn(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                    pathname.startsWith('/admin')
                      ? 'bg-accent-100 text-accent-500'
                      : 'text-text-secondary hover:text-text-primary hover:bg-muted'
                  )}
                >
                  Admin
                </Link>
              )}
            </nav>
          )}

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="icon" aria-label="Notifications">
                  <Bell className="h-4 w-4" />
                </Button>
                <div className="relative group">
                  <Button variant="ghost" size="sm" className="gap-2" aria-haspopup="menu">
                    <div className="h-7 w-7 rounded-full bg-primary-100 flex items-center justify-center">
                      <User className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    </div>
                    <span className="text-sm font-medium text-text-primary">
                      {userName ?? 'Mon compte'}
                    </span>
                  </Button>
                  {/* Dropdown */}
                  <div className="absolute right-0 top-full mt-1 hidden group-hover:block w-48 rounded-lg border border-border bg-surface shadow-modal py-1 z-50">
                    <button
                      onClick={onLogout}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" /> Déconnexion
                    </button>
                  </div>
                </div>
              </>
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
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'px-3 py-2 rounded-md text-sm font-medium',
                      pathname === link.href
                        ? 'bg-primary-50 text-primary'
                        : 'text-text-secondary'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <button onClick={onLogout} className="text-left px-3 py-2 text-sm text-destructive">
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href={ROUTES.login} className="px-3 py-2 text-sm text-text-secondary">Connexion</Link>
                <Link href={ROUTES.register} className="px-3 py-2 text-sm font-medium text-primary">S&apos;inscrire</Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
