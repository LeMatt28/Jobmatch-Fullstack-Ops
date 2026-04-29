'use client'

import React from 'react'
import Link from 'next/link'
import { Sparkles, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { useSimilarJobs } from '@/features/ai-feature/hooks/useJobRecommendations'
import { ROUTES } from '@/lib/constants/routes'
import { cn } from '@/lib/utils/cn'

export interface SimilarJobsProps {
  jobId: string
}

export function SimilarJobs({ jobId }: SimilarJobsProps) {
  const { jobs, isLoading } = useSimilarJobs(jobId)

  if (!isLoading && jobs.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-accent-500" aria-hidden="true" />
          Offres similaires
        </CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex h-24 items-center justify-center">
            <LoadingSpinner size="sm" />
          </div>
        ) : (
          <ul className="space-y-2" role="list" aria-label="Offres similaires">
            {jobs.map((job) => (
              <li key={job.jobId}>
                <Link
                  href={ROUTES.jobDetail(job.jobId)}
                  className={cn(
                    'flex items-start justify-between gap-3 rounded-lg p-2.5 transition-colors duration-150',
                    'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg'
                  )}
                  aria-label={`${job.title} chez ${job.company} — ${job.matchScore}% de correspondance`}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{job.title}</p>
                    <p className="text-xs text-text-secondary flex items-center gap-1 mt-0.5">
                      {job.company}
                      <span aria-hidden="true">·</span>
                      <MapPin className="h-3 w-3" aria-hidden="true" />
                      {job.location}
                    </p>
                    <div className="mt-1 flex gap-1">
                      <Badge variant="ghost" className="text-xs">{job.contractType}</Badge>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs font-bold text-primary bg-primary-100 rounded-full px-2 py-0.5">
                    {job.matchScore}%
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
