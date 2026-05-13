import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, X } from 'lucide-react'

const CAND_PLANS = [
  {
    label: 'Gratuit',
    price: '0€',
    sub: '/mois',
    cta: 'Commencer',
    ctaTo: '/register/candidate',
    highlight: false,
    features: [
      { label: 'Swipes/jour', value: '10' },
      { label: 'Matchs', value: 'Illimité' },
      { label: 'Voir qui a liké', value: false },
      { label: 'Booster son profil', value: false },
      { label: 'Score IA détaillé', value: false },
      { label: 'Statistiques', value: false },
    ],
  },
  {
    label: 'PRO Mensuel',
    price: '9,99€',
    sub: '/mois',
    badge: 'Le plus populaire',
    cta: 'Essai 7 jours ★',
    ctaTo: '/premium/candidate',
    highlight: true,
    features: [
      { label: 'Swipes/jour', value: 'Illimité' },
      { label: 'Matchs', value: 'Illimité' },
      { label: 'Voir qui a liké', value: true },
      { label: 'Booster son profil', value: true },
      { label: 'Score IA détaillé', value: true },
      { label: 'Statistiques', value: true },
    ],
  },
  {
    label: 'PRO Annuel',
    price: '5,99€',
    sub: '/mois · soit 71,88€/an',
    cta: 'Économiser 40%',
    ctaTo: '/premium/candidate',
    highlight: false,
    badge2: '−40%',
    features: [
      { label: 'Swipes/jour', value: 'Illimité' },
      { label: 'Matchs', value: 'Illimité' },
      { label: 'Voir qui a liké', value: true },
      { label: 'Booster son profil', value: true },
      { label: 'Score IA détaillé', value: true },
      { label: 'Statistiques', value: true },
    ],
  },
]

const CO_PLANS = [
  {
    label: 'Gratuit',
    price: '0€',
    sub: '2 offres max',
    cta: 'Commencer',
    ctaTo: '/register/company',
    highlight: false,
  },
  {
    label: 'Starter',
    price: '49€',
    sub: '/mois',
    badge: 'Le plus populaire',
    cta: 'Essai 7 jours ★',
    ctaTo: '/premium/company',
    highlight: true,
  },
  {
    label: 'Growth',
    price: '99€',
    sub: '/mois',
    cta: 'Contacter l\'équipe',
    ctaTo: '/premium/company',
    highlight: false,
  },
]

function FeatureValue({ value }) {
  if (value === true) return <Check className="w-4 h-4 text-emerald-500 mx-auto" aria-label="Inclus" />
  if (value === false) return <X className="w-4 h-4 text-gray-300 mx-auto" aria-label="Non inclus" />
  return <span className="text-xs font-medium text-gray-700">{value}</span>
}

function PlanCard({ plan }) {
  return (
    <div className={`relative rounded-2xl p-6 bg-white ${plan.highlight ? 'border-2 border-brand-600 shadow-lg' : 'border border-gray-200'}`}>
      {plan.badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
          {plan.badge}
        </span>
      )}
      {plan.badge2 && (
        <span className="absolute -top-3 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          {plan.badge2}
        </span>
      )}
      <p className="font-bold text-gray-900 mb-1">{plan.label}</p>
      <p className="text-3xl font-black text-brand-600 mb-0.5">{plan.price}</p>
      <p className="text-xs text-gray-400 mb-5">{plan.sub}</p>

      {plan.features && (
        <div className="space-y-2 mb-5 border-t border-gray-100 pt-4">
          {plan.features.map((f) => (
            <div key={f.label} className="flex items-center justify-between text-xs">
              <span className="text-gray-600">{f.label}</span>
              <FeatureValue value={f.value} />
            </div>
          ))}
        </div>
      )}

      <Link
        to={plan.ctaTo}
        className={`block text-center text-sm font-semibold py-2.5 rounded-xl transition ${
          plan.highlight
            ? 'bg-brand-600 text-white hover:bg-brand-800'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {plan.cta}
      </Link>
    </div>
  )
}

export default function PricingSection() {
  const [tab, setTab] = useState('candidats')

  return (
    <section className="bg-white py-20" aria-label="Tarifs">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Commencez gratuitement.</h2>
        <p className="text-gray-500 mb-8">Passez à PRO quand vous êtes prêt.</p>

        {/* Tab switch */}
        <div className="inline-flex bg-gray-100 rounded-xl p-1 mb-10">
          {['candidats', 'entreprises'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition capitalize ${
                tab === t ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {(tab === 'candidats' ? CAND_PLANS : CO_PLANS).map((p) => (
            <PlanCard key={p.label} plan={p} />
          ))}
        </div>

        <p className="text-sm text-gray-400">
          🔒 Paiement sécurisé · ✓ Sans engagement · 💬 Support 7j/7
        </p>
      </div>
    </section>
  )
}
