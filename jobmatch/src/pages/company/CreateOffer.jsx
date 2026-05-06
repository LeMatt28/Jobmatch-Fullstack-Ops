import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { SidebarCompany } from '../../components/SidebarCompany'
import { TagInput } from '../../components/TagInput'
import { CityAutocomplete } from '../../components/CityAutocomplete'
import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'
import { createOffer } from '../../services/companyService'
import { formatSalary } from '../../utils/formatDate'

const CONTRACT_TYPES = ['CDI', 'CDD', 'Freelance', 'Stage', 'Alternance']
const REMOTE_OPTIONS = ['Non', 'Hybride', 'Full Remote']
const LEVELS = ['Junior', 'Confirmé', 'Senior', 'Peu importe']

const STACK_SUGGESTIONS = {
  Frontend: ['React', 'Vue', 'Angular', 'TypeScript', 'Next.js'],
  Backend: ['Node.js', 'Python', 'Laravel', 'Java', 'Go'],
  Data: ['SQL', 'MongoDB', 'Redis', 'Elasticsearch'],
  DevOps: ['Docker', 'Kubernetes', 'AWS', 'GCP', 'CI/CD'],
}

const SOFT_SUGGESTIONS = ['Leadership', 'Autonomie', 'Communication', 'Créativité', 'Curiosité', 'Rigueur', 'Esprit d\'équipe']

function PreviewCard({ offer }) {
  const salary = formatSalary(offer.salaryMin, offer.salaryMax)
  return (
    <div className="rounded-2xl overflow-hidden shadow-lg" style={{ background: '#1C1730' }}>
      <div className="px-5 pt-5 pb-4" style={{ background: '#312A52' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">ME</div>
          <div>
            <p className="text-white font-bold text-sm truncate">{offer.title || 'Titre du poste'}</p>
            <p className="text-gray-300 text-xs">{offer.company} · {offer.location || 'Lieu'} · {offer.contractType}</p>
          </div>
        </div>
      </div>
      <div className="px-5 py-4 space-y-3">
        <p className="text-gray-300 text-xs leading-relaxed line-clamp-3">{offer.description || 'Description du poste...'}</p>
        <div className="flex flex-wrap gap-1.5">
          {offer.stack?.slice(0, 4).map((s) => (
            <span key={s} className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: '#3C3489', color: '#AFA9EC' }}>{s}</span>
          ))}
        </div>
      </div>
      <div className="px-5 py-3" style={{ background: '#252040' }}>
        <p className="text-xs text-gray-400">
          {salary ? `💰 ${salary}/an` : <span className="text-amber-400">💰 Salaire non communiqué</span>}
          {offer.location ? ` · 📍 ${offer.location}` : ''}
        </p>
      </div>
    </div>
  )
}

export default function CreateOffer() {
  const navigate = useNavigate()
  const [stack, setStack] = useState([])
  const [softSkills, setSoftSkills] = useState([])
  const [remote, setRemote] = useState('Non')
  const [hybridDays, setHybridDays] = useState(2)
  const [hideSalary, setHideSalary] = useState(false)
  const [level, setLevel] = useState('Confirmé')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  const watchedTitle = watch('title', '')
  const watchedDesc = watch('description', '')
  const watchedContract = watch('contractType', 'CDI')
  const watchedSalMin = watch('salaryMin', '')
  const watchedSalMax = watch('salaryMax', '')

  const liveOffer = {
    title: watchedTitle,
    company: 'Votre entreprise',
    location,
    contractType: watchedContract,
    description: watchedDesc,
    stack,
    salaryMin: hideSalary ? null : Number(watchedSalMin) || null,
    salaryMax: hideSalary ? null : Number(watchedSalMax) || null,
    remote: remote !== 'Non',
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await createOffer({ ...data, stack, softSkills, remote, level, location, salaryMin: hideSalary ? null : Number(data.salaryMin), salaryMax: hideSalary ? null : Number(data.salaryMax) })
      navigate('/company/dashboard')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-warm-50">
      <SidebarCompany />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6 md:p-8">
          <h1 className="text-2xl font-bold text-brand-900 mb-6">Publier une offre</h1>

          <div className="grid lg:grid-cols-[1fr,340px] gap-8 items-start">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* Section 1 — L'essentiel */}
              <section className="bg-white border border-warm-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-sm font-semibold text-brand-900 uppercase tracking-wider mb-4">L'essentiel</h2>

                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Titre du poste, ex : Développeur React Senior"
                      className={`w-full px-4 py-3 border rounded-xl text-sm outline-none transition font-medium ${errors.title ? 'border-red-400' : 'border-warm-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100'}`}
                      {...register('title', { required: 'Titre requis' })}
                    />
                    {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
                  </div>

                  {/* Contract type */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">Type de contrat</p>
                    <div className="flex flex-wrap gap-2">
                      {CONTRACT_TYPES.map((ct) => (
                        <label key={ct} className={`cursor-pointer px-4 py-2 rounded-xl text-sm border font-medium transition ${watch('contractType', 'CDI') === ct ? 'bg-brand-600 text-white border-brand-600' : 'border-warm-200 text-gray-600 hover:border-brand-400'}`}>
                          <input type="radio" value={ct} className="sr-only" {...register('contractType')} defaultChecked={ct === 'CDI'} />
                          {ct}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Location + remote */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-2">Localisation</p>
                      <CityAutocomplete value={location} onChange={setLocation} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-2">Télétravail</p>
                      <div className="flex gap-2">
                        {REMOTE_OPTIONS.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setRemote(opt)}
                            className={`flex-1 py-2.5 rounded-xl text-xs border font-medium transition ${remote === opt ? 'bg-brand-600 text-white border-brand-600' : 'border-warm-200 text-gray-600 hover:border-brand-400'}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      {remote === 'Hybride' && (
                        <div className="mt-2 flex items-center gap-2">
                          <input type="range" min={1} max={5} value={hybridDays} onChange={(e) => setHybridDays(Number(e.target.value))} className="flex-1 accent-brand-600" />
                          <span className="text-xs text-brand-700 font-medium w-24">{hybridDays}j/sem présentiel</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 2 — Le poste */}
              <section className="bg-white border border-warm-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-sm font-semibold text-brand-900 uppercase tracking-wider mb-4">Le poste</h2>

                <div className="space-y-4">
                  <div>
                    <textarea
                      rows={6}
                      placeholder="Décrivez le poste, les missions principales, l'environnement de travail..."
                      className={`w-full px-4 py-3 border rounded-xl text-sm outline-none resize-none transition ${errors.description ? 'border-red-400' : 'border-warm-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100'}`}
                      {...register('description', { required: 'Description requise' })}
                    />
                    {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
                    <p className="text-xs text-brand-600 mt-1">💡 Mentionnez les missions principales pour +12% de matchs</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">Stack technique</p>
                    <TagInput value={stack} onChange={setStack} placeholder="Ajouter une techno..." suggestions={Object.values(STACK_SUGGESTIONS).flat()} />
                    <div className="mt-2 space-y-1.5">
                      {Object.entries(STACK_SUGGESTIONS).map(([cat, items]) => (
                        <div key={cat} className="flex flex-wrap gap-1.5 items-center">
                          <span className="text-xs text-gray-400 w-16">{cat}</span>
                          {items.map((item) => (
                            <button
                              key={item}
                              type="button"
                              onClick={() => !stack.includes(item) && setStack((p) => [...p, item])}
                              className="text-xs px-2.5 py-1 bg-warm-100 text-gray-600 rounded-full hover:bg-brand-50 hover:text-brand-700 transition"
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 3 — Conditions */}
              <section className="bg-white border border-warm-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-sm font-semibold text-brand-900 uppercase tracking-wider mb-4">Conditions</h2>

                <div className="space-y-4">
                  {/* Salary */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium text-gray-500">Fourchette salariale</p>
                      <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
                        <input type="checkbox" checked={hideSalary} onChange={(e) => setHideSalary(e.target.checked)} className="accent-brand-600" />
                        Ne pas afficher
                      </label>
                    </div>
                    {!hideSalary ? (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                          <input type="number" placeholder="45000" className="w-full px-4 py-2.5 pr-12 border border-warm-200 rounded-xl text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" {...register('salaryMin')} />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">€/an</span>
                        </div>
                        <div className="relative">
                          <input type="number" placeholder="65000" className="w-full px-4 py-2.5 pr-12 border border-warm-200 rounded-xl text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" {...register('salaryMax')} />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">€/an</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                        ⚠ Les offres avec salaire reçoivent 2× plus de matchs
                      </p>
                    )}
                  </div>

                  {/* Level */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">Niveau d'expérience requis</p>
                    <div className="flex flex-wrap gap-2">
                      {LEVELS.map((l) => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => setLevel(l)}
                          className={`px-4 py-2 rounded-xl text-sm border font-medium transition ${level === l ? 'bg-brand-600 text-white border-brand-600' : 'border-warm-200 text-gray-600 hover:border-brand-400'}`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Soft skills */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">Soft skills recherchés</p>
                    <TagInput value={softSkills} onChange={setSoftSkills} placeholder="Ajouter..." suggestions={SOFT_SUGGESTIONS} />
                  </div>
                </div>
              </section>

              {/* Actions */}
              <div className="flex gap-3">
                <Button type="submit" variant="primary" disabled={loading} className="flex items-center gap-2">
                  {loading ? <Spinner size="sm" /> : 'Publier l\'offre →'}
                </Button>
                <Button type="button" variant="secondary">Sauvegarder en brouillon</Button>
              </div>
            </form>

            {/* Live preview */}
            <aside className="hidden lg:block sticky top-8">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Aperçu de votre offre</p>
              <PreviewCard offer={liveOffer} />
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}
