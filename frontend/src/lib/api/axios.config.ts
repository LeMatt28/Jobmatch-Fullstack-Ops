import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api'

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
})

// Inject access token on every request
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('auth-storage')
      if (raw) {
        const parsed = JSON.parse(raw) as { state?: { accessToken?: string } }
        const token = parsed?.state?.accessToken
        if (token) config.headers.Authorization = `Bearer ${token}`
      }
    } catch {
      // silently ignore JSON parse errors
    }
  }
  return config
})

// Handle 401 — clear storage and redirect to login
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('auth-storage')
      window.location.href = '/login'
    }
    return Promise.reject(error instanceof Error ? error : new Error(String(error)))
  }
)
