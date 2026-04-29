import React from 'react'
import { SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'

export interface EmptyStateProps {
  title?: string
  description?: string
  icon?: React.ElementType
  action?: { label: string; onClick: () => void }
  className?: string
}

export function EmptyState({
  title = 'Aucun résultat',
  description = 'Essayez de modifier vos critères de recherche.',
  icon: Icon = SearchX,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <Icon className="h-8 w-8 text-text-disabled" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-text-secondary">{description}</p>
      {action && (
        <Button variant="secondary" className="mt-6" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
