import React from 'react'
import Link from 'next/link'
import { Briefcase } from 'lucide-react'

const FOOTER_SECTIONS = [
  {
    title: 'Navigation',
    links: [
      { href: '/',          label: 'Accueil' },
      { href: '/jobs',      label: 'Offres d\'emploi' },
      { href: '/dashboard', label: 'Dashboard' },
    ],
  },
  {
    title: 'Légal',
    links: [
      { href: '/legal/terms',   label: 'CGU' },
      { href: '/legal/privacy', label: 'Politique de confidentialité' },
      { href: '/legal/cookies', label: 'Cookies' },
    ],
  },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-surface" role="contentinfo">
      <div className="page-container py-8">

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                <Briefcase className="h-3.5 w-3.5 text-white" aria-hidden="true" />
              </div>
              <span className="font-semibold text-text-primary">
                Job<span className="text-primary">Aggregator</span>
              </span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              Trouvez les meilleures offres d&apos;emploi agrégées depuis toutes les plateformes, au même endroit.
            </p>
          </div>

          {/* Sections */}
          {FOOTER_SECTIONS.map(({ title, links }) => (
            <div key={title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-disabled mb-3">
                {title}
              </h3>
              <ul className="flex flex-col gap-2">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-text-secondary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-xs text-text-disabled text-center sm:text-left">
            © {year} JobAggregator — Epitech. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}
