import { type Metadata } from 'next'
import { JobsPageClient } from './JobsPageClient'

export const metadata: Metadata = {
  title: 'Offres d\'emploi — JobAggregator',
  description: 'Parcourez des milliers d\'offres d\'emploi filtrées selon vos critères.',
}

export default function JobsPage() {
  return <JobsPageClient />
}
