import React from 'react'
import Link from 'next/link'
import { Briefcase, Search, TrendingUp, Sparkles } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex">

      {/* Left panel — branding (desktop only) */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 gradient-primary flex-col justify-between p-12 shrink-0">
        <Link
          href="/"
          className="flex items-center gap-2 text-white font-bold text-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md w-fit"
          aria-label="JobAggregator — retour à l'accueil"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
            <Briefcase className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          JobAggregator
        </Link>

        <div className="space-y-8">
          <blockquote>
            <p className="text-2xl font-semibold text-white leading-relaxed">
              &ldquo;Trouvez l&apos;opportunité qui correspond à vos ambitions.&rdquo;
            </p>
            <footer className="mt-3 text-white/70 text-sm">
              Des milliers d&apos;offres agrégées, une seule plateforme.
            </footer>
          </blockquote>

          <div className="space-y-3">
            {([
              { Icon: Search,     text: 'Recherche avancée par localisation, salaire et contrat' },
              { Icon: TrendingUp, text: 'Analytics marché et tendances en temps réel' },
              { Icon: Sparkles,   text: 'Recommandations IA personnalisées selon votre profil' },
            ] as const).map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-white/90 text-sm">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                </div>
                {text}
              </div>
            ))}
          </div>

          <div className="flex gap-8 text-white/80 text-sm">
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

        <p className="text-white/40 text-xs">© {new Date().getFullYear()} JobAggregator — Epitech</p>
      </div>

      {/* Right panel — form, scrollable, centered */}
      <div className="flex flex-1 flex-col items-center justify-center min-h-screen px-5 py-12 sm:px-8 overflow-y-auto">

        {/* Mobile logo */}
        <div className="lg:hidden mb-8 self-center">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
            aria-label="JobAggregator — retour à l'accueil"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Briefcase className="h-4 w-4 text-white" aria-hidden="true" />
            </div>
            Job<span className="text-primary">Aggregator</span>
          </Link>
        </div>

        <main id="main-content" tabIndex={-1} className="w-full max-w-md">
          {children}
        </main>
      </div>
    </div>
  )
}
