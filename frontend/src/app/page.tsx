import Link from 'next/link'
import { Briefcase, Search, TrendingUp, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ROUTES } from '@/lib/constants/routes'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main id="main-content" tabIndex={-1} className="flex-1">
        {/* Hero */}
        <section className="gradient-soft py-20 sm:py-28" aria-labelledby="hero-title">
          <div className="page-container text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              12 000+ offres agrégées chaque jour
            </div>

            <h1
              id="hero-title"
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary leading-tight"
            >
              Trouvez votre prochain{' '}
              <span className="text-primary">emploi idéal</span>
            </h1>

            <p className="mt-6 max-w-2xl mx-auto text-lg text-text-secondary">
              JobAggregator agrège les meilleures offres de toutes les plateformes.
              Recherche intelligente, recommandations IA, analytics marché.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href={ROUTES.register}>
                  Commencer gratuitement <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href={ROUTES.jobs}>
                  <Search className="h-4 w-4" aria-hidden="true" />
                  Parcourir les offres
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="section" aria-labelledby="features-title">
          <div className="page-container">
            <h2 id="features-title" className="text-center text-2xl font-bold text-text-primary mb-12">
              Pourquoi JobAggregator ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Search,
                  title: 'Recherche avancée',
                  desc: 'Filtrez par localisation, salaire, type de contrat, date de publication.',
                  color: 'bg-primary-100 text-primary',
                },
                {
                  icon: TrendingUp,
                  title: 'Analytics marché',
                  desc: 'Distribution des salaires, tendances techno, évolution du marché en temps réel.',
                  color: 'bg-secondary-100 text-secondary-500',
                },
                {
                  icon: Sparkles,
                  title: 'Recommandations IA',
                  desc: 'Offres personnalisées selon votre profil, vos compétences et votre historique.',
                  color: 'bg-accent-100 text-accent-500',
                },
              ].map(({ icon: Icon, title, desc, color }) => (
                <div key={title} className="card p-6 text-center hover:shadow-card-hover">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${color} mb-4`}>
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-text-primary mb-2">{title}</h3>
                  <p className="text-sm text-text-secondary">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
