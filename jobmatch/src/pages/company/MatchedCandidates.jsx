import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { X, Lock } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { SidebarCompany } from '../../components/SidebarCompany'
import { ScoreBadge } from '../../components/ScoreBadge'
import { ScoreDetail, mockScoreCriteria } from '../../components/ScoreDetail'
import { TagList } from '../../components/TagList'
import { Spinner } from '../../components/ui/Spinner'
import { getMatchedCandidates } from '../../services/companyService'
import { mockOffers } from '../../mocks/offers'

const FILTERS = ['Tous', 'Nouveaux', 'Score > 80']
const SORT_OPTIONS = [
  { value: 'score-desc', label: 'Score décroissant ▼' },
  { value: 'score-asc', label: 'Score croissant ▲' },
  { value: 'date', label: 'Date' },
]

function CandidateModal({ candidate, onClose }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [onClose])

  const salaryStr = candidate.salaryExpected >= 10000
    ? `${Math.round(candidate.salaryExpected / 1000)}k€`
    : `${candidate.salaryExpected}€`

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(38,33,92,0.7)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-warm-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-lg">
              {candidate.initials}
            </div>
            <div>
              <h2 className="font-bold text-brand-900">{candidate.name}</h2>
              <p className="text-sm text-gray-400">{candidate.location}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Score global */}
          <div className="flex items-center gap-4 p-4 bg-warm-50 border border-warm-200 rounded-xl">
            <ScoreBadge score={candidate.scoreCandidat} size="lg" />
            <div>
              <p className="font-semibold text-brand-900">
                {candidate.scoreCandidat >= 85 ? 'Excellent profil' : candidate.scoreCandidat >= 70 ? 'Bon profil' : 'Profil correct'}
              </p>
              <p className="text-xs text-gray-400">Score de compatibilité avec cette offre</p>
            </div>
          </div>

          {/* Score détaillé */}
          <section className="bg-warm-50 border border-warm-200 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-brand-900 mb-3">Compatibilité détaillée</h3>
            <ScoreDetail scores={mockScoreCriteria} />
          </section>

          {/* Infos gratuites */}
          <section>
            <h3 className="text-sm font-semibold text-brand-900 mb-3">Informations</h3>
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div className="bg-warm-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-0.5">Salaire attendu</p>
                <p className="font-semibold text-brand-900">{salaryStr}/an</p>
              </div>
              <div className="bg-warm-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-0.5">Localisation</p>
                <p className="font-semibold text-brand-900">{candidate.location}</p>
              </div>
              <div className="bg-warm-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-0.5">Mobilité</p>
                <p className="font-semibold text-brand-900">{candidate.mobility ? 'OK' : 'Non'}</p>
              </div>
              <div className="bg-warm-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-0.5">Expérience</p>
                <p className="font-semibold text-brand-900">{candidate.level || 'Confirmé'}</p>
              </div>
            </div>
            {candidate.skills?.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-gray-400 mb-1.5">Compétences</p>
                <TagList tags={candidate.skills} color="brand" />
              </div>
            )}
          </section>

          {/* PRO blur zone */}
          <section className="relative rounded-xl overflow-hidden border border-warm-200">
            <div className="p-4 space-y-2 blur-sm select-none pointer-events-none">
              <div className="flex items-center gap-3 py-2 border-b border-warm-100">
                <span className="text-sm text-gray-500">Voir le CV complet</span>
              </div>
              <div className="flex items-center gap-3 py-2 border-b border-warm-100">
                <span className="text-sm text-gray-500">Contacter directement</span>
              </div>
              <div className="flex items-center gap-3 py-2">
                <span className="text-sm text-gray-500">Voir le profil LinkedIn</span>
              </div>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm">
              <Lock className="w-6 h-6 text-brand-600 mb-2" />
              <p className="text-sm font-semibold text-brand-900 mb-3">🔓 Débloquez le profil complet avec JobMatch PRO</p>
              <a href="/premium/company" className="bg-brand-600 text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-brand-800 transition">
                Passer à PRO — 49€/mois
              </a>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-warm-200 px-6 py-4 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border-2 border-warm-200 text-gray-600 font-semibold hover:bg-warm-50 transition text-sm">
            Passer
          </button>
          <a href="/premium/company" className="flex-1 py-3 rounded-xl bg-brand-600 text-white font-semibold text-center hover:bg-brand-800 transition text-sm">
            Contacter (PRO)
          </a>
        </div>
      </motion.div>
    </div>
  )
}

export default function MatchedCandidates() {
  const { id } = useParams()
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('score-desc')
  const [filter, setFilter] = useState('Tous')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const offer = mockOffers.find((o) => o.id === id) || mockOffers[0]

  useEffect(() => {
    getMatchedCandidates(id).then(setCandidates).finally(() => setLoading(false))
  }, [id])

  const filtered = candidates
    .filter((c) => {
      if (filter === 'Nouveaux') return c.isNew
      if (filter === 'Score > 80') return c.scoreCandidat > 80
      return true
    })
    .filter((c) => !search || c.skills?.some((s) => s.toLowerCase().includes(search.toLowerCase())) || c.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'score-asc') return a.scoreCandidat - b.scoreCandidat
      if (sort === 'date') return 0
      return b.scoreCandidat - a.scoreCandidat
    })

  return (
    <div className="flex min-h-screen bg-warm-50">
      <SidebarCompany />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-brand-900">{offer.title}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              {offer.contractType && <span className="text-xs bg-brand-50 text-brand-700 px-3 py-1 rounded-full border border-brand-100">{offer.contractType}</span>}
              {offer.location && <span className="text-xs bg-warm-100 text-warm-900 px-3 py-1 rounded-full border border-warm-200">{offer.location}</span>}
              {offer.remote && <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100">Remote</span>}
              <span className="text-xs text-brand-600 font-medium">{candidates.length} match{candidates.length > 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-3 mb-5">
            <div className="flex gap-1 bg-warm-100 rounded-xl p-1">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filter === f ? 'bg-white text-brand-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-warm-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-brand-400 bg-white"
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <input
              type="text"
              placeholder="Filtrer par compétence..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-warm-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-brand-400 flex-1 min-w-[140px]"
            />
          </div>

          {loading ? <Spinner /> : (
            <div className="bg-white border border-warm-200 rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-warm-50 border-b border-warm-200">
                  <tr>
                    <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Candidat</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 hidden sm:table-cell">Compétences</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Score IA</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) => (
                    <tr key={c.id} className={`border-b border-warm-100 hover:bg-warm-50 transition cursor-pointer ${i === filtered.length - 1 ? 'border-0' : ''}`} onClick={() => setSelected(c)}>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{c.initials}</div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-brand-900 text-sm">{c.name}</p>
                              {c.isNew && <span className="text-xs bg-brand-600 text-white px-2 py-0.5 rounded-full">Nouveau</span>}
                            </div>
                            <p className="text-xs text-gray-400">{c.location} · {c.salaryExpected >= 10000 ? `${Math.round(c.salaryExpected / 1000)}k€` : `${c.salaryExpected}€`}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {c.skills.slice(0, 2).map((s) => (
                            <span key={s} className="text-xs px-2 py-0.5 bg-brand-50 text-brand-700 rounded-full">{s}</span>
                          ))}
                          {c.skills.length > 2 && <span className="text-xs text-gray-400">+{c.skills.length - 2}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <ScoreBadge score={c.scoreCandidat} size="sm" />
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelected(c) }}
                          className="text-xs text-brand-600 hover:underline font-medium"
                        >
                          Voir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {selected && <CandidateModal candidate={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  )
}
