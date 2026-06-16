import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Globe, Shield, Code2, ArrowRight, Check, CheckCircle } from 'lucide-react'
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
  const [isLoading, setIsLoading] = useState(false)
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
    navigate('/dashboard')
  }

  function onSubmit() {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)
      login()
      setTimeout(() => {
        navigate('/dashboard')
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
                Your sanctuary has been created. Redirecting to your dashboard...
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
                <Button variant="outline" size="md" className="flex-1" onClick={handleLogin}>
                  <Globe className="h-4 w-4" />
                  Google
                </Button>
                <Button variant="outline" size="md" className="flex-1" onClick={handleLogin}>
                  <Code2 className="h-4 w-4" />
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
