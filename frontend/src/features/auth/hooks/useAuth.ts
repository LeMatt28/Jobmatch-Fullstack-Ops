'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../store/authStore'
import type { LoginCredentials, RegisterCredentials, AuthResponse } from '../types/auth.types'
import { ROUTES } from '@/lib/constants/routes'
import { apiClient } from '@/lib/api/axios.config'

async function loginRequest(credentials: LoginCredentials): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials)
  return data
}

async function registerRequest(credentials: RegisterCredentials): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/register', credentials)
  return data
}

async function logoutRequest(): Promise<void> {
  await apiClient.post('/auth/logout')
}

export interface UseAuthReturn {
  user: ReturnType<typeof useAuthStore>['user']
  isAuthenticated: boolean
  isAdmin: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => Promise<void>
  isLoginLoading: boolean
  isRegisterLoading: boolean
  loginError: string | null
  registerError: string | null
}

export function useAuth(): UseAuthReturn {
  const router = useRouter()
  const { user, isAuthenticated, setUser, setTokens, logout: storeLogout, setError } = useAuthStore()

  const loginMutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      setUser(data.user)
      setTokens(data.tokens)
      setError(null)
      router.push(ROUTES.dashboard)
    },
    onError: (error: Error) => {
      setError(error.message)
    },
  })

  const registerMutation = useMutation({
    mutationFn: registerRequest,
    onSuccess: (data) => {
      setUser(data.user)
      setTokens(data.tokens)
      setError(null)
      router.push(ROUTES.dashboard)
    },
    onError: (error: Error) => {
      setError(error.message)
    },
  })

  const logoutMutation = useMutation({
    mutationFn: logoutRequest,
    onSettled: () => {
      storeLogout()
      router.push(ROUTES.login)
    },
  })

  return {
    user,
    isAuthenticated,
    isAdmin: user?.role === 'admin',
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    loginError: loginMutation.error?.message ?? null,
    registerError: registerMutation.error?.message ?? null,
  }
}
