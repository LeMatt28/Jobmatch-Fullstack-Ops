import { type Metadata } from 'next'
import { AdminDashboardClient } from './AdminDashboardClient'

export const metadata: Metadata = {
  title: 'Dashboard Admin — JobAggregator',
}

export default function AdminDashboardPage() {
  return <AdminDashboardClient />
}
