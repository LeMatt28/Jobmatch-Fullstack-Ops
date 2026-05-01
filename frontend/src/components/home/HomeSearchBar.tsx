'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'

export function HomeSearchBar() {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (location.trim()) params.set('location', location.trim())
    router.push(`/jobs${params.toString() ? `?${params}` : ''}`)
  }

  const handleTag = (tag: string) => {
    router.push(`/jobs?q=${encodeURIComponent(tag)}`)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form
        onSubmit={handleSubmit}
        role="search"
        aria-label="Recherche d'offres d'emploi"
        className="flex flex-col sm:flex-row gap-2 p-2 bg-surface rounded-xl border border-border shadow-card-hover"
      >
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-disabled pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Poste, compétence, entreprise…"
            aria-label="Intitulé du poste ou compétence"
            className={cn(
              'w-full h-11 rounded-lg pl-9 pr-4 text-sm bg-transparent border-0',
              'text-text-primary placeholder:text-text-disabled',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset'
            )}
          />
        </div>

        <div className="hidden sm:block w-px bg-border self-stretch my-1" aria-hidden="true" />

        <div className="relative flex-1">
          <MapPin
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-disabled pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ville, région, télétravail…"
            aria-label="Localisation"
            className={cn(
              'w-full h-11 rounded-lg pl-9 pr-4 text-sm bg-transparent border-0',
              'text-text-primary placeholder:text-text-disabled',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset'
            )}
          />
        </div>

        <Button type="submit" size="lg" className="shrink-0 px-6">
          <Search className="h-4 w-4" aria-hidden="true" />
          Rechercher
        </Button>
      </form>

      {/* Popular searches */}
      <div className="mt-4 flex flex-wrap items-center gap-2 justify-center">
        <span className="text-xs text-text-disabled">Populaire :</span>
        {['React', 'Python', 'Product Manager', 'UX Designer', 'DevOps', 'Data Scientist'].map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleTag(tag)}
            className="text-xs px-3 py-1 rounded-full bg-surface border border-border text-text-secondary hover:border-primary hover:text-primary transition-colors"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  )
}
