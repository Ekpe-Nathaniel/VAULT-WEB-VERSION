import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProcessingCardProps {
  progress: number
  currentStage: string
}

export function ProcessingCard({ progress, currentStage }: ProcessingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'rounded-[28px] p-8 sm:p-10 text-center',
        'liquid-glass-intense dark:liquid-glass-dark-intense',
        'shadow-ambient-lg'
      )}
    >
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-container/50 dark:bg-primary/10 backdrop-blur-md">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent dark:border-primary-container dark:border-t-transparent"
        />
      </div>

      <h3 className="font-primary text-xl font-semibold text-on-surface mb-2 tracking-tight">
        Processing Vault...
      </h3>

      <p className="text-sm text-on-surface-variant mb-6">{currentStage}</p>

      <div className="mx-auto max-w-xs">
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/40 dark:bg-white/5">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-primary-container"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <p className="mt-2 text-xs text-on-surface-variant font-medium">{progress}%</p>
      </div>
    </motion.div>
  )
}
