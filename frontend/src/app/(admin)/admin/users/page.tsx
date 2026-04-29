import { type Metadata } from 'next'
import { UserTable } from '@/components/admin/UserTable'

export const metadata: Metadata = {
  title: 'Utilisateurs — Admin JobAggregator',
}

export default function AdminUsersPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Gestion des utilisateurs</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Consultez, suspendez ou supprimez les comptes utilisateurs.
        </p>
      </div>
      <UserTable />
    </div>
  )
}
