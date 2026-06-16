import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavLink {
  label: string
  href: string
}

interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
  links: NavLink[]
}

export function MobileDrawer({ isOpen, onClose, links }: MobileDrawerProps) {
  const { pathname } = useLocation()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-on-surface/8 z-40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.nav
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className={cn(
              'fixed right-0 top-0 bottom-0 w-80 z-50',
              'liquid-glass-intense dark:liquid-glass-dark-intense',
              'shadow-ambient-xl'
            )}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="flex items-center justify-between p-6">
              <span className="font-primary text-xl font-semibold text-on-surface tracking-tight">
                Vault
              </span>
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full liquid-glass-subtle dark:liquid-glass-dark transition-all duration-300 hover:brightness-110 active:scale-[0.92] cursor-pointer"
                aria-label="Close menu"
              >
                <X className="h-5 w-5 text-on-surface-variant" />
              </button>
            </div>
            <div className="px-4 space-y-1">
              {links.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={onClose}
                    className={cn(
                      'block rounded-full px-4 py-3 transition-all duration-300 font-secondary text-sm font-medium',
                      'active:scale-[0.97]',
                      isActive
                        ? 'text-primary bg-primary-container/50 dark:bg-primary/20 dark:text-primary-container backdrop-blur-md'
                        : 'text-on-surface-variant hover:text-on-surface hover:liquid-glass-subtle dark:hover:liquid-glass-dark'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  )
}
