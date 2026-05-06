import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, BarChart2, Users, Bell } from 'lucide-react'
import { SidebarCompany } from '../../components/SidebarCompany'
import { ScoreBadge } from '../../components/ScoreBadge'
import { Spinner } from '../../components/ui/Spinner'
import { Button } from '../../components/ui/Button'
import { getDashboardStats, getMyOffers, getMatchedCandidates } from '../../services/companyService'
import { useAuth } from '../../hooks/useAuth'

function KpiCard({ label, value, sub, color }) {
  return (
    <div className={`rounded-2xl p-5 ${color}`}>
      <p className="text-3xl font-black text-brand-900 mb-1">{value}</p>
      <p className="text-sm font-semibold text-brand-700">{label}</p>
      {sub && <p className="text-xs text-brand-500 mt-0.5">{sub}</p>}
    </div>
  )
}

function OfferRow({ offer }) {
  const matchProgress = Math.min(100, ((offer.matchCount || 0) / 20) * 100)
  return (
    <div className="flex items-center gap-4 p-4 border-b border-warm-100 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-brand-900 text-sm">{offer.title}</p>
        <p className="text-xs text-gray-400">{offer.contractType} · {offer.location} · Publiée il y a 3 jours</p>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 max-w-[120px] h-1.5 bg-warm-100 rounded-full overflow-hidden">
            <div className="h-full bg-brand-400 rounded-full" style={{ width: `${matchProgress}%` }} />
          </div>
          <span className="text-xs text-gray-400">{offer.matchCount || 12}/20 matchs</span>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
          {offer.newMatches || 3} nouveaux
        </span>
        <Link to={`/company/offer/${offer.id}/matches`} className="text-xs text-brand-600 hover:underline font-medium">
          Voir →
        </Link>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [offers, setOffers] = useState([])
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getDashboardStats(), getMyOffers(), getMatchedCandidates('1')])
      .then(([s, o, c]) => { setStats(s); setOffers(o.slice(0, 4)); setCandidates(c.slice(0, 3)) })
      .finally(() => setLoading(false))
  }, [])

  const newMatches = stats ? (stats.candidatesThisWeek || 3) : 0

  return (
    <div className="flex min-h-screen bg-warm-50">
      <SidebarCompany />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-brand-900">
              Bonjour, {user?.name || 'Recruteur'} 👋
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {newMatches > 0 ? `${newMatches} nouveaux matchs aujourd'hui` : 'Bienvenue sur votre tableau de bord'}
            </p>
          </div>

          {loading ? <Spinner size="lg" /> : (
            <>
              {/* Action requise */}
              {newMatches > 0 && (
                <div className="flex items-center gap-3 bg-brand-50 border-l-4 border-brand-600 rounded-r-xl px-4 py-3 mb-6">
                  <Bell className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  <p className="text-sm text-brand-800">
                    <strong>{newMatches} candidats</strong> ont matché avec vos offres aujourd'hui.{' '}
                    <Link to="/company/offer/1/matches" className="underline font-medium">Voir les profils</Link>
                  </p>
                </div>
              )}

              {/* KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <KpiCard label="Offres actives" value={stats?.activeOffers ?? 4} color="bg-brand-50" />
                <KpiCard label="Matchs totaux" value={stats?.totalMatches ?? 47} color="bg-brand-50" />
                <KpiCard label="Nouveaux cette sem." value={newMatches} color="bg-brand-50" />
                <KpiCard label="Taux de match" value="34%" color="bg-brand-50" />
              </div>

              {/* Offres actives */}
              <section className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-brand-900">Vos offres actives</h2>
                  <Link to="/company/offer/new">
                    <Button variant="primary" className="text-sm flex items-center gap-1">
                      <Plus className="w-4 h-4" /> Nouvelle offre
                    </Button>
                  </Link>
                </div>
                <div className="bg-white border border-warm-200 rounded-2xl shadow-sm overflow-hidden">
                  {offers.map((offer) => <OfferRow key={offer.id} offer={offer} />)}
                </div>
              </section>

              {/* Derniers candidats */}
              <section className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-brand-900">Derniers candidats matchés</h2>
                  <Link to="/company/offer/1/matches" className="text-sm text-brand-600 hover:underline">Voir tous →</Link>
                </div>
                <div className="bg-white border border-warm-200 rounded-2xl shadow-sm overflow-hidden">
                  {candidates.map((c, i) => (
                    <div key={c.id} className={`flex items-center gap-4 p-4 hover:bg-warm-50 transition ${i < candidates.length - 1 ? 'border-b border-warm-100' : ''}`}>
                      <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">{c.initials}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-brand-900 text-sm">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.location} · {c.salaryExpected >= 10000 ? `${Math.round(c.salaryExpected / 1000)}k€` : `${c.salaryExpected}€`}/an</p>
                      </div>
                      <ScoreBadge score={c.scoreCandidat} size="sm" />
                    </div>
                  ))}
                </div>
              </section>

              {/* Shortcuts */}
              <div className="flex flex-wrap gap-3">
                <Link to="/company/offer/new">
                  <Button variant="primary" className="flex items-center gap-2"><Plus className="w-4 h-4" /> Publier une offre</Button>
                </Link>
                <Link to="/company/offer/1/matches">
                  <Button variant="secondary" className="flex items-center gap-2"><Users className="w-4 h-4" /> Tous mes candidats</Button>
                </Link>
                <Link to="/company/profile">
                  <Button variant="secondary" className="flex items-center gap-2"><BarChart2 className="w-4 h-4" /> Mes stats</Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
