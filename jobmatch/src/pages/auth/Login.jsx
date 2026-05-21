import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import { loginUser } from '../../services/authService'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'
import OAuthButtons from '../../components/OAuthButtons'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [showPwd, setShowPwd] = useState(false)
  const [apiError, setApiError] = useState(searchParams.get('error') ?? '')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async ({ email, password }) => {
    setApiError('')
    setLoading(true)
    try {
      const { token, role, user } = await loginUser(email, password)
      login(token, role, user)
      navigate(role === 'candidate' ? '/candidate/feed' : role === 'admin' ? '/admin' : '/company/dashboard', { replace: true })
    } catch (err) {
      setApiError(err.message || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-brand-100 p-8"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-black text-lg mx-auto mb-3">JM</div>
          <h1 className="text-2xl font-bold text-brand-900">Connexion</h1>
          <p className="text-sm text-gray-500 mt-1">Content de vous revoir !</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="demo@candidat.fr"
            error={errors.email?.message}
            {...register('email', { required: 'Email requis' })}
          />

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Mot de passe</label>
            <div className="relative">
              <input
                id="password"
                type={showPwd ? 'text' : 'password'}
                placeholder="••••••••"
                className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition pr-10 ${errors.password ? 'border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100'}`}
                {...register('password', { required: 'Mot de passe requis' })}
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPwd ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p role="alert" className="text-xs text-red-500">{errors.password.message}</p>}
          </div>

          {apiError && <p role="alert" className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2">{apiError}</p>}

          <Button type="submit" variant="primary" className="w-full mt-2" disabled={loading}>
            {loading ? <Spinner size="sm" /> : 'Se connecter'}
          </Button>
        </form>

        <div className="mt-5">
          <div className="relative flex items-center gap-3 mb-4">
            <div className="flex-1 border-t border-gray-200" />
            <span className="text-xs text-gray-400">ou continuer avec</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>
          <OAuthButtons />
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          Pas encore de compte ?{' '}
          <Link to="/register/candidate" className="text-brand-600 font-medium hover:underline">Candidat</Link>
          {' · '}
          <Link to="/register/company" className="text-brand-600 font-medium hover:underline">Entreprise</Link>
        </div>

        <div className="mt-4 p-3 bg-brand-50 rounded-xl text-xs text-brand-700">
          <p className="font-medium mb-1">Comptes démo</p>
          <p>Candidat : demo@candidat.fr / demo</p>
          <p>Entreprise : demo@entreprise.fr / demo</p>
          <p>Admin : admin@jobmatch.fr / admin</p>
        </div>
      </motion.div>
    </div>
  )
}
