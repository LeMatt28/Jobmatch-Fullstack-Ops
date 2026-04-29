import { type Metadata } from 'next'
import { OfferModeration } from '@/components/admin/OfferModeration'

export const metadata: Metadata = {
  title: 'Modération des offres — Admin JobAggregator',
}

export default function AdminOffersPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Modération des offres</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Approuvez ou rejetez les offres signalées ou en attente de validation.
        </p>
      </div>
      <OfferModeration />
    </div>
  )
}
