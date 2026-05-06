import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Building2, Users, Calendar, Globe } from 'lucide-react'
import { Navbar } from '../../components/Navbar'
import { ScoreBadge } from '../../components/ScoreBadge'
import { TagList } from '../../components/TagList'
import { OfferCard } from '../../components/OfferCard'
import { Spinner } from '../../components/ui/Spinner'
import { getCompanyById } from '../../services/companyService'
import { mockOffers } from '../../mocks/offers'

export default function CompanyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCompanyById(id).then(setCompany).finally(() => setLoading(false))
  }, [id])

  const companyOffers = mockOffers.filter((o) => o.company.id === id)

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center"><Spinner size="lg" /></div>
    </div>
  )

  if (!company) return null

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 pb-24 md:pb-8 pt-8">
        <button onClick={() => navigate(-1)} className="text-sm text-brand-600 hover:underline mb-6 flex items-center gap-1">
          ← Retour
        </button>

        {/* Header */}
        <div className="bg-white border border-brand-100 rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex gap-5 items-start">
            <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
              {company.name?.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-brand-900">{company.name}</h1>
              <p className="text-gray-500 text-sm">{company.sector}</p>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Users className="w-4 h-4" />{company.employees} employés</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />Fondée en {company.founded}</span>
                <span className="flex items-center gap-1"><Building2 className="w-4 h-4" />{company.location}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <p className="text-xs text-gray-400">Score fiabilité</p>
              <ScoreBadge score={company.score} size="md" />
            </div>
          </div>
        </div>

        {/* Description */}
        <section className="bg-white border border-brand-100 rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-brand-900 mb-3">À propos</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{company.description}</p>
        </section>

        {/* Values */}
        {company.values?.length > 0 && (
          <section className="bg-white border border-brand-100 rounded-2xl p-6 shadow-sm mb-6">
            <h2 className="text-lg font-semibold text-brand-900 mb-3">Nos valeurs</h2>
            <TagList tags={company.values} color="brand" />
          </section>
        )}

        {/* Active offers */}
        {companyOffers.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-brand-900 mb-4">Offres actives ({companyOffers.length})</h2>
            <div className="flex flex-col gap-3">
              {companyOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
