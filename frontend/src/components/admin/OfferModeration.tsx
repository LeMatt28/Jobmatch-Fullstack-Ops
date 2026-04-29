'use client'

import React, { useState } from 'react'
import { CheckCircle, XCircle, AlertTriangle, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { useAdminOffers } from '@/features/admin/hooks/useAdminOffers'
import type { OfferModerationStatus } from '@/features/admin/types/admin.types'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

const STATUS_CONFIG: Record<OfferModerationStatus, { label: string; variant: 'warning' | 'success' | 'destructive' }> = {
  pending:  { label: 'En attente', variant: 'warning' },
  approved: { label: 'Approuvée',  variant: 'success' },
  rejected: { label: 'Rejetée',    variant: 'destructive' },
}

function OffersTabContent({ status }: { status?: OfferModerationStatus }) {
  const { offers, isLoading, moderate, isModerating } = useAdminOffers(status)

  if (isLoading) {
    return <div className="flex h-40 items-center justify-center"><LoadingSpinner /></div>
  }

  if (offers.length === 0) {
    return <p className="py-8 text-center text-sm text-text-secondary">Aucune offre dans cette catégorie.</p>
  }

  return (
    <div className="space-y-3">
      {offers.map((offer) => {
        const cfg = STATUS_CONFIG[offer.status]
        return (
          <div
            key={offer.id}
            className="rounded-lg border border-border p-4 space-y-3"
            role="article"
            aria-label={`Offre : ${offer.title} chez ${offer.company}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-text-primary">{offer.title}</p>
                <p className="text-sm text-text-secondary">
                  {offer.company} · {offer.location} · {offer.contractType}
                </p>
                <p className="text-xs text-text-disabled mt-0.5">
                  Source : {offer.source} · Publiée {formatDistanceToNow(parseISO(offer.publishedAt), { addSuffix: true, locale: fr })}
                </p>
              </div>
              <Badge variant={cfg.variant}>{cfg.label}</Badge>
            </div>

            {offer.reportCount > 0 && (
              <div className="flex items-start gap-2 rounded-md bg-[#FFF8F0] border border-warning px-3 py-2 text-xs text-[#7A4A00]">
                <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" aria-hidden="true" />
                <span>
                  <strong>{offer.reportCount} signalement{offer.reportCount > 1 ? 's' : ''}</strong>
                  {offer.reportReason && ` — ${offer.reportReason}`}
                </span>
              </div>
            )}

            {offer.status === 'pending' && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="gap-1.5"
                  onClick={() => moderate({ id: offer.id, status: 'approved' })}
                  disabled={isModerating}
                  aria-label={`Approuver l'offre ${offer.title}`}
                >
                  <CheckCircle className="h-4 w-4" aria-hidden="true" />
                  Approuver
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="gap-1.5"
                  onClick={() => moderate({ id: offer.id, status: 'rejected' })}
                  disabled={isModerating}
                  aria-label={`Rejeter l'offre ${offer.title}`}
                >
                  <XCircle className="h-4 w-4" aria-hidden="true" />
                  Rejeter
                </Button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export function OfferModeration() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-4 w-4 text-primary" aria-hidden="true" />
          Modération des offres
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">En attente</TabsTrigger>
            <TabsTrigger value="approved">Approuvées</TabsTrigger>
            <TabsTrigger value="rejected">Rejetées</TabsTrigger>
            <TabsTrigger value="all">Toutes</TabsTrigger>
          </TabsList>
          <TabsContent value="pending"><OffersTabContent status="pending" /></TabsContent>
          <TabsContent value="approved"><OffersTabContent status="approved" /></TabsContent>
          <TabsContent value="rejected"><OffersTabContent status="rejected" /></TabsContent>
          <TabsContent value="all"><OffersTabContent /></TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
