import { useState, useEffect } from 'react'
import { X, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { AdminLayout } from './AdminLayout'
import { ScoreBadge } from '../../components/ScoreBadge'
import { mockCompanies } from '../../mocks/companies'
import { mockOffers } from '../../mocks/offers'

const extraCompanies = [
  { id: 'c4', name: 'DataViz', sector: 'Data & BI', description: 'Plateforme de visualisation de données pour les équipes analytics.', values: ['Data-driven', 'Simplicité'], score: 71, employees: 30, founded: 2021, website: 'https://dataviz.fr', location: 'Paris 3e', subscription: 'Starter', activeOffers: 2, email: 'rh@dataviz.fr' },
  { id: 'c5', name: 'FinTech Solutions', sector: 'Finance & Tech', description: 'Solutions de paiement B2B pour les PME européennes.', values: ['Sécurité', 'Innovation'], score: 85, employees: 60, founded: 2017, website: 'https://fintech.com', location: 'Paris 8e', subscription: 'Growth', activeOffers: 4, email: 'contact@fintech.com' },
  { id: 'c6', name: 'UX Studio', sector: 'Design', description: 'Agence spécialisée en UX research et design de produits numériques.', values: ['Empathie', 'Qualité'], score: 68, employees: 18, founded: 2020, website: 'https://uxstudio.fr', location: 'Lyon 6e', subscription: 'Gratuit', activeOffers: 1, email: 'admin@uxstudio.fr' },
]

const allCompanies = [
  ...mockCompanies.map((c, i) => ({ ...c, subscription: i === 0 ? 'Growth' : i === 1 ? 'Starter' : 'Growth', activeOffers: [3, 1, 2][i], email: `contact@${c.name.toLowerCase().replace(' ', '')}.fr` })),
  ...extraCompanies,
]

function CompanyModal({ company, onClose }) {
  const offers = mockOffers.filter((o) => o.company.id === company.id)

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
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-sm">{company.name.slice(0, 2).toUpperCase()}</div>
            <div>
              <p className="font-bold text-brand-900">{company.name}</p>
              <p className="text-xs text-gray-400">{company.sector} · {company.location}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <ScoreBadge score={company.score} size="md" />
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${company.subscription === 'Growth' ? 'bg-brand-600 text-white' : company.subscription === 'Starter' ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-500'}`}>{company.subscription}</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Description</p>
            <p className="text-sm text-gray-700">{company.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><p className="text-xs text-gray-400">Employés</p><p className="text-sm font-medium text-gray-800">{company.employees}</p></div>
            <div><p className="text-xs text-gray-400">Fondée en</p><p className="text-sm font-medium text-gray-800">{company.founded}</p></div>
            <div><p className="text-xs text-gray-400">Email</p><p className="text-sm font-medium text-gray-800">{company.email}</p></div>
            <div><p className="text-xs text-gray-400">Site web</p><p className="text-sm font-medium text-brand-600">{company.website}</p></div>
          </div>
          {offers.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Offres publiées</p>
              <div className="space-y-1.5">
                {offers.map((o) => (
                  <div key={o.id} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-700">{o.title}</p>
                    <span className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full">{o.contractType}</span>
                  </div>
                ))}
              </div>
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

export default function AdminCompanies() {
  const [companies, setCompanies] = useState(allCompanies)
  const [search, setSearch] = useState('')
  const [viewing, setViewing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const filtered = companies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.sector.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = () => {
    setCompanies((prev) => prev.filter((c) => c.id !== deleting.id))
    setDeleting(null)
  }

  return (
    <AdminLayout title="Entreprises">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">{companies.length} inscrites</p>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 w-56"
            />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-100">
                <th className="px-5 py-3 text-left font-medium">Entreprise</th>
                <th className="px-5 py-3 text-left font-medium">Email</th>
                <th className="px-5 py-3 text-left font-medium">Secteur</th>
                <th className="px-5 py-3 text-left font-medium">Fiabilité</th>
                <th className="px-5 py-3 text-left font-medium">Offres actives</th>
                <th className="px-5 py-3 text-left font-medium">Abonnement</th>
                <th className="px-5 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{c.name.slice(0, 2).toUpperCase()}</div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-500">{c.email}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{c.sector}</td>
                  <td className="px-5 py-3"><ScoreBadge score={c.score} size="sm" /></td>
                  <td className="px-5 py-3">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{c.activeOffers}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${c.subscription === 'Growth' ? 'bg-brand-600 text-white' : c.subscription === 'Starter' ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-500'}`}>{c.subscription}</span>
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
        {viewing && <CompanyModal company={viewing} onClose={() => setViewing(null)} />}
        {deleting && <DeleteModal name={deleting.name} onConfirm={handleDelete} onCancel={() => setDeleting(null)} />}
      </AnimatePresence>
    </AdminLayout>
  )
}
