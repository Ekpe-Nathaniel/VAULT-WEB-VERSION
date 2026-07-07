import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEmbedStore } from '@/store/embedStore'
import { UploadDropzone } from '@/components/sections/UploadDropzone'
import { SecretForm } from '@/components/sections/SecretForm'
import { ProcessingCard } from '@/components/sections/ProcessingCard'
import { SuccessCard } from '@/components/sections/SuccessCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/ui/GlassCard'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export function Embed() {
  const {
    file,
    message,
    password,
    status,
    progress,
    currentStage,
    downloadUrl,
    setFile,
    setMessage,
    setPassword,
    startEmbedding,
    resetWorkflow,
  } = useEmbedStore()

  const canSubmit = file && message.length > 0 && password.length >= 8 && status !== 'processing'

  const defaultFilename = `vault_${file?.name || 'protected.png'}`

  function handleDownload(customFilename?: string) {
    if (downloadUrl) {
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = customFilename || defaultFilename
      link.click()
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && status === 'success') {
        resetWorkflow()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [status, resetWorkflow])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          {/* Hero */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-12 sm:mb-16 text-center"
          >
            <motion.div variants={itemVariants} className="mb-6 flex justify-center">
              <Badge variant="outline">
                <Shield className="h-3 w-3" />
                Primary Action
              </Badge>
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="font-primary text-3xl sm:text-4xl lg:text-5xl font-semibold text-on-surface leading-tight tracking-tight"
            >
              Embed a Secret
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-on-surface-variant leading-relaxed"
            >
              Transform your everyday files into a private sanctuary. Securely nestle your most
              important messages within images or audio without a trace.
            </motion.p>
          </motion.div>

          {/* Workflow */}
          <AnimatePresence mode="wait">
            {status === 'processing' ? (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mx-auto max-w-md"
              >
                <ProcessingCard progress={progress} currentStage={currentStage} />
              </motion.div>
            ) : status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SuccessCard onDownload={handleDownload} onReset={resetWorkflow} canDownload={!!downloadUrl} defaultFilename={defaultFilename} />
              </motion.div>
            ) : (
              <motion.div
                key="workflow"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-12 lg:gap-16 lg:grid-cols-2 items-start"
              >
                {/* Left Column - Upload */}
                <motion.div variants={itemVariants} className="space-y-6">
                  <GlassCard className="p-8" variant="intense">
                    <div className="mb-6">
                      <h2 className="font-primary text-lg font-semibold text-on-surface tracking-tight">
                        Step 1: Choose a Cover
                      </h2>
                    </div>
                    <UploadDropzone file={file} onFileSelect={setFile} />
                  </GlassCard>
                </motion.div>

                {/* Right Column - Message */}
                <motion.div variants={itemVariants} className="space-y-6">
                  <GlassCard className="p-8" variant="intense">
                    <div className="mb-6">
                      <h2 className="font-primary text-lg font-semibold text-on-surface tracking-tight">
                        Step 2: Hide Your Message
                      </h2>
                    </div>
                    <SecretForm
                      message={message}
                      password={password}
                      onMessageChange={setMessage}
                      onPasswordChange={setPassword}
                    />
                  </GlassCard>

                  {/* Submit */}
                  <motion.div variants={itemVariants}>
                    <Button
                      size="xl"
                      className={cn(
                        'w-full text-base',
                        'bg-gradient-to-r from-primary to-primary-container/80 dark:from-primary dark:to-primary/60',
                        'hover:brightness-110',
                        'disabled:opacity-40'
                      )}
                      disabled={!canSubmit}
                      onClick={startEmbedding}
                    >
                      Hide Message
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
