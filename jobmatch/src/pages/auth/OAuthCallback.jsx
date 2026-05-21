import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Spinner } from '../../components/ui/Spinner'

function parseJwt(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch {
    return null
  }
}

export default function OAuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()

  useEffect(() => {
    const token = searchParams.get('token')
    const error = searchParams.get('error')

    if (error) {
      navigate(`/login?error=${encodeURIComponent(error)}`, { replace: true })
      return
    }

    if (!token) {
      navigate('/login?error=Token+manquant', { replace: true })
      return
    }

    const payload = parseJwt(token)
    if (!payload) {
      navigate('/login?error=Token+invalide', { replace: true })
      return
    }

    const role = payload.role
    const user = {
      id: payload.id,
      email: payload.email,
      firstName: payload.firstName ?? '',
      lastName: payload.lastName ?? '',
    }

    login(token, role, user)

    if (role === 'candidate') navigate('/candidate/feed', { replace: true })
    else if (role === 'company') navigate('/company/dashboard', { replace: true })
    else navigate('/', { replace: true })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
      <Spinner />
      <p className="text-sm text-gray-500">Connexion en cours…</p>
    </div>
  )
}
