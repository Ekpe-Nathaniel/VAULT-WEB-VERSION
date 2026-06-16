import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'section' | 'article'
  variant?: 'default' | 'intense' | 'subtle'
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, as: Tag = 'div', variant = 'default', ...props }, ref) => {
    return (
      <Tag
        ref={ref}
        className={cn(
          'rounded-[28px]',
          variant === 'default' && 'liquid-glass dark:liquid-glass-dark',
          variant === 'intense' && 'liquid-glass-intense dark:liquid-glass-dark-intense',
          variant === 'subtle' && 'liquid-glass-subtle dark:liquid-glass-dark',
          'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
          'hover:brightness-[1.02]',
          className
        )}
        {...props}
      >
        {children}
      </Tag>
    )
  }
)

GlassCard.displayName = 'GlassCard'
