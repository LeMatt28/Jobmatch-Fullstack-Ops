export type AdminUserStatus = 'active' | 'suspended' | 'pending'
export type OfferModerationStatus = 'pending' | 'approved' | 'rejected'

export interface AdminUser {
  id: string
  firstName: string
  lastName: string
  email: string
  role: 'user' | 'admin'
  status: AdminUserStatus
  createdAt: string
  jobsViewed: number
  lastLogin?: string
}

export interface AdminOffer {
  id: string
  title: string
  company: string
  location: string
  contractType: string
  status: OfferModerationStatus
  source: string
  publishedAt: string
  reportCount: number
  reportReason?: string
}

export interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalOffers: number
  pendingModeration: number
  newUsersThisWeek: number
  offersThisWeek: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
