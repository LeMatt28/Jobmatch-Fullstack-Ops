import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default:     'bg-primary-100 text-primary-600',
        secondary:   'bg-secondary-100 text-secondary-500',
        accent:      'bg-accent-100 text-accent-500',
        success:     'bg-[#D4F5E9] text-[#1A5C3A]',
        warning:     'bg-[#FFF0DB] text-[#7A4A00]',
        destructive: 'bg-red-100 text-red-600',
        outline:     'border border-border text-text-secondary bg-transparent',
        ghost:       'bg-muted text-text-secondary',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
