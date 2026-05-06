import { useState } from 'react'

export function TagInput({ value = [], onChange, placeholder = 'Ajouter...', suggestions = [] }) {
  const [input, setInput] = useState('')

  const add = (tag) => {
    const clean = tag.trim()
    if (clean && !value.includes(clean)) onChange([...value, clean])
    setInput('')
  }

  const remove = (tag) => onChange(value.filter((t) => t !== tag))

  const onKey = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault()
      add(input)
    }
    if (e.key === 'Backspace' && !input && value.length > 0) {
      remove(value[value.length - 1])
    }
  }

  const unusedSuggestions = suggestions.filter((s) => !value.includes(s))

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2 border border-gray-200 rounded-xl px-3 py-2 min-h-[44px] focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100 bg-white">
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 bg-brand-100 text-brand-800 rounded-full text-xs px-3 py-1 font-medium">
            {tag}
            <button
              type="button"
              onClick={() => remove(tag)}
              className="ml-0.5 hover:text-brand-900 focus-visible:outline-none"
              aria-label={`Supprimer ${tag}`}
            >×</button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[80px] outline-none text-sm bg-transparent placeholder:text-gray-400"
        />
      </div>
      {unusedSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {unusedSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className="text-xs px-3 py-1 rounded-full border border-brand-200 text-brand-600 hover:bg-brand-50 transition"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
