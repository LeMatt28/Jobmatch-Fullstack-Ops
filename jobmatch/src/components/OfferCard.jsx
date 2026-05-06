import { MapPin, Clock, Wifi } from 'lucide-react'
import { ScoreBadge } from './ScoreBadge'
import { TagList } from './TagList'
import { formatSalary } from '../utils/formatDate'

function CompanyAvatar({ name, size = 'md' }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm' }
  return (
    <div className={`${sizes[size]} rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold flex-shrink-0`}>
      {name?.slice(0, 2).toUpperCase()}
    </div>
  )
}

export function OfferCard({ offer, onClick, compact = false }) {
  const salary = formatSalary(offer.salaryMin, offer.salaryMax)

  if (compact) {
    return (
      <div
        role="article"
        aria-label={offer.title}
        onClick={onClick}
        className={`bg-white border border-brand-100 rounded-2xl p-4 shadow-sm flex gap-3 items-start ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      >
        <CompanyAvatar name={offer.company.name} size="sm" />
        <div className="min-w-0">
          <p className="font-semibold text-brand-900 text-sm truncate">{offer.title}</p>
          <p className="text-xs text-gray-500">{offer.company.name} · {offer.location}</p>
          {salary && <p className="text-xs text-brand-600 font-medium mt-0.5">{salary}</p>}
        </div>
        <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 font-medium whitespace-nowrap">{offer.contractType}</span>
      </div>
    )
  }

  return (
    <div
      role="article"
      aria-label={offer.title}
      onClick={onClick}
      className={`bg-white border border-brand-100 rounded-2xl p-5 shadow-sm flex flex-col gap-4 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
    >
      <div className="flex gap-3 items-start">
        <CompanyAvatar name={offer.company.name} />
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-brand-900 text-base leading-tight">{offer.title}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{offer.company.name}</p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 font-medium">{offer.contractType}</span>
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{offer.location}</span>
        {offer.remote && <span className="flex items-center gap-1 text-brand-600"><Wifi className="w-3 h-3" />Remote</span>}
        {salary && <span className="font-medium text-gray-700">{salary}/an</span>}
      </div>

      {offer.description && (
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{offer.description}</p>
      )}

      <div className="flex flex-wrap gap-2">
        {offer.stack?.slice(0, 4).map((s) => (
          <span key={s} className="text-xs px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 font-medium">{s}</span>
        ))}
        {offer.stack?.length > 4 && (
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500">+{offer.stack.length - 4}</span>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Score entreprise</span>
          <ScoreBadge score={offer.company.score} size="sm" />
        </div>
      </div>
    </div>
  )
}
