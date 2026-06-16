import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

const variants = {
  primary:
    'bg-primary text-white hover:brightness-110 active:brightness-95',
  secondary:
    'liquid-glass-subtle dark:liquid-glass-dark text-on-surface hover:liquid-glass dark:hover:liquid-glass-dark-intense active:scale-[0.97]',
  ghost:
    'text-on-surface-variant hover:liquid-glass-subtle dark:hover:liquid-glass-dark active:scale-[0.97]',
  outline:
    'border border-outline-variant/50 dark:border-white/10 text-on-surface hover:liquid-glass-subtle dark:hover:liquid-glass-dark active:scale-[0.97]',
} as const

const sizes = {
  sm: 'h-9 px-5 text-sm',
  md: 'h-11 px-7 text-sm',
  lg: 'h-13 px-9 text-base',
  xl: 'h-14 px-10 text-base',
} as const

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'relative inline-flex items-center justify-center gap-2 rounded-full font-secondary font-medium transition-all duration-300 no-tap-highlight',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
          'cursor-pointer select-none',
          'active:scale-[0.97]',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
