import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Lock, Palette, Database, HelpCircle, LogOut,
  Mail, Key, Trash2, Shield, Eye, EyeOff, ExternalLink, HardDrive,
  ChevronRight, Smartphone, Menu, X
} from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

/* ─── Sub-components ─── */

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={cn(
        'relative inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300',
        enabled ? 'bg-primary' : 'bg-on-surface-variant/30'
      )}
    >
      <span
        className={cn(
          'inline-block h-4 w-4 rounded-full bg-white shadow-ambient-sm transition-transform duration-300',
          enabled ? 'translate-x-5' : 'translate-x-1'
        )}
      />
    </button>
  )
}

function SettingRow({ icon: Icon, label, description, action, danger }: {
  icon: React.ElementType
  label: string
  description?: string
  action: React.ReactNode
  danger?: boolean
}) {
  return (
    <div className={cn(
      'flex items-center justify-between rounded-2xl px-5 py-4',
      'liquid-glass dark:liquid-glass-dark'
    )}>
      <div className="flex items-center gap-3 min-w-0">
        <Icon className={cn('h-5 w-5 shrink-0', danger ? 'text-coral' : 'text-on-surface-variant')} />
        <div className="space-y-0.5 min-w-0">
          <p className={cn('text-sm font-medium truncate', danger ? 'text-coral' : 'text-on-surface')}>{label}</p>
          {description && <p className="text-xs text-on-surface-variant truncate">{description}</p>}
        </div>
      </div>
      <div className="shrink-0 ml-3">{action}</div>
    </div>
  )
}

/* ─── Sidebar items ─── */

type SectionId = 'account' | 'privacy' | 'appearance' | 'storage' | 'help' | 'logout'

interface SidebarItem {
  id: SectionId
  label: string
  icon: React.ElementType
  danger?: boolean
}

const sidebarItems: SidebarItem[] = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'privacy', label: 'Privacy', icon: Lock },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'storage', label: 'Storage & Data', icon: Database },
  { id: 'help', label: 'Help & Feedback', icon: HelpCircle },
  { id: 'logout', label: 'Logout', icon: LogOut, danger: true },
]

/* ─── Section content components ─── */

function AccountContent() {
  const [twoFactor, setTwoFactor] = useState(false)
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-primary text-xl font-semibold text-on-surface tracking-tight mb-1">Account</h2>
        <p className="text-sm text-on-surface-variant">Your personal information and security</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="First Name" defaultValue="John" />
        <Input label="Last Name" defaultValue="Doe" />
      </div>
      <Input label="Email Address" defaultValue="john.doe@example.com" />
      <div className="flex justify-end">
        <Button size="sm">Save Changes</Button>
      </div>
      <div className="space-y-3">
        <SettingRow icon={Smartphone} label="Two-Step Verification" description="Add an extra layer of security" action={<Toggle enabled={twoFactor} onChange={setTwoFactor} />} />
        <SettingRow icon={Mail} label="Change Email Address" description="Update your account email" action={<Button variant="ghost" size="sm" className="text-primary">Update <ChevronRight className="h-3.5 w-3.5" /></Button>} />
        <SettingRow icon={Key} label="Change Password" description="Use a strong, unique password" action={<Button variant="ghost" size="sm" className="text-primary">Change <ChevronRight className="h-3.5 w-3.5" /></Button>} />
        <SettingRow icon={Trash2} label="Delete Account" description="Permanently remove your data" danger action={<Button variant="ghost" size="sm" className="text-coral">Delete</Button>} />
      </div>
    </div>
  )
}

function PrivacyContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-primary text-xl font-semibold text-on-surface tracking-tight mb-1">Privacy</h2>
        <p className="text-sm text-on-surface-variant">Your data stays yours</p>
      </div>
      <div className="space-y-3">
        <SettingRow icon={Shield} label="End-to-End Encryption" description="All data is encrypted before leaving your device" action={<span className="text-xs font-medium text-mint">Active</span>} />
        <SettingRow icon={EyeOff} label="Local-First Processing" description="Your secrets never reach our servers" action={<span className="text-xs font-medium text-primary">Enabled</span>} />
        <SettingRow icon={Eye} label="Clear Local Data" description="Remove all cached data from this device" action={<Button variant="ghost" size="sm" className="text-on-surface-variant">Clear</Button>} />
      </div>
    </div>
  )
}

function AppearanceContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-primary text-xl font-semibold text-on-surface tracking-tight mb-1">Appearance</h2>
        <p className="text-sm text-on-surface-variant">Customize how Vault looks</p>
      </div>
      <div className="space-y-3">
        <SettingRow icon={Palette} label="Theme" description="Toggle between light and dark mode" action={<ThemeToggle />} />
      </div>
    </div>
  )
}

function StorageContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-primary text-xl font-semibold text-on-surface tracking-tight mb-1">Storage & Data</h2>
        <p className="text-sm text-on-surface-variant">Manage your stored information</p>
      </div>
      <div className="space-y-3">
        <SettingRow icon={HardDrive} label="Manage Stored Data" description="View and manage your embedded files" action={<Button variant="ghost" size="sm" className="text-primary">Manage <ChevronRight className="h-3.5 w-3.5" /></Button>} />
        <SettingRow icon={Database} label="Export All Data" description="Download a backup of your data" action={<Button variant="ghost" size="sm" className="text-primary">Export</Button>} />
        <SettingRow icon={Trash2} label="Clear Cache" description="Free up space by removing temporary files" action={<Button variant="ghost" size="sm" className="text-on-surface-variant">Clear</Button>} />
      </div>
    </div>
  )
}

function HelpContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-primary text-xl font-semibold text-on-surface tracking-tight mb-1">Help & Feedback</h2>
        <p className="text-sm text-on-surface-variant">Resources and support</p>
      </div>
      <div className="space-y-3">
        <SettingRow icon={HelpCircle} label="Documentation" description="Learn how to use Vault" action={<Button variant="ghost" size="sm" className="text-primary">Open <ExternalLink className="h-3.5 w-3.5" /></Button>} />
        <SettingRow icon={HelpCircle} label="Report an Issue" description="Found a bug? Let us know" action={<Button variant="ghost" size="sm" className="text-primary">Report <ExternalLink className="h-3.5 w-3.5" /></Button>} />
        <SettingRow icon={HelpCircle} label="Version" description="Current app version" action={<span className="text-xs font-medium text-on-surface-variant">1.0.0</span>} />
      </div>
    </div>
  )
}

/* ─── Main component ─── */

export function Settings() {
  const { logout } = useAuthStore()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState<SectionId>('account')
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleSectionClick = (id: SectionId) => {
    if (id === 'logout') {
      handleLogout()
      return
    }
    setActiveSection(id)
    setMobileOpen(false)
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'account': return <AccountContent />
      case 'privacy': return <PrivacyContent />
      case 'appearance': return <AppearanceContent />
      case 'storage': return <StorageContent />
      case 'help': return <HelpContent />
      default: return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-24"
    >
      <div className="flex gap-8">
        {/* ─── Mobile sidebar toggle ─── */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex md:hidden fixed bottom-6 right-6 z-50 h-12 w-12 items-center justify-center rounded-full liquid-glass-intense dark:liquid-glass-dark-intense shadow-ambient-lg"
          aria-label="Toggle settings menu"
        >
          {mobileOpen ? <X className="h-5 w-5 text-on-surface" /> : <Menu className="h-5 w-5 text-on-surface" />}
        </button>

        {/* ─── Sidebar ─── */}
        <aside
          className={cn(
            'w-60 shrink-0 self-start sticky top-24',
            'hidden md:block'
          )}
        >
          <div className={cn(
            'rounded-[28px] p-5 space-y-5',
            'liquid-glass dark:liquid-glass-dark',
            'border border-outline-variant/15 dark:border-white/[0.04]',
          )}>
            <div className="space-y-1 px-1">
              <h1 className="font-primary text-xl font-semibold text-on-surface tracking-tight">Settings</h1>
              <p className="text-xs text-on-surface-variant">Manage your preferences</p>
            </div>
            <nav className="space-y-1">
              {sidebarItems.map((item) => {
                const isActive = activeSection === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSectionClick(item.id)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300',
                      'active:scale-[0.97] cursor-pointer no-tap-highlight',
                      isActive
                        ? 'text-primary bg-primary-container/50 dark:bg-primary/20 dark:text-primary-container backdrop-blur-md'
                        : item.danger
                          ? 'text-on-surface-variant hover:text-coral hover:liquid-glass-subtle dark:hover:liquid-glass-dark'
                          : 'text-on-surface-variant hover:text-on-surface hover:liquid-glass-subtle dark:hover:liquid-glass-dark'
                    )}
                  >
                    <item.icon className={cn('h-4 w-4', item.danger && isActive ? '' : '')} />
                    {item.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* ─── Mobile drawer ─── */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-40 bg-on-surface/20 backdrop-blur-sm md:hidden"
                onClick={() => setMobileOpen(false)}
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                className="fixed left-0 top-0 bottom-0 w-72 z-50 liquid-glass-intense dark:liquid-glass-dark-intense shadow-ambient-xl md:hidden"
              >
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="font-primary text-xl font-semibold text-on-surface tracking-tight">Settings</span>
                    <button onClick={() => setMobileOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full liquid-glass-subtle dark:liquid-glass-dark cursor-pointer" aria-label="Close menu">
                      <X className="h-5 w-5 text-on-surface-variant" />
                    </button>
                  </div>
                  <nav className="space-y-1">
                    {sidebarItems.map((item) => {
                      const isActive = activeSection === item.id
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSectionClick(item.id)}
                          className={cn(
                            'flex w-full items-center gap-3 rounded-full px-4 py-3 text-sm font-medium transition-all duration-300',
                            'active:scale-[0.97] cursor-pointer no-tap-highlight',
                            isActive
                              ? 'text-primary bg-primary-container/50 dark:bg-primary/20 dark:text-primary-container backdrop-blur-md'
                              : item.danger
                                ? 'text-on-surface-variant hover:text-coral'
                                : 'text-on-surface-variant hover:text-on-surface'
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </button>
                      )
                    })}
                  </nav>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* ─── Content panel ─── */}
        <div className="flex-1 min-w-0">
          <GlassCard variant="intense" className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  )
}
