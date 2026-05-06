import { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const navigate = useNavigate()

  const [token, setToken] = useState(() => localStorage.getItem('jm-token'))
  const [role, setRole] = useState(() => localStorage.getItem('jm-role'))
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('jm-user')) } catch { return null }
  })

  const isAuth = !!token

  const login = (newToken, newRole, newUser) => {
    localStorage.setItem('jm-token', newToken)
    localStorage.setItem('jm-role', newRole)
    localStorage.setItem('jm-user', JSON.stringify(newUser))
    setToken(newToken)
    setRole(newRole)
    setUser(newUser)
  }

  const logout = () => {
    localStorage.removeItem('jm-token')
    localStorage.removeItem('jm-role')
    localStorage.removeItem('jm-user')
    setToken(null)
    setRole(null)
    setUser(null)
    navigate('/')
  }

  const updateUser = (data) => {
    const updated = { ...user, ...data }
    localStorage.setItem('jm-user', JSON.stringify(updated))
    setUser(updated)
  }

  return (
    <AuthContext.Provider value={{ user, token, role, isAuth, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}
