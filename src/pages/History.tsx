import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Download, Image, Music, FileQuestion, Trash2, AlertTriangle, X } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'
import { historyService, type HistoryItem } from '@/services/historyService'

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

const typeIcons: Record<string, typeof Image> = {
  image: Image,
  audio: Music,
}

export function History() {
  const [records, setRecords] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const apiToken = useAuthStore((s) => s.apiToken)
  const ensureApiToken = useAuthStore((s) => s.ensureApiToken)
  const [downloading, setDownloading] = useState<number | null>(null)
  const [showClearModal, setShowClearModal] = useState(false)
  const [clearing, setClearing] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const token = apiToken || await ensureApiToken()
        const items = await historyService.list(token)
        if (!cancelled) setRecords(items)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load history')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [apiToken, ensureApiToken])

  const handleDownload = async (recordId: number) => {
    setDownloading(recordId)
    try {
      const token = apiToken || await ensureApiToken()
      const url = historyService.downloadUrl(recordId)
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Download failed')
      const blob = await res.blob()
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      const record = records.find((r) => r.id === recordId)
      link.download = record?.original_filename || `vault_${recordId}`
      link.click()
      URL.revokeObjectURL(link.href)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed')
    } finally {
      setDownloading(null)
    }
  }

  const handleClear = async () => {
    setClearing(true)
    try {
      const token = apiToken || await ensureApiToken()
      await historyService.clear(token)
      setRecords([])
      setShowClearModal(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear history')
    } finally {
      setClearing(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
    >
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-center mb-12"
      >
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-container/50 dark:bg-primary/10 backdrop-blur-md shadow-ambient-xs">
          <Clock className="h-7 w-7 text-primary" />
        </div>
        <h1 className="font-primary text-3xl sm:text-4xl font-bold text-on-surface mb-3 tracking-tight">
          History
        </h1>
        <p className="text-on-surface-variant max-w-md mx-auto">
          Previously embedded files — download them again anytime.
        </p>
      </motion.div>

      {/* Clear button */}
      {!loading && records.length > 0 && (
        <div className="flex justify-end mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowClearModal(true)}
          >
            <Trash2 className="h-4 w-4" />
            Clear History
          </Button>
        </div>
      )}

      {/* Content */}
      {loading && (
        <div className="text-center py-20">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-on-surface-variant">Loading history...</p>
        </div>
      )}

      {error && (
        <GlassCard className="p-6 mb-6 text-center" variant="subtle">
          <p className="text-sm text-coral">{error}</p>
        </GlassCard>
      )}

      {!loading && !error && records.length === 0 && (
        <GlassCard className="p-12 text-center" variant="subtle">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/60 dark:bg-white/5">
            <FileQuestion className="h-6 w-6 text-on-surface-variant/40" />
          </div>
          <h3 className="font-primary text-base font-semibold text-on-surface mb-2">No history yet</h3>
          <p className="text-sm text-on-surface-variant max-w-xs mx-auto">
            Files you embed will appear here so you can download them again later.
          </p>
        </GlassCard>
      )}

      {!loading && records.length > 0 && (
        <div className="space-y-3">
          {records.map((record, i) => {
            const Icon = typeIcons[record.file_type] || FileQuestion
            return (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
              >
                <GlassCard className="p-4 sm:p-5" variant="subtle">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-container/40 dark:bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-on-surface truncate">
                        {record.original_filename}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-on-surface-variant capitalize">
                          {record.operation}
                        </span>
                        <span className="text-xs text-on-surface-variant/50">&middot;</span>
                        <span className="text-xs text-on-surface-variant">
                          {formatDate(record.created_at)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(record.id)}
                      disabled={downloading === record.id}
                      className="shrink-0 flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container/70 transition-colors disabled:opacity-50"
                      title="Download file"
                    >
                      {downloading === record.id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      <span className="hidden sm:inline">Download</span>
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>
      )}
      {/* Clear confirmation modal */}
      <AnimatePresence>
        {showClearModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => !clearing && setShowClearModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-sm"
            >
              <GlassCard className="p-6" variant="intense">
                <button
                  onClick={() => setShowClearModal(false)}
                  disabled={clearing}
                  className="absolute right-4 top-4 text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-50"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-coral/10">
                  <AlertTriangle className="h-6 w-6 text-coral" />
                </div>
                <h3 className="font-primary text-lg font-semibold text-on-surface mb-2">
                  Clear all history?
                </h3>
                <p className="text-sm text-on-surface-variant mb-6">
                  This will permanently delete your entire history and remove all stored files from the server. This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => setShowClearModal(false)}
                    disabled={clearing}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1 !bg-coral !text-white hover:!brightness-110"
                    onClick={handleClear}
                    loading={clearing}
                  >
                    Clear All
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
