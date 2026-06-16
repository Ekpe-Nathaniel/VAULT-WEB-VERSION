import { motion } from 'framer-motion'
import { Download, Shield, Key, Lock, Database } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { ExtractDropzone } from '@/components/sections/ExtractDropzone'
import { ExtractResults } from '@/components/sections/ExtractResults'
import { useExtractStore } from '@/store/extractStore'

export function Extract() {
  const { file, password, status, result, setFile, setPassword, startExtraction } =
    useExtractStore()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
    >
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-14 sm:mb-20"
      >
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-container/50 dark:bg-primary/10 backdrop-blur-md shadow-ambient-xs">
          <Download className="h-7 w-7 text-primary" />
        </div>
        <h1 className="font-primary text-3xl sm:text-4xl lg:text-5xl font-bold text-on-surface mb-4 tracking-tight">
          Extract
        </h1>
        <p className="text-on-surface-variant max-w-md mx-auto text-base sm:text-lg leading-relaxed">
          Reveal hidden messages from images and audio files using your secret extraction key.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6">
          <Badge variant="default">
            <Key className="h-3 w-3" />
            Key Required
          </Badge>
          <Badge variant="outline">
            <Lock className="h-3 w-3" />
            AES-256 Encryption
          </Badge>
          <Badge variant="outline">
            <Database className="h-3 w-3" />
            Max 100 MB
          </Badge>
        </div>
      </motion.div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
        {/* Left Column - Upload & Extract */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-3 rounded-[28px] liquid-glass-intense dark:liquid-glass-dark-intense shadow-ambient-md p-8 sm:p-10"
        >
          <ExtractDropzone
            file={file}
            password={password}
            isProcessing={status === 'processing'}
            onFileSelect={setFile}
            onPasswordChange={setPassword}
            onExtract={startExtraction}
          />
        </motion.div>

        {/* Right Column - Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-2 rounded-[28px] liquid-glass-intense dark:liquid-glass-dark-intense shadow-ambient-md p-6 sm:p-8"
        >
          <ExtractResults result={result} />
        </motion.div>
      </div>
    </motion.div>
  )
}
