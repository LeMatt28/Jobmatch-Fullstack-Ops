import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import { updateProfile } from '../../services/candidateService'
import { TagInput } from '../../components/TagInput'
import { CityAutocomplete } from '../../components/CityAutocomplete'
import { RangeSlider } from '../../components/RangeSlider'
import { WorkModePicker } from '../../components/WorkModePicker'
import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'

const SKILL_SUGGESTIONS = ['React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'TypeScript', 'Docker', 'AWS', 'SQL', 'GraphQL', 'Go', 'Java']
const SOFT_SUGGESTIONS = ['Leadership', 'Communication', 'Autonomie', 'Esprit d\'équipe', 'Curiosité', 'Rigueur', 'Créativité', 'Adaptabilité']
const CONTRACT_TYPES = ['CDI', 'CDD', 'Freelance', 'Stage', 'Alternance']
const LEVELS = [
  { value: 'Junior', label: 'Junior', sub: '< 2 ans' },
  { value: 'Confirmé', label: 'Confirmé', sub: '2–5 ans' },
  { value: 'Senior', label: 'Senior', sub: '5+ ans' },
]

export default function ProfileSetup() {
  const { updateUser } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    location: '', salary: [35000, 60000], workMode: null, hybridDays: 2, contractTypes: [],
    skills: [], softSkills: [],
    experience: '', level: 'Confirmé',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const toggleContract = (ct) => {
    set('contractTypes', form.contractTypes.includes(ct)
      ? form.contractTypes.filter((c) => c !== ct)
      : [...form.contractTypes, ct])
  }

  const finish = async () => {
    setLoading(true)
    try {
      await updateProfile(form)
      updateUser(form)
      navigate('/candidate/feed')
    } finally {
      setLoading(false)
    }
  }

  const steps = ['Informations', 'Compétences', 'Expérience']

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            {steps.map((s, i) => (
              <span key={s} className={i <= step ? 'text-brand-600 font-medium' : ''}>{s}</span>
            ))}
          </div>
          <div className="h-1.5 bg-brand-100 rounded-full overflow-hidden">
            <div className="h-full bg-brand-600 rounded-full transition-all duration-300" style={{ width: `${((step + 1) / 3) * 100}%` }} />
          </div>
        </div>

        <motion.div
          key={step}
          className="bg-white rounded-2xl border border-brand-100 shadow-sm p-8"
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
        >
          {step === 0 && (
            <div className="flex flex-col gap-5">
              <h2 className="text-xl font-bold text-brand-900">Informations générales</h2>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Localisation</label>
                <CityAutocomplete value={form.location} onChange={(v) => set('location', v)} />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Salaire attendu</label>
                <RangeSlider value={form.salary} onChange={(v) => set('salary', v)} />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Mode de travail</label>
                <WorkModePicker
                  value={form.workMode}
                  onChange={(v) => set('workMode', v)}
                  hybridDays={form.hybridDays}
                  onHybridDaysChange={(v) => set('hybridDays', v)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-gray-700">Type de contrat recherché</p>
                <div className="flex flex-wrap gap-2">
                  {CONTRACT_TYPES.map((ct) => (
                    <button
                      key={ct} type="button"
                      onClick={() => toggleContract(ct)}
                      className={`text-sm px-4 py-2 rounded-xl border transition font-medium ${form.contractTypes.includes(ct) ? 'bg-brand-600 text-white border-brand-600' : 'border-gray-200 text-gray-600 hover:border-brand-400'}`}
                    >
                      {ct}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-bold text-brand-900">Compétences</h2>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Compétences techniques</label>
                <TagInput value={form.skills} onChange={(v) => set('skills', v)} placeholder="React, Python..." suggestions={SKILL_SUGGESTIONS} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Soft skills</label>
                <TagInput value={form.softSkills} onChange={(v) => set('softSkills', v)} placeholder="Leadership..." suggestions={SOFT_SUGGESTIONS} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-bold text-brand-900">Expérience</h2>
              <div className="flex flex-col gap-1">
                <label htmlFor="experience" className="text-sm font-medium text-gray-700">Résumé de ton parcours</label>
                <textarea
                  id="experience" rows={5}
                  className="border border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 rounded-xl px-4 py-3 text-sm outline-none resize-none"
                  placeholder="Décris ton parcours, tes expériences marquantes..."
                  value={form.experience} onChange={(e) => set('experience', e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-gray-700">Niveau d'expérience</p>
                <div className="flex gap-3">
                  {LEVELS.map(({ value, label, sub }) => (
                    <button
                      key={value} type="button"
                      onClick={() => set('level', value)}
                      className={`flex-1 rounded-xl border p-3 text-center transition ${form.level === value ? 'border-brand-600 bg-brand-50' : 'border-gray-200 hover:border-brand-400'}`}
                    >
                      <p className={`text-sm font-semibold ${form.level === value ? 'text-brand-700' : 'text-gray-700'}`}>{label}</p>
                      <p className="text-xs text-gray-400">{sub}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {step > 0
              ? <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>← Précédent</Button>
              : <div />
            }
            <div className="flex items-center gap-3">
              <Link to="/candidate/feed" className="text-xs text-gray-400 hover:underline">Passer pour l'instant</Link>
              {step < 2
                ? <Button variant="primary" onClick={() => setStep((s) => s + 1)}>Suivant →</Button>
                : (
                  <Button variant="primary" onClick={finish} disabled={loading}>
                    {loading ? <Spinner size="sm" /> : 'Terminer et découvrir les offres →'}
                  </Button>
                )
              }
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
