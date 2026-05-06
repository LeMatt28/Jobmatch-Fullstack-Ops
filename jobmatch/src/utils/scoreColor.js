export function scoreColor(score) {
  if (score > 80) return { bg: 'bg-green-100', text: 'text-green-800', label: 'Excellent' }
  if (score >= 50) return { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Correct' }
  return { bg: 'bg-red-100', text: 'text-red-800', label: 'Faible' }
}
