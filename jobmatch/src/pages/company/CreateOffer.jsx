import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { SidebarCompany } from '../../components/SidebarCompany'
import { TagInput } from '../../components/TagInput'
import { CityAutocomplete } from '../../components/CityAutocomplete'
import { RangeSlider } from '../../components/RangeSlider'
import { WorkModePicker } from '../../components/WorkModePicker'
import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'
import { createOffer } from '../../services/companyService'
import { formatSalary } from '../../utils/formatDate'

const CONTRACT_TYPES = ['CDI', 'CDD', 'Freelance', 'Stage', 'Alternance']
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
    <div className="rounded-2xl overflow-hidden shadow-md bg-white border-t-4 border-brand-600">
      <div className="px-5 pt-4 pb-3 bg-brand-50 flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-brand-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">ME</div>
        <div className="flex-1 min-w-0">
          <p className="text-brand-900 font-semibold text-sm truncate">{offer.company}</p>
        </div>
      </div>
      <div className="px-5 py-4 space-y-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{offer.title || 'Titre du poste'}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{offer.company} · {offer.location || 'Lieu'} · {offer.contractType}</p>
        </div>
        <div className="border-t border-gray-100" />
        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">{offer.description || 'Description du poste...'}</p>
        <div className="flex flex-wrap gap-1.5">
          {offer.stack?.slice(0, 4).map((s) => (
            <span key={s} className="text-xs px-2.5 py-1 rounded-full font-medium bg-brand-50 text-brand-700 border border-brand-100">{s}</span>
          ))}
        </div>
      </div>
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="text-sm space-y-0.5">
            {salary
              ? <p className="text-gray-900 font-semibold">💰 {salary}/an</p>
              : <p className="text-amber-600 text-xs font-medium">💰 Salaire non communiqué</p>
            }
            {offer.location && <p className="text-gray-500 text-xs">📍 {offer.location}</p>}
          </div>
          {offer.remote && (
            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">Remote</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CreateOffer() {
  const navigate = useNavigate()
  const [stack, setStack] = useState([])
  const [softSkills, setSoftSkills] = useState([])
  const [workMode, setWorkMode] = useState('onsite')
  const [hybridDays, setHybridDays] = useState(2)
  const [salary, setSalary] = useState([45000, 65000])
  const [hideSalary, setHideSalary] = useState(false)
  const [level, setLevel] = useState('Confirmé')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  const watchedTitle = watch('title', '')
  const watchedDesc = watch('description', '')
  const watchedContract = watch('contractType', 'CDI')

  const liveOffer = {
    title: watchedTitle,
    company: 'Votre entreprise',
    location,
    contractType: watchedContract,
    description: watchedDesc,
    stack,
    salaryMin: hideSalary ? null : salary[0],
    salaryMax: hideSalary ? null : salary[1],
    remote: workMode !== 'onsite',
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await createOffer({ ...data, stack, softSkills, workMode, hybridDays, level, location, salaryMin: hideSalary ? null : salary[0], salaryMax: hideSalary ? null : salary[1] })
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
                      <p className="text-xs font-medium text-gray-500 mb-2">Mode de travail</p>
                      <WorkModePicker
                        value={workMode}
                        onChange={setWorkMode}
                        hybridDays={hybridDays}
                        onHybridDaysChange={setHybridDays}
                      />
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
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-medium text-gray-500">Fourchette salariale</p>
                      <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
                        <input type="checkbox" checked={hideSalary} onChange={(e) => setHideSalary(e.target.checked)} className="accent-brand-600" />
                        Ne pas afficher
                      </label>
                    </div>
                    {!hideSalary ? (
                      <RangeSlider value={salary} onChange={setSalary} />
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
