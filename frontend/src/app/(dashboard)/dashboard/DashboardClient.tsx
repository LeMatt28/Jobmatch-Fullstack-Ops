'use client'

import React from 'react'
import { Briefcase, TrendingUp, Sparkles, Search } from 'lucide-react'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { RecentJobs } from '@/components/dashboard/RecentJobs'
import { SalaryDistribution } from '@/components/data-feature/SalaryDistribution'
import { JobTrends } from '@/components/data-feature/JobTrends'
import { JobSearchBar } from '@/components/jobs/JobSearchBar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useAnalyticsSummary, useTrendsAnalytics } from '@/features/data-feature/hooks/useJobAnalytics'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/lib/constants/routes'

export function DashboardClient() {
  const { user } = useAuth()
  const { data: summary } = useAnalyticsSummary()
  const { data: trends } = useTrendsAnalytics()
  const router = useRouter()

  const firstName = user?.firstName ?? 'vous'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          {greeting}, {firstName} 👋
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Voici un aperçu du marché et vos recommandations personnalisées.
        </p>
      </div>

      {/* Quick search */}
      <section aria-labelledby="search-title">
        <h2 id="search-title" className="sr-only">Recherche rapide</h2>
        <JobSearchBar
          onSearch={() => router.push(ROUTES.jobs)}
          className="shadow-card-hover"
        />
      </section>

      {/* Stats row */}
      <section aria-labelledby="stats-title">
        <h2 id="stats-title" className="sr-only">Statistiques du marché</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Offres disponibles"
            value={summary?.totalJobs?.toLocaleString('fr-FR') ?? '12 480'}
            description="sur toutes les plateformes"
            icon={Briefcase}
            iconColor="bg-primary-100 text-primary"
            trend={{ value: summary?.growthPercent ?? 8, label: 'ce mois' }}
          />
          <StatsCard
            title="Salaire moyen"
            value={
              summary?.avgSalary
                ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(summary.avgSalary)
                : '51 000 €'
            }
            description="brut annuel"
            icon={TrendingUp}
            iconColor="bg-secondary-100 text-secondary-500"
            trend={{ value: 3, label: 'vs an passé' }}
          />
          <StatsCard
            title="Top compétence"
            value={summary?.topSkill ?? 'TypeScript'}
            description="la plus demandée"
            icon={Sparkles}
            iconColor="bg-accent-100 text-accent-500"
          />
          <StatsCard
            title="Top localisation"
            value={summary?.topLocation ?? 'Paris'}
            description="le plus d'offres"
            icon={Search}
            iconColor="bg-[#D4F5E9] text-[#1A5C3A]"
          />
        </div>
      </section>

      {/* Main grid — DATA + IA visibles sans navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — DATA features */}
        <div className="lg:col-span-2 space-y-6">
          <section aria-labelledby="salary-title">
            <h2 id="salary-title" className="sr-only">Distribution des salaires</h2>
            <SalaryDistribution />
          </section>

          <section aria-labelledby="trends-title">
            <h2 id="trends-title" className="sr-only">Tendances du marché</h2>
            <JobTrends />
          </section>

          <section aria-labelledby="recent-title">
            <h2 id="recent-title" className="sr-only">Offres récentes</h2>
            <RecentJobs />
          </section>
        </div>

        {/* Right column — Top tags/skills */}
        <div className="space-y-6">
          <section aria-labelledby="tags-title">
            <h2 id="tags-title" className="sr-only">Keywords extraits par l'IA</h2>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
                  Top keywords IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2" role="list" aria-label="Keywords extraits par l'IA">
                  {(trends?.topSkills ?? []).map(({ skill, count, growth }) => (
                    <div key={skill} role="listitem" title={`${count} offres · +${growth}%`}>
                      <Badge variant="outline" className="cursor-default">
                        {skill}
                        <span className="ml-1.5 text-xs text-text-disabled">{count}</span>
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}
