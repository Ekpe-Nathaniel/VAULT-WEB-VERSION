import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Globe, Shield, ArrowRight, Code2 } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Badge } from '@/components/ui/Badge'
import { authSchema, type AuthSchemaType } from '@/lib/validators'
import { useAuthStore } from '@/store/authStore'

export function AuthCard() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthSchemaType>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(authSchema) as any,
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  function handleLogin() {
    login()
    navigate('/dashboard')
  }

  function onSubmit() {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      handleLogin()
    }, 1000)
  }

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
          className="mx-auto max-w-md"
        >
          <GlassCard variant="intense" className="p-8 sm:p-10">
            <div className="text-center mb-8">
              <Badge variant="outline" className="mb-4">
                <Shield className="h-3 w-3" />
                Secure &middot; Private &middot; Local First
              </Badge>
              <h2 className="font-primary text-2xl font-semibold text-on-surface mb-2 tracking-tight">
                Welcome Back
              </h2>
              <p className="text-sm text-on-surface-variant">
                Sign in to your translucent vault.
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <Button variant="outline" size="md" className="w-full" onClick={handleLogin}>
                <Globe className="h-4 w-4" />
                Continue with Google
              </Button>
              <Button variant="outline" size="md" className="w-full" onClick={handleLogin}>
                <Code2 className="h-4 w-4" />
                Continue with GitHub
              </Button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/30 dark:border-white/8" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white/60 dark:bg-white/5 backdrop-blur-md px-4 text-on-surface-variant">
                  or sign in with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email or Username"
                type="text"
                placeholder="you@example.com"
                error={errors.email?.message}
                autoComplete="email"
                {...register('email')}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                error={errors.password?.message}
                showPasswordToggle
                autoComplete="current-password"
                {...register('password')}
              />

              <div className="flex items-center justify-between">
                <Checkbox
                  label="Remember me"
                  {...register('rememberMe')}
                />
                <a
                  href="#"
                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot Password?
                </a>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                loading={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
                {!isLoading && <ArrowRight className="h-4 w-4" />}
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-on-surface-variant">
              Don&apos;t have an account?{' '}
              <a
                href="/signup"
                className="text-primary hover:text-primary/80 font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-primary after:transition-transform hover:after:origin-left hover:after:scale-x-100"
              >
                Create Account
              </a>
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  )
}
