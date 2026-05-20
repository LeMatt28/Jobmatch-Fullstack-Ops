import { AdminLayout } from './AdminLayout'
import { AdminStatCard } from '../../components/admin/AdminStatCard'
import { AdminBarChart } from '../../components/admin/AdminBarChart'

const weekData = [
  { label: 'Lun', value: 18 },
  { label: 'Mar', value: 24 },
  { label: 'Mer', value: 15 },
  { label: 'Jeu', value: 31 },
  { label: 'Ven', value: 27 },
  { label: 'Sam', value: 8 },
  { label: 'Dim', value: 5 },
]

const weekCompanies = [
  { label: 'Lun', value: 3 },
  { label: 'Mar', value: 5 },
  { label: 'Mer', value: 2 },
  { label: 'Jeu', value: 7 },
  { label: 'Ven', value: 4 },
  { label: 'Sam', value: 1 },
  { label: 'Dim', value: 0 },
]

const matchesData = [
  { label: 'Lun', value: 42 },
  { label: 'Mar', value: 67 },
  { label: 'Mer', value: 38 },
  { label: 'Jeu', value: 91 },
  { label: 'Ven', value: 74 },
  { label: 'Sam', value: 21 },
  { label: 'Dim', value: 14 },
]

const recentSignups = [
  { type: 'Candidat', name: 'Hugo Moreau', email: 'hugo.moreau@gmail.com', date: '20 mai 2025', status: 'Actif' },
  { type: 'Entreprise', name: 'FinTech Solutions', email: 'contact@fintech.com', date: '19 mai 2025', status: 'Actif' },
  { type: 'Candidat', name: 'Julie Petit', email: 'julie.petit@email.com', date: '19 mai 2025', status: 'Actif' },
  { type: 'Candidat', name: 'Nicolas Blanc', email: 'n.blanc@yahoo.fr', date: '18 mai 2025', status: 'Inactif' },
  { type: 'Entreprise', name: 'DataViz', email: 'rh@dataviz.fr', date: '17 mai 2025', status: 'Actif' },
]

export default function AdminDashboard() {
  return (
    <AdminLayout title="Vue d'ensemble">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4">
          <AdminStatCard value="1 284" label="Candidats inscrits" delta="+12 ce mois" />
          <AdminStatCard value="312" label="Entreprises inscrites" delta="+4 ce mois" />
          <AdminStatCard value="847" label="Offres actives" />
          <AdminStatCard value="68" label="Abonnements PRO actifs" delta="+8 ce mois" />
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-2 gap-4">
          <AdminBarChart
            title="Inscriptions cette semaine"
            data={weekData}
            color="bg-brand-600"
            secondaryData={weekCompanies}
            secondaryColor="bg-amber-400"
            legend={[
              { label: 'Candidats', color: 'bg-brand-600' },
              { label: 'Entreprises', color: 'bg-amber-400' },
            ]}
          />
          <AdminBarChart
            title="Matchs par jour"
            data={matchesData}
            color="bg-emerald-500"
          />
        </div>

        {/* Dernières inscriptions */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-700">Dernières inscriptions</p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-100">
                <th className="px-6 py-3 text-left font-medium">Type</th>
                <th className="px-6 py-3 text-left font-medium">Nom</th>
                <th className="px-6 py-3 text-left font-medium">Email</th>
                <th className="px-6 py-3 text-left font-medium">Date</th>
                <th className="px-6 py-3 text-left font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {recentSignups.map((row, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition">
                  <td className="px-6 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${row.type === 'Candidat' ? 'bg-brand-50 text-brand-700' : 'bg-amber-50 text-amber-700'}`}>
                      {row.type}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-800">{row.name}</td>
                  <td className="px-6 py-3 text-sm text-gray-500">{row.email}</td>
                  <td className="px-6 py-3 text-sm text-gray-400">{row.date}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${row.status === 'Actif' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
