export interface Message {
  id: string
  content: string
  sentAt: string
  fromMe: boolean
}

export interface Conversation {
  id: string
  contact: {
    name: string
    initials: string
    title: string
    company: string
  }
  subject: string
  messages: Message[]
  unread: number
}
