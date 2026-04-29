export type ContractType = 'CDI' | 'CDD' | 'Alternance' | 'Stage' | 'Freelance' | 'Interim'
export type ExperienceLevel = 'Junior' | 'Intermédiaire' | 'Senior' | 'Expert'
export type JobSource = 'LinkedIn' | 'Indeed' | 'Welcome to the Jungle' | 'Glassdoor' | 'Other'

export interface Company {
  id: string
  name: string
  logo?: string
  website?: string
  size?: string
  sector?: string
}

export interface SalaryRange {
  min: number
  max: number
  currency: string
  period: 'year' | 'month' | 'day'
}

export interface Job {
  id: string
  title: string
  company: Company
  location: string
  remote: 'full' | 'partial' | 'none'
  contractType: ContractType
  experienceLevel: ExperienceLevel
  salary?: SalaryRange
  skills: string[]
  description: string
  requirements: string[]
  benefits?: string[]
  source: JobSource
  sourceUrl: string
  publishedAt: string
  expiresAt?: string
  isFavorite?: boolean
  applicationCount?: number
}

export interface JobFilters {
  query: string
  location: string
  contractTypes: ContractType[]
  experienceLevels: ExperienceLevel[]
  remote: 'all' | 'full' | 'partial' | 'none'
  salaryMin?: number
  salaryMax?: number
  publishedSince?: '24h' | '3d' | '7d' | '30d'
  skills: string[]
  sortBy: 'relevance' | 'date' | 'salary'
}

export interface JobsResponse {
  jobs: Job[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface JobsState {
  filters: JobFilters
  currentPage: number
  pageSize: number
  selectedJobId: string | null
}

export const DEFAULT_FILTERS: JobFilters = {
  query: '',
  location: '',
  contractTypes: [],
  experienceLevels: [],
  remote: 'all',
  salaryMin: undefined,
  salaryMax: undefined,
  publishedSince: undefined,
  skills: [],
  sortBy: 'relevance',
}
