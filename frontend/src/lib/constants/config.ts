export const APP_CONFIG = {
  name: 'JobAggregator',
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api',
  apiKey: process.env.NEXT_PUBLIC_API_KEY ?? '',
  pageSize: 12,
  debounceMs: 400,
  queryStaleTime: 60_000,
} as const
