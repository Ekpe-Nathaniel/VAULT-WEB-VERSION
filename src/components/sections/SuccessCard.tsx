import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Download, RotateCcw, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/ui/GlassCard'

interface SuccessCardProps {
  onDownload: (customFilename?: string) => void
  onReset: () => void
  canDownload: boolean
  defaultFilename?: string
}

export function SuccessCard({ onDownload, onReset, canDownload, defaultFilename = 'protected.png' }: SuccessCardProps) {
  const [showRename, setShowRename] = useState(false)
  const [filename, setFilename] = useState(defaultFilename)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-lg"
    >
      <GlassCard variant="intense" className="p-8 sm:p-10 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', damping: 15, stiffness: 200 }}
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-container dark:bg-primary/20 backdrop-blur-md"
        >
          <CheckCircle className="h-8 w-8 text-primary dark:text-primary-container" />
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="font-primary text-2xl font-semibold text-on-surface mb-3 tracking-tight"
        >
          Success! Message Hidden
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="text-sm text-on-surface-variant mb-6 max-w-sm mx-auto leading-relaxed"
        >
          Your file has been encoded. Download it below. Use the same password to extract the message later.
        </motion.p>

        {/* File rename section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mb-6"
        >
          {showRename ? (
            <div className="flex items-center gap-2 max-w-sm mx-auto">
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className={[
                  'flex-1 rounded-full px-4 py-2 text-sm text-on-surface',
                  'placeholder:text-on-surface-variant/50',
                  'glass-input dark:glass-input-dark',
                  'focus:bg-white/80 dark:focus:bg-white/8 focus:border-white/70 dark:focus:border-white/15 focus:outline-none',
                  'transition-all duration-200',
                ].join(' ')}
                placeholder="Enter filename..."
                aria-label="Output filename"
              />
              <button
                onClick={() => { setShowRename(false); setFilename(defaultFilename) }}
                className="text-xs text-on-surface-variant/60 hover:text-on-surface transition-colors whitespace-nowrap"
              >
                Reset
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowRename(true)}
              className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant/60 hover:text-on-surface transition-colors cursor-pointer"
            >
              <Pencil className="h-3 w-3" />
              Rename output file
            </button>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Button size="lg" className="w-full sm:w-auto" onClick={() => onDownload(showRename ? filename : undefined)} disabled={!canDownload}>
            <Download className="h-4 w-4" />
            Download Protected File
          </Button>
          <Button variant="secondary" size="lg" className="w-full sm:w-auto" onClick={onReset}>
            <RotateCcw className="h-4 w-4" />
            Embed Another Secret
          </Button>
        </motion.div>
      </GlassCard>
    </motion.div>
  )
}
