'use client'

import React from 'react'
import { SlidersHorizontal, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useJobsStore } from '@/features/jobs/store/jobsStore'
import type { ContractType, ExperienceLevel } from '@/features/jobs/types/job.types'
import { cn } from '@/lib/utils/cn'

const CONTRACT_OPTIONS: ContractType[] = ['CDI', 'CDD', 'Alternance', 'Stage', 'Freelance', 'Interim']
const EXPERIENCE_OPTIONS: ExperienceLevel[] = ['Junior', 'Intermédiaire', 'Senior', 'Expert']
const REMOTE_OPTIONS = [
  { value: 'all',     label: 'Tous' },
  { value: 'full',    label: 'Full remote' },
  { value: 'partial', label: 'Hybride' },
  { value: 'none',    label: 'Présentiel' },
] as const
const PUBLISHED_OPTIONS = [
  { value: '24h', label: 'Dernières 24h' },
  { value: '3d',  label: '3 derniers jours' },
  { value: '7d',  label: 'Cette semaine' },
  { value: '30d', label: 'Ce mois' },
] as const
const SORT_OPTIONS = [
  { value: 'relevance', label: 'Pertinence' },
  { value: 'date',      label: 'Date de publication' },
  { value: 'salary',    label: 'Salaire' },
] as const

export interface JobFiltersProps {
  className?: string
  totalResults?: number
}

export function JobFilters({ className, totalResults }: JobFiltersProps) {
  const { filters, setFilters, resetFilters } = useJobsStore()

  const toggleContractType = (type: ContractType) => {
    const next = filters.contractTypes.includes(type)
      ? filters.contractTypes.filter((t) => t !== type)
      : [...filters.contractTypes, type]
    setFilters({ contractTypes: next })
  }

  const toggleExperience = (level: ExperienceLevel) => {
    const next = filters.experienceLevels.includes(level)
      ? filters.experienceLevels.filter((l) => l !== level)
      : [...filters.experienceLevels, level]
    setFilters({ experienceLevels: next })
  }

  const activeFilterCount =
    filters.contractTypes.length +
    filters.experienceLevels.length +
    (filters.remote !== 'all' ? 1 : 0) +
    (filters.publishedSince ? 1 : 0) +
    (filters.salaryMin ? 1 : 0)

  return (
    <aside
      aria-label="Filtres de recherche"
      className={cn('flex flex-col gap-5', className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-text-secondary" aria-hidden="true" />
          <h2 className="font-semibold text-text-primary text-sm">Filtres</h2>
          {activeFilterCount > 0 && (
            <Badge variant="default" className="text-xs">{activeFilterCount}</Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-xs gap-1"
            aria-label="Réinitialiser tous les filtres"
          >
            <RotateCcw className="h-3 w-3" aria-hidden="true" />
            Réinitialiser
          </Button>
        )}
      </div>

      {totalResults !== undefined && (
        <p className="text-sm text-text-secondary">
          <span className="font-semibold text-text-primary">{totalResults.toLocaleString('fr-FR')}</span> offres
        </p>
      )}

      {/* Sort */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-text-disabled">
          Trier par
        </label>
        <Select value={filters.sortBy} onValueChange={(v) => setFilters({ sortBy: v as typeof filters.sortBy })}>
          <SelectTrigger aria-label="Trier les offres par">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Contract type */}
      <fieldset className="space-y-2">
        <legend className="text-xs font-semibold uppercase tracking-wider text-text-disabled">
          Type de contrat
        </legend>
        <div className="flex flex-wrap gap-2">
          {CONTRACT_OPTIONS.map((type) => {
            const active = filters.contractTypes.includes(type)
            return (
              <button
                key={type}
                type="button"
                onClick={() => toggleContractType(type)}
                aria-pressed={active}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium border transition-all duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
                  active
                    ? 'bg-primary text-white border-primary'
                    : 'bg-surface text-text-secondary border-border hover:border-primary hover:text-primary'
                )}
              >
                {type}
              </button>
            )
          })}
        </div>
      </fieldset>

      {/* Experience */}
      <fieldset className="space-y-2">
        <legend className="text-xs font-semibold uppercase tracking-wider text-text-disabled">
          Expérience
        </legend>
        <div className="flex flex-wrap gap-2">
          {EXPERIENCE_OPTIONS.map((level) => {
            const active = filters.experienceLevels.includes(level)
            return (
              <button
                key={level}
                type="button"
                onClick={() => toggleExperience(level)}
                aria-pressed={active}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium border transition-all duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
                  active
                    ? 'bg-accent text-white border-accent'
                    : 'bg-surface text-text-secondary border-border hover:border-accent hover:text-accent-500'
                )}
              >
                {level}
              </button>
            )
          })}
        </div>
      </fieldset>

      {/* Remote */}
      <div className="space-y-2">
        <label htmlFor="filter-remote" className="text-xs font-semibold uppercase tracking-wider text-text-disabled">
          Télétravail
        </label>
        <Select value={filters.remote} onValueChange={(v) => setFilters({ remote: v as typeof filters.remote })}>
          <SelectTrigger id="filter-remote" aria-label="Filtrer par télétravail">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {REMOTE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Published since */}
      <div className="space-y-2">
        <label htmlFor="filter-date" className="text-xs font-semibold uppercase tracking-wider text-text-disabled">
          Publié depuis
        </label>
        <Select
          value={filters.publishedSince ?? ''}
          onValueChange={(v) => setFilters({ publishedSince: v as typeof filters.publishedSince || undefined })}
        >
          <SelectTrigger id="filter-date" aria-label="Filtrer par date de publication">
            <SelectValue placeholder="Toutes les dates" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Toutes les dates</SelectItem>
            {PUBLISHED_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Salary range */}
      <fieldset className="space-y-2">
        <legend className="text-xs font-semibold uppercase tracking-wider text-text-disabled">
          Salaire annuel (€)
        </legend>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            value={filters.salaryMin ?? ''}
            onChange={(e) => setFilters({ salaryMin: e.target.value ? Number(e.target.value) : undefined })}
            aria-label="Salaire minimum"
            className="input-base w-full"
            min={0}
            step={5000}
          />
          <span className="text-text-disabled text-sm shrink-0" aria-hidden="true">–</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.salaryMax ?? ''}
            onChange={(e) => setFilters({ salaryMax: e.target.value ? Number(e.target.value) : undefined })}
            aria-label="Salaire maximum"
            className="input-base w-full"
            min={0}
            step={5000}
          />
        </div>
      </fieldset>
    </aside>
  )
}
