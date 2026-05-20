import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Building2, Briefcase, Heart, CreditCard, LogOut } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const links = [
  { to: '/admin', icon: LayoutDashboard, label: 'Vue d\'ensemble', end: true },
  { to: '/admin/candidates', icon: Users, label: 'Candidats' },
  { to: '/admin/companies', icon: Building2, label: 'Entreprises' },
  { to: '/admin/offers', icon: Briefcase, label: 'Offres' },
  { to: '/admin/matches', icon: Heart, label: 'Matchs' },
  { to: '/admin/subscriptions', icon: CreditCard, label: 'Abonnements' },
]

export function AdminLayout({ children, title }) {
  const { logout } = useAuth()

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="bg-brand-900 text-white flex flex-col min-h-screen sticky top-0 h-screen z-20 w-[240px] flex-shrink-0">
        <div className="px-4 py-5 border-b border-brand-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center font-bold text-sm flex-shrink-0">JM</div>
          <span className="font-black text-lg tracking-tight">JobMatch</span>
          <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white">Admin</span>
        </div>

        <nav className="flex flex-col gap-1 p-2 flex-1">
          {links.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive ? 'bg-brand-800 text-white' : 'text-brand-200 hover:bg-brand-800 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-2 border-t border-brand-800">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-brand-300 hover:bg-brand-800 hover:text-white transition w-full"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Navbar top */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
          <h1 className="text-sm font-semibold text-gray-800">{title}</h1>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Connecté en tant qu'Admin</span>
            <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold">AD</div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
