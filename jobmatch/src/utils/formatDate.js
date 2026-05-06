import { formatDistanceToNow, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

export function timeAgo(dateStr) {
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true, locale: fr })
  } catch {
    return ''
  }
}

export function formatSalary(min, max) {
  const fmt = (n) => n >= 10000 ? `${Math.round(n / 1000)}k€` : `${n}€`
  if (!min && !max) return null
  if (!max) return fmt(min)
  return `${fmt(min)}–${fmt(max)}`
}
