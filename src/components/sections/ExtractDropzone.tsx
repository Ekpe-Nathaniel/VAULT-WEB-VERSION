import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, File, X, Lock, Shield, Image, Music, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import type { EmbedFile } from '@/types'

const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.wav', '.flac']
const MAX_SIZE = 100 * 1024 * 1024

const FILE_ICONS: Record<string, typeof Image> = {
  image: Image,
  audio: Music,
}

interface ExtractDropzoneProps {
  file: EmbedFile | null
  password: string
  isProcessing: boolean
  onFileSelect: (file: EmbedFile | null) => void
  onPasswordChange: (password: string) => void
  onExtract: () => void
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function ExtractDropzone({
  file,
  password,
  isProcessing,
  onFileSelect,
  onPasswordChange,
  onExtract,
}: ExtractDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback(
    (selectedFile: File) => {
      setError(null)
      const ext = '.' + selectedFile.name.split('.').pop()?.toLowerCase()
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        setError(`Unsupported file type. Supported: ${ALLOWED_EXTENSIONS.join(', ')}`)
        return
      }
      if (selectedFile.size > MAX_SIZE) {
        setError('File exceeds the 100 MB size limit.')
        return
      }
      const reader = new FileReader()
      reader.onload = () => {
        onFileSelect({
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type,
          dataUrl: reader.result as string,
        })
      }
      reader.readAsDataURL(selectedFile)
    },
    [onFileSelect]
  )

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragOver(false)
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile) processFile(droppedFile)
    },
    [processFile]
  )

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => setIsDragOver(false)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) processFile(f)
  }

  const category = file?.type.startsWith('image') ? 'image' : 'audio'
  const FileIcon = FILE_ICONS[category] || File
  const canExtract = file && password.length >= 1 && !isProcessing

  return (
    <div className="space-y-8">
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !file && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !file) {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Upload stego file"
        className={cn(
          'relative rounded-[28px] p-10 sm:p-14 text-center transition-all duration-300',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          isDragOver
            ? 'bg-primary-container/20 scale-[1.01] backdrop-blur-xl'
            : 'liquid-glass-subtle dark:liquid-glass-dark',
          error && 'bg-red-50/30'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_EXTENSIONS.join(',')}
          onChange={handleInputChange}
          className="sr-only"
          aria-hidden="true"
        />

        {file ? (
          <div className="flex items-center gap-4 text-left">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-container/50 dark:bg-primary/10 backdrop-blur-md">
              <FileIcon className="h-6 w-6 text-primary dark:text-primary-container" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-on-surface truncate">{file.name}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-on-surface-variant">{formatSize(file.size)}</span>
                <span className="text-xs text-on-surface-variant">{file.type || extFromName(file.name)}</span>
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onFileSelect(null) }}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-surface-container-high dark:hover:bg-white/5 transition-colors duration-200 cursor-pointer active:scale-[0.9]"
              aria-label="Remove file"
            >
              <X className="h-4 w-4 text-on-surface-variant" />
            </button>
          </div>
        ) : (
          <>
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/60 dark:bg-white/5 backdrop-blur-md shadow-ambient-xs">
              <Upload className="h-6 w-6 text-on-surface-variant" />
            </div>
            <h3 className="font-primary text-lg font-semibold text-on-surface mb-2 tracking-tight">
              Upload Stego File
            </h3>
            <p className="text-sm text-on-surface-variant max-w-xs mx-auto mb-6 leading-relaxed">
              Drag and drop your image or audio file here, or click to browse your computer.
            </p>
            <Button
              variant="secondary"
              size="md"
              onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
            >
              Select File
            </Button>
          </>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="text-xs text-coral -mt-6"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Password (same one used during embedding) */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-on-surface-variant">
          Embedding Password
        </label>
        <p className="text-xs text-on-surface-variant/60 -mt-1 mb-1">
          Enter the same password you used when embedding the secret.
        </p>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Lock className="h-4 w-4 text-on-surface-variant/60" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="Enter your embedding password"
            className={[
              'w-full rounded-full pl-11 pr-12 py-3.5 text-sm text-on-surface',
              'placeholder:text-on-surface-variant/50',
              'glass-input dark:glass-input-dark',
              'focus:bg-white/80 dark:focus:bg-white/8 focus:border-white/70 dark:focus:border-white/15 focus:outline-none',
              'transition-all duration-200',
            ].join(' ')}
            aria-label="Embedding password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-on-surface transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Extract Button */}
      <Button
        size="xl"
        className={cn(
          'w-full text-base',
          'bg-gradient-to-r from-primary to-primary-container/80 dark:from-primary dark:to-primary/60',
          'hover:brightness-110',
          'disabled:opacity-40'
        )}
        disabled={!canExtract}
        loading={isProcessing}
        onClick={onExtract}
      >
        {isProcessing ? 'Extracting...' : 'Extract Message'}
      </Button>

      {/* Trust Indicator */}
      <div className="flex items-center justify-center gap-2">
        <Shield className="h-3.5 w-3.5 text-on-surface-variant/40" />
        <span className="text-[10px] text-on-surface-variant/40 tracking-[0.12em] uppercase font-medium">
          Password-protected with PBKDF2+AES encryption.
        </span>
      </div>
    </div>
  )
}

function extFromName(name: string): string {
  const parts = name.split('.')
  return parts.length > 1 ? '.' + parts[parts.length - 1].toUpperCase() : ''
}
