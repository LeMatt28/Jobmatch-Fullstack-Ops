import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'

let isRefreshing = false
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = []

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((p) => (token ? p.resolve(token) : p.reject(error)))
  failedQueue = []
}

function getStoredTokens(): { accessToken: string | null; refreshToken: string | null } {
  if (typeof window === 'undefined') return { accessToken: null, refreshToken: null }
  try {
    const raw = localStorage.getItem('auth-storage')
    if (!raw) return { accessToken: null, refreshToken: null }
    const parsed = JSON.parse(raw) as { state?: { accessToken?: string; refreshToken?: string } }
    return {
      accessToken: parsed?.state?.accessToken ?? null,
      refreshToken: parsed?.state?.refreshToken ?? null,
    }
  } catch {
    return { accessToken: null, refreshToken: null }
  }
}

function updateStoredAccessToken(token: string) {
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem('auth-storage')
    if (!raw) return
    const parsed = JSON.parse(raw) as { state?: Record<string, unknown> }
    if (parsed.state) {
      parsed.state.accessToken = token
      localStorage.setItem('auth-storage', JSON.stringify(parsed))
    }
  } catch { /* ignore */ }
}

export function setupInterceptors(client: AxiosInstance) {
  // Request — inject Bearer token
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const { accessToken } = getStoredTokens()
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
    return config
  })

  // Response — handle 401 with token refresh
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

      if (error.response?.status !== 401 || original._retry) {
        return Promise.reject(error instanceof Error ? error : new Error(String(error)))
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`
          return client(original)
        })
      }

      original._retry = true
      isRefreshing = true

      const { refreshToken } = getStoredTokens()
      if (!refreshToken) {
        isRefreshing = false
        if (typeof window !== 'undefined') window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        const { data } = await client.post<{ accessToken: string }>('/auth/refresh', { refreshToken })
        updateStoredAccessToken(data.accessToken)
        processQueue(null, data.accessToken)
        original.headers.Authorization = `Bearer ${data.accessToken}`
        return client(original)
      } catch (refreshError) {
        processQueue(refreshError, null)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage')
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
  )
}
