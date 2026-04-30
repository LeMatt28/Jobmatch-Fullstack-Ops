'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, ArrowLeft, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils/cn'
import { useMessagesStore } from '@/features/messages/store/messagesStore'
import type { Conversation } from '@/features/messages/types/message.types'
import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns'
import { fr } from 'date-fns/locale'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(iso: string) {
  const d = new Date(iso)
  if (isToday(d))     return format(d, 'HH:mm')
  if (isYesterday(d)) return 'Hier'
  return format(d, 'dd MMM', { locale: fr })
}

function formatFullTime(iso: string) {
  return format(new Date(iso), "d MMMM 'à' HH:mm", { locale: fr })
}

function Avatar({ initials, size = 'md' }: { initials: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-12 w-12 text-base' }
  return (
    <div className={cn('flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-accent font-semibold text-white', sizes[size])}>
      {initials}
    </div>
  )
}

// ─── Conversation List ────────────────────────────────────────────────────────

function ConversationItem({
  conv, active, onClick,
}: {
  conv: Conversation
  active: boolean
  onClick: () => void
}) {
  const last = conv.messages[conv.messages.length - 1]

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors',
        'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary',
        active ? 'bg-primary-50 border-r-2 border-primary' : ''
      )}
    >
      <Avatar initials={conv.contact.initials} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className={cn('text-sm truncate', conv.unread > 0 ? 'font-semibold text-text-primary' : 'font-medium text-text-primary')}>
            {conv.contact.name}
          </span>
          <span className="text-xs text-text-disabled shrink-0">{last ? formatTime(last.sentAt) : ''}</span>
        </div>
        <p className="text-xs text-text-secondary truncate mb-0.5">{conv.subject}</p>
        <div className="flex items-center justify-between gap-2">
          <p className={cn('text-xs truncate', conv.unread > 0 ? 'text-text-primary font-medium' : 'text-text-disabled')}>
            {last ? (last.fromMe ? 'Vous : ' : '') + last.content : ''}
          </p>
          {conv.unread > 0 && (
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">
              {conv.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

// ─── Message Thread ───────────────────────────────────────────────────────────

function MessageThread({ conv }: { conv: Conversation }) {
  const { sendMessage } = useMessagesStore()
  const [draft, setDraft] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conv.messages.length])

  function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!draft.trim()) return
    sendMessage(conv.id, draft.trim())
    setDraft('')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Thread header */}
      <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-border shrink-0">
        <Avatar initials={conv.contact.initials} size="md" />
        <div>
          <p className="font-semibold text-text-primary text-sm">{conv.contact.name}</p>
          <p className="text-xs text-text-secondary">{conv.contact.title} · {conv.contact.company}</p>
        </div>
        <div className="ml-auto">
          <Badge variant="outline" className="text-xs">{conv.subject}</Badge>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
        {conv.messages.map((msg, i) => {
          const prevMsg = conv.messages[i - 1]
          const showDate = !prevMsg || new Date(msg.sentAt).toDateString() !== new Date(prevMsg.sentAt).toDateString()

          return (
            <React.Fragment key={msg.id}>
              {showDate && (
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 border-t border-border" />
                  <span className="text-xs text-text-disabled shrink-0">{formatFullTime(msg.sentAt)}</span>
                  <div className="flex-1 border-t border-border" />
                </div>
              )}
              <div className={cn('flex gap-2.5', msg.fromMe ? 'flex-row-reverse' : 'flex-row')}>
                {!msg.fromMe && <Avatar initials={conv.contact.initials} size="sm" />}
                <div className={cn(
                  'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm',
                  msg.fromMe
                    ? 'bg-primary text-white rounded-tr-sm'
                    : 'bg-muted text-text-primary rounded-tl-sm'
                )}>
                  <p className="leading-relaxed">{msg.content}</p>
                  <p className={cn('mt-1 text-[11px]', msg.fromMe ? 'text-primary-200 text-right' : 'text-text-disabled text-right')}>
                    {format(new Date(msg.sentAt), 'HH:mm')}
                  </p>
                </div>
              </div>
            </React.Fragment>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Compose */}
      <form onSubmit={handleSend} className="flex items-end gap-3 px-4 sm:px-6 py-4 border-t border-border shrink-0">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e) } }}
          placeholder="Écrivez votre message... (Entrée pour envoyer)"
          rows={1}
          className={cn(
            'flex-1 resize-none rounded-xl border border-border bg-surface px-4 py-2.5 text-sm',
            'text-text-primary placeholder:text-text-disabled',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'min-h-[44px] max-h-32 overflow-y-auto'
          )}
          style={{ height: 'auto' }}
          onInput={(e) => {
            const t = e.currentTarget
            t.style.height = 'auto'
            t.style.height = Math.min(t.scrollHeight, 128) + 'px'
          }}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!draft.trim()}
          aria-label="Envoyer"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyThread() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20 text-center px-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 mb-4">
        <MessageSquare className="h-8 w-8 text-primary" />
      </div>
      <p className="font-semibold text-text-primary mb-1">Sélectionnez une conversation</p>
      <p className="text-sm text-text-secondary">Choisissez une conversation dans la liste pour lire et répondre aux messages.</p>
    </div>
  )
}

// ─── Main Client ──────────────────────────────────────────────────────────────

export function MessagesClient() {
  const { conversations, selectedId, selectConversation } = useMessagesStore()
  const [mobileView, setMobileView] = useState<'list' | 'thread'>('list')

  const selected = conversations.find((c) => c.id === selectedId) ?? null
  const totalUnread = conversations.reduce((s, c) => s + c.unread, 0)

  function handleSelect(id: string) {
    selectConversation(id)
    setMobileView('thread')
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Messages</h1>
          <p className="mt-0.5 text-sm text-text-secondary">
            {totalUnread > 0
              ? `${totalUnread} message${totalUnread > 1 ? 's' : ''} non lu${totalUnread > 1 ? 's' : ''}`
              : `${conversations.length} conversation${conversations.length > 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {/* Two-panel layout */}
      <Card className="overflow-hidden border border-border" style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}>
        <div className="flex h-full">

          {/* Conversation list — always visible on desktop, toggled on mobile */}
          <aside
            className={cn(
              'w-full sm:w-80 lg:w-96 shrink-0 border-r border-border flex flex-col',
              'sm:flex', // always visible sm+
              mobileView === 'thread' ? 'hidden sm:flex' : 'flex'
            )}
          >
            <div className="px-4 py-3 border-b border-border shrink-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-disabled">
                Conversations
              </p>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-border">
              {conversations.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conv={conv}
                  active={conv.id === selectedId}
                  onClick={() => handleSelect(conv.id)}
                />
              ))}
            </div>
          </aside>

          {/* Thread panel */}
          <main
            className={cn(
              'flex-1 flex flex-col min-w-0',
              mobileView === 'list' ? 'hidden sm:flex' : 'flex'
            )}
          >
            {/* Mobile back button */}
            {mobileView === 'thread' && (
              <div className="flex items-center gap-2 px-4 py-2 border-b border-border sm:hidden shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileView('list')}
                  className="gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Retour
                </Button>
              </div>
            )}

            {selected ? <MessageThread conv={selected} /> : <EmptyThread />}
          </main>
        </div>
      </Card>
    </div>
  )
}

// Card helper (inline to avoid import issues)
function Card({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={cn('rounded-xl border border-border bg-surface shadow-card', className)} style={style}>
      {children}
    </div>
  )
}
