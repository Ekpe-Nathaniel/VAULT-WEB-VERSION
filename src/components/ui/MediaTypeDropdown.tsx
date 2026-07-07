import { useEffect, useRef, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image, Music } from 'lucide-react'

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
    icon: <Image className="h-5 w-5" />,
  },
  {
    value: 'audio',
    label: 'Audio',
    description: 'WAV, MP3, FLAC, OGG, and more',
    icon: <Music className="h-5 w-5" />,
  },
]

interface MediaTypeDropdownProps {
  open: boolean
  onSelect: (type: 'image' | 'audio') => void
  onClose: () => void
  anchorRef: React.RefObject<HTMLElement | null>
}

export function MediaTypeDropdown({ open, onSelect, onClose, anchorRef }: MediaTypeDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose, anchorRef])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 z-50
            bg-white dark:bg-[#141824] backdrop-blur-2xl
            border border-white/60 dark:border-white/10
            shadow-lg shadow-black/8 dark:shadow-black/30
            rounded-2xl p-2"
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              className="w-full flex items-center gap-3 rounded-xl p-3 text-left transition-all duration-200 cursor-pointer active:scale-[0.98] hover:bg-primary-container/40 dark:hover:bg-primary/10"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-container/60 dark:bg-primary/10 text-primary dark:text-primary-container">
                {opt.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-on-surface">{opt.label}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">{opt.description}</p>
              </div>
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
