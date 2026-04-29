'use client'

import React, { useState } from 'react'
import { Search, MapPin, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'
import { useJobsStore } from '@/features/jobs/store/jobsStore'
import { useDebounce } from '@/hooks/useDebounce'

export interface JobSearchBarProps {
  className?: string
  onSearch?: () => void
}

export function JobSearchBar({ className, onSearch }: JobSearchBarProps) {
  const { filters, setFilters } = useJobsStore()
  const [localQuery, setLocalQuery] = useState(filters.query)
  const [localLocation, setLocalLocation] = useState(filters.location)

  useDebounce(localQuery, 500)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters({ query: localQuery, location: localLocation })
    onSearch?.()
  }

  const handleClear = () => {
    setLocalQuery('')
    setLocalLocation('')
    setFilters({ query: '', location: '' })
  }

  const hasValue = localQuery || localLocation

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      aria-label="Recherche d'offres d'emploi"
      className={cn(
        'flex flex-col sm:flex-row gap-2 p-2 bg-surface rounded-xl border border-border shadow-card',
        className
      )}
    >
      {/* Query field */}
      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-disabled pointer-events-none"
          aria-hidden="true"
        />
        <input
          id="job-search-query"
          type="search"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Poste, compétence, entreprise…"
          aria-label="Intitulé du poste ou compétence"
          className={cn(
            'w-full h-10 rounded-lg pl-9 pr-4 text-sm bg-transparent',
            'text-text-primary placeholder:text-text-disabled',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset',
            'border-0'
          )}
        />
      </div>

      {/* Divider */}
      <div className="hidden sm:block w-px bg-border self-stretch my-1" aria-hidden="true" />

      {/* Location field */}
      <div className="relative flex-1">
        <MapPin
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-disabled pointer-events-none"
          aria-hidden="true"
        />
        <input
          id="job-search-location"
          type="text"
          value={localLocation}
          onChange={(e) => setLocalLocation(e.target.value)}
          placeholder="Ville, région, pays…"
          aria-label="Localisation"
          className={cn(
            'w-full h-10 rounded-lg pl-9 pr-4 text-sm bg-transparent',
            'text-text-primary placeholder:text-text-disabled',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset',
            'border-0'
          )}
        />
      </div>

      <div className="flex gap-2">
        {hasValue && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            aria-label="Effacer la recherche"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button type="submit" className="shrink-0 px-6">
          <Search className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Rechercher</span>
        </Button>
      </div>
    </form>
  )
}
