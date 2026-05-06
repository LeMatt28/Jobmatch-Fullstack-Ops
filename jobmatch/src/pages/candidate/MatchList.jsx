import { useState, useEffect } from 'react'
import { X, Heart, Mail, MessageCircle, Copy } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Navbar } from '../../components/Navbar'
import { ScoreBadge } from '../../components/ScoreBadge'
import { ScoreDetail, mockScoreCriteria } from '../../components/ScoreDetail'
import { TagList } from '../../components/TagList'
import { Spinner } from '../../components/ui/Spinner'
import { getMatches } from '../../services/candidateService'
import { timeAgo } from '../../utils/formatDate'
import { formatSalary } from '../../utils/formatDate'

function statusLabel(status) {
  if (status === 'new') return { label: 'NOUVEAU', cls: 'bg-brand-600 text-white' }
  if (status === 'replied') return { label: 'RELANCER', cls: 'bg-amber-100 text-amber-700' }
  return { label: 'VU', cls: 'bg-gray-100 text-gray-500' }
}

function MatchModal({ match, onClose }) {
  const { offer } = match
  const salary = formatSalary(offer.salaryMin, offer.salaryMax)

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [onClose])

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
        <div className="sticky top-0 bg-white border-b border-warm-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold">
              {offer.company.name?.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="font-bold text-brand-900">{offer.title}</h2>
              <p className="text-sm text-gray-400">{offer.company.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex flex-wrap gap-2">
            {offer.contractType && <span className="text-xs bg-brand-50 text-brand-700 px-3 py-1 rounded-full border border-brand-100">{offer.contractType}</span>}
            {offer.location && <span className="text-xs bg-warm-100 text-warm-900 px-3 py-1 rounded-full border border-warm-200">{offer.location}</span>}
            {salary && <span className="text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-full border border-amber-100">💰 {salary}/an</span>}
          </div>

          <div className="bg-brand-50 rounded-xl p-4 border border-brand-100">
            <p className="text-xs text-brand-500 font-medium uppercase tracking-wide mb-2">Message de l'entreprise</p>
            <p className="text-sm text-brand-800 italic">{match.messageIA}</p>
          </div>

          <section className="bg-warm-50 rounded-xl p-4 border border-warm-200">
            <h3 className="text-sm font-semibold text-brand-900 mb-3">Score de compatibilité IA</h3>
            <ScoreDetail scores={mockScoreCriteria} />
          </section>

          <section>
            <h3 className="text-sm font-semibold text-brand-900 mb-2">Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{offer.description}</p>
          </section>

          {offer.stack?.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-brand-900 mb-2">Stack</h3>
              <TagList tags={offer.stack} color="brand" />
            </section>
          )}
        </div>
      </motion.div>
    </div>
  )
}

function FeaturedMatch({ match, onClick }) {
  const { offer } = match
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl p-6 bg-brand-900 text-white relative overflow-hidden hover:bg-brand-800 transition group"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs bg-brand-400 text-white font-bold px-3 py-1 rounded-full animate-pulse">🔥 NOUVEAU</span>
          </div>
          <h3 className="text-xl font-bold mb-1">{offer.title}</h3>
          <p className="text-brand-300 text-sm">{offer.company.name} · {offer.location} · {offer.contractType}</p>
          <p className="text-brand-200 text-sm mt-2 italic line-clamp-2">"{match.messageIA}"</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <ScoreBadge score={match.scoreIA || 91} size="lg" />
          <span className="text-brand-300 text-sm group-hover:text-white transition">Voir →</span>
        </div>
      </div>
    </button>
  )
}

function MatchCard({ match, onClick, size = 'normal' }) {
  const { offer } = match
  const { label, cls } = statusLabel(match.status)

  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-white border border-warm-200 rounded-2xl p-5 hover:-translate-y-0.5 hover:shadow-md transition-all group ${size === 'large' ? 'row-span-2' : ''}`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cls}`}>{label}</span>
        <span className="text-xs text-gray-400">{timeAgo(match.createdAt)}</span>
      </div>
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
          {offer.company.name?.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-brand-900 text-sm truncate">{offer.title}</p>
          <p className="text-xs text-gray-400">{offer.company.name} · {offer.location}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <ScoreBadge score={match.scoreIA || 85} size="sm" />
        <span className="text-xs text-gray-400">Excellent match</span>
      </div>
      <p className="text-xs text-brand-700 italic line-clamp-2">{match.messageIA}</p>
      <ContactSection match={match} />
      <div className="mt-3 text-xs text-brand-600 font-medium opacity-0 group-hover:opacity-100 transition">
        Voir le détail →
      </div>
    </button>
  )
}

function ContactSection({ match }) {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const { contact } = match
  if (!contact) return null

  const copyEmail = () => {
    navigator.clipboard.writeText(contact.email).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="mt-3 bg-brand-50 border border-brand-100 rounded-xl p-3">
      <div className="flex items-center gap-1.5 mb-2">
        <Mail className="w-3.5 h-3.5 text-brand-500" />
        <p className="text-xs font-semibold text-brand-700">
          Contact : {contact.name} — {contact.role}
        </p>
      </div>
      <p className="text-xs text-brand-600 mb-2">{contact.email}</p>
      <div className="flex gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/messages/${match.id}`) }}
          className="flex items-center gap-1.5 text-xs font-medium text-brand-700 bg-brand-100 hover:bg-brand-200 px-2.5 py-1.5 rounded-lg transition"
        >
          <MessageCircle className="w-3 h-3" />
          Envoyer un message →
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); copyEmail() }}
          className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-white border border-brand-100 hover:bg-gray-50 px-2.5 py-1.5 rounded-lg transition"
        >
          <Copy className="w-3 h-3" />
          {copied ? 'Copié !' : "Copier l'email"}
        </button>
      </div>
    </div>
  )
}

const TABS = ['Tous', 'Nouveaux', 'À relancer']

export default function MatchList() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [tab, setTab] = useState('Tous')

  useEffect(() => {
    getMatches().then(setMatches).finally(() => setLoading(false))
  }, [])

  const filtered = matches.filter((m) => {
    if (tab === 'Nouveaux') return m.status === 'new'
    if (tab === 'À relancer') return m.status === 'replied'
    return true
  })

  const newCount = matches.filter((m) => m.status === 'new').length
  const featured = filtered.find((m) => (m.scoreIA || 85) >= 85 && m.status === 'new')
  const rest = featured ? filtered.filter((m) => m.id !== featured.id) : filtered

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 pb-24 md:pb-8 pt-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <h1 className="text-2xl font-bold text-brand-900">Mes Matchs</h1>
          {newCount > 0 && (
            <span className="bg-brand-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">{newCount} nouveau{newCount > 1 ? 'x' : ''}</span>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-warm-100 rounded-xl p-1 w-fit mb-6">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === t ? 'bg-white text-brand-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {loading && <Spinner />}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <Heart className="w-12 h-12 text-brand-200 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-brand-900 mb-2">Aucun match pour l'instant</h2>
            <p className="text-gray-500 text-sm">Swipez des offres pour créer vos premiers matchs !</p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="space-y-4">
            {/* Featured */}
            {featured && tab === 'Tous' && (
              <FeaturedMatch match={featured} onClick={() => setSelected(featured)} />
            )}

            {/* Grid */}
            {rest.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-4">
                {rest.map((match) => (
                  <MatchCard key={match.id} match={match} onClick={() => setSelected(match)} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <AnimatePresence>
        {selected && <MatchModal match={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  )
}
