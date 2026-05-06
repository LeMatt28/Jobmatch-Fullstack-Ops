import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Lock, User, LogOut } from 'lucide-react'
import { Navbar } from '../components/Navbar'
import { Button } from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'

function Toggle({ label, defaultOn = true }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-700">{label}</span>
      <button
        type="button"
        onClick={() => setOn((s) => !s)}
        className={`relative w-11 h-6 rounded-full transition-colors ${on ? 'bg-brand-600' : 'bg-gray-200'}`}
        role="switch" aria-checked={on}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  )
}

export default function Settings() {
  const { logout, role } = useAuth()
  const profilePath = role === 'candidate' ? '/candidate/profile' : '/company/profile'

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {role === 'candidate' && <Navbar />}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 pb-24 md:pb-8 pt-8">
        <h1 className="text-2xl font-bold text-brand-900 mb-8">Paramètres</h1>

        {/* Mon compte */}
        <section className="bg-white border border-brand-100 rounded-2xl shadow-sm p-6 mb-4">
          <h2 className="text-base font-semibold text-brand-900 flex items-center gap-2 mb-4">
            <User className="w-4 h-4" /> Mon compte
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-500">Nouvel email</label>
              <input type="email" placeholder="nouveau@email.fr" className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-500">Nouveau mot de passe</label>
              <input type="password" placeholder="••••••••" className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
            </div>
            <Button variant="secondary" className="self-start text-sm">Sauvegarder</Button>
          </div>
        </section>

        {/* Mon profil */}
        <section className="bg-white border border-brand-100 rounded-2xl shadow-sm p-6 mb-4">
          <h2 className="text-base font-semibold text-brand-900 flex items-center gap-2 mb-3">
            <Lock className="w-4 h-4" /> Mon profil
          </h2>
          <Link to={profilePath} className="text-sm text-brand-600 hover:underline font-medium">
            Voir et modifier mon profil →
          </Link>
        </section>

        {/* Notifications */}
        <section className="bg-white border border-brand-100 rounded-2xl shadow-sm p-6 mb-4">
          <h2 className="text-base font-semibold text-brand-900 flex items-center gap-2 mb-2">
            <Bell className="w-4 h-4" /> Notifications
          </h2>
          <div className="divide-y divide-gray-50">
            <Toggle label="Nouveaux matchs" />
            <Toggle label="Messages des entreprises" />
            <Toggle label="Nouvelles offres compatibles" defaultOn={false} />
            <Toggle label="Newsletter hebdomadaire" defaultOn={false} />
          </div>
        </section>

        {/* Danger zone */}
        <section className="bg-white border border-red-100 rounded-2xl shadow-sm p-6">
          <h2 className="text-base font-semibold text-red-600 flex items-center gap-2 mb-3">
            <LogOut className="w-4 h-4" /> Zone de danger
          </h2>
          <Button variant="danger" onClick={logout} className="flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Se déconnecter
          </Button>
        </section>
      </main>
    </div>
  )
}
