import { useState } from 'react'
import { AdminLayout } from './AdminLayout'
import { AdminStatCard } from '../../components/admin/AdminStatCard'
import { mockCandidateSubscriptions, mockCompanySubscriptions } from '../../mocks/subscriptions'

function statusStyle(status) {
  if (status === 'Actif') return 'bg-emerald-50 text-emerald-700'
  if (status === 'Essai') return 'bg-amber-50 text-amber-700'
  return 'bg-red-50 text-red-500'
}

function SubscriptionTable({ rows, type }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="text-xs text-gray-400 border-b border-gray-100">
            <th className="px-5 py-3 text-left font-medium">Nom</th>
            <th className="px-5 py-3 text-left font-medium">Email</th>
            <th className="px-5 py-3 text-left font-medium">Plan</th>
            <th className="px-5 py-3 text-left font-medium">Depuis le</th>
            <th className="px-5 py-3 text-left font-medium">Renouvellement</th>
            <th className="px-5 py-3 text-left font-medium">Statut</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition">
              <td className="px-5 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {r.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{r.name}</span>
                </div>
              </td>
              <td className="px-5 py-3 text-sm text-gray-500">{r.email}</td>
              <td className="px-5 py-3">
                <span className="text-xs bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full font-medium">{r.plan}</span>
              </td>
              <td className="px-5 py-3 text-sm text-gray-400">{new Date(r.since).toLocaleDateString('fr-FR')}</td>
              <td className="px-5 py-3 text-sm text-gray-400">{new Date(r.renewal).toLocaleDateString('fr-FR')}</td>
              <td className="px-5 py-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyle(r.status)}`}>{r.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const TABS = ['Candidats PRO', 'Entreprises PRO']

export default function AdminSubscriptions() {
  const [tab, setTab] = useState(0)

  return (
    <AdminLayout title="Abonnements PRO">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4">
          <AdminStatCard value="2 847 €" label="Revenu mensuel (MRR)" />
          <AdminStatCard value="68" label="Abonnements actifs" delta="+8 ce mois" />
          <AdminStatCard value="12" label="En période d'essai" />
          <AdminStatCard value="3" label="Résiliés ce mois" />
        </div>

        {/* Onglets */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === i ? 'bg-white text-brand-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t}
            </button>
          ))}
        </div>

        <SubscriptionTable rows={tab === 0 ? mockCandidateSubscriptions : mockCompanySubscriptions} type={tab === 0 ? 'candidate' : 'company'} />
      </div>
    </AdminLayout>
  )
}
