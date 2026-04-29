export const ENDPOINTS = {
  auth: {
    login:    '/auth/login',
    register: '/auth/register',
    logout:   '/auth/logout',
    refresh:  '/auth/refresh',
    me:       '/auth/me',
  },
  jobs: {
    list:       '/jobs',
    detail:     (id: string) => `/jobs/${id}`,
    similar:    (id: string) => `/jobs/${id}/similar`,
    recommend:  '/jobs/recommendations',
    analytics:  '/jobs/analytics',
    salary:     '/jobs/analytics/salary',
    trends:     '/jobs/analytics/trends',
  },
  users: {
    list:   '/admin/users',
    detail: (id: string) => `/admin/users/${id}`,
    update: (id: string) => `/admin/users/${id}`,
    delete: (id: string) => `/admin/users/${id}`,
  },
  offers: {
    list:     '/admin/offers',
    moderate: (id: string) => `/admin/offers/${id}/moderate`,
    delete:   (id: string) => `/admin/offers/${id}`,
  },
} as const
