import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Briefcase, Users, Building2, LogOut, Sparkles, Settings } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const links = [
  { to: '/company/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { to: '/company/offer/new', icon: Briefcase, label: 'Mes offres' },
  { to: '/company/offer/1/matches', icon: Users, label: 'Candidats matchés' },
  { to: '/company/profile', icon: Building2, label: 'Mon profil' },
  { to: '/premium/company', icon: Sparkles, label: 'Premium', isPro: true },
]

export function SidebarCompany() {
  const { logout } = useAuth()

  return (
    <aside className="bg-brand-900 text-white flex flex-col min-h-screen sticky top-0 h-screen z-20 w-16 md:w-[220px] flex-shrink-0 transition-all">
      {/* Logo */}
      <div className="px-3 md:px-4 py-5 border-b border-brand-800 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center font-bold text-sm flex-shrink-0">JM</div>
        <span className="hidden md:block font-black text-lg tracking-tight">JobMatch</span>
      </div>

      <nav className="flex flex-col gap-1 p-2 flex-1">
        {links.map(({ to, icon: Icon, label, isPro }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive ? 'bg-brand-800 text-white' : 'text-brand-200 hover:bg-brand-800 hover:text-white'
              }`
            }
          >
            <span className="relative flex-shrink-0">
              <Icon className="w-5 h-5" />
            </span>
            <span className="hidden md:block">{label}</span>
            {isPro && (
              <span className="hidden md:inline-block ml-auto text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: '#C4834A' }}>
                PRO
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-2 border-t border-brand-800 space-y-1">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${isActive ? 'bg-brand-800 text-white' : 'text-brand-300 hover:bg-brand-800 hover:text-white'}`
          }
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          <span className="hidden md:block">Paramètres</span>
        </NavLink>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-brand-300 hover:bg-brand-800 hover:text-white transition w-full"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className="hidden md:block">Déconnexion</span>
        </button>
      </div>
    </aside>
  )
}
