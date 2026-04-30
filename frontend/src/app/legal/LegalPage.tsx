import React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface Section {
  id: string
  title: string
  content: React.ReactNode
}

interface LegalPageProps {
  title: string
  subtitle: string
  lastUpdated: string
  sections: Section[]
  breadcrumb: string
}

export function LegalPage({ title, subtitle, lastUpdated, sections, breadcrumb }: LegalPageProps) {
  return (
    <div className="bg-background">
      {/* Hero */}
      <div className="gradient-soft border-b border-border">
        <div className="page-container py-10 sm:py-14">
          {/* Breadcrumb */}
          <nav aria-label="Fil d'Ariane" className="mb-4 flex items-center gap-1.5 text-sm text-text-secondary">
            <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
            <ChevronRight className="h-3.5 w-3.5 text-text-disabled" />
            <span className="text-text-primary font-medium">{breadcrumb}</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary">{title}</h1>
          <p className="mt-3 text-text-secondary">{subtitle}</p>
          <p className="mt-2 text-sm text-text-disabled">Dernière mise à jour : {lastUpdated}</p>
        </div>
      </div>

      {/* Content */}
      <div className="page-container py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Sidebar TOC */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-disabled">Sommaire</p>
              <nav aria-label="Table des matières">
                <ul className="space-y-1">
                  {sections.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="block rounded-md px-3 py-1.5 text-sm text-text-secondary hover:text-primary hover:bg-primary-50 transition-colors"
                      >
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <article className="lg:col-span-3">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="mb-10 scroll-mt-24">
                <h2 className="text-xl font-bold text-text-primary mb-4 pb-2 border-b border-border">{s.title}</h2>
                <div className="space-y-3 text-sm text-text-secondary leading-relaxed">
                  {s.content}
                </div>
              </section>
            ))}
          </article>
        </div>
      </div>
    </div>
  )
}
