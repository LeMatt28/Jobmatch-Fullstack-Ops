import { useState, useEffect } from 'react'
import { MapPin, Globe, ChevronDown, ChevronUp } from 'lucide-react'
import { Navbar } from '../../components/Navbar'
import { ScoreDetail, mockScoreCriteria } from '../../components/ScoreDetail'
import { TagList } from '../../components/TagList'
import { TagInput } from '../../components/TagInput'
import { CityAutocomplete } from '../../components/CityAutocomplete'
import { RangeSlider } from '../../components/RangeSlider'
import { WorkModePicker } from '../../components/WorkModePicker'
import { Spinner } from '../../components/ui/Spinner'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../hooks/useAuth'
import { getProfile } from '../../services/candidateService'

const TABS = ['Mon profil', 'Mon CV', 'Mes préférences', 'Mes statistiques']

const CONTRACT_TYPES = ['CDI', 'CDD', 'Freelance', 'Stage', 'Alternance']
const SECTORS = ['Tech', 'Fintech', 'Santé', 'E-commerce', 'Conseil', 'Industrie', 'Media', 'Éducation']
const AVAILABILITY = ['Immédiatement', 'Dans 1 mois', 'Dans 3 mois', "Je suis à l'écoute"]

const INTEREST_CATEGORIES = [
  {
    label: 'Sport & Bien-être',
    items: ['Football', 'Basketball', 'Tennis', 'Running', 'Cyclisme', 'Natation', 'Yoga', 'Musculation', 'Randonnée', 'Escalade', 'Arts martiaux', 'Danse', 'Ski', 'Surf', 'Padel', 'Golf', 'Volleyball', 'Handball'],
  },
  {
    label: 'Culture & Créativité',
    items: ['Musique', 'Guitare', 'Piano', 'Chant', 'Photographie', 'Cinéma', 'Théâtre', 'Peinture', 'Dessin', 'Sculpture', 'Écriture', 'Littérature', 'BD & Manga', 'Podcasts', 'Jeux de société', 'Jeux vidéo', 'Anime'],
  },
  {
    label: 'Tech & Sciences',
    items: ['Open Source', 'Hackathons', 'Electronics', '3D Printing', 'IA/ML', 'Astronomie', 'Robotique', 'Cybersécurité', 'Web3', 'Gaming compétitif'],
  },
  {
    label: 'Social & Engagement',
    items: ['Bénévolat', 'Mentorat', 'Entrepreneuriat', 'Développement personnel', 'Voyages', 'Langues étrangères', 'Cuisine', 'Gastronomie', 'Jardinage', 'Animaux', 'Écologie', 'Politique', 'Spiritualité'],
  },
]

const ACCOMPLISHMENT_PLACEHOLDERS = [
  "Ex: J'ai couru mon premier marathon en 3h45 après 6 mois d'entraînement",
  "Ex: J'ai appris la guitare seul et joue maintenant dans un groupe de jazz",
  "Ex: J'ai lancé un projet open source suivi par 2 000 personnes sur GitHub",
]

const PROFILE_SCORE_CRITERIA = [
  { criteria: 'Complétude du profil', value: 82 },
  { criteria: 'Compétences vérifiées', value: 90 },
  { criteria: 'Cohérence expérience', value: 85 },
  { criteria: 'Présence réseau', value: 60, comment: 'Ajoutez LinkedIn pour +8 pts' },
  { criteria: 'Disponibilité', value: 100 },
]

const WEEKLY_SWIPES = [
  { day: 'Lundi', count: 3 },
  { day: 'Mardi', count: 5 },
  { day: 'Mercredi', count: 3 },
  { day: 'Jeudi', count: 8 },
  { day: 'Vendredi', count: 4 },
]
const MAX_SWIPES = Math.max(...WEEKLY_SWIPES.map((d) => d.count))

function InterestsAccordion({ interests, onChange }) {
  const [openCats, setOpenCats] = useState([INTEREST_CATEGORIES[0].label])
  const [customTag, setCustomTag] = useState('')
  const MAX = 10

  const toggle = (item) => {
    if (interests.includes(item)) {
      onChange(interests.filter((i) => i !== item))
    } else if (interests.length < MAX) {
      onChange([...interests, item])
    }
  }

  const toggleCat = (label) => {
    setOpenCats((prev) => prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label])
  }

  const addCustom = () => {
    const t = customTag.trim()
    if (t && !interests.includes(t) && interests.length < MAX) {
      onChange([...interests, t])
      setCustomTag('')
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-gray-500">{interests.length}/{MAX} sélectionnés</p>
        {interests.length >= MAX && <p className="text-xs text-amber-600 font-medium">Maximum atteint</p>}
      </div>
      {INTEREST_CATEGORIES.map((cat) => {
        const isOpen = openCats.includes(cat.label)
        return (
          <div key={cat.label} className="border border-warm-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => toggleCat(cat.label)}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-warm-50 hover:bg-warm-100 transition text-sm font-medium text-brand-900"
            >
              {cat.label}
              {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            {isOpen && (
              <div className="px-4 py-3 flex flex-wrap gap-2 bg-white">
                {cat.items.map((item) => {
                  const active = interests.includes(item)
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggle(item)}
                      className={`text-sm px-3 py-1.5 rounded-full font-medium transition ${
                        active ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-brand-50'
                      } ${!active && interests.length >= MAX ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      {item}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
      <div className="flex gap-2 mt-2">
        <input
          type="text"
          value={customTag}
          onChange={(e) => setCustomTag(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustom())}
          placeholder="Ajouter un intérêt personnalisé..."
          className="flex-1 px-3 py-2 border border-warm-200 rounded-xl text-sm outline-none focus:border-brand-400"
          disabled={interests.length >= MAX}
        />
        <button
          type="button"
          onClick={addCustom}
          disabled={!customTag.trim() || interests.length >= MAX}
          className="px-3 py-2 bg-brand-600 text-white rounded-xl text-sm font-medium disabled:opacity-40 transition hover:bg-brand-800"
        >
          +
        </button>
      </div>
    </div>
  )
}

function TabProfile({ profile, name, initials }) {
  const [linkedin, setLinkedin] = useState('')
  const [github, setGithub] = useState('')
  const [portfolio, setPortfolio] = useState('')
  const [twitter, setTwitter] = useState('')
  const [about, setAbout] = useState('')
  const [interests, setInterests] = useState([])
  const [accomplishments, setAccomplishments] = useState(['', '', ''])

  return (
    <div className="space-y-5">
      {/* Identity */}
      <section className="bg-white border border-warm-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-5 mb-5">
          <div className="w-20 h-20 rounded-full bg-brand-600 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
            {initials}
          </div>
          <div>
            <h2 className="text-xl font-bold text-brand-900">{name}</h2>
            <p className="text-sm text-gray-500">{profile?.email || ''}</p>
            {profile?.location && (
              <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" />{profile.location}
              </p>
            )}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { icon: Globe, label: 'LinkedIn', val: linkedin, set: setLinkedin, placeholder: 'https://linkedin.com/in/...' },
            { icon: Globe, label: 'GitHub', val: github, set: setGithub, placeholder: 'https://github.com/...' },
            { icon: Globe, label: 'Portfolio', val: portfolio, set: setPortfolio, placeholder: 'https://monsite.fr' },
            { icon: Globe, label: 'Twitter/X', val: twitter, set: setTwitter, placeholder: 'https://x.com/...' },
          ].map(({ icon: Icon, label, val, set, placeholder }) => (
            <div key={label} className="relative">
              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="url"
                value={val}
                onChange={(e) => set(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-9 pr-3 py-2.5 border border-warm-200 rounded-xl text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Score IA */}
      <section className="bg-white border border-warm-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-brand-900 mb-4">Score IA de votre profil</h2>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Circle */}
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="40" fill="none" stroke="#F5EDE0" strokeWidth="8" />
                <circle cx="48" cy="48" r="40" fill="none" stroke="#534AB7" strokeWidth="8"
                  strokeDasharray={`${(84 / 100) * 251} 251`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-brand-900">84</span>
                <span className="text-xs text-gray-400">/100</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-brand-600">Très attractif</p>
            <p className="text-xs text-gray-400 text-center">Visible par 73% des offres</p>
          </div>
          <div className="flex-1">
            <ScoreDetail scores={PROFILE_SCORE_CRITERIA} globalScore={84} />
          </div>
        </div>
        <div className="mt-4 bg-brand-50 border border-brand-100 rounded-xl p-3">
          <p className="text-sm text-brand-800">💡 Ajoutez votre lien LinkedIn pour augmenter votre score de 8 points.</p>
        </div>
      </section>

      {/* Skills */}
      <section className="bg-white border border-warm-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-brand-900 mb-3">Compétences techniques</h2>
        {profile?.skills?.length > 0 && <TagList tags={profile.skills} color="brand" />}
      </section>

      {/* Interests */}
      <section className="bg-white border border-warm-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-brand-900 mb-3">Centres d'intérêt</h2>
        {interests.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {interests.map((i) => (
              <span key={i} className="text-sm px-3 py-1 rounded-full bg-brand-600 text-white font-medium flex items-center gap-1">
                {i}
                <button type="button" onClick={() => setInterests((p) => p.filter((x) => x !== i))} className="text-brand-200 hover:text-white text-xs ml-0.5">✕</button>
              </span>
            ))}
          </div>
        )}
        <InterestsAccordion interests={interests} onChange={setInterests} />
      </section>

      {/* Accomplishments */}
      <section className="bg-white border border-warm-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-brand-900 mb-1">3 accomplissements dont je suis fier·e</h2>
        <p className="text-sm text-gray-400 mb-4">Hors contexte professionnel — ce qui vous rend unique</p>
        <div className="space-y-4">
          {accomplishments.map((val, idx) => (
            <div key={idx} className="relative">
              <span className="absolute -left-2 top-2 text-4xl font-black text-brand-100 select-none" style={{ lineHeight: 1 }}>{idx + 1}</span>
              <div className="relative ml-6">
                <textarea
                  value={val}
                  onChange={(e) => {
                    const updated = [...accomplishments]
                    updated[idx] = e.target.value.slice(0, 150)
                    setAccomplishments(updated)
                  }}
                  rows={2}
                  placeholder={ACCOMPLISHMENT_PLACEHOLDERS[idx]}
                  className="w-full px-4 py-3 bg-warm-50 border border-warm-200 rounded-xl text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 resize-none"
                />
                <span className="absolute bottom-2 right-3 text-[10px] text-gray-400">{val.length}/150</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="bg-white border border-warm-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-brand-900 mb-3">À propos</h2>
        <div className="relative">
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value.slice(0, 250))}
            rows={4}
            placeholder="Décris-toi en quelques mots..."
            className="w-full px-4 py-3 border border-warm-200 rounded-xl text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 resize-none"
          />
          <span className="absolute bottom-3 right-3 text-xs text-gray-400">{about.length}/250</span>
        </div>
      </section>

      <Button variant="primary">Sauvegarder</Button>
    </div>
  )
}

function TabCV() {
  const [uploaded, setUploaded] = useState(false)
  const [dragging, setDragging] = useState(false)

  return (
    <div className="space-y-5">
      <section className="bg-white border border-warm-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-brand-900 mb-4">Mon CV</h2>
        {!uploaded ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); setUploaded(true) }}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition ${dragging ? 'border-brand-400 bg-brand-50' : 'border-warm-200 bg-warm-50 hover:border-brand-300'}`}
            onClick={() => setUploaded(true)}
          >
            <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            </div>
            <p className="text-sm font-semibold text-brand-900 mb-1">Glisse ton CV ici ou clique pour parcourir</p>
            <p className="text-xs text-gray-400">PDF, DOCX — max 5 Mo</p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-4 p-4 bg-warm-50 border border-warm-200 rounded-xl mb-4">
              <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center font-bold text-xs">PDF</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-brand-900">mon-cv.pdf</p>
                <p className="text-xs text-gray-400">128 Ko · Ajouté il y a 2 min</p>
              </div>
              <div className="flex gap-2">
                <button className="text-xs text-brand-600 hover:underline">Remplacer</button>
                <button onClick={() => setUploaded(false)} className="text-xs text-red-500 hover:underline">Supprimer</button>
              </div>
            </div>
            <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 space-y-1">
              <p className="text-sm text-brand-800">✓ CV analysé — 8 compétences détectées automatiquement</p>
              <p className="text-sm text-brand-800">✓ 4 ans d'expérience estimés</p>
              <p className="text-sm text-amber-700">⚠ Ajoutez une photo de profil pour +5 pts</p>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

function TabPreferences({ profile }) {
  const [city, setCity] = useState(profile?.location || '')
  const [contracts, setContracts] = useState(profile?.contractTypes || ['CDI'])
  const [salary, setSalary] = useState([35000, 60000])
  const [workMode, setWorkMode] = useState('hybrid')
  const [hybridDays, setHybridDays] = useState(2)
  const [sectors, setSectors] = useState(['Tech', 'Fintech'])
  const [availability, setAvailability] = useState('Immédiatement')

  const toggleContract = (c) => setContracts((p) => p.includes(c) ? p.filter((x) => x !== c) : [...p, c])
  const toggleSector = (s) => setSectors((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s])

  return (
    <div className="space-y-5">
      <section className="bg-white border border-warm-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-brand-900 mb-3">Localisation</h3>
        <CityAutocomplete value={city} onChange={setCity} />
      </section>

      <section className="bg-white border border-warm-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-brand-900 mb-3">Types de contrat</h3>
        <div className="flex flex-wrap gap-2">
          {CONTRACT_TYPES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => toggleContract(c)}
              className={`text-sm px-3 py-1.5 rounded-full border font-medium transition ${contracts.includes(c) ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-600 border-warm-200 hover:border-brand-400'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="bg-white border border-warm-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-brand-900 mb-4">Salaire attendu</h3>
        <RangeSlider value={salary} onChange={setSalary} />
      </section>

      <section className="bg-white border border-warm-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-brand-900 mb-4">Mode de travail</h3>
        <WorkModePicker value={workMode} onChange={setWorkMode} hybridDays={hybridDays} onHybridDaysChange={setHybridDays} />
      </section>

      <section className="bg-white border border-warm-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-brand-900 mb-3">Secteurs d'activité</h3>
        <div className="flex flex-wrap gap-2">
          {SECTORS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleSector(s)}
              className={`text-sm px-3 py-1.5 rounded-full border font-medium transition ${sectors.includes(s) ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-600 border-warm-200 hover:border-brand-400'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      <section className="bg-white border border-warm-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-brand-900 mb-3">Disponibilité</h3>
        <div className="flex flex-wrap gap-2">
          {AVAILABILITY.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAvailability(a)}
              className={`text-sm px-3 py-1.5 rounded-full border font-medium transition ${availability === a ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-600 border-warm-200'}`}
            >
              {a}
            </button>
          ))}
        </div>
      </section>

      <Button variant="primary">Sauvegarder mes préférences</Button>
    </div>
  )
}

function TabStats() {
  const kpis = [
    { label: 'Offres vues', value: 47 },
    { label: 'Likes envoyés', value: 23 },
    { label: 'Matchs obtenus', value: 8 },
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
        <h3 className="text-sm font-semibold text-brand-900 mb-4">Vos swipes cette semaine</h3>
        <div className="space-y-2">
          {WEEKLY_SWIPES.map((d) => (
            <div key={d.day} className="flex items-center gap-3">
              <span className="text-xs text-gray-400 w-16">{d.day}</span>
              <div className="flex-1 h-5 bg-warm-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-400 rounded-full transition-all"
                  style={{ width: `${(d.count / MAX_SWIPES) * 100}%` }}
                />
              </div>
              <span className="text-xs font-bold text-brand-700 w-4">{d.count}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border border-warm-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-brand-900 mb-3">Secteurs les plus matchés</h3>
        <div className="flex flex-wrap gap-2">
          {[['SaaS B2B', 4], ['Fintech', 3], ['E-commerce', 1]].map(([s, n]) => (
            <span key={s} className="text-sm bg-brand-50 text-brand-700 border border-brand-100 px-3 py-1 rounded-full font-medium">
              {s} <span className="text-brand-400">({n})</span>
            </span>
          ))}
        </div>
      </section>
    </div>
  )
}

export default function CandidateProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState(TABS[0])

  useEffect(() => {
    getProfile().then(setProfile).finally(() => setLoading(false))
  }, [])

  const name = profile?.name || user?.name || 'Candidat'
  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 pb-24 md:pb-8 pt-8">
        <h1 className="text-2xl font-bold text-brand-900 mb-5">Mon profil</h1>

        {/* Tabs */}
        <div className="flex gap-1 bg-warm-100 rounded-xl p-1 mb-6 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${tab === t ? 'bg-white text-brand-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? <Spinner size="lg" /> : (
          <>
            {tab === 'Mon profil' && <TabProfile profile={profile} name={name} initials={initials} />}
            {tab === 'Mon CV' && <TabCV />}
            {tab === 'Mes préférences' && <TabPreferences profile={profile} />}
            {tab === 'Mes statistiques' && <TabStats />}
          </>
        )}
      </main>
    </div>
  )
}
