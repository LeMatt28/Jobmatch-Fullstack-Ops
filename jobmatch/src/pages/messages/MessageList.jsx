import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { Navbar } from '../../components/Navbar'
import { SidebarCompany } from '../../components/SidebarCompany'
import { useAuth } from '../../hooks/useAuth'
import { mockConversations } from '../../mocks/messages'
import { timeAgo } from '../../utils/formatDate'

function ConversationItem({ conv, onClick }) {
  const initials = conv.contact.name?.slice(0, 2).toUpperCase()
  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-start gap-3 p-4 hover:bg-warm-50 transition border-b border-gray-100 last:border-0"
    >
      <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="font-semibold text-gray-900 text-sm truncate">{conv.offer.company}</p>
          <span className="text-xs text-gray-400 flex-shrink-0">{timeAgo(conv.lastMessage.createdAt)}</span>
        </div>
        <p className="text-xs text-gray-500 truncate">{conv.offer.title}</p>
        <p className="text-xs text-gray-400 truncate mt-0.5 italic">
          {conv.lastMessage.senderId === 'candidate' ? 'Vous : ' : ''}
          {conv.lastMessage.content}
        </p>
      </div>
      {conv.unreadCount > 0 && (
        <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          {conv.unreadCount}
        </span>
      )}
    </button>
  )
}

export default function MessageList() {
  const { role } = useAuth()
  const navigate = useNavigate()
  const conversations = [...mockConversations].sort(
    (a, b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
  )
  const totalUnread = conversations.reduce((s, c) => s + c.unreadCount, 0)

  const content = (
    <main className="flex-1 max-w-2xl mx-auto w-full px-4 pb-24 md:pb-8 pt-8">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-brand-900">Messages</h1>
        {totalUnread > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {totalUnread} non lu{totalUnread > 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="bg-white border border-warm-200 rounded-2xl overflow-hidden shadow-sm">
        {conversations.length === 0 ? (
          <div className="text-center py-16 px-6">
            <MessageCircle className="w-12 h-12 text-brand-200 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-brand-900 mb-2">Pas encore de conversations</h2>
            <p className="text-sm text-gray-500">Commencez par matcher avec des offres !</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <ConversationItem
              key={conv.matchId}
              conv={conv}
              onClick={() => navigate(`/messages/${conv.matchId}`)}
            />
          ))
        )}
      </div>
    </main>
  )

  if (role === 'company') {
    return (
      <div className="flex min-h-screen bg-warm-50">
        <SidebarCompany />
        <div className="flex-1 flex flex-col">{content}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col">
      <Navbar />
      {content}
    </div>
  )
}
