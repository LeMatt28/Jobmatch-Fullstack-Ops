import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function SuccessPage() {
  const { role } = useAuth()
  const nextPath = role === 'company' ? '/company/dashboard' : '/candidate/feed'

  return (
    <div className="min-h-screen bg-warm-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Animated checkmark */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-emerald-500" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" />
            <path d="M12 20l6 6 10-12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className="text-2xl font-black text-brand-900 mb-2">🎉 Bienvenue dans JobMatch PRO !</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Votre essai gratuit de 7 jours commence maintenant. Profitez de toutes les fonctionnalités PRO sans limitation.
        </p>

        <div className="bg-white border border-warm-200 rounded-2xl p-5 mb-6 text-left space-y-2">
          <p className="text-sm text-emerald-700">✓ Swipes illimités</p>
          <p className="text-sm text-emerald-700">✓ Score IA détaillé par critère</p>
          <p className="text-sm text-emerald-700">✓ Statistiques de visibilité</p>
          <p className="text-sm text-emerald-700">✓ Qui a liké votre profil</p>
        </div>

        <Link
          to={nextPath}
          className="inline-flex items-center gap-2 bg-brand-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-brand-800 transition"
        >
          Découvrir mes nouveaux avantages →
        </Link>
      </div>
    </div>
  )
}
