import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Shield, EyeOff, Lock, type LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  Shield,
  EyeOff,
  Lock,
}

interface FeatureCardProps {
  title: string
  description: string
  icon: string
  index: number
}

export function FeatureCard({ title, description, icon, index }: FeatureCardProps) {
  const IconComponent = iconMap[icon] || Shield

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] as const }}
      className={cn(
        'group relative rounded-[28px] p-8',
        'liquid-glass dark:liquid-glass-dark',
        'hover:liquid-glass-intense dark:hover:liquid-glass-dark-intense',
        'shadow-ambient-sm',
        'hover:shadow-ambient-lg dark:hover:shadow-dark-ambient-lg',
        'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
        'hover:-translate-y-1 hover:brightness-[1.02]',
        'active:scale-[0.98]'
      )}
    >
      <div className={cn(
        'absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100',
        'bg-gradient-to-br from-primary/3 to-transparent',
        'transition-opacity duration-500'
      )} />

      <div className="relative z-10">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-container/50 dark:bg-primary/10 group-hover:bg-primary-container/70 dark:group-hover:bg-primary/20 backdrop-blur-md transition-all duration-300">
          <IconComponent className="h-6 w-6 text-primary dark:text-primary-container" />
        </div>

        <h3 className="font-primary text-lg font-semibold text-on-surface mb-3 tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          {description}
        </p>
      </div>
    </motion.article>
  )
}
