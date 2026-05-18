import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import { registerCandidate } from '../../services/authService'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'

export default function RegisterCandidate() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const password = watch('password')

  const onSubmit = async (data) => {
    setApiError('')
    setLoading(true)
    try {
      const { token, role, user } = await registerCandidate(data)
      login(token, role, user)
      navigate('/candidate/setup', { replace: true })
    } catch (err) {
      setApiError(err.message || 'Erreur lors de l\'inscription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <motion.div
        className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-brand-100 p-8"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-black text-lg mx-auto mb-3">JM</div>
          <h1 className="text-2xl font-bold text-brand-900">Créer mon compte candidat</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              id="firstName"
              label="Prénom"
              placeholder="Alex"
              error={errors.firstName?.message}
              {...register('firstName', { required: 'Prénom requis' })}
            />
            <Input
              id="lastName"
              label="Nom"
              placeholder="Martin"
              error={errors.lastName?.message}
              {...register('lastName', { required: 'Nom requis' })}
            />
          </div>

          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="alex@email.fr"
            error={errors.email?.message}
            {...register('email', {
              required: 'Email requis',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email invalide' },
            })}
          />

          <Input
            id="password"
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', {
              required: 'Mot de passe requis',
              validate: (v) => {
                if (v.length < 8) return '8 caractères minimum'
                if (!/[A-Z]/.test(v)) return 'Au moins une majuscule'
                if (!/[a-z]/.test(v)) return 'Au moins une minuscule'
                if (!/[0-9]/.test(v)) return 'Au moins un chiffre'
                return true
              },
            })}
          />

          <Input
            id="confirmPassword"
            label="Confirmer le mot de passe"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Confirmation requise',
              validate: (v) => v === password || 'Les mots de passe ne correspondent pas',
            })}
          />

          <div className="flex items-start gap-2">
            <input
              id="cgu"
              type="checkbox"
              className="mt-0.5 accent-brand-600"
              {...register('cgu', { required: 'Vous devez accepter les CGU' })}
            />
            <label htmlFor="cgu" className="text-sm text-gray-600">
              J'accepte les <span className="text-brand-600">conditions d'utilisation</span>
            </label>
          </div>
          {errors.cgu && <p role="alert" className="text-xs text-red-500">{errors.cgu.message}</p>}

          {apiError && <p role="alert" className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2">{apiError}</p>}

          <Button type="submit" variant="primary" className="w-full mt-2" disabled={loading}>
            {loading ? <Spinner size="sm" /> : 'Créer mon compte'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          <Link to="/" className="text-brand-600 hover:underline">← Retour à l'accueil</Link>
        </p>
      </motion.div>
    </div>
  )
}
