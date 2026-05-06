import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Send, Paperclip, ArrowLeft, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Navbar } from '../../components/Navbar'
import { SidebarCompany } from '../../components/SidebarCompany'
import { useAuth } from '../../hooks/useAuth'
import { mockConversations } from '../../mocks/messages'
import { timeAgo } from '../../utils/formatDate'

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

function formatDateLabel(iso) {
  const d = new Date(iso)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  if (d.toDateString() === today.toDateString()) return "Aujourd'hui"
  if (d.toDateString() === yesterday.toDateString()) return 'Hier'
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
}

function groupByDate(messages) {
  const groups = []
  let currentDate = null
  let currentGroup = null
  for (const msg of messages) {
    const label = formatDateLabel(msg.createdAt)
    if (label !== currentDate) {
      currentDate = label
      currentGroup = { label, messages: [] }
      groups.push(currentGroup)
    }
    currentGroup.messages.push(msg)
  }
  return groups
}

function IAMessage({ msg }) {
  return (
    <div className="flex justify-center my-4">
      <div className="max-w-md bg-brand-50 border border-brand-100 text-brand-800 rounded-xl px-4 py-3 text-center">
        <p className="text-xs font-semibold text-brand-500 mb-1">✨ Message généré par JobMatch IA</p>
        <p className="text-sm italic leading-relaxed">"{msg.content}"</p>
        <p className="text-xs text-brand-400 mt-1">Généré automatiquement au moment du match</p>
      </div>
    </div>
  )
}

function ConversationSidebar({ conversations, activeId, onSelect, onClose }) {
  return (
    <div className="w-80 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col h-full">
      <div className="px-4 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-semibold text-brand-900">Conversations</h2>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv) => {
          const active = conv.matchId === activeId
          return (
            <button
              key={conv.matchId}
              onClick={() => onSelect(conv.matchId)}
              className={`w-full text-left flex items-start gap-3 p-3 transition border-b border-gray-50 ${active ? 'bg-brand-50' : 'hover:bg-warm-50'}`}
            >
              <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                {conv.contact.name?.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{conv.offer.company}</p>
                <p className="text-xs text-gray-400 truncate">{conv.lastMessage.content}</p>
              </div>
              {conv.unreadCount > 0 && (
                <span className="w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center flex-shrink-0">
                  {conv.unreadCount}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function Conversation() {
  const { matchId } = useParams()
  const navigate = useNavigate()
  const { role } = useAuth()
  const [text, setText] = useState('')
  const [messages, setMessages] = useState([])
  const [showSidebar, setShowSidebar] = useState(true)
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const messagesEndRef = useRef(null)

  const conv = mockConversations.find((c) => c.matchId === matchId)

  useEffect(() => {
    if (conv) setMessages(conv.messages)
  }, [matchId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: 'candidate',
      content: trimmed,
      createdAt: new Date().toISOString(),
      read: false,
    }
    setMessages((prev) => [...prev, newMsg])
    setText('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!conv) {
    return (
      <div className="min-h-screen bg-warm-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Conversation introuvable.</p>
          <button onClick={() => navigate('/messages')} className="text-brand-600 hover:underline text-sm">
            ← Retour aux messages
          </button>
        </div>
      </div>
    )
  }

  const grouped = groupByDate(messages)

  const chatPanel = (
    <div className="flex-1 flex flex-col min-h-0 bg-warm-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate('/messages')}
          className="text-gray-400 hover:text-gray-600 transition md:hidden"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-9 h-9 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
          {conv.contact.name?.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-brand-900 text-sm">{conv.contact.name}</p>
          <p className="text-xs text-gray-400 truncate">{conv.offer.title} · {conv.offer.company}</p>
        </div>
        <Link
          to={`/company/${conv.offer.id}`}
          className="text-xs text-brand-600 hover:underline hidden md:block flex-shrink-0"
        >
          Voir l'offre →
        </Link>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {grouped.map((group) => (
          <div key={group.label}>
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">{group.label}</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            {group.messages.map((msg) => {
              if (msg.type === 'ia_intro') return <IAMessage key={msg.id} msg={msg} />
              const isCandidate = msg.senderId === 'candidate'
              return (
                <div key={msg.id} className={`flex ${isCandidate ? 'justify-end' : 'justify-start'} mb-2`}>
                  {!isCandidate && (
                    <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0 mt-1">
                      {conv.contact.name?.slice(0, 1)}
                    </div>
                  )}
                  <div className={`max-w-xs lg:max-w-sm ${isCandidate ? 'items-end' : 'items-start'} flex flex-col`}>
                    <div className={`px-4 py-2.5 text-sm leading-relaxed ${
                      isCandidate
                        ? 'bg-brand-600 text-white rounded-2xl rounded-tr-sm'
                        : 'bg-white text-gray-900 rounded-2xl rounded-tl-sm border border-gray-100'
                    }`}>
                      {msg.content}
                    </div>
                    <span className={`text-[10px] mt-1 ${isCandidate ? 'text-gray-400 text-right' : 'text-gray-400'}`}>
                      {formatTime(msg.createdAt)}
                      {isCandidate && ' ✓✓'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-100 px-4 py-3">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 500))}
              onKeyDown={handleKeyDown}
              placeholder="Écrivez votre message..."
              rows={1}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 resize-none"
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
            {text.length > 400 && (
              <span className="absolute bottom-2 right-3 text-[10px] text-gray-400">{text.length}/500</span>
            )}
          </div>
          <button
            onClick={sendMessage}
            disabled={!text.trim()}
            className="w-10 h-10 bg-brand-600 text-white rounded-xl flex items-center justify-center hover:bg-brand-800 transition disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-1.5 relative inline-block">
          <button
            type="button"
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-500 transition"
            onMouseEnter={() => setTooltipVisible(true)}
            onMouseLeave={() => setTooltipVisible(false)}
          >
            <Paperclip className="w-3 h-3" />
            Pièce jointe
          </button>
          <AnimatePresence>
            {tooltipVisible && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="absolute bottom-full left-0 mb-1 bg-gray-800 text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap"
              >
                Bientôt disponible
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )

  const layout = (
    <div className="flex h-screen bg-warm-50">
      <div className="hidden md:flex">{showSidebar && (
        <ConversationSidebar
          conversations={mockConversations}
          activeId={matchId}
          onSelect={(id) => navigate(`/messages/${id}`)}
        />
      )}</div>
      {chatPanel}
    </div>
  )

  if (role === 'company') {
    return (
      <div className="flex min-h-screen">
        <SidebarCompany />
        <div className="flex-1 flex flex-col min-h-0">
          {layout}
        </div>
      </div>
    )
  }

  return layout
}
