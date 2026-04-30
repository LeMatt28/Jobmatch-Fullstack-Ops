export type NotificationType = 'job' | 'info' | 'success' | 'warning'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  createdAt: string
  href?: string
}
