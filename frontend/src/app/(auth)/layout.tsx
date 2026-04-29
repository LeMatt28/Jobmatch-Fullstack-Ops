import React from 'react'
import Link from 'next/link'
import { Briefcase } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel — branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary flex-col justify-between p-12">
        <Link
          href="/"
          className="flex items-center gap-2 text-white font-bold text-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md"
          aria-label="JobAggregator — retour à l'accueil"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
            <Briefcase className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          JobAggregator
        </Link>

        <div className="space-y-6">
          <blockquote className="space-y-2">
            <p className="text-2xl font-semibold text-white leading-relaxed">
              &ldquo;Trouvez l&apos;opportunité qui correspond à vos ambitions.&rdquo;
            </p>
            <footer className="text-white/70 text-sm">
              Des milliers d&apos;offres agrégées, une seule plateforme.
            </footer>
          </blockquote>

          <div className="flex gap-6 text-white/80 text-sm">
            <div>
              <div className="text-2xl font-bold text-white">12k+</div>
              <div>Offres actives</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">3k+</div>
              <div>Entreprises</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">98%</div>
              <div>Satisfaction</div>
            </div>
          </div>
        </div>

        <p className="text-white/50 text-xs">© {new Date().getFullYear()} JobAggregator — Epitech</p>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-12">
        {/* Mobile logo */}
        <div className="mb-8 lg:hidden flex justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Briefcase className="h-4 w-4 text-white" aria-hidden="true" />
            </div>
            Job<span className="text-primary">Aggregator</span>
          </Link>
        </div>

        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  )
}
