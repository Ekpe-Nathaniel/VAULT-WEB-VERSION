import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline'
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, children, variant = 'default', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide',
          variant === 'default' &&
            'bg-primary-container/70 dark:bg-primary/20 text-primary dark:text-primary-container backdrop-blur-md',
          variant === 'outline' &&
            'border border-outline-variant/40 dark:border-white/10 text-on-surface-variant backdrop-blur-sm',
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'
