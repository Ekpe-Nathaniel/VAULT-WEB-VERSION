import { useEffect, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image, Music, X } from 'lucide-react'

interface MediaTypeOption {
  value: 'image' | 'audio'
  label: string
  description: string
  icon: ReactNode
}

const options: MediaTypeOption[] = [
  {
    value: 'image',
    label: 'Image',
    description: 'PNG, JPEG, WebP',
    icon: <Image className="h-7 w-7" />,
  },
  {
    value: 'audio',
    label: 'Audio',
    description: 'WAV, MP3, FLAC, OGG, and more',
    icon: <Music className="h-7 w-7" />,
  },
]

interface MediaTypeModalProps {
  open: boolean
  onSelect: (type: 'image' | 'audio') => void
  onClose: () => void
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: 20,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export function MediaTypeModal({ open, onSelect, onClose }: MediaTypeModalProps) {
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.3 }}
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-sm rounded-[28px] liquid-glass-intense dark:liquid-glass-dark-intense p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-primary text-lg font-semibold text-on-surface tracking-tight">
                Select Media Type
              </h2>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-surface-container-high dark:hover:bg-white/5 transition-colors duration-200 cursor-pointer active:scale-[0.9]"
                aria-label="Close"
              >
                <X className="h-4 w-4 text-on-surface-variant" />
              </button>
            </div>
            <p className="text-sm text-on-surface-variant mb-5 leading-relaxed">
              Choose the type of cover media you want to use for hiding your secret.
            </p>
            <div className="space-y-3">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onSelect(opt.value)}
                  className="w-full flex items-center gap-4 rounded-2xl p-4 text-left transition-all duration-200 cursor-pointer active:scale-[0.98] hover:bg-primary-container/30 dark:hover:bg-primary/10 border border-transparent hover:border-primary-container/40"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-container/50 dark:bg-primary/10 backdrop-blur-md text-primary dark:text-primary-container">
                    {opt.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-on-surface">{opt.label}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{opt.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
