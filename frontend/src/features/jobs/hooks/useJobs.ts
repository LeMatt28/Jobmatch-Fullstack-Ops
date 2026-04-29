import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/axios.config'
import { useJobsStore } from '../store/jobsStore'
import { buildJobQueryParams } from '../utils/jobFormatters'
import type { JobsResponse, Job } from '../types/job.types'

async function fetchJobs(params: Record<string, string>): Promise<JobsResponse> {
  const { data } = await apiClient.get<JobsResponse>('/jobs', { params })
  return data
}

async function fetchJobById(id: string): Promise<Job> {
  const { data } = await apiClient.get<Job>(`/jobs/${id}`)
  return data
}

export interface UseJobsReturn {
  jobs: Job[]
  total: number
  totalPages: number
  currentPage: number
  isLoading: boolean
  isError: boolean
  error: Error | null
}

export function useJobs(): UseJobsReturn {
  const { filters, currentPage, pageSize } = useJobsStore()
  const params = buildJobQueryParams(filters, currentPage, pageSize)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['jobs', params],
    queryFn: () => fetchJobs(params),
    placeholderData: (prev) => prev,
  })

  return {
    jobs: data?.jobs ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 0,
    currentPage: data?.page ?? currentPage,
    isLoading,
    isError,
    error: error as Error | null,
  }
}

export interface UseJobDetailReturn {
  job: Job | undefined
  isLoading: boolean
  isError: boolean
}

export function useJobDetail(id: string): UseJobDetailReturn {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['job', id],
    queryFn: () => fetchJobById(id),
    enabled: !!id,
  })

  return { job: data, isLoading, isError }
}
