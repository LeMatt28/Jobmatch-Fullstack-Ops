import { useState, useEffect } from 'react'
import { Building2, Users, Calendar, Link as LinkIcon } from 'lucide-react'
import { SidebarCompany } from '../../components/SidebarCompany'
import { ScoreBadge } from '../../components/ScoreBadge'
import { ScoreDetail } from '../../components/ScoreDetail'
import { TagInput } from '../../components/TagInput'
import { CityAutocomplete } from '../../components/CityAutocomplete'
import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'
import { getCompanyProfile, getDashboardStats } from '../../services/companyService'
import { Link } from 'react-router-dom'

const TABS = ['Profil public', 'Statistiques', 'Abonnement']
const SECTORS = ['Tech', 'Fintech', 'SaaS', 'E-commerce', 'Santé', 'Industrie', 'Conseil', 'Éducation']
const SIZES = ['1–10', '10–50', '50–200', '200–1000', '1000+']
const VALUES_SUGGESTIONS = ['Innovation', 'Bienveillance', 'Transparence', 'Impact social', 'Autonomie', 'Excellence', 'Diversité', 'Durabilité']

const RELIABILITY_CRITERIA = [
  { criteria: 'Profil complété', value: 88 },
  { criteria: 'Rapidité de réponse', value: 80 },
  { criteria: 'Taux de match conclu', value: 70, comment: 'Répondez aux matchs en moins de 48h pour améliorer ce score' },
  { criteria: 'Ancienneté sur JobMatch', value: 100 },
]

const WEEKLY_SWIPES = [
  { day: 'Lun', count: 12 },
  { day: 'Mar', count: 8 },
  { day: 'Mer', count: 15 },
  { day: 'Jeu', count: 20 },
  { day: 'Ven', count: 10 },
]
const MAX_SWIPES = Math.max(...WEEKLY_SWIPES.map((d) => d.count))

function TabPublicProfile({ company }) {
  const [description, setDescription] = useState(company?.description || '')
  const [sector, setSector] = useState(company?.sector || '')
  const [size, setSize] = useState('50–200')
  const [city, setCity] = useState(company?.location || '')
  const [website, setWebsite] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [values, setValues] = useState(company?.values || [])

  return (
    <div className="space-y-5">
      {/* Header card */}
      <section className="bg-white border border-warm-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-5 mb-5">
          <div className="w-20 h-20 rounded-2xl bg-brand-600 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
            {company?.name?.slice(0, 2).toUpperCase() || 'JM'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-brand-900">{company?.name}</h2>
            <p className="text-sm text-gray-400">{company?.sector}</p>
            <div className="flex items-center gap-3 mt-2">
              <ScoreBadge score={company?.score || 88} size="sm" />
              <span className="text-xs text-gray-400">Score de fiabilité visible par les candidats</span>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Secteur</label>
            <select value={sector} onChange={(e) => setSector(e.target.value)} className="w-full border border-warm-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-400 bg-white">
              {SECTORS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Taille de l'entreprise</label>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => (
                <button key={s} type="button" onClick={() => setSize(s)} className={`px-3 py-1.5 rounded-lg text-xs border font-medium transition ${size === s ? 'bg-brand-600 text-white border-brand-600' : 'border-warm-200 text-gray-600'}`}>{s}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Ville</label>
            <CityAutocomplete value={city} onChange={setCity} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Site web</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." className="w-full pl-9 pr-3 py-2.5 border border-warm-200 rounded-xl text-sm outline-none focus:border-brand-400" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border border-warm-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-brand-900 mb-3">Description de l'entreprise</h3>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-warm-200 rounded-xl text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 resize-none"
          placeholder="Décrivez votre entreprise, votre culture, vos projets..."
        />
      </section>

      <section className="bg-white border border-warm-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-brand-900 mb-3">Nos valeurs</h3>
        <TagInput value={values} onChange={setValues} placeholder="Ajouter une valeur..." suggestions={VALUES_SUGGESTIONS} />
      </section>

      <section className="bg-white border border-warm-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-brand-900 mb-3">Score de fiabilité détaillé</h3>
        <ScoreDetail scores={RELIABILITY_CRITERIA} globalScore={company?.score || 85} />
        <div className="mt-3 bg-brand-50 border border-brand-100 rounded-xl p-3">
          <p className="text-sm text-brand-800">💡 Répondez aux matchs en moins de 48h pour améliorer votre score de réactivité.</p>
        </div>
      </section>

      <Button variant="primary">Sauvegarder</Button>
    </div>
  )
}

function TabStats({ stats }) {
  const kpis = [
    { label: 'Offres publiées', value: stats?.activeOffers ?? 4 },
    { label: 'Matchs totaux', value: stats?.totalMatches ?? 47 },
    { label: 'Nouveaux candidats', value: stats?.candidatesThisWeek ?? 12 },
    { label: 'Taux de match', value: '34%' },
  ]

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white border border-warm-200 rounded-2xl p-4 shadow-sm text-center">
            <p className="text-2xl font-black text-brand-900">{k.value}</p>
            <p className="text-xs text-gray-500 mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      <section className="bg-white border border-warm-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-brand-900 mb-4">Candidats par jour cette semaine</h3>
        <div className="flex items-end gap-2 h-20">
          {WEEKLY_SWIPES.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-brand-400 rounded-t-md" style={{ height: `${(d.count / MAX_SWIPES) * 64}px` }} />
              <span className="text-xs text-gray-400">{d.day}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border border-warm-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-brand-900 mb-3">Compétences les plus matchées</h3>
        <div className="flex flex-wrap gap-2">
          {[['React', 18], ['TypeScript', 15], ['Node.js', 12], ['Python', 8], ['AWS', 6]].map(([s, n]) => (
            <span key={s} className="text-sm bg-brand-50 text-brand-700 border border-brand-100 px-3 py-1 rounded-full font-medium">
              {s} <span className="text-brand-400">({n})</span>
            </span>
          ))}
        </div>
      </section>
    </div>
  )
}

function TabSubscription() {
  return (
    <div className="space-y-5">
      <section className="bg-white border border-warm-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-brand-900 mb-3">Votre plan actuel</h3>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold">Gratuit</div>
          <div className="text-sm text-gray-500">2 offres actives · accès limité aux profils</div>
        </div>
      </section>
      <Link to="/premium/company">
        <Button variant="primary" className="w-full">Voir les plans PRO →</Button>
      </Link>
    </div>
  )
}

export default function CompanyProfile() {
  const [company, setCompany] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState(TABS[0])

  useEffect(() => {
    Promise.all([getCompanyProfile(), getDashboardStats()])
      .then(([c, s]) => { setCompany(c); setStats(s) })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex min-h-screen bg-warm-50">
      <SidebarCompany />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-brand-900 mb-5">Mon profil entreprise</h1>

          {/* Tabs */}
          <div className="flex gap-1 bg-warm-100 rounded-xl p-1 mb-6">
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

          {loading ? <Spinner size="lg" /> : (
            <>
              {tab === 'Profil public' && <TabPublicProfile company={company} />}
              {tab === 'Statistiques' && <TabStats stats={stats} />}
              {tab === 'Abonnement' && <TabSubscription />}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
