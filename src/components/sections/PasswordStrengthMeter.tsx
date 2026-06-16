import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PasswordStrengthMeterProps {
  password: string
}

function getStrength(password: string): { score: number; label: string; color: string; barColor: string } {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++

  if (score <= 1) return { score, label: 'Weak', color: 'text-coral', barColor: 'bg-coral' }
  if (score <= 2) return { score, label: 'Fair', color: 'text-orange-400', barColor: 'bg-orange-400' }
  if (score <= 3) return { score, label: 'Good', color: 'text-yellow-500', barColor: 'bg-yellow-500' }
  if (score === 4) return { score, label: 'Strong', color: 'text-mint', barColor: 'bg-mint' }
  return { score: 5, label: 'Very Strong', color: 'text-mint', barColor: 'bg-mint' }
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  if (!password) return null

  const { score, label, color, barColor } = getStrength(password)
  const bars = 5

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {Array.from({ length: bars }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ width: 0, opacity: 0 }}
            animate={{
              width: i < score ? '100%' : 0,
              opacity: i < score ? 1 : 0,
            }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className={cn('h-1 rounded-full flex-1', i < score ? barColor : 'bg-white/20 dark:bg-white/5')}
          />
        ))}
      </div>
      <p className={cn('text-[11px] font-medium tracking-wide', color)}>{label}</p>
    </div>
  )
}
