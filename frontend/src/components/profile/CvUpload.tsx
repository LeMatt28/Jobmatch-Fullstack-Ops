'use client'

import React, { useRef, useState } from 'react'
import { Upload, FileText, Eye, Download, Trash2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'
import { useProfileStore } from '@/features/profile/store/profileStore'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const MAX_SIZE = 5 * 1024 * 1024 // 5 Mo

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

function openPdf(data: string) {
  const binary = atob(data.split(',')[1])
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  const blob = new Blob([bytes], { type: 'application/pdf' })
  window.open(URL.createObjectURL(blob), '_blank')
}

function downloadPdf(data: string, name: string) {
  const a = document.createElement('a')
  a.href = data
  a.download = name
  a.click()
}

export function CvUpload() {
  const { profile, update } = useProfileStore()
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const cv = profile.cv

  function processFile(file: File) {
    setError(null)
    if (file.type !== 'application/pdf') {
      setError('Seuls les fichiers PDF sont acceptés.')
      return
    }
    if (file.size > MAX_SIZE) {
      setError(`Le fichier dépasse la limite de ${formatSize(MAX_SIZE)}.`)
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = e.target?.result as string
      try {
        update({
          cv: { name: file.name, size: file.size, uploadedAt: new Date().toISOString(), data },
        })
      } catch {
        setError('Espace de stockage insuffisant. Essayez un fichier plus léger.')
      }
    }
    reader.readAsDataURL(file)
  }

  if (cv) {
    return (
      <div className="flex items-center gap-4 rounded-xl border border-border bg-muted/40 p-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50">
          <FileText className="h-6 w-6 text-red-500" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-text-primary">{cv.name}</p>
          <p className="mt-0.5 text-xs text-text-disabled">
            {formatSize(cv.size)} · Ajouté le {format(new Date(cv.uploadedAt), 'd MMMM yyyy', { locale: fr })}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost" size="icon-sm"
            onClick={() => openPdf(cv.data)}
            aria-label="Voir le CV"
            title="Aperçu"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost" size="icon-sm"
            onClick={() => downloadPdf(cv.data, cv.name)}
            aria-label="Télécharger le CV"
            title="Télécharger"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost" size="icon-sm"
            onClick={() => update({ cv: null })}
            aria-label="Supprimer le CV"
            title="Supprimer"
            className="text-destructive hover:text-destructive hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f) }}
        className="sr-only"
        aria-label="Choisir un fichier PDF"
      />

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false) }}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          const f = e.dataTransfer.files[0]
          if (f) processFile(f)
        }}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-all duration-150',
          'hover:border-primary hover:bg-primary-50/30',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          dragging
            ? 'scale-[1.01] border-primary bg-primary-50/50'
            : 'border-border'
        )}
        aria-label="Zone de dépôt pour votre CV PDF"
      >
        <div className={cn(
          'flex h-14 w-14 items-center justify-center rounded-2xl transition-colors',
          dragging ? 'bg-primary text-white' : 'bg-primary-50'
        )}>
          <Upload className={cn('h-7 w-7', dragging ? 'text-white' : 'text-primary')} />
        </div>

        <div className="text-center">
          <p className="text-sm font-semibold text-text-primary">
            {dragging ? 'Déposez votre CV ici' : 'Glissez-déposez votre CV'}
          </p>
          <p className="mt-1 text-xs text-text-secondary">
            ou <span className="font-medium text-primary">cliquez pour parcourir</span>
          </p>
          <p className="mt-1.5 text-xs text-text-disabled">PDF uniquement · 5 Mo maximum</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-destructive">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </div>
      )}
    </div>
  )
}
