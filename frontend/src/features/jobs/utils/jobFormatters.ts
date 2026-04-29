import { formatDistanceToNow, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { SalaryRange, ContractType, Job } from '../types/job.types'

export function formatSalary(salary: SalaryRange): string {
  const fmt = (n: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: salary.currency, maximumFractionDigits: 0 }).format(n)

  const period = salary.period === 'year' ? '/an' : salary.period === 'month' ? '/mois' : '/jour'
  return `${fmt(salary.min)} – ${fmt(salary.max)} ${period}`
}

export function formatPublishedAt(dateStr: string): string {
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true, locale: fr })
  } catch {
    return dateStr
  }
}

export function formatLocation(location: string, remote: Job['remote']): string {
  if (remote === 'full') return 'Full remote'
  if (remote === 'partial') return `${location} (hybride)`
  return location
}

export const CONTRACT_COLORS: Record<ContractType, string> = {
  CDI:        'default',
  CDD:        'secondary',
  Alternance: 'accent',
  Stage:      'success',
  Freelance:  'warning',
  Interim:    'outline',
} as const

export const REMOTE_LABELS: Record<Job['remote'], string> = {
  full:    'Full remote',
  partial: 'Hybride',
  none:    'Présentiel',
}

export function buildJobQueryParams(
  filters: import('../types/job.types').JobFilters,
  page: number,
  pageSize: number
): Record<string, string> {
  const params: Record<string, string> = {
    page: String(page),
    pageSize: String(pageSize),
    sortBy: filters.sortBy,
  }

  if (filters.query)            params.q          = filters.query
  if (filters.location)         params.location   = filters.location
  if (filters.remote !== 'all') params.remote     = filters.remote
  if (filters.salaryMin)        params.salaryMin  = String(filters.salaryMin)
  if (filters.salaryMax)        params.salaryMax  = String(filters.salaryMax)
  if (filters.publishedSince)   params.since      = filters.publishedSince
  if (filters.contractTypes.length)   params.contractTypes   = filters.contractTypes.join(',')
  if (filters.experienceLevels.length) params.experienceLevels = filters.experienceLevels.join(',')
  if (filters.skills.length)    params.skills     = filters.skills.join(',')

  return params
}
