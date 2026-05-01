import Link from 'next/link'
import {
  Briefcase, Search, TrendingUp, Sparkles, ArrowRight,
  Shield, Bell, BookOpen, Users, BarChart2,
  Code2, PenTool, HeartPulse, ShoppingBag, Megaphone,
  GraduationCap, Wrench, Building2, CheckCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HomeSearchBar } from '@/components/home/HomeSearchBar'
import { AnimatedStats } from '@/components/home/AnimatedStats'
import { TestimonialsMarquee } from '@/components/home/TestimonialsMarquee'
import { ROUTES } from '@/lib/constants/routes'

/* ── Static data ─────────────────────────────────────────────── */

const STATS = [
  { end: 12000, suffix: '+', label: 'Offres actives',   separator: true },
  { end: 3000,  suffix: '+', label: 'Entreprises',      separator: true },
  { end: 50,    suffix: '+', label: 'Sources agrégées', separator: false },
  { end: 98,    suffix: ' %', label: 'Satisfaction',    separator: false },
]

const FEATURES = [
  {
    icon: Search,
    color: 'bg-primary-100 text-primary',
    title: 'Recherche avancée',
    desc: 'Filtrez par localisation, salaire, type de contrat, date de publication et stack technique. Retrouvez exactement ce que vous cherchez en quelques secondes.',
  },
  {
    icon: Sparkles,
    color: 'bg-accent-100 text-accent-500',
    title: 'Recommandations IA',
    desc: 'Notre IA analyse votre profil, vos compétences et votre historique pour vous suggérer des offres parfaitement adaptées à votre parcours.',
  },
  {
    icon: BarChart2,
    color: 'bg-secondary-100 text-secondary-500',
    title: 'Analytics marché',
    desc: 'Visualisez la distribution des salaires, les tendances technologies et l\'évolution du marché en temps réel pour prendre des décisions éclairées.',
  },
  {
    icon: Bell,
    color: 'bg-primary-100 text-primary',
    title: 'Alertes personnalisées',
    desc: 'Créez des alertes sur mesure et recevez une notification dès qu\'une offre correspond à vos critères. Ne ratez plus aucune opportunité.',
  },
  {
    icon: BookOpen,
    color: 'bg-accent-100 text-accent-500',
    title: 'Suivi des candidatures',
    desc: 'Gardez un œil sur toutes vos candidatures au même endroit : statut, relances, entretiens. Organisez votre recherche d\'emploi efficacement.',
  },
  {
    icon: Shield,
    color: 'bg-secondary-100 text-secondary-500',
    title: 'Offres vérifiées',
    desc: 'Chaque offre est filtrée pour éliminer les doublons et les annonces obsolètes. Vous ne voyez que des opportunités réelles et actuelles.',
  },
]

const STEPS = [
  {
    number: '01',
    title: 'Créez votre profil',
    desc: 'Renseignez vos compétences, votre expérience et vos préférences de poste. L\'inscription est gratuite et prend moins de 2 minutes.',
  },
  {
    number: '02',
    title: 'Explorez & filtrez',
    desc: 'Parcourez des milliers d\'offres agrégées depuis plus de 50 plateformes. Utilisez les filtres avancés pour affiner votre recherche.',
  },
  {
    number: '03',
    title: 'Postulez en confiance',
    desc: 'Accédez directement à l\'offre originale, suivez vos candidatures et recevez des recommandations IA pour maximiser vos chances.',
  },
]

const CATEGORIES = [
  { icon: Code2,        label: 'Développement',      count: '3 200+', q: 'développeur' },
  { icon: PenTool,      label: 'Design & UX',         count: '820+',   q: 'designer ux' },
  { icon: TrendingUp,   label: 'Marketing',           count: '1 100+', q: 'marketing' },
  { icon: BarChart2,    label: 'Data & IA',           count: '950+',   q: 'data scientist' },
  { icon: Users,        label: 'Ressources humaines', count: '640+',   q: 'RH recrutement' },
  { icon: HeartPulse,   label: 'Santé',               count: '1 400+', q: 'santé médical' },
  { icon: ShoppingBag,  label: 'Commerce',            count: '1 800+', q: 'commercial vente' },
  { icon: Megaphone,    label: 'Communication',       count: '530+',   q: 'communication' },
  { icon: GraduationCap, label: 'Formation',          count: '410+',   q: 'formateur enseignant' },
  { icon: Wrench,       label: 'Technique',           count: '2 100+', q: 'technicien ingénieur' },
  { icon: Building2,    label: 'Immobilier',          count: '360+',   q: 'immobilier' },
  { icon: Briefcase,    label: 'Finance',             count: '790+',   q: 'finance comptabilité' },
]

const TESTIMONIALS = [
  {
    quote: 'J\'ai trouvé mon CDI en 3 semaines grâce aux recommandations IA. Impressionnant.',
    name: 'Sophie L.',
    role: 'Développeuse React, Paris',
    initials: 'SL',
    color: 'bg-primary-100 text-primary',
  },
  {
    quote: 'Les alertes personnalisées m\'ont permis d\'être parmi les premiers à postuler. Ça change tout.',
    name: 'Marc D.',
    role: 'Product Manager, Lyon',
    initials: 'MD',
    color: 'bg-secondary-100 text-secondary-500',
  },
  {
    quote: 'Enfin un outil qui agrège tout au même endroit. Fini les 10 onglets ouverts en parallèle.',
    name: 'Inès B.',
    role: 'UX Designer, Bordeaux',
    initials: 'IB',
    color: 'bg-accent-100 text-accent-500',
  },
  {
    quote: 'Les analytics marché m\'ont aidé à négocier mon salaire avec des données concrètes.',
    name: 'Thomas K.',
    role: 'Data Engineer, Nantes',
    initials: 'TK',
    color: 'bg-primary-100 text-primary',
  },
  {
    quote: 'Interface claire, offres pertinentes. J\'ai décroché un entretien dès la première semaine.',
    name: 'Camille R.',
    role: 'Chef de projet digital, Lille',
    initials: 'CR',
    color: 'bg-secondary-100 text-secondary-500',
  },
  {
    quote: 'La fonction de suivi des candidatures m\'a évité de postuler deux fois au même poste.',
    name: 'Julien M.',
    role: 'Ingénieur DevOps, Toulouse',
    initials: 'JM',
    color: 'bg-accent-100 text-accent-500',
  },
  {
    quote: 'Grâce aux filtres avancés, je trouve uniquement des offres en télétravail dans ma stack.',
    name: 'Amira S.',
    role: 'Développeuse Backend, Marseille',
    initials: 'AS',
    color: 'bg-primary-100 text-primary',
  },
]

/* ── Page ────────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main id="main-content" tabIndex={-1} className="flex-1">

        {/* ── Hero ─────────────────────────────────────────────── */}
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

            <p className="mt-5 max-w-xl mx-auto text-lg text-text-secondary">
              Toutes les offres d&apos;emploi, depuis toutes les plateformes, en un seul endroit.
            </p>

            <div className="mt-10">
              <HomeSearchBar />
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-sm text-text-secondary">
              {['Gratuit', 'Sans inscription pour naviguer', 'Mis à jour en temps réel'].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Stats animées ─────────────────────────────────────── */}
        <section aria-label="Chiffres clés" className="border-y border-border bg-surface">
          <div className="page-container py-10">
            <AnimatedStats stats={STATS} />
          </div>
        </section>

        {/* ── Catégories ───────────────────────────────────────── */}
        <section className="section" aria-labelledby="categories-title">
          <div className="page-container">
            <div className="text-center mb-10">
              <h2 id="categories-title" className="text-2xl font-bold text-text-primary">
                Explorez par secteur
              </h2>
              <p className="mt-2 text-text-secondary">
                Des milliers d&apos;offres dans tous les domaines
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {CATEGORIES.map(({ icon: Icon, label, count, q }) => (
                <Link
                  key={label}
                  href={`${ROUTES.jobs}?q=${encodeURIComponent(q)}`}
                  className="flex items-center gap-3 p-4 rounded-lg border border-border bg-surface hover:border-primary hover:shadow-card-hover transition-all duration-200 group"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{label}</p>
                    <p className="text-xs text-text-disabled">{count} offres</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ─────────────────────────────────────────── */}
        <section className="section bg-muted/40" aria-labelledby="features-title">
          <div className="page-container">
            <div className="text-center mb-12">
              <h2 id="features-title" className="text-2xl font-bold text-text-primary">
                Tout ce dont vous avez besoin
              </h2>
              <p className="mt-2 text-text-secondary max-w-xl mx-auto">
                JobAggregator réunit les outils essentiels pour une recherche d&apos;emploi efficace et organisée.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map(({ icon: Icon, color, title, desc }) => (
                <div key={title} className="card p-6">
                  <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${color} mb-4`}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-text-primary mb-2">{title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Comment ça marche ────────────────────────────────── */}
        <section className="section" aria-labelledby="how-title">
          <div className="page-container">
            <div className="text-center mb-12">
              <h2 id="how-title" className="text-2xl font-bold text-text-primary">
                Comment ça marche ?
              </h2>
              <p className="mt-2 text-text-secondary">
                Démarrez votre recherche en 3 étapes simples
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div
                className="hidden md:block absolute top-8 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px bg-border"
                aria-hidden="true"
              />
              {STEPS.map(({ number, title, desc }) => (
                <div key={number} className="flex flex-col items-center text-center">
                  <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white font-bold text-lg mb-5 shadow-md">
                    {number}
                  </div>
                  <h3 className="font-semibold text-text-primary mb-2">{title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed max-w-xs">{desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button size="lg" asChild>
                <Link href={ROUTES.register}>
                  Commencer gratuitement <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ── Témoignages carousel ─────────────────────────────── */}
        <section className="section bg-muted/40 overflow-hidden" aria-labelledby="testimonials-title">
          <div className="page-container mb-10">
            <div className="text-center">
              <h2 id="testimonials-title" className="text-2xl font-bold text-text-primary">
                Ils ont trouvé leur emploi
              </h2>
              <p className="mt-2 text-text-secondary">
                Rejoignez des milliers de candidats qui font confiance à JobAggregator
              </p>
            </div>
          </div>

          <TestimonialsMarquee testimonials={TESTIMONIALS} />
        </section>

        {/* ── CTA final ────────────────────────────────────────── */}
        <section className="gradient-primary py-16 sm:py-20" aria-labelledby="cta-title">
          <div className="page-container text-center">
            <h2 id="cta-title" className="text-3xl sm:text-4xl font-bold text-white">
              Prêt à trouver votre prochain emploi ?
            </h2>
            <p className="mt-4 text-white/80 max-w-xl mx-auto">
              Créez votre compte gratuitement et accédez à des milliers d&apos;offres personnalisées selon votre profil.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-primary-50"
                asChild
              >
                <Link href={ROUTES.register}>
                  Créer un compte gratuit <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-white hover:bg-white/10 border border-white/30"
                asChild
              >
                <Link href={ROUTES.jobs}>
                  <Search className="h-4 w-4" />
                  Parcourir les offres
                </Link>
              </Button>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
