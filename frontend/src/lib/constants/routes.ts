export const ROUTES = {
  home:      '/',
  login:     '/login',
  register:  '/register',
  dashboard: '/dashboard',
  jobs:      '/jobs',
  jobDetail: (id: string) => `/jobs/${id}`,
  admin: {
    dashboard: '/admin/dashboard',
    users:     '/admin/users',
    offers:    '/admin/offers',
  },
} as const
