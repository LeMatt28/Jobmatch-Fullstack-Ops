'use client'

import React from 'react'
import { JobCard } from './JobCard'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { Pagination } from '@/components/common/Pagination'
import { useJobs } from '@/features/jobs/hooks/useJobs'
import { useJobsStore } from '@/features/jobs/store/jobsStore'
import { cn } from '@/lib/utils/cn'

export interface JobListProps {
  className?: string
}

export function JobList({ className }: JobListProps) {
  const { jobs, totalPages, currentPage, isLoading, isError } = useJobs()
  const { setPage, resetFilters } = useJobsStore()

  if (isLoading) {
    return (
      <div className={cn('flex flex-col gap-4', className)}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card p-5 animate-pulse">
            <div className="flex gap-3">
              <div className="skeleton h-11 w-11 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-3 w-1/4 rounded" />
                <div className="skeleton h-4 w-3/4 rounded" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="skeleton h-3 w-full rounded" />
              <div className="skeleton h-3 w-5/6 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <EmptyState
        title="Erreur de chargement"
        description="Impossible de charger les offres. Veuillez réessayer."
        action={{ label: 'Réessayer', onClick: () => window.location.reload() }}
        className={className}
      />
    )
  }

  if (jobs.length === 0) {
    return (
      <EmptyState
        title="Aucune offre trouvée"
        description="Essayez d'élargir vos critères de recherche ou de réinitialiser les filtres."
        action={{ label: 'Réinitialiser les filtres', onClick: resetFilters }}
        className={className}
      />
    )
  }

  return (
    <section aria-label="Liste des offres d'emploi" className={cn('flex flex-col gap-6', className)}>
      <div
        className="grid grid-cols-1 gap-4"
        role="list"
        aria-live="polite"
        aria-busy={isLoading}
      >
        {jobs.map((job, i) => (
          <div key={job.id} role="listitem" className={`stagger-item`} style={{ animationDelay: `${i * 40}ms` }}>
            <JobCard job={job} />
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </section>
  )
}
