import React from 'react'
import Link from 'next/link'
import { Briefcase } from 'lucide-react'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-surface" role="contentinfo">
      <div className="page-container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Briefcase className="h-3.5 w-3.5 text-white" aria-hidden="true" />
            </div>
            <span className="font-semibold text-text-primary">
              Job<span className="text-primary">Aggregator</span>
            </span>
          </div>

          {/* Links */}
          <nav aria-label="Liens du pied de page">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-text-secondary">
              {[
                { href: '/jobs',    label: 'Offres' },
                { href: '/login',   label: 'Connexion' },
                { href: '/register',label: 'Inscription' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Copyright */}
          <p className="text-xs text-text-disabled">
            © {year} JobAggregator — Epitech
          </p>
        </div>
      </div>
    </footer>
  )
}
