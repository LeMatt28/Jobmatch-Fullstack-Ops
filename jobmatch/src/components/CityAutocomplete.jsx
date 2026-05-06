import { useState, useRef, useEffect, useCallback } from 'react'
import { MapPin, Loader2 } from 'lucide-react'

const REMOTE_OPTION = { name: 'Toute la France', remote: true, displayLabel: '📍 Toute la France — Remote / Télétravail' }

function useDebounce(fn, delay) {
  const timer = useRef(null)
  return useCallback((...args) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => fn(...args), delay)
  }, [fn, delay])
}

async function fetchCities(query) {
  const res = await fetch(
    `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(query)}&fields=nom,departement,codesPostaux&boost=population&limit=8`
  )
  if (!res.ok) throw new Error('API error')
  const data = await res.json()
  return data.map((c) => ({
    name: c.nom,
    department: c.departement?.nom,
    postalCode: c.codesPostaux?.[0],
    displayLabel: `${c.nom} (${c.codesPostaux?.[0]}) — ${c.departement?.nom}`,
  }))
}

export function CityAutocomplete({ value, onChange, placeholder = 'Rechercher une ville...' }) {
  const [query, setQuery] = useState(value || '')
  const [open, setOpen] = useState(false)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const containerRef = useRef(null)

  const search = useCallback(async (q) => {
    if (q.length < 2) { setResults([]); setOpen(false); return }
    setLoading(true)
    setError(false)
    try {
      const cities = await fetchCities(q)
      setResults(cities)
      setOpen(true)
    } catch {
      setError(true)
      setResults([])
      setOpen(true)
    } finally {
      setLoading(false)
    }
  }, [])

  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    debouncedSearch(query)
  }, [query, debouncedSearch])

  useEffect(() => {
    const handleClick = (e) => {
      if (!containerRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') setOpen(false)
  }

  const select = (city) => {
    const label = city.remote ? 'Toute la France' : city.name
    setQuery(label)
    setOpen(false)
    onChange?.(label)
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); onChange?.(e.target.value) }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-9 pr-9 py-2.5 border border-warm-200 rounded-xl text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 bg-white"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin pointer-events-none" />
        )}
      </div>
      {open && (
        <ul className="absolute z-50 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
          {/* Option spéciale Toute la France */}
          <li>
            <button
              type="button"
              onMouseDown={() => select(REMOTE_OPTION)}
              className="w-full text-left px-4 py-2.5 hover:bg-brand-50 transition text-sm font-medium text-gray-900 border-b border-gray-100"
            >
              {REMOTE_OPTION.displayLabel}
            </button>
          </li>
          {error && (
            <li className="px-4 py-3 text-sm text-gray-500 italic">
              Service temporairement indisponible
            </li>
          )}
          {!error && results.length === 0 && query.length >= 2 && !loading && (
            <li className="px-4 py-3 text-sm text-gray-400 italic">
              Aucune ville trouvée pour cette recherche
            </li>
          )}
          {!error && results.map((city) => (
            <li key={`${city.postalCode}-${city.name}`}>
              <button
                type="button"
                onMouseDown={() => select(city)}
                className="w-full text-left px-4 py-2.5 hover:bg-brand-50 transition"
              >
                <span className="text-sm font-medium text-gray-900">{city.name}</span>
                <span className="text-sm text-gray-400"> ({city.postalCode})</span>
                {city.department && (
                  <span className="block text-xs text-gray-400">{city.department}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
