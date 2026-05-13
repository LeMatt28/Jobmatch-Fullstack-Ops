const CRITERIA = [
  { label: 'Compétences techniques', value: 94, color: 'bg-emerald-500' },
  { label: 'Localisation', value: 100, color: 'bg-emerald-500' },
  { label: 'Prétentions salariales', value: 72, color: 'bg-amber-400', note: 'Légèrement au-dessus de la fourchette — à discuter' },
  { label: 'Soft skills', value: 90, color: 'bg-emerald-500' },
  { label: 'Contrat', value: 100, color: 'bg-emerald-500' },
  { label: 'Mobilité', value: 80, color: 'bg-emerald-500' },
]

const FEATURES = [
  'Compétences techniques',
  'Prétentions salariales',
  'Localisation & mobilité',
  'Type de contrat',
  'Expérience et niveau',
  'Soft skills & culture d\'entreprise',
]

function ScoreMockup() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-3">Score de compatibilité</p>
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-5xl font-black text-gray-900">91</span>
        <span className="text-sm text-gray-400">/100</span>
        <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold px-2.5 py-1 rounded-full">Excellent match</span>
      </div>
      <div className="space-y-3">
        {CRITERIA.map((c) => (
          <div key={c.label}>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-gray-600">{c.label}</span>
              <span className="text-xs font-bold text-gray-900">{c.value}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${c.color}`} style={{ width: `${c.value}%` }} />
            </div>
            {c.note && <p className="text-xs text-gray-400 italic mt-0.5">{c.note}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ScoreSection() {
  return (
    <section className="bg-brand-50 py-20" aria-label="Score IA">
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block bg-white border border-brand-200 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            Intelligence artificielle
          </span>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-4">Une IA qui explique ses choix.</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Pas une boîte noire. Notre algorithme analyse 6 critères pour chaque match et vous dit précisément pourquoi vous correspondez à une offre.
          </p>
          <ul className="space-y-2">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-brand-600 font-bold">✦</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
        <ScoreMockup />
      </div>
    </section>
  )
}
