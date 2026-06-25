import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Shield, ArrowRight, Check, CheckCircle } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { PasswordStrengthMeter } from '@/components/sections/PasswordStrengthMeter'
import { signupSchema, type SignupSchemaType } from '@/lib/validators'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export function SignUpCard() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle)
  const [isLoading, setIsLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [passwordVal, setPasswordVal] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupSchemaType>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(signupSchema) as any,
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const watchedPassword = watch('password')
  const watchedConfirm = watch('confirmPassword')
  const passwordsMatch = watchedConfirm && watchedPassword === watchedConfirm

  function handleLogin() {
    login()
    navigate('/embed')
  }

  function onSubmit() {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)
      login()
      setTimeout(() => {
        navigate('/embed')
      }, 2000)
    }, 1500)
  }

  if (isSuccess) {
    return (
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-md text-center"
          >
            <GlassCard variant="intense" className="p-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', damping: 15, stiffness: 200 }}
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-container/50 dark:bg-primary/10 backdrop-blur-md">
                  <CheckCircle className="h-8 w-8 text-primary dark:text-primary-container" />
                </div>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="font-primary text-2xl font-semibold text-on-surface mb-3 tracking-tight"
              >
                Welcome to The Vault
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-sm text-on-surface-variant"
              >
                Your sanctuary has been created. Redirecting to your vault...
              </motion.p>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-[640px]"
        >
          <GlassCard variant="intense" className="p-8 sm:p-10">
            {/* Header */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="text-center mb-8"
            >
              <motion.div variants={fadeUp}>
                <Badge variant="outline" className="mb-4">
                  <Shield className="h-3 w-3" />
                  Encrypted &middot; Local First &middot; Zero Knowledge
                </Badge>
              </motion.div>
              <motion.h2
                variants={fadeUp}
                className="font-primary text-2xl font-semibold text-on-surface mb-2 tracking-tight"
              >
                Create Your Sanctuary
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="text-sm text-on-surface-variant"
              >
                Secure your digital assets within the translucent vault of advanced steganography.
              </motion.p>
            </motion.div>

            {/* Social */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="space-y-3 mb-6"
            >
              <motion.div variants={fadeUp}>
                <p className="text-xs text-on-surface-variant text-center mb-3">
                  Continue with
                </p>
              </motion.div>
              <motion.div variants={fadeUp} className="flex gap-3">
                <Button variant="outline" size="md" className="flex-1" onClick={async () => { setGoogleLoading(true); try { await signInWithGoogle(); navigate('/embed') } catch { setGoogleLoading(false) } }} loading={googleLoading}>
                  <svg className="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </Button>
                <Button variant="outline" size="md" className="flex-1" onClick={() => navigate('/embed')}>
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  GitHub
                </Button>
              </motion.div>
            </motion.div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/30 dark:border-white/8" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white/60 dark:bg-white/5 backdrop-blur-md px-4 text-on-surface-variant">
                  or sign up with email
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                <motion.div variants={fadeUp}>
                  <Input
                    label="Full Name"
                    type="text"
                    placeholder="John Doe"
                    error={errors.fullName?.message}
                    autoComplete="name"
                    {...register('fullName', {
                      onChange: () => setPasswordVal(watchedPassword || ''),
                    })}
                  />
                </motion.div>

                <motion.div variants={fadeUp}>
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    error={errors.email?.message}
                    autoComplete="email"
                    {...register('email')}
                  />
                </motion.div>

                <motion.div variants={fadeUp}>
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Create a strong password"
                    error={errors.password?.message}
                    showPasswordToggle
                    autoComplete="new-password"
                    {...register('password', {
                      onChange: (e) => setPasswordVal(e.target.value),
                    })}
                  />
                  <div className="mt-3">
                    <PasswordStrengthMeter password={watchedPassword || ''} />
                  </div>
                </motion.div>

                <motion.div variants={fadeUp}>
                  <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="Re-enter your password"
                    error={errors.confirmPassword?.message}
                    showPasswordToggle
                    autoComplete="new-password"
                    {...register('confirmPassword')}
                  />
                  {watchedConfirm && (
                    <div className="mt-1.5 flex items-center gap-1.5">
                      {passwordsMatch ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-mint" />
                          <span className="text-xs text-mint">Passwords match</span>
                        </>
                      ) : (
                        <span className="text-xs text-coral">Passwords do not match</span>
                      )}
                    </div>
                  )}
                </motion.div>
              </motion.div>

              {/* Privacy Commitment */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  'rounded-2xl p-5',
                  'liquid-glass-subtle dark:liquid-glass-dark'
                )}
              >
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-container/50 dark:bg-primary/10 backdrop-blur-md">
                    <Shield className="h-5 w-5 text-primary dark:text-primary-container" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-on-surface tracking-tight">
                      Privacy Commitment
                    </h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Your keys never leave your device. We use end-to-end local encryption
                      to ensure you are the sole curator of your vault.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  loading={isLoading}
                >
                  {isLoading ? 'Creating Sanctuary...' : 'Create Account'}
                  {!isLoading && <ArrowRight className="h-4 w-4" />}
                </Button>
              </motion.div>
            </form>

            {/* Login link */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-6 text-center text-xs text-on-surface-variant"
            >
              Already have an account?{' '}
              <a
                href="/login"
                className="text-primary hover:text-primary/80 font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-primary after:transition-transform hover:after:origin-left hover:after:scale-x-100"
              >
                Log In
              </a>
            </motion.p>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  )
}
