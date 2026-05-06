import { NavLink, Link } from 'react-router-dom'
import { Flame, Heart, User, Settings, MessageCircle } from 'lucide-react'
import { mockConversations } from '../mocks/messages'

const links = [
  { to: '/candidate/feed', icon: Flame, label: 'Feed' },
  { to: '/candidate/matches', icon: Heart, label: 'Matchs' },
  { to: '/messages', icon: MessageCircle, label: 'Messages' },
  { to: '/candidate/profile', icon: User, label: 'Profil' },
  { to: '/settings', icon: Settings, label: 'Réglages' },
]

export function Navbar({ matchCount = 0 }) {
  const unreadMessages = mockConversations.reduce((s, c) => s + c.unreadCount, 0)

  return (
    <>
      {/* Desktop top nav */}
      <nav className="hidden md:flex sticky top-0 z-30 bg-white border-b border-warm-200 px-6 py-3 items-center justify-between">
        <span className="text-xl font-black text-brand-900 tracking-tight">JobMatch</span>
        <ul className="flex gap-1">
          {links.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
                    isActive ? 'bg-brand-50 text-brand-600' : 'text-gray-500 hover:bg-warm-100 hover:text-brand-600'
                  }`
                }
              >
                <span className="relative">
                  <Icon className="w-4 h-4" />
                  {to === '/messages' && unreadMessages > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                      {unreadMessages}
                    </span>
                  )}
                </span>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
        <Link
          to="/premium/candidate"
          className="text-xs font-bold text-white px-3 py-1.5 rounded-full hover:opacity-90 transition"
          style={{ background: '#C4834A' }}
        >
          Passer PRO
        </Link>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-warm-200 flex safe-area-pb">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-2.5 gap-1 text-xs font-medium transition relative ${
                isActive ? 'text-brand-600' : 'text-gray-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`relative ${isActive ? 'text-brand-600' : ''}`}>
                  <Icon className="w-5 h-5" />
                  {to === '/candidate/matches' && matchCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {matchCount}
                    </span>
                  )}
                  {to === '/messages' && unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {unreadMessages}
                    </span>
                  )}
                </div>
                <span>{label}</span>
                {isActive && <div className="absolute top-0 inset-x-0 h-0.5 bg-brand-600 rounded-b" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  )
}
