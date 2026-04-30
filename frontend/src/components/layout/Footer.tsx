import React from 'react'
import Link from 'next/link'
import { Briefcase } from 'lucide-react'

const FOOTER_SECTIONS = [
  {
    title: 'Produit',
    links: [
      { href: '/dashboard',     label: 'Dashboard' },
      { href: '/jobs',          label: 'Offres d\'emploi' },
      { href: '/profile',       label: 'Mon espace' },
      { href: '/notifications', label: 'Notifications' },
    ],
  },
  {
    title: 'Support',
    links: [
      { href: '/docs',    label: 'Documentation' },
      { href: '/faq',     label: 'FAQ' },
      { href: '/contact', label: 'Contact' },
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
      <div className="page-container py-10">

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
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
        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-text-disabled">
            © {year} JobAggregator — Epitech. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/legal/terms"   className="text-xs text-text-disabled hover:text-primary transition-colors">CGU</Link>
            <Link href="/legal/privacy" className="text-xs text-text-disabled hover:text-primary transition-colors">Confidentialité</Link>
            <Link href="/legal/cookies" className="text-xs text-text-disabled hover:text-primary transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
