import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/axios.config'
import { ENDPOINTS } from '@/lib/api/endpoints'
import type { SalaryAnalytics, TrendsAnalytics, AnalyticsSummary } from '../types/analytics.types'

async function fetchSalaryAnalytics(): Promise<SalaryAnalytics> {
  const { data } = await apiClient.get<SalaryAnalytics>(ENDPOINTS.jobs.salary)
  return data
}

async function fetchTrendsAnalytics(): Promise<TrendsAnalytics> {
  const { data } = await apiClient.get<TrendsAnalytics>(ENDPOINTS.jobs.trends)
  return data
}

async function fetchAnalyticsSummary(): Promise<AnalyticsSummary> {
  const { data } = await apiClient.get<AnalyticsSummary>(ENDPOINTS.jobs.analytics)
  return data
}

// Fallback data shown while API loads or on error
const FALLBACK_SALARY: SalaryAnalytics = {
  buckets: [
    { range: '< 30k', count: 120, avgSalary: 27000 },
    { range: '30–40k', count: 340, avgSalary: 35000 },
    { range: '40–50k', count: 520, avgSalary: 45000 },
    { range: '50–60k', count: 410, avgSalary: 55000 },
    { range: '60–75k', count: 280, avgSalary: 67000 },
    { range: '75–100k', count: 150, avgSalary: 87000 },
    { range: '> 100k', count: 80, avgSalary: 120000 },
  ],
  median: 48000,
  average: 51000,
  min: 20000,
  max: 180000,
}

const FALLBACK_TRENDS: TrendsAnalytics = {
  monthly: [
    { month: 'Nov', jobs: 980, applications: 4200 },
    { month: 'Déc', jobs: 820, applications: 3600 },
    { month: 'Jan', jobs: 1100, applications: 5100 },
    { month: 'Fév', jobs: 1250, applications: 5800 },
    { month: 'Mar', jobs: 1400, applications: 6300 },
    { month: 'Avr', jobs: 1580, applications: 7100 },
  ],
  topSkills: [
    { skill: 'React', count: 1240, growth: 18 },
    { skill: 'Python', count: 1100, growth: 24 },
    { skill: 'TypeScript', count: 980, growth: 32 },
    { skill: 'Node.js', count: 860, growth: 12 },
    { skill: 'Docker', count: 720, growth: 28 },
    { skill: 'AWS', count: 680, growth: 15 },
  ],
}

export function useSalaryAnalytics() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics', 'salary'],
    queryFn: fetchSalaryAnalytics,
    staleTime: 5 * 60 * 1000,
    placeholderData: FALLBACK_SALARY,
  })
  return { data: data ?? FALLBACK_SALARY, isLoading }
}

export function useTrendsAnalytics() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics', 'trends'],
    queryFn: fetchTrendsAnalytics,
    staleTime: 5 * 60 * 1000,
    placeholderData: FALLBACK_TRENDS,
  })
  return { data: data ?? FALLBACK_TRENDS, isLoading }
}

export function useAnalyticsSummary() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics', 'summary'],
    queryFn: fetchAnalyticsSummary,
    staleTime: 5 * 60 * 1000,
  })
  return { data, isLoading }
}
