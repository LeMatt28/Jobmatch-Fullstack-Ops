import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils/cn'

export interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: React.ElementType
  iconColor?: string
  trend?: { value: number; label: string }
  className?: string
}

export function StatsCard({
  title, value, description, icon: Icon,
  iconColor = 'bg-primary-100 text-primary',
  trend, className,
}: StatsCardProps) {
  const isPositive = (trend?.value ?? 0) >= 0

  return (
    <Card className={cn('hover:shadow-card-hover transition-shadow', className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-secondary truncate">{title}</p>
            <p className="mt-1 text-2xl font-bold text-text-primary">{value}</p>
            {description && (
              <p className="mt-0.5 text-xs text-text-disabled">{description}</p>
            )}
            {trend && (
              <p className={cn('mt-1 flex items-center gap-1 text-xs font-medium', isPositive ? 'text-[#1A5C3A]' : 'text-destructive')}>
                {isPositive
                  ? <TrendingUp className="h-3 w-3" aria-hidden="true" />
                  : <TrendingDown className="h-3 w-3" aria-hidden="true" />}
                {isPositive ? '+' : ''}{trend.value}% {trend.label}
              </p>
            )}
          </div>
          <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', iconColor)}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
