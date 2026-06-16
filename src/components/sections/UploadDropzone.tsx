import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, File, X, Image, Music } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { EmbedFile } from '@/types'

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'audio/wav', 'audio/flac']
const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.wav', '.flac']
const MAX_SIZE = 100 * 1024 * 1024

const FILE_ICONS: Record<string, typeof Image> = {
  image: Image,
  audio: Music,
}

interface UploadDropzoneProps {
  file: EmbedFile | null
  onFileSelect: (file: EmbedFile | null) => void
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function UploadDropzone({ file, onFileSelect }: UploadDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
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

  if (file) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-2xl liquid-glass-subtle dark:liquid-glass-dark p-5"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary-container/50 dark:bg-primary/10 backdrop-blur-md">
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
            onClick={() => onFileSelect(null)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-surface-container-high dark:hover:bg-white/5 transition-colors duration-200 cursor-pointer active:scale-[0.9]"
            aria-label="Remove file"
          >
            <X className="h-4 w-4 text-on-surface-variant" />
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !file) {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Upload cover file"
        className={cn(
          'relative rounded-2xl p-8 sm:p-12 text-center transition-all duration-300 cursor-pointer',
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
          accept={ALLOWED_TYPES.join(',')}
          onChange={handleInputChange}
          className="sr-only"
          aria-hidden="true"
        />

        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-md shadow-ambient-xs">
          <Upload className="h-6 w-6 text-on-surface-variant" />
        </div>

        <p className="font-primary text-base font-semibold text-on-surface mb-2 tracking-tight">
          {isDragOver ? 'Drop your file here' : 'Upload Cover File'}
        </p>

        <p className="text-sm text-on-surface-variant leading-relaxed max-w-xs mx-auto">
          Drag and drop your image or audio here, or{' '}
          <span className="text-primary hover:underline cursor-pointer">browse</span> to select.
        </p>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="mt-4 text-xs text-coral"
              role="alert"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function extFromName(name: string): string {
  const parts = name.split('.')
  return parts.length > 1 ? '.' + parts[parts.length - 1].toUpperCase() : ''
}
