import { useState } from 'react'
import { AdminLayout } from './AdminLayout'
import { ScoreBadge } from '../../components/ScoreBadge'
import { mockMatches } from '../../mocks/matches'
import { mockOffers } from '../../mocks/offers'
import { mockCandidates } from '../../mocks/candidates'

const extraMatches = [
  { id: 'm6', candidateName: 'Hugo Moreau', candidateInitials: 'HM', offer: mockOffers[1], scoreIA: 76, status: 'Lu', createdAt: '2025-05-18T09:00:00Z' },
  { id: 'm7', candidateName: 'Julie Petit', candidateInitials: 'JP', offer: mockOffers[5], scoreIA: 69, status: 'Nouveau', createdAt: '2025-05-19T14:00:00Z' },
  { id: 'm8', candidateName: 'Nicolas Blanc', candidateInitials: 'NB', offer: mockOffers[7], scoreIA: 93, status: 'Nouveau', createdAt: '2025-05-20T08:30:00Z' },
]

const allMatches = [
  ...mockMatches.map((m, i) => ({
    id: m.id,
    candidateName: mockCandidates[i % mockCandidates.length].name,
    candidateInitials: mockCandidates[i % mockCandidates.length].initials,
    offer: m.offer,
    scoreIA: m.scoreIA,
    status: m.status === 'new' ? 'Nouveau' : 'Lu',
    createdAt: m.createdAt,
  })),
  ...extraMatches,
]

const FILTERS = ['Tous', 'Aujourd\'hui', 'Cette semaine', 'Ce mois']

function statusStyle(status) {
  if (status === 'Nouveau') return 'bg-brand-600 text-white'
  if (status === 'Archivé') return 'bg-gray-200 text-gray-400'
  return 'bg-gray-100 text-gray-500'
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function isInRange(dateStr, filter) {
  const d = new Date(dateStr)
  const now = new Date()
  if (filter === 'Aujourd\'hui') {
    return d.toDateString() === now.toDateString()
  }
  if (filter === 'Cette semaine') {
    const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7)
    return d >= weekAgo
  }
  if (filter === 'Ce mois') {
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }
  return true
}

export default function AdminMatches() {
  const [filter, setFilter] = useState('Tous')

  const filtered = allMatches.filter((m) => isInRange(m.createdAt, filter))

  return (
    <AdminLayout title="Matchs">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">{allMatches.length} matchs au total</p>
          <div className="flex gap-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${filter === f ? 'bg-brand-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-100">
                <th className="px-5 py-3 text-left font-medium">Candidat</th>
                <th className="px-5 py-3 text-left font-medium">Entreprise</th>
                <th className="px-5 py-3 text-left font-medium">Offre</th>
                <th className="px-5 py-3 text-left font-medium">Score</th>
                <th className="px-5 py-3 text-left font-medium">Date</th>
                <th className="px-5 py-3 text-left font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-400">Aucun match pour cette période</td></tr>
              ) : (
                filtered.map((m) => (
                  <tr key={m.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{m.candidateInitials}</div>
                        <span className="text-sm text-gray-800">{m.candidateName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">{m.offer.company.name}</td>
                    <td className="px-5 py-3 text-sm text-gray-700 max-w-[180px] truncate">{m.offer.title}</td>
                    <td className="px-5 py-3"><ScoreBadge score={m.scoreIA} size="sm" /></td>
                    <td className="px-5 py-3 text-sm text-gray-400">{formatDate(m.createdAt)}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyle(m.status)}`}>{m.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
