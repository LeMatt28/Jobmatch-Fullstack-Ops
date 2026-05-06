import { Link } from 'react-router-dom'
import { Check, X } from 'lucide-react'

const FEATURES = [
  { label: 'Offres publiées', free: '2', pro: 'Illimitées' },
  { label: 'Voir les matchs', free: true, pro: true },
  { label: 'Voir le profil complet du candidat', free: false, pro: true },
  { label: 'Contacter directement le candidat', free: false, pro: true },
  { label: 'Score IA détaillé du candidat', free: false, pro: true },
  { label: 'Accès au CV', free: false, pro: true },
  { label: 'Statistiques avancées des offres', free: false, pro: true },
  { label: 'Badge "Entreprise vérifiée"', free: false, pro: true },
  { label: 'Support recrutement dédié', free: false, pro: true },
]

const PLANS = [
  { id: 'starter', label: 'Starter', price: '49 €', sub: '/mois · 1 recruteur, 5 offres actives', highlight: false },
  { id: 'growth', label: 'Growth', price: '99 €', sub: '/mois · 3 recruteurs, offres illimitées', highlight: true, badge: 'Le plus populaire' },
  { id: 'enterprise', label: 'Enterprise', price: 'Sur devis', sub: 'SSO, API, intégration ATS', highlight: false },
]

function Cell({ value }) {
  if (value === true) return <Check className="w-4 h-4 text-emerald-500 mx-auto" />
  if (value === false) return <X className="w-4 h-4 text-gray-300 mx-auto" />
  return <span className="text-sm font-medium text-brand-900">{value}</span>
}

export default function PremiumCompany() {
  return (
    <div className="min-h-screen bg-warm-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-brand-900 mb-2">JobMatch PRO Entreprise</h1>
          <p className="text-gray-500">Accédez aux profils complets et recrutez plus vite.</p>
        </div>

        <div className="bg-white border border-warm-200 rounded-2xl shadow-sm overflow-hidden mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b border-warm-200">
                <th className="text-left px-5 py-4 text-sm font-semibold text-brand-900 w-1/2">Fonctionnalité</th>
                <th className="text-center px-4 py-4 text-sm font-medium text-gray-400">Gratuit</th>
                <th className="text-center px-4 py-4 text-sm font-bold text-brand-600">PRO</th>
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((f, i) => (
                <tr key={f.label} className={`border-b border-warm-100 ${i === FEATURES.length - 1 ? 'border-0' : ''}`}>
                  <td className="px-5 py-3 text-sm text-gray-700">{f.label}</td>
                  <td className="px-4 py-3 text-center"><Cell value={f.free} /></td>
                  <td className="px-4 py-3 text-center"><Cell value={f.pro} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {PLANS.map((plan) => (
            <div key={plan.id} className={`rounded-2xl p-5 relative ${plan.highlight ? 'bg-white border-2 border-brand-600' : 'bg-white border border-warm-200'}`}>
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">{plan.badge}</span>
              )}
              <p className="font-bold text-brand-900 mb-1">{plan.label}</p>
              <p className="text-2xl font-black text-brand-600 mb-0.5">{plan.price}</p>
              <p className="text-xs text-gray-400 mb-4">{plan.sub}</p>
              <Link
                to={plan.id === 'enterprise' ? '/settings' : '/premium/checkout'}
                className={`block text-center text-sm font-semibold px-4 py-2.5 rounded-xl transition ${plan.highlight ? 'bg-brand-600 text-white hover:bg-brand-800' : 'bg-warm-100 text-brand-800 hover:bg-warm-200'}`}
              >
                {plan.id === 'enterprise' ? 'Nous contacter' : 'Choisir'}
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/premium/checkout" className="inline-flex items-center gap-2 bg-brand-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-brand-800 transition text-sm">
            Démarrer maintenant →
          </Link>
          <p className="text-xs text-gray-400 mt-3">Sans engagement · Support dédié · Facturation mensuelle</p>
        </div>

        <div className="flex justify-center gap-8 mt-8 text-sm text-gray-400">
          <span>🔒 Paiement sécurisé</span>
          <span>⭐ 4.8/5 satisfaction</span>
          <span>💬 Support 7j/7</span>
        </div>
      </div>
    </div>
  )
}
