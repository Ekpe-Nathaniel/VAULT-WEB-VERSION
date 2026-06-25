import { motion } from 'framer-motion'
import { FileText, ShieldCheck, Clock, Lock, Terminal, FileCode, AlertTriangle } from 'lucide-react'
import type { ExtractResult } from '@/types'

function formatTimestamp(ts: number): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date(ts))
}

interface ExtractResultsProps {
  result: ExtractResult | null
  errorMessage?: string
}

export function ExtractResults({ result, errorMessage }: ExtractResultsProps) {
  if (errorMessage) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 px-6 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-coral/10 dark:bg-coral/5 backdrop-blur-md shadow-ambient-xs">
          <AlertTriangle className="h-6 w-6 text-coral" />
        </div>
        <h3 className="font-primary text-base font-semibold text-on-surface mb-3 tracking-tight">
          Extraction Failed
        </h3>
        <p className="text-sm text-on-surface-variant max-w-xs leading-relaxed mb-4">
          {errorMessage}
        </p>
        <p className="text-[11px] text-on-surface-variant/60 max-w-xs leading-relaxed">
          Make sure you entered the same password used during embedding and selected the correct stego file.
        </p>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 px-6 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/60 dark:bg-white/5 backdrop-blur-md shadow-ambient-xs">
          <FileCode className="h-6 w-6 text-on-surface-variant/40" />
        </div>
        <h3 className="font-primary text-base font-semibold text-on-surface mb-2 tracking-tight">
          Waiting for Extraction
        </h3>
        <p className="text-sm text-on-surface-variant max-w-xs leading-relaxed">
          Upload a stego file and provide the correct extraction key to reveal the hidden message.
        </p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      {/* Recovered Content */}
      <div className="rounded-[24px] liquid-glass dark:liquid-glass-dark p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-on-surface tracking-tight">
            Recovered Content
          </h3>
        </div>
        <div className="relative rounded-2xl bg-white/60 dark:bg-white/5 p-5">
          <pre className="text-xs text-on-surface-variant leading-relaxed whitespace-pre-wrap break-words font-mono select-all">
            {result.message}
          </pre>
        </div>
      </div>

      {/* Metadata */}
      <div className="rounded-[24px] liquid-glass dark:liquid-glass-dark p-6 space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-on-surface tracking-tight">Details</h3>
        </div>
        <div className="grid gap-4">
          <MetadataRow
            icon={<FileCode className="h-3.5 w-3.5" />}
            label="Format"
            value={result.format}
          />
          <MetadataRow
            icon={<ShieldCheck className="h-3.5 w-3.5" />}
            label="Integrity"
            value={result.integrity}
          />
          <MetadataRow
            icon={<Clock className="h-3.5 w-3.5" />}
            label="Extracted"
            value={formatTimestamp(result.timestamp)}
          />
        </div>
      </div>

      {/* Security Notice */}
      <div className="flex items-start gap-3 rounded-xl bg-white/40 dark:bg-white/5 backdrop-blur-md px-4 py-3">
        <Lock className="h-4 w-4 shrink-0 mt-0.5 text-on-surface-variant" />
        <p className="text-[11px] text-on-surface-variant leading-relaxed">
          This content was decrypted in your browser using the provided key. No data is sent to any server — everything stays local.
        </p>
      </div>
    </motion.div>
  )
}

function MetadataRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <span className="text-on-surface-variant/50">{icon}</span>
        <span className="text-xs text-on-surface-variant">{label}</span>
      </div>
      <span className="text-xs font-medium text-on-surface text-right">{value}</span>
    </div>
  )
}
