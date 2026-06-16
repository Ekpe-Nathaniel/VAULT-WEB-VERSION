import { motion } from 'framer-motion'
import { LayoutDashboard } from 'lucide-react'

export function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24"
    >
      <div className="mx-auto max-w-lg">
        <div className="rounded-[28px] liquid-glass-intense dark:liquid-glass-dark-intense shadow-ambient-md p-8 sm:p-10 text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-container/50 dark:bg-primary/10 backdrop-blur-md">
            <LayoutDashboard className="h-7 w-7 text-primary" />
          </div>
          <h1 className="font-primary text-3xl font-semibold text-on-surface mb-3 tracking-tight">
            Dashboard
          </h1>
          <p className="text-on-surface-variant max-w-md mx-auto">
            Welcome to your vault. Your secure sanctuary is ready.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
