import { type Metadata } from 'next'
import { NotificationsClient } from './NotificationsClient'

export const metadata: Metadata = {
  title: 'Notifications — JobAggregator',
  description: 'Toutes vos notifications.',
}

export default function NotificationsPage() {
  return <NotificationsClient />
}
