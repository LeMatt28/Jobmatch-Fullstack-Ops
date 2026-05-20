import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function ProtectedRoute({ children, requiredRole }) {
  const { isAuth, role } = useAuth()

  if (!isAuth) return <Navigate to="/login" replace />

  if (requiredRole && role !== requiredRole) {
    const fallback = role === 'candidate' ? '/candidate/feed' : role === 'admin' ? '/admin' : '/company/dashboard'
    return <Navigate to={fallback} replace />
  }

  return children
}
