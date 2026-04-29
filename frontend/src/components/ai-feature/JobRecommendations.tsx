'use client'

import React from 'react'
import Link from 'next/link'
import { Sparkles, MapPin, Banknote, TrendingUp, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { useJobRecommendations } from '@/features/ai-feature/hooks/useJobRecommendations'
import { ROUTES } from '@/lib/constants/routes'
import { cn } from '@/lib/utils/cn'

function MatchScore({ score }: { score: number }) {
  const color =
    score >= 90 ? 'text-[#1A5C3A] bg-[#D4F5E9]' :
    score >= 75 ? 'text-primary bg-primary-100' :
    'text-text-secondary bg-muted'

  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold', color)}>
      {score}% match
    </span>
  )
}

function ProfileStrengthBar({ value }: { value: number }) {
  const color = value >= 80 ? 'bg-success' : value >= 60 ? 'bg-primary' : 'bg-warning'
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-text-secondary">Force du profil</span>
        <span className="font-semibold text-text-primary">{value}%</span>
      </div>
      <div
        className="h-2 w-full rounded-full bg-muted overflow-hidden"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Force du profil : ${value}%`}
      >
        <div className={cn('h-full rounded-full transition-all duration-700', color)} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

export function JobRecommendations() {
  const { data, isLoading } = useJobRecommendations()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-100">
            <Sparkles className="h-4 w-4 text-accent-500" aria-hidden="true" />
          </div>
          <div>
            <CardTitle className="text-base">Recommandations IA</CardTitle>
            <CardDescription>Offres personnalisées selon votre profil</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <ProfileStrengthBar value={data.profileStrength} />

            {/* Recommended jobs */}
            <ul className="space-y-3" role="list" aria-label="Offres recommandées">
              {data.jobs.map((job) => (
                <li key={job.jobId}>
                  <Link
                    href={ROUTES.jobDetail(job.jobId)}
                    className={cn(
                      'block rounded-lg border border-border p-3 transition-all duration-150',
                      'hover:border-primary hover:shadow-card focus-visible:outline-none',
                      'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1'
                    )}
                    aria-label={`${job.title} chez ${job.company} — ${job.matchScore}% de correspondance`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-text-primary truncate">{job.title}</p>
                        <p className="text-xs text-text-secondary">{job.company}</p>
                      </div>
                      <MatchScore score={job.matchScore} />
                    </div>

                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-text-secondary">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" aria-hidden="true" />
                        {job.location}
                      </span>
                      {job.salary && (
                        <span className="flex items-center gap-1 text-[#1A5C3A]">
                          <Banknote className="h-3 w-3" aria-hidden="true" />
                          {job.salary}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1">
                      {job.matchReasons.map((r) => (
                        <Badge key={r} variant="accent" className="text-xs">{r}</Badge>
                      ))}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Skill gaps */}
            {data.skillGaps.length > 0 && (
              <div className="rounded-lg border border-warning bg-[#FFF8F0] p-3 space-y-2">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-[#7A4A00]">
                  <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  Compétences à développer
                </p>
                <div className="flex flex-wrap gap-2">
                  {data.skillGaps.map((gap) => (
                    <div key={gap.skill} className="flex items-center gap-1">
                      <Badge variant={gap.importance === 'high' ? 'warning' : 'outline'} className="text-xs">
                        {gap.skill}
                      </Badge>
                      <span className="text-xs text-text-disabled">{gap.jobCount} offres</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
