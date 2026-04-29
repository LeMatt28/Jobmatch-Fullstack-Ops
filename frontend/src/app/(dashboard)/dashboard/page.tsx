import { type Metadata } from 'next'
import { DashboardClient } from './DashboardClient'

export const metadata: Metadata = {
  title: 'Dashboard — JobAggregator',
  description: 'Votre tableau de bord personnel — offres recommandées, analytics marché, statistiques.',
}

export default function DashboardPage() {
  return <DashboardClient />
}
