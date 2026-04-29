import { create } from 'zustand'
import type { JobsState, JobFilters } from '../types/job.types'
import { DEFAULT_FILTERS } from '../types/job.types'

interface JobsActions {
  setFilters: (filters: Partial<JobFilters>) => void
  resetFilters: () => void
  setPage: (page: number) => void
  setSelectedJob: (id: string | null) => void
}

type JobsStore = JobsState & JobsActions

export const useJobsStore = create<JobsStore>((set) => ({
  filters: DEFAULT_FILTERS,
  currentPage: 1,
  pageSize: 12,
  selectedJobId: null,

  setFilters: (partial) =>
    set((state) => ({
      filters: { ...state.filters, ...partial },
      currentPage: 1,
    })),

  resetFilters: () =>
    set({ filters: DEFAULT_FILTERS, currentPage: 1 }),

  setPage: (page) => set({ currentPage: page }),

  setSelectedJob: (id) => set({ selectedJobId: id }),
}))
