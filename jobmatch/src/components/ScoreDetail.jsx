export const mockScoreCriteria = [
  { criteria: 'Compétences techniques', value: 94, comment: 'React et TypeScript parfaitement alignés' },
  { criteria: 'Localisation', value: 100, comment: 'Paris — correspond exactement' },
  { criteria: 'Prétentions salariales', value: 72, comment: 'Légèrement au-dessus de la fourchette proposée' },
  { criteria: 'Soft skills', value: 88, comment: 'Leadership et autonomie valorisés' },
  { criteria: 'Type de contrat', value: 100, comment: 'CDI souhaité — CDI proposé' },
  { criteria: 'Mobilité', value: 80, comment: 'Remote possible 2j/sem proposé' },
]

function barColor(v) {
  if (v >= 80) return 'bg-emerald-500'
  if (v >= 50) return 'bg-amber-400'
  return 'bg-red-400'
}

function globalLabel(score) {
  if (score >= 85) return 'Excellent match'
  if (score >= 70) return 'Bon match'
  if (score >= 50) return 'Match correct'
  return 'À améliorer'
}

export function ScoreDetail({ scores = mockScoreCriteria, globalScore }) {
  const computed = globalScore ?? Math.round(scores.reduce((a, s) => a + s.value, 0) / scores.length)
  const color = computed >= 80 ? 'text-emerald-600' : computed >= 50 ? 'text-amber-500' : 'text-red-500'

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className={`text-3xl font-black ${color}`}>{computed}</span>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Score global</p>
          <p className={`text-sm font-semibold ${color}`}>{globalLabel(computed)}</p>
        </div>
      </div>
      <div className="space-y-2.5">
        {scores.map((s) => (
          <div key={s.criteria}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">{s.criteria}</span>
              <span className="text-xs font-semibold text-gray-700">{s.value}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${barColor(s.value)} transition-all`} style={{ width: `${s.value}%` }} />
            </div>
            {s.comment && <p className="text-xs text-gray-400 mt-0.5">{s.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
