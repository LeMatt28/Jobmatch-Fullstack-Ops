import { useState, useEffect } from 'react'
import { X, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { AdminLayout } from './AdminLayout'
import { mockOffers } from '../../mocks/offers'
import { formatSalary } from '../../utils/formatDate'

const initialOffers = mockOffers.map((o) => ({ ...o, active: true, matches: Math.floor(Math.random() * 20) }))

function OfferDetailModal({ offer, onClose }) {
  const salary = formatSalary(offer.salaryMin, offer.salaryMax)

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
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-sm">{offer.company.name.slice(0, 2).toUpperCase()}</div>
            <div>
              <p className="font-bold text-brand-900">{offer.title}</p>
              <p className="text-xs text-gray-400">{offer.company.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            <span className="text-xs bg-brand-50 text-brand-700 px-3 py-1 rounded-full border border-brand-100">{offer.contractType}</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{offer.location}</span>
            {salary && <span className="text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-full">💰 {salary}/an</span>}
            {offer.remote && <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">Remote</span>}
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Description</p>
            <p className="text-sm text-gray-700 leading-relaxed">{offer.description}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Stack</p>
            <div className="flex flex-wrap gap-1.5">
              {offer.stack.map((s) => <span key={s} className="text-xs bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full">{s}</span>)}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function DeleteModal({ title, onConfirm, onCancel }) {
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
          <p className="font-bold text-gray-900">Supprimer cette offre ?</p>
          <p className="text-sm text-gray-600 mt-1 font-medium">{title}</p>
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

const FILTERS = ['Toutes', 'Actives', 'Inactives']

export default function AdminOffers() {
  const [offers, setOffers] = useState(initialOffers)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Toutes')
  const [viewing, setViewing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const filtered = offers.filter((o) => {
    const matchSearch = o.title.toLowerCase().includes(search.toLowerCase()) || o.company.name.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'Toutes' || (filter === 'Actives' && o.active) || (filter === 'Inactives' && !o.active)
    return matchSearch && matchFilter
  })

  const toggleActive = (id) => {
    setOffers((prev) => prev.map((o) => o.id === id ? { ...o, active: !o.active } : o))
  }

  const handleDelete = () => {
    setOffers((prev) => prev.filter((o) => o.id !== deleting.id))
    setDeleting(null)
  }

  return (
    <AdminLayout title="Offres publiées">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">{offers.length} offres</p>
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

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-100">
                <th className="px-5 py-3 text-left font-medium">Titre</th>
                <th className="px-5 py-3 text-left font-medium">Entreprise</th>
                <th className="px-5 py-3 text-left font-medium">Lieu</th>
                <th className="px-5 py-3 text-left font-medium">Contrat</th>
                <th className="px-5 py-3 text-left font-medium">Matchs</th>
                <th className="px-5 py-3 text-left font-medium">Statut</th>
                <th className="px-5 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition">
                  <td className="px-5 py-3 text-sm font-medium text-gray-900 max-w-[200px] truncate">{o.title}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{o.company.name}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{o.location}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full">{o.contractType}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{o.matches}</span>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => toggleActive(o.id)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${o.active ? 'bg-emerald-500' : 'bg-gray-300'}`}
                      aria-label={o.active ? 'Désactiver' : 'Activer'}
                    >
                      <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${o.active ? 'translate-x-4' : 'translate-x-1'}`} />
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setViewing(o)} className="text-xs px-2.5 py-1 rounded-lg bg-brand-50 text-brand-700 hover:bg-brand-100 transition">Voir</button>
                      <button onClick={() => setDeleting(o)} className="text-xs px-2.5 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition">Supprimer</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {viewing && <OfferDetailModal offer={viewing} onClose={() => setViewing(null)} />}
        {deleting && <DeleteModal title={deleting.title} onConfirm={handleDelete} onCancel={() => setDeleting(null)} />}
      </AnimatePresence>
    </AdminLayout>
  )
}
