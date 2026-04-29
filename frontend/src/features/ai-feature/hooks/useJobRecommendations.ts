import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/axios.config'
import { ENDPOINTS } from '@/lib/api/endpoints'
import type { AIRecommendations, RecommendedJob } from '../types/ai.types'

async function fetchRecommendations(): Promise<AIRecommendations> {
  const { data } = await apiClient.get<AIRecommendations>(ENDPOINTS.jobs.recommend)
  return data
}

async function fetchSimilarJobs(jobId: string): Promise<RecommendedJob[]> {
  const { data } = await apiClient.get<RecommendedJob[]>(ENDPOINTS.jobs.similar(jobId))
  return data
}

const FALLBACK: AIRecommendations = {
  jobs: [
    {
      jobId: '1',
      title: 'Développeur React Senior',
      company: 'TechCorp',
      location: 'Paris',
      contractType: 'CDI',
      salary: '55k – 70k €/an',
      matchScore: 94,
      matchReasons: ['React', 'TypeScript', 'Node.js'],
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      jobId: '2',
      title: 'Frontend Engineer',
      company: 'StartupXYZ',
      location: 'Lyon (hybride)',
      contractType: 'CDI',
      salary: '45k – 60k €/an',
      matchScore: 87,
      matchReasons: ['Next.js', 'Tailwind', 'API REST'],
      publishedAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      jobId: '3',
      title: 'Full Stack Developer',
      company: 'ScaleUp',
      location: 'Full remote',
      contractType: 'CDI',
      salary: '50k – 65k €/an',
      matchScore: 82,
      matchReasons: ['React', 'Python', 'Docker'],
      publishedAt: new Date(Date.now() - 259200000).toISOString(),
    },
  ],
  skillGaps: [
    { skill: 'Docker', importance: 'high', jobCount: 420 },
    { skill: 'GraphQL', importance: 'medium', jobCount: 280 },
    { skill: 'AWS', importance: 'high', jobCount: 680 },
  ],
  profileStrength: 72,
}

export function useJobRecommendations() {
  const { data, isLoading } = useQuery({
    queryKey: ['ai', 'recommendations'],
    queryFn: fetchRecommendations,
    staleTime: 10 * 60 * 1000,
    placeholderData: FALLBACK,
  })
  return { data: data ?? FALLBACK, isLoading }
}

export function useSimilarJobs(jobId: string) {
  const { data, isLoading } = useQuery({
    queryKey: ['ai', 'similar', jobId],
    queryFn: () => fetchSimilarJobs(jobId),
    enabled: !!jobId,
    staleTime: 10 * 60 * 1000,
  })
  return { jobs: data ?? [], isLoading }
}
