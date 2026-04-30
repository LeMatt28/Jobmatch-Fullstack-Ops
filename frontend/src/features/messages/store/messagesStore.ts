import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Conversation, Message } from '../types/message.types'

const hoursAgo = (h: number) => new Date(Date.now() - h * 3600000).toISOString()
const daysAgo  = (d: number) => new Date(Date.now() - d * 86400000).toISOString()

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    contact: { name: 'Sophie Martin', initials: 'SM', title: 'Tech Recruiter', company: 'Contentsquare' },
    subject: 'Opportunité Développeur Frontend React',
    unread: 2,
    messages: [
      {
        id: 'm1-1',
        fromMe: false,
        content: 'Bonjour, j\'ai consulté votre profil sur LinkedIn et je pense que vous pourriez être un excellent candidat pour un poste de Développeur Frontend chez nous. Seriez-vous disponible pour un échange ?',
        sentAt: daysAgo(3),
      },
      {
        id: 'm1-2',
        fromMe: true,
        content: 'Bonjour Sophie, merci pour votre message ! Je suis effectivement intéressé par cette opportunité. Pouvez-vous me donner plus de détails sur le poste ?',
        sentAt: daysAgo(2),
      },
      {
        id: 'm1-3',
        fromMe: false,
        content: 'Bien sûr ! Il s\'agit d\'un CDI en full-remote avec une équipe de 12 développeurs. Stack : React, TypeScript, GraphQL. Salaire entre 55k et 70k selon expérience.',
        sentAt: daysAgo(2),
      },
      {
        id: 'm1-4',
        fromMe: false,
        content: 'Êtes-vous disponible pour un call de 30 min cette semaine ?',
        sentAt: hoursAgo(5),
      },
    ],
  },
  {
    id: 'conv-2',
    contact: { name: 'Thomas Dubois', initials: 'TD', title: 'Engineering Manager', company: 'Alan' },
    subject: 'Poste Lead Fullstack – Alan',
    unread: 0,
    messages: [
      {
        id: 'm2-1',
        fromMe: false,
        content: 'Bonjour, suite à votre candidature pour le poste de Lead Fullstack, nous avons étudié votre profil avec attention et souhaitons vous inviter à un entretien technique.',
        sentAt: daysAgo(7),
      },
      {
        id: 'm2-2',
        fromMe: true,
        content: 'Bonjour Thomas, c\'est avec plaisir que j\'accepte votre invitation ! Quelles sont les prochaines étapes du processus ?',
        sentAt: daysAgo(6),
      },
      {
        id: 'm2-3',
        fromMe: false,
        content: 'Super ! Nous vous proposerons un test technique à réaliser en 3h à domicile, suivi d\'un entretien avec l\'équipe. Je vous envoie le lien de calendly pour choisir un créneau.',
        sentAt: daysAgo(6),
      },
      {
        id: 'm2-4',
        fromMe: true,
        content: 'Parfait, j\'ai réservé le créneau jeudi 10h. À très vite !',
        sentAt: daysAgo(5),
      },
    ],
  },
  {
    id: 'conv-3',
    contact: { name: 'Camille Leroy', initials: 'CL', title: 'RH Recrutement', company: 'Qonto' },
    subject: 'Candidature – Lead Développeur TypeScript',
    unread: 1,
    messages: [
      {
        id: 'm3-1',
        fromMe: true,
        content: 'Bonjour, je souhaiterais postuler pour le poste de Lead Développeur TypeScript publié sur LinkedIn. J\'ai 5 ans d\'expérience sur des stacks similaires. Je serais ravi d\'en discuter.',
        sentAt: daysAgo(10),
      },
      {
        id: 'm3-2',
        fromMe: false,
        content: 'Bonjour, merci pour votre message et l\'intérêt que vous portez à Qonto ! Votre profil est très intéressant. Pouvez-vous nous envoyer votre CV et un lien vers vos réalisations ?',
        sentAt: daysAgo(9),
      },
      {
        id: 'm3-3',
        fromMe: true,
        content: 'Voici mon CV en pièce jointe et mon GitHub : github.com/monprofil. N\'hésitez pas si vous avez des questions !',
        sentAt: daysAgo(9),
      },
      {
        id: 'm3-4',
        fromMe: false,
        content: 'Merci beaucoup ! Nous reviendrons vers vous dans les 48h. Bonne journée !',
        sentAt: hoursAgo(2),
      },
    ],
  },
]

interface MessagesStore {
  conversations: Conversation[]
  selectedId: string | null
  selectConversation: (id: string) => void
  sendMessage: (conversationId: string, content: string) => void
  markAsRead: (conversationId: string) => void
  totalUnread: () => number
}

export const useMessagesStore = create<MessagesStore>()(
  persist(
    (set, get) => ({
      conversations: MOCK_CONVERSATIONS,
      selectedId: null,

      selectConversation: (id) => {
        set({ selectedId: id })
        get().markAsRead(id)
      },

      markAsRead: (conversationId) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId ? { ...c, unread: 0 } : c
          ),
        })),

      sendMessage: (conversationId, content) => {
        const msg: Message = {
          id: `msg-${Date.now()}`,
          content,
          fromMe: true,
          sentAt: new Date().toISOString(),
        }
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? { ...c, messages: [...c.messages, msg] }
              : c
          ),
        }))
      },

      totalUnread: () =>
        get().conversations.reduce((sum, c) => sum + c.unread, 0),
    }),
    {
      name: 'messages-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
