import { type Metadata } from 'next'
import { MessagesClient } from './MessagesClient'

export const metadata: Metadata = {
  title: 'Messages — JobAggregator',
  description: 'Vos conversations avec les recruteurs.',
}

export default function MessagesPage() {
  return <MessagesClient />
}
