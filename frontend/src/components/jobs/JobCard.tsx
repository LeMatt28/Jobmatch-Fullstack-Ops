import React from 'react'
import Link from 'next/link'
import { MapPin, Clock, Banknote, Wifi, Building2, Heart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'
import type { Job } from '@/features/jobs/types/job.types'
import {
  formatSalary,
  formatPublishedAt,
  formatLocation,
  CONTRACT_COLORS,
  REMOTE_LABELS,
} from '@/features/jobs/utils/jobFormatters'
import { ROUTES } from '@/lib/constants/routes'

export interface JobCardProps {
  job: Job
  onFavorite?: (id: string) => void
  className?: string
  variant?: 'default' | 'compact'
}

export function JobCard({ job, onFavorite, className, variant = 'default' }: JobCardProps) {
  const contractColor = CONTRACT_COLORS[job.contractType] as
    | 'default' | 'secondary' | 'accent' | 'success' | 'warning' | 'outline'

  return (
    <article
      className={cn(
        'card p-5 job-card-lift group relative flex flex-col gap-4',
        className
      )}
      aria-label={`Offre : ${job.title} chez ${job.company.name}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Company logo */}
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-50 border border-border overflow-hidden"
            aria-hidden="true"
          >
            {job.company.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={job.company.logo} alt="" className="h-full w-full object-contain p-1" />
            ) : (
              <Building2 className="h-5 w-5 text-primary" />
            )}
          </div>

          <div className="min-w-0">
            <p className="text-xs text-text-secondary truncate">{job.company.name}</p>
            <Link
              href={ROUTES.jobDetail(job.id)}
              className="font-semibold text-text-primary hover:text-primary transition-colors line-clamp-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            >
              {job.title}
            </Link>
          </div>
        </div>

        {/* Favorite button */}
        {onFavorite && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onFavorite(job.id)}
            aria-label={job.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            aria-pressed={job.isFavorite}
            className="shrink-0"
          >
            <Heart
              className={cn('h-4 w-4 transition-colors', job.isFavorite ? 'fill-secondary text-secondary' : 'text-text-disabled')}
            />
          </Button>
        )}
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-2 text-xs text-text-secondary">
        <span className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {formatLocation(job.location, job.remote)}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {formatPublishedAt(job.publishedAt)}
        </span>
        {job.salary && (
          <span className="flex items-center gap-1 text-success-text font-medium">
            <Banknote className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {formatSalary(job.salary)}
          </span>
        )}
        {job.remote !== 'none' && (
          <span className="flex items-center gap-1 text-primary">
            <Wifi className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {REMOTE_LABELS[job.remote]}
          </span>
        )}
      </div>

      {/* Description (compact hides this) */}
      {variant === 'default' && (
        <p className="text-sm text-text-secondary line-clamp-2">{job.description}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-border">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant={contractColor}>{job.contractType}</Badge>
          <Badge variant="ghost">{job.experienceLevel}</Badge>
          {job.skills.slice(0, 2).map((skill) => (
            <Badge key={skill} variant="outline">{skill}</Badge>
          ))}
          {job.skills.length > 2 && (
            <Badge variant="outline">+{job.skills.length - 2}</Badge>
          )}
        </div>

        <Link
          href={ROUTES.jobDetail(job.id)}
          className="shrink-0 text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
          aria-label={`Voir les détails de l'offre ${job.title}`}
        >
          Voir l&apos;offre →
        </Link>
      </div>
    </article>
  )
}
