import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate('/premium/success')
    }, 1200)
  }

  const renewDate = new Date()
  renewDate.setDate(renewDate.getDate() + 7)
  const renewStr = renewDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="min-h-screen bg-warm-50 py-12 px-4">
      <div className="max-w-3xl mx-auto grid md:grid-cols-[1fr,320px] gap-8 items-start">

        {/* Form */}
        <div>
          <h1 className="text-2xl font-bold text-brand-900 mb-6">Informations de paiement</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">Email de facturation</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@email.fr"
                className="w-full px-4 py-3 border border-warm-200 rounded-xl text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            {/* Mocked card fields */}
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">Carte bancaire</label>
              <div className="bg-gray-50 border border-warm-200 rounded-xl p-4 space-y-3 opacity-75">
                <div className="flex items-center gap-3">
                  <input
                    disabled
                    placeholder="Numéro de carte"
                    className="flex-1 bg-transparent text-sm outline-none text-gray-400 cursor-not-allowed"
                  />
                  <div className="flex gap-1.5">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">VISA</span>
                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">MC</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <input disabled placeholder="MM/AA" className="w-20 bg-transparent text-sm text-gray-400 outline-none cursor-not-allowed" />
                  <input disabled placeholder="CVC" className="w-16 bg-transparent text-sm text-gray-400 outline-none cursor-not-allowed" />
                </div>
                <p className="text-xs text-amber-600 flex items-center gap-1.5">
                  <Lock className="w-3 h-3" />
                  Paiement simulé — aucune donnée réelle collectée
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">Nom sur la carte</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jean Dupont"
                className="w-full px-4 py-3 border border-warm-200 rounded-xl text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 text-white font-semibold py-3.5 rounded-xl hover:bg-brand-800 transition text-sm disabled:opacity-60"
            >
              {loading ? 'Traitement en cours...' : 'Démarrer mon essai gratuit →'}
            </button>

            <p className="text-xs text-gray-400 text-center leading-relaxed">
              En continuant, vous acceptez nos CGU. Vous ne serez débité qu'après la période d'essai.
              Annulation possible depuis votre espace.
            </p>
          </form>
        </div>

        {/* Summary */}
        <div className="bg-white border border-warm-200 rounded-2xl p-5 shadow-sm sticky top-8">
          <h2 className="font-semibold text-brand-900 mb-4">Récapitulatif</h2>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Plan PRO Trimestriel</span>
              <span className="font-medium text-brand-900">7,99 €/mois</span>
            </div>
            <div className="flex justify-between text-gray-400 text-xs">
              <span>Durée</span>
              <span>× 3 mois</span>
            </div>
          </div>
          <div className="border-t border-warm-200 pt-3 space-y-2 text-sm mb-4">
            <p className="text-emerald-700 text-xs">✓ Essai gratuit 7 jours inclus</p>
            <p className="text-emerald-700 text-xs">✓ Annulable avant le 7e jour</p>
          </div>
          <div className="border-t border-warm-200 pt-3">
            <div className="flex justify-between font-bold text-brand-900 mb-1">
              <span>Total aujourd'hui</span>
              <span>0,00 €</span>
            </div>
            <p className="text-xs text-gray-400">Renouvellement le {renewStr} : 23,97 €</p>
          </div>
        </div>
      </div>
    </div>
  )
}
