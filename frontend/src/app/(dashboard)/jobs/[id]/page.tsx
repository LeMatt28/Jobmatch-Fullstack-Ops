import { type Metadata } from 'next'
import { JobDetailClient } from './JobDetailClient'

export const metadata: Metadata = {
  title: 'Détail de l\'offre — JobAggregator',
}

export default function JobDetailPage({ params }: { params: { id: string } }) {
  return <JobDetailClient id={params.id} />
}
