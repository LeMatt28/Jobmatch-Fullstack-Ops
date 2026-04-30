import { type Metadata } from 'next'
import { ProfileClient } from './ProfileClient'

export const metadata: Metadata = {
  title: 'Mon espace — JobAggregator',
  description: 'Gérez votre profil, vos informations personnelles et vos préférences.',
}

export default function ProfilePage() {
  return <ProfileClient />
}
