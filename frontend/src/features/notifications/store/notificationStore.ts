import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Notification } from '../types/notification.types'

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'job',
    title: 'Nouvelle offre recommandée',
    message: 'Une offre de développeur React correspond à votre profil chez Contentsquare.',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    href: '/jobs',
  },
  {
    id: '2',
    type: 'success',
    title: 'Profil complété',
    message: 'Votre profil est maintenant complet. Les recommandations IA sont activées.',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    href: '/profile',
  },
  {
    id: '3',
    type: 'job',
    title: '5 nouvelles offres disponibles',
    message: 'Des offres en TypeScript/Node.js viennent d\'être publiées sur les plateformes agrégées.',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    href: '/jobs',
  },
  {
    id: '4',
    type: 'info',
    title: 'Bienvenue sur JobAggregator',
    message: 'Explorez plus de 12 000 offres agrégées depuis toutes les grandes plateformes.',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
]

interface NotificationStore {
  notifications: Notification[]
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  unreadCount: () => number
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: MOCK_NOTIFICATIONS,

      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      unreadCount: () => get().notifications.filter((n) => !n.read).length,
    }),
    {
      name: 'notifications-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ notifications: state.notifications }),
    }
  )
)
