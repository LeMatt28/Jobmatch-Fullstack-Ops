'use client'

import React from 'react'
import Link from 'next/link'
import {
  MapPin, Clock, Banknote, Wifi, Building2,
  ExternalLink, ArrowLeft, Briefcase, Users,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingPage } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { useJobDetail } from '@/features/jobs/hooks/useJobs'
import {
  formatSalary,
  formatPublishedAt,
  formatLocation,
  CONTRACT_COLORS,
  REMOTE_LABELS,
} from '@/features/jobs/utils/jobFormatters'
import { ROUTES } from '@/lib/constants/routes'
import { cn } from '@/lib/utils/cn'

export function JobDetailClient({ id }: { id: string }) {
  const { job, isLoading, isError } = useJobDetail(id)

  if (isLoading) return <LoadingPage />
  if (isError || !job) {
    return (
      <EmptyState
        title="Offre introuvable"
        description="Cette offre n'existe pas ou a été supprimée."
        action={{ label: 'Retour aux offres', onClick: () => window.history.back() }}
      />
    )
  }

  const contractColor = CONTRACT_COLORS[job.contractType] as
    | 'default' | 'secondary' | 'accent' | 'success' | 'warning' | 'outline'

  return (
    <article className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <nav aria-label="Fil d'Ariane">
        <Link
          href={ROUTES.jobs}
          className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Retour aux offres
        </Link>
      </nav>

      {/* Hero card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-5">
            {/* Logo */}
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary-50 border border-border overflow-hidden"
              aria-hidden="true"
            >
              {job.company.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={job.company.logo} alt="" className="h-full w-full object-contain p-2" />
              ) : (
                <Building2 className="h-8 w-8 text-primary" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant={contractColor}>{job.contractType}</Badge>
                <Badge variant="ghost">{job.experienceLevel}</Badge>
                {job.remote !== 'none' && (
                  <Badge variant="accent">{REMOTE_LABELS[job.remote]}</Badge>
                )}
              </div>

              <h1 className="text-2xl font-bold text-text-primary">{job.title}</h1>

              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-secondary">
                <span className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" aria-hidden="true" />
                  {job.company.name}
                  {job.company.sector && ` · ${job.company.sector}`}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {formatLocation(job.location, job.remote)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  Publiée {formatPublishedAt(job.publishedAt)}
                </span>
                {job.applicationCount !== undefined && (
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" aria-hidden="true" />
                    {job.applicationCount} candidature{job.applicationCount !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {job.salary && (
                <p className="mt-2 flex items-center gap-1.5 text-base font-semibold text-[#1A5C3A]">
                  <Banknote className="h-5 w-5" aria-hidden="true" />
                  {formatSalary(job.salary)}
                </p>
              )}
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-2 sm:items-end shrink-0">
              <Button asChild>
                <a
                  href={job.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Postuler sur ${job.source} (nouvel onglet)`}
                >
                  Postuler
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
              <span className="text-xs text-text-disabled text-center">
                Via {job.source}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Description */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description du poste</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-sm max-w-none text-text-secondary leading-relaxed whitespace-pre-line"
                aria-label="Description complète de l'offre"
              >
                {job.description}
              </div>
            </CardContent>
          </Card>

          {job.requirements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Prérequis</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2" role="list">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" aria-hidden="true" />
                      {req}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {job.benefits && job.benefits.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Avantages</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2" role="list">
                  {job.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-success shrink-0" aria-hidden="true" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" aria-hidden="true" />
                Compétences requises
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2" role="list" aria-label="Compétences">
                {job.skills.map((skill) => (
                  <div key={skill} role="listitem">
                    <Badge variant="outline">{skill}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Company info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" aria-hidden="true" />
                {job.company.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-text-secondary">
              {job.company.sector && (
                <p><span className="font-medium text-text-primary">Secteur :</span> {job.company.sector}</p>
              )}
              {job.company.size && (
                <p><span className="font-medium text-text-primary">Taille :</span> {job.company.size}</p>
              )}
              {job.company.website && (
                <a
                  href={job.company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'inline-flex items-center gap-1 text-primary hover:underline',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm'
                  )}
                >
                  Site web <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              )}
            </CardContent>
          </Card>

          {/* Apply CTA */}
          <Card className="bg-primary-50 border-primary-200">
            <CardContent className="p-4 text-center space-y-3">
              <p className="text-sm font-medium text-primary">Intéressé(e) par ce poste ?</p>
              <Button className="w-full" asChild>
                <a
                  href={job.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Postuler sur ${job.source} (nouvel onglet)`}
                >
                  Postuler maintenant
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
              <p className="text-xs text-text-disabled">Vous serez redirigé vers {job.source}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </article>
  )
}
