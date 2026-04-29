'use client'

import React from 'react'
import { Users, Briefcase, Clock, TrendingUp } from 'lucide-react'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { useAdminUsers } from '@/features/admin/hooks/useAdminUsers'
import { useAdminOffers } from '@/features/admin/hooks/useAdminOffers'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants/routes'
import { ArrowRight } from 'lucide-react'
import { UserTable } from '@/components/admin/UserTable'

export function AdminDashboardClient() {
  const { users, total: totalUsers } = useAdminUsers(1, 5)
  const { offers, total: totalOffers } = useAdminOffers()
  const pendingOffers = offers.filter((o) => o.status === 'pending').length
  const activeUsers = users.filter((u) => u.status === 'active').length

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Administration</h1>
          <p className="mt-1 text-sm text-text-secondary">Vue d&apos;ensemble de la plateforme</p>
        </div>
      </div>

      {/* Stats */}
      <section aria-labelledby="admin-stats-title">
        <h2 id="admin-stats-title" className="sr-only">Statistiques admin</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Utilisateurs"
            value={totalUsers}
            description="inscrits au total"
            icon={Users}
            iconColor="bg-primary-100 text-primary"
            trend={{ value: 12, label: 'cette semaine' }}
          />
          <StatsCard
            title="Utilisateurs actifs"
            value={activeUsers}
            description="connectés récemment"
            icon={TrendingUp}
            iconColor="bg-[#D4F5E9] text-[#1A5C3A]"
          />
          <StatsCard
            title="Offres totales"
            value={totalOffers}
            description="indexées"
            icon={Briefcase}
            iconColor="bg-secondary-100 text-secondary-500"
          />
          <StatsCard
            title="En attente"
            value={pendingOffers}
            description="offres à modérer"
            icon={Clock}
            iconColor="bg-[#FFF0DB] text-[#7A4A00]"
          />
        </div>
      </section>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { href: ROUTES.admin.users,  label: 'Gérer les utilisateurs', desc: 'Suspendre, supprimer, changer les rôles', color: 'border-primary-200 bg-primary-50' },
          { href: ROUTES.admin.offers, label: 'Modérer les offres',     desc: `${pendingOffers} offre(s) en attente d'approbation`, color: 'border-warning bg-[#FFF8F0]' },
        ].map(({ href, label, desc, color }) => (
          <div key={href} className={`rounded-xl border p-5 flex items-center justify-between ${color}`}>
            <div>
              <p className="font-semibold text-text-primary">{label}</p>
              <p className="text-sm text-text-secondary mt-0.5">{desc}</p>
            </div>
            <Button variant="secondary" size="sm" asChild>
              <Link href={href} aria-label={label}>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        ))}
      </div>

      {/* Recent users preview */}
      <section aria-labelledby="recent-users-title">
        <div className="flex items-center justify-between mb-4">
          <h2 id="recent-users-title" className="font-semibold text-text-primary">Utilisateurs récents</h2>
          <Button variant="ghost" size="sm" asChild className="gap-1 text-primary">
            <Link href={ROUTES.admin.users}>
              Voir tout <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </Button>
        </div>
        <UserTable />
      </section>
    </div>
  )
}
