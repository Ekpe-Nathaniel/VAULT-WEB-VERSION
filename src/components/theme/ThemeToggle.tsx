import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'
import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative flex h-9 w-9 items-center justify-center rounded-full',
        'liquid-glass-subtle dark:liquid-glass-dark',
        'text-on-surface-variant hover:text-on-surface',
        'transition-all duration-300 hover:brightness-110 active:scale-[0.92]',
        'cursor-pointer no-tap-highlight',
        className
      )}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <Sun
        className={cn(
          'h-4 w-4 absolute transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
          theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-75'
        )}
      />
      <Moon
        className={cn(
          'h-4 w-4 absolute transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
          theme === 'light' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'
        )}
      />
    </button>
  )
}
