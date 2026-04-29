'use client'

import React, { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { JobSearchBar } from '@/components/jobs/JobSearchBar'
import { JobFilters } from '@/components/jobs/JobFilters'
import { JobList } from '@/components/jobs/JobList'
import { Button } from '@/components/ui/button'
import { useJobs } from '@/features/jobs/hooks/useJobs'
import { useIsMobile } from '@/hooks/useMediaQuery'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export function JobsPageClient() {
  const { total, isLoading } = useJobs()
  const isMobile = useIsMobile()
  const [filtersOpen, setFiltersOpen] = useState(false)

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Offres d&apos;emploi</h1>
        <p className="mt-1 text-sm text-text-secondary">
          {isLoading
            ? 'Chargement des offres…'
            : `${total.toLocaleString('fr-FR')} offres disponibles`}
        </p>
      </div>

      {/* Search bar */}
      <JobSearchBar />

      <div className="flex gap-6 items-start">
        {/* Sidebar filters — desktop */}
        <div className="hidden lg:block w-64 shrink-0">
          <div className="card p-4 sticky top-24">
            <JobFilters totalResults={total} />
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Mobile filter button */}
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <p className="text-sm text-text-secondary">
              {!isLoading && (
                <span><strong>{total.toLocaleString('fr-FR')}</strong> offres</span>
              )}
            </p>

            <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                  Filtres
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Filtres de recherche</DialogTitle>
                </DialogHeader>
                <JobFilters totalResults={total} />
                <Button className="mt-4 w-full" onClick={() => setFiltersOpen(false)}>
                  Voir les résultats
                </Button>
              </DialogContent>
            </Dialog>
          </div>

          <JobList />
        </div>
      </div>
    </div>
  )
}
