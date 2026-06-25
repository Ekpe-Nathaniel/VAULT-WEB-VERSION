import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, User, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { MobileDrawer } from '@/components/layout/MobileDrawer'
import { Button } from '@/components/ui/Button'

const navLinks = [
  { label: 'Embed', href: '/embed' },
  { label: 'Extract', href: '/extract' },
  { label: 'History', href: '/history' },
  { label: 'Settings', href: '/settings' },
]

export function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { pathname } = useLocation()
  const { isAuthenticated, logout } = useAuthStore()

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50',
          'liquid-glass dark:liquid-glass-dark',
          'border-b border-outline-variant/15 dark:border-white/[0.04]',
          'transition-all duration-500'
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <motion.a
              href="/"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2 no-tap-highlight"
            >
              <span className="font-primary text-xl font-semibold text-on-surface tracking-tight">
                Vault
              </span>
            </motion.a>

            {/* Desktop Navigation */}
            {isAuthenticated ? (
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map((link, i) => {
                  const isActive = pathname === link.href
                  return (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.06 + 0.1, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        to={link.href}
                        className={cn(
                          'rounded-full px-4 py-2 text-sm font-medium',
                          'transition-all duration-300 no-tap-highlight',
                          'active:scale-[0.95]',
                          isActive
                            ? 'text-primary bg-primary-container/50 dark:bg-primary/20 dark:text-primary-container backdrop-blur-md'
                            : 'text-on-surface-variant hover:text-on-surface hover:liquid-glass-subtle dark:hover:liquid-glass-dark'
                        )}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  )
                })}
              </nav>
            ) : (
              <nav className="hidden md:flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Log In</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </nav>
            )}

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <ThemeToggle />

              {isAuthenticated && (
                <>
                  <Link
                    to="/settings"
                    className="hidden md:flex h-9 w-9 items-center justify-center rounded-full liquid-glass-subtle dark:liquid-glass-dark text-on-surface-variant hover:text-primary transition-all duration-300 hover:brightness-110 active:scale-[0.92] no-tap-highlight"
                    aria-label="Profile"
                  >
                    <User className="h-4 w-4" />
                  </Link>
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    onClick={logout}
                    className={cn(
                      'hidden md:flex h-9 w-9 items-center justify-center rounded-full',
                      'liquid-glass-subtle dark:liquid-glass-dark',
                      'text-on-surface-variant hover:text-coral',
                      'transition-all duration-300 hover:brightness-110 active:scale-[0.92]',
                      'cursor-pointer no-tap-highlight'
                    )}
                    aria-label="Log out"
                  >
                    <LogOut className="h-4 w-4" />
                  </motion.button>

                  <button
                    onClick={() => setDrawerOpen(true)}
                    className="flex md:hidden h-9 w-9 items-center justify-center rounded-full liquid-glass-subtle dark:liquid-glass-dark transition-all duration-300 hover:brightness-110 active:scale-[0.92] cursor-pointer no-tap-highlight"
                    aria-label="Open menu"
                  >
                    <Menu className="h-5 w-5 text-on-surface-variant" />
                  </button>
                </>
              )}

              {!isAuthenticated && (
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="flex md:hidden h-9 w-9 items-center justify-center rounded-full liquid-glass-subtle dark:liquid-glass-dark transition-all duration-300 hover:brightness-110 active:scale-[0.92] cursor-pointer no-tap-highlight"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5 text-on-surface-variant" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        links={isAuthenticated ? navLinks : [{ label: 'Log In', href: '/login' }, { label: 'Sign Up', href: '/signup' }]}
      />
    </>
  )
}
