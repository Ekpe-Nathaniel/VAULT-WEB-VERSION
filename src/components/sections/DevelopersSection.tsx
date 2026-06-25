import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const developers = [
  {
    name: 'Ekpe Nathaniel',
    role: 'Full-Stack Developer',
    bio: 'Architects secure front-to-back systems with a passion for steganography and privacy-first design.',
  },
  {
    name: 'Mensah Bright',
    role: 'UI/UX Designer',
    bio: 'Crafts intuitive, beautiful interfaces that make security feel seamless and human-centered.',
  },
  {
    name: 'Fosu Godson',
    role: 'Security Engineer',
    bio: 'Specializes in encryption protocols and zero-knowledge architectures that keep your data sovereign.',
  },
]

const avatarColors = [
  'from-primary/20 to-primary/5',
  'from-violet/20 to-violet/5',
  'from-mint/20 to-mint/5',
]

const initialLetters = ['EN', 'MB', 'FG']

export function DevelopersSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <h2 className="font-primary text-2xl sm:text-3xl font-semibold text-on-surface tracking-tight mb-3">
            Meet the Developers
          </h2>
          <p className="text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
            The team behind Vault — building the future of privacy-preserving steganography.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {developers.map((dev, i) => (
            <motion.div
              key={dev.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                'group relative rounded-[24px] p-6',
                'liquid-glass dark:liquid-glass-dark',
                'hover:liquid-glass-intense dark:hover:liquid-glass-dark-intense',
                'transition-all duration-500 hover:-translate-y-0.5 active:scale-[0.98]'
              )}
            >
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className={cn(
                  'mb-4 flex h-20 w-20 items-center justify-center rounded-full',
                  'bg-gradient-to-br',
                  avatarColors[i],
                  'backdrop-blur-md'
                )}>
                  <span className="font-primary text-lg font-semibold text-on-surface tracking-wide">
                    {initialLetters[i]}
                  </span>
                </div>

                {/* Info */}
                <h3 className="font-primary text-base font-semibold text-on-surface mb-0.5 tracking-tight">
                  {dev.name}
                </h3>
                <p className="text-xs font-medium text-on-surface-variant/70 mb-3">
                  {dev.role}
                </p>
                <p className="text-xs text-on-surface-variant leading-relaxed max-w-xs">
                  {dev.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
