import { Link } from 'react-router-dom'
import { Check, Zap, Heart, ArrowRight } from 'lucide-react'

const HOW_IT_WORKS = [
  {
    icon: (
      <svg viewBox="0 0 40 40" className="w-6 h-6" fill="none">
        <circle cx="20" cy="14" r="7" stroke="currentColor" strokeWidth="2" />
        <path d="M6 36c0-7.732 6.268-14 14-14s14 6.268 14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: 'Crée ton profil',
    desc: 'Compétences, salaire, localisation. 5 minutes chrono.',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" className="w-6 h-6" fill="none">
        <path d="M8 20h8M24 20h8M20 8v8M20 24v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 12l4 4M24 24l4 4M28 12l-4 4M16 24l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: 'Swipe les offres',
    desc: "Like ce qui t'attire, passe ce qui ne colle pas.",
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" className="w-6 h-6" fill="none">
        <path d="M20 8c-4.418 0-8 3.134-8 7 0 2.21 1.12 4.185 2.886 5.487L14 28l6-3 6 3-.886-7.513C26.88 19.185 28 17.21 28 15c0-3.866-3.582-7-8-7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Match et échange',
    desc: "Quand c'est réciproque, notre IA te présente l'opportunité.",
  },
]

const SCORE_CRITERIA = [
  { label: 'Compétences techniques', value: 94 },
  { label: 'Localisation', value: 82 },
  { label: 'Prétentions salariales', value: 76 },
  { label: 'Soft skills', value: 90 },
  { label: 'Mobilité', value: 100 },
  { label: 'Type de contrat', value: 80 },
]

const TESTIMONIALS = [
  {
    name: 'Sophie M.',
    role: 'Dev Frontend',
    text: "Trouvé un CDI en 12 jours. Le matching IA m'a évité des dizaines d'offres hors-sujet.",
  },
  {
    name: 'TechFlow RH',
    role: 'Équipe recrutement',
    text: 'Nos délais de recrutement ont chuté de 40%. Les candidats matchés sont vraiment qualifiés.',
  },
  {
    name: 'Karim B.',
    role: 'Dev Backend reconverti',
    text: 'Reconversion réussie grâce au score IA. Je savais exactement pourquoi je correspondais à chaque offre.',
  },
]

const PLANS_CAND = [
  { label: 'Mensuel', price: '9,99 €', sub: '/mois · sans engagement' },
  { label: 'Trimestriel', price: '7,99 €', sub: '/mois · soit 23,97 €/trim', highlight: true, badge: 'Le plus populaire' },
  { label: 'Annuel', price: '5,99 €', sub: '/mois · soit 71,88 €/an · −40 %' },
]

function MockCard() {
  return (
    <div className="relative" style={{ perspective: 800 }}>
      {/* Background card */}
      <div
        className="absolute inset-0 rounded-3xl"
        style={{ background: '#252040', transform: 'rotate(4deg) scale(0.93)', borderRadius: 24 }}
      />
      {/* Main card */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{ background: '#1C1730' }}>
        {/* Like indicator */}
        <div className="absolute top-5 left-5 z-10 text-emerald-400 font-black text-lg border-2 border-emerald-400 rounded-xl px-2.5 py-1" style={{ transform: 'rotate(-12deg)', opacity: 0.9 }}>
          LIKE ✓
        </div>
        {/* Header */}
        <div className="px-5 pt-6 pb-4" style={{ background: '#312A52' }}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">TF</div>
            <div>
              <p className="text-white font-bold text-sm">Développeur React Senior</p>
              <p className="text-gray-300 text-xs">TechFlow · Paris 9e · CDI</p>
            </div>
          </div>
        </div>
        {/* Body */}
        <div className="px-5 py-4 space-y-3">
          <p className="text-gray-300 text-xs leading-relaxed line-clamp-2">Rejoignez une startup SaaS en forte croissance. Stack moderne, équipe bienveillante, full remote possible.</p>
          <div className="flex flex-wrap gap-1.5">
            {['React', 'TypeScript', 'Node.js'].map((t) => (
              <span key={t} className="text-xs px-2.5 py-1 rounded-full text-brand-200 font-medium" style={{ background: '#3C3489' }}>{t}</span>
            ))}
          </div>
        </div>
        {/* Footer */}
        <div className="px-5 py-3 text-xs text-gray-400" style={{ background: '#252040' }}>
          <p>💰 55k–70k€/an · 📍 Paris 9e · Hybride 3j</p>
        </div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-warm-50 font-sans">

      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-warm-50/95 backdrop-blur border-b border-warm-200 px-6 py-4 flex items-center justify-between">
        <span className="font-black text-brand-900 text-xl tracking-tight">JobMatch</span>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition">Connexion</Link>
          <Link to="/register/candidate" className="text-sm font-semibold bg-brand-600 text-white px-4 py-2 rounded-xl hover:bg-brand-800 transition">Commencer</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-[1fr,420px] gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 rounded-full px-4 py-1.5 text-sm text-brand-700 font-medium mb-6">
            🔥 +2 400 matchs cette semaine
          </div>
          <h1 className="text-5xl font-black text-brand-900 leading-tight tracking-tight mb-5">
            Trouvez votre job<br />
            comme vous trouvez<br />
            l'amour.
          </h1>
          <p className="text-base text-gray-500 max-w-md mb-8 leading-relaxed">
            Swipez les offres qui vous correspondent vraiment. Notre IA analyse chaque profil pour des matchs précis.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <Link to="/register/candidate" className="inline-flex items-center gap-2 bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-800 transition">
              Je suis candidat <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/register/company" className="inline-flex items-center gap-2 bg-warm-100 text-brand-800 font-semibold px-6 py-3 rounded-xl border border-warm-200 hover:bg-warm-200 transition">
              Je recrute
            </Link>
          </div>
          <p className="text-sm text-gray-400">
            Rejoint par <strong className="text-warm-900">12 000 candidats</strong> et <strong className="text-warm-900">850 entreprises</strong>
          </p>
          <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-400">
            {['Stripe', 'Doctolib', 'Leboncoin', 'ManoMano', 'Dataiku'].map((c) => (
              <span key={c} className="font-semibold">{c}</span>
            ))}
          </div>
        </div>
        <div className="hidden md:block">
          <MockCard />
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black text-brand-900 mb-3">
            Aussi simple que Tinder,<br />
            <span className="text-brand-600">aussi sérieux que LinkedIn.</span>
          </h2>
          <p className="text-gray-500 mb-12">Trois étapes, zéro friction.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  {step.icon}
                </div>
                <div>
                  <p className="font-bold text-brand-900 mb-1">
                    <span className="text-brand-400 mr-1">{i + 1}.</span>{step.title}
                  </p>
                  <p className="text-sm text-gray-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Score IA */}
      <section className="bg-brand-900 py-20">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-black text-white mb-4">Une IA qui explique ses choix.</h2>
            <p className="text-brand-200 leading-relaxed mb-6">
              Pas une boîte noire. Notre IA score chaque match sur 6 critères et t'explique pourquoi tu corresponds.
            </p>
            <Link to="/register/candidate" className="inline-flex items-center gap-2 bg-white text-brand-900 font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-50 transition">
              Voir mon score IA <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="rounded-2xl p-6" style={{ background: '#252040' }}>
            <div className="flex items-baseline gap-2 mb-5">
              <span className="text-4xl font-black text-emerald-400">87</span>
              <span className="text-brand-300 text-sm">/100 · Excellent match</span>
            </div>
            <div className="space-y-3">
              {SCORE_CRITERIA.map((c) => (
                <div key={c.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-brand-300">{c.label}</span>
                    <span className="text-xs font-bold text-white">{c.value}%</span>
                  </div>
                  <div className="h-1.5 bg-brand-800 rounded-full">
                    <div className="h-full rounded-full bg-brand-400" style={{ width: `${c.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* For companies */}
      <section className="bg-warm-50 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black text-brand-900 mb-3">Recrutez 3× plus vite.</h2>
          <p className="text-gray-500 mb-10">Les candidats viennent à vous, qualifiés et motivés.</p>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { icon: '🎯', title: 'Profils qualifiés', desc: 'Seulement des candidats dont le score IA dépasse 70%.' },
              { icon: '📊', title: 'Score transparent', desc: 'Chaque critère de compatibilité est détaillé et explicable.' },
              { icon: '💬', title: 'Contact direct', desc: "Accès aux coordonnées complètes avec l'abonnement PRO." },
            ].map((item) => (
              <div key={item.title} className="bg-white border border-warm-200 rounded-2xl p-5 text-left">
                <div className="text-2xl mb-3">{item.icon}</div>
                <p className="font-bold text-brand-900 mb-1">{item.title}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
          <Link to="/register/company" className="inline-flex items-center gap-2 bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-800 transition">
            Créer un compte entreprise <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-black text-brand-900 text-center mb-10">Ce qu'ils en disent</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white border border-warm-200 rounded-2xl p-5">
                <p className="text-sm text-gray-600 italic mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold">
                    {t.name.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="bg-warm-50 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-black text-brand-900 mb-3">Un plan pour chaque étape</h2>
          <p className="text-gray-500 mb-10">Gratuit pour commencer, PRO pour accélérer.</p>
          <div className="grid md:grid-cols-3 gap-5 mb-8">
            {PLANS_CAND.map((p) => (
              <div
                key={p.label}
                className={`rounded-2xl p-6 text-left ${p.highlight ? 'bg-white border-2 border-brand-600' : 'bg-white border border-warm-200'}`}
              >
                {p.badge && (
                  <span className="inline-block bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">{p.badge}</span>
                )}
                <p className="text-lg font-bold text-brand-900">{p.label}</p>
                <p className="text-3xl font-black text-brand-600 my-2">{p.price}</p>
                <p className="text-xs text-gray-400">{p.sub}</p>
              </div>
            ))}
          </div>
          <Link to="/premium/candidate" className="inline-flex items-center gap-2 bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-800 transition">
            Voir tous les plans <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-900 text-brand-300 py-10">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-black text-white text-lg">JobMatch</span>
            <p className="text-xs mt-1">Le Tinder de la recherche d'emploi.</p>
          </div>
          <div className="flex gap-6 text-xs">
            <a href="#" className="hover:text-white transition">Mentions légales</a>
            <a href="#" className="hover:text-white transition">CGU</a>
            <a href="#" className="hover:text-white transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
