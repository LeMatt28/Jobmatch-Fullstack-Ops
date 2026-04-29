'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { JobCard } from '@/components/jobs/JobCard'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { useJobs } from '@/features/jobs/hooks/useJobs'
import { ROUTES } from '@/lib/constants/routes'

export function RecentJobs() {
  const { jobs, isLoading } = useJobs()
  const recent = jobs.slice(0, 3)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Offres récentes</CardTitle>
          <Button variant="ghost" size="sm" asChild className="gap-1 text-primary">
            <Link href={ROUTES.jobs} aria-label="Voir toutes les offres d'emploi">
              Voir tout <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <LoadingSpinner size="sm" />
          </div>
        ) : recent.length === 0 ? (
          <p className="text-sm text-text-secondary text-center py-6">Aucune offre disponible.</p>
        ) : (
          recent.map((job) => (
            <JobCard key={job.id} job={job} variant="compact" />
          ))
        )}
      </CardContent>
    </Card>
  )
}
