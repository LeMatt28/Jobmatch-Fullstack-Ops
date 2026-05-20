import { useState, useEffect } from 'react'
import { X, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { AdminLayout } from './AdminLayout'
import { ScoreBadge } from '../../components/ScoreBadge'
import { mockCandidates } from '../../mocks/candidates'

const extraCandidates = [
  { id: 'cand6', name: 'Hugo Moreau', initials: 'HM', skills: ['Java', 'Spring Boot', 'PostgreSQL'], experience: '5 ans backend, ex-Société Générale', location: 'Paris', salaryExpected: 65000, mobility: true, softSkills: ['Rigueur', 'Fiabilité'], scoreCandidat: 82, level: 'Confirmé', contact: { name: 'RH', role: 'RH', email: 'rh@sg.fr' }, accomplishments: [], subscription: 'PRO' },
  { id: 'cand7', name: 'Julie Petit', initials: 'JP', skills: ['Product', 'Agile', 'Figma', 'SQL'], experience: '3 ans PM, ex-Doctolib', location: 'Lyon', salaryExpected: 52000, mobility: false, softSkills: ['Curiosité', 'Empathie'], scoreCandidat: 74, level: 'Confirmé', contact: { name: 'RH', role: 'RH', email: 'rh@doctolib.fr' }, accomplishments: [], subscription: 'Gratuit' },
  { id: 'cand8', name: 'Nicolas Blanc', initials: 'NB', skills: ['Ruby on Rails', 'PostgreSQL', 'Redis'], experience: '7 ans fullstack, freelance', location: 'Bordeaux', salaryExpected: 75000, mobility: true, softSkills: ['Autonomie', 'Initiative'], scoreCandidat: 89, level: 'Senior', contact: { name: 'Auto', role: 'Freelance', email: 'n.blanc@yahoo.fr' }, accomplishments: [], subscription: 'PRO' },
]

const allCandidates = [
  ...mockCandidates.map((c) => ({ ...c, subscription: 'Gratuit', status: 'Actif', matches: Math.floor(Math.random() * 12) })),
  ...extraCandidates.map((c) => ({ ...c, status: 'Actif', matches: Math.floor(Math.random() * 12) })),
]

function CandidateModal({ candidate, onClose }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(38,33,92,0.7)' }} onClick={onClose}>
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true"
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-sm">{candidate.initials}</div>
            <div>
              <p className="font-bold text-brand-900">{candidate.name}</p>
              <p className="text-xs text-gray-400">{candidate.level} · {candidate.location}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <ScoreBadge score={candidate.scoreCandidat} size="md" />
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${candidate.subscription === 'PRO' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-500'}`}>{candidate.subscription}</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Expérience</p>
            <p className="text-sm text-gray-700">{candidate.experience}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Compétences</p>
            <div className="flex flex-wrap gap-1.5">
              {candidate.skills.map((s) => <span key={s} className="text-xs bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full">{s}</span>)}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Contact</p>
            <p className="text-sm text-gray-700">{candidate.contact.email}</p>
          </div>
          {candidate.accomplishments.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Accomplissements</p>
              <ul className="space-y-1">
                {candidate.accomplishments.map((a, i) => <li key={i} className="text-sm text-gray-700 before:content-['·'] before:mr-2 before:text-brand-400">{a}</li>)}
              </ul>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

function DeleteModal({ name, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(38,33,92,0.7)' }} onClick={onCancel}>
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true"
      >
        <div className="text-center mb-4">
          <div className="text-3xl mb-2">⚠️</div>
          <p className="font-bold text-gray-900">Supprimer {name} ?</p>
          <p className="text-sm text-gray-500 mt-1">Cette action est irréversible.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition">Annuler</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition">Supprimer</button>
        </div>
      </motion.div>
    </div>
  )
}

const FILTERS = ['Tous', 'Actifs', 'PRO', 'Inactifs']

export default function AdminCandidates() {
  const [candidates, setCandidates] = useState(allCandidates)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Tous')
  const [viewing, setViewing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const filtered = candidates.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.contact.email.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'Tous' || (filter === 'PRO' && c.subscription === 'PRO') || (filter === 'Actifs' && c.status === 'Actif') || (filter === 'Inactifs' && c.status !== 'Actif')
    return matchSearch && matchFilter
  })

  const handleDelete = () => {
    setCandidates((prev) => prev.filter((c) => c.id !== deleting.id))
    setDeleting(null)
  }

  return (
    <AdminLayout title="Candidats">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">{candidates.length} inscrits</p>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 w-56"
              />
            </div>
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
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-100">
                <th className="px-5 py-3 text-left font-medium">Candidat</th>
                <th className="px-5 py-3 text-left font-medium">Email</th>
                <th className="px-5 py-3 text-left font-medium">Ville</th>
                <th className="px-5 py-3 text-left font-medium">Matchs</th>
                <th className="px-5 py-3 text-left font-medium">Abonnement</th>
                <th className="px-5 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{c.initials}</div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.level}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-500">{c.contact.email}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{c.location}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{c.matches}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${c.subscription === 'PRO' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-500'}`}>{c.subscription}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setViewing(c)} className="text-xs px-2.5 py-1 rounded-lg bg-brand-50 text-brand-700 hover:bg-brand-100 transition">Voir</button>
                      <button onClick={() => setDeleting(c)} className="text-xs px-2.5 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition">Supprimer</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {viewing && <CandidateModal candidate={viewing} onClose={() => setViewing(null)} />}
        {deleting && <DeleteModal name={deleting.name} onConfirm={handleDelete} onCancel={() => setDeleting(null)} />}
      </AnimatePresence>
    </AdminLayout>
  )
}
