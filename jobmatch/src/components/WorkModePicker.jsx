import { Check } from 'lucide-react'

const MODES = [
  { value: 'remote', icon: '🏠', label: 'Full Remote' },
  { value: 'hybrid', icon: '⚡', label: 'Hybride' },
  { value: 'onsite', icon: '🏢', label: 'Sur place' },
]

export function WorkModePicker({ value, onChange, hybridDays = 2, onHybridDaysChange }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        {MODES.map(({ value: v, icon, label }) => {
          const active = value === v
          return (
            <button
              key={v}
              type="button"
              onClick={() => onChange(v)}
              className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition font-medium text-sm ${
                active
                  ? 'bg-brand-50 border-brand-600 text-brand-900'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-brand-300'
              }`}
            >
              {active && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-brand-600 text-white rounded-full flex items-center justify-center">
                  <Check className="w-2.5 h-2.5" />
                </span>
              )}
              <span className="text-2xl">{icon}</span>
              <span className={active ? 'text-brand-900' : 'text-gray-600'}>{label}</span>
            </button>
          )
        })}
      </div>
      {value === 'hybrid' && onHybridDaysChange && (
        <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
          <p className="text-sm font-medium text-brand-900 mb-2">
            Jours en présentiel : <span className="font-bold">{hybridDays} jour{hybridDays > 1 ? 's' : ''}/sem</span>
          </p>
          <input
            type="range"
            min={1}
            max={5}
            value={hybridDays}
            onChange={(e) => onHybridDaysChange(Number(e.target.value))}
            className="w-full accent-brand-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1 jour</span>
            <span>5 jours</span>
          </div>
        </div>
      )}
    </div>
  )
}
