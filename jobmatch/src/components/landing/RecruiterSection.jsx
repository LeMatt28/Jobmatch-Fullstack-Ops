import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'

const ADVANTAGES = [
  'Profils pré-qualifiés par l\'IA',
  'Score de compatibilité transparent',
  'Contact direct inclus dans l\'abonnement PRO',
  'Tableau de bord recruteur en temps réel',
]

const MOCK_CANDIDATES = [
  { initials: 'SL', name: 'Sophie L.', score: 91, skills: ['React', 'TypeScript'] },
  { initials: 'KA', name: 'Karim A.', score: 88, skills: ['Python', 'ML'] },
  { initials: 'LD', name: 'Laura D.', score: 84, skills: ['UX', 'Figma'] },
]

function CandidateMiniCard({ initials, name, score, skills }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-3 shadow-sm">
      <div className="w-8 h-8 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{name}</p>
        <div className="flex gap-1 mt-0.5">
          {skills.map((s) => (
            <span key={s} className="text-xs bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded">{s}</span>
          ))}
        </div>
      </div>
      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex-shrink-0">
        {score}✓
      </span>
    </div>
  )
}

export default function RecruiterSection() {
  return (
    <section className="bg-white py-20" aria-label="Pour les recruteurs">
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Mockup */}
        <div className="space-y-3">
          {MOCK_CANDIDATES.map((c) => <CandidateMiniCard key={c.initials} {...c} />)}
        </div>

        {/* Text */}
        <div>
          <span className="inline-block bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            Pour les entreprises
          </span>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-4">Recrutez sur la qualité, pas sur le volume.</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Publiez une offre en 3 minutes. Recevez uniquement des profils compatibles. Consultez le score de chaque candidat avant même de lire son CV.
          </p>
          <ul className="space-y-3 mb-8">
            {ADVANTAGES.map((a) => (
              <li key={a} className="flex items-start gap-2 text-sm text-gray-700">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                {a}
              </li>
            ))}
          </ul>
          <Link
            to="/register/company"
            className="inline-flex items-center gap-2 bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-800 transition"
          >
            Créer mon compte entreprise <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
