import { scoreColor } from '../utils/scoreColor'

export function ScoreBadge({ score, size = 'md' }) {
  const { bg, text, label } = scoreColor(score)
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-lg px-4 py-2 font-bold',
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${bg} ${text} ${sizes[size]}`}>
      {size === 'lg' ? `${score} — ${label}` : score}
    </span>
  )
}
