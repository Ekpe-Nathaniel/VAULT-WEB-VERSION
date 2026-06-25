import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { PasswordStrengthMeter } from '@/components/sections/PasswordStrengthMeter'

interface SecretFormProps {
  message: string
  password: string
  onMessageChange: (message: string) => void
  onPasswordChange: (password: string) => void
}

const MAX_MESSAGE_LENGTH = 2000

export function SecretForm({
  message,
  password,
  onMessageChange,
  onPasswordChange,
}: SecretFormProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="space-y-5">
      {/* Secret Message */}
      <div className="space-y-1.5">
        <label
          htmlFor="secret-message"
          className="block text-sm font-medium text-on-surface-variant"
        >
          Your Secret
        </label>
        <div className="relative">
          <textarea
            id="secret-message"
            value={message}
            onChange={(e) => onMessageChange(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
            placeholder="Type the message you want to protect..."
            rows={5}
            className={[
              'w-full rounded-xl px-4 py-3 text-sm text-on-surface resize-none',
              'placeholder:text-on-surface-variant/50',
              'glass-input dark:glass-input-dark',
              'focus:bg-white/80 dark:focus:bg-white/8 focus:border-white/70 dark:focus:border-white/15 focus:outline-none',
              'transition-all duration-200',
            ].join(' ')}
            aria-label="Your secret message"
          />
        </div>
        <div className="flex justify-end">
          <span className="text-xs text-on-surface-variant/50">
            {message.length} / {MAX_MESSAGE_LENGTH}
          </span>
        </div>
      </div>

      {/* Access Password */}
      <div className="space-y-1.5">
        <label
          htmlFor="access-password"
          className="block text-sm font-medium text-on-surface-variant"
        >
          Access Password
        </label>
        <p className="text-xs text-on-surface-variant/50 -mt-0.5 mb-1">
          Required for extraction
        </p>
        <div className="relative">
          <input
            id="access-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="Create a strong key"
            className={[
              'w-full rounded-full pl-5 pr-12 py-3 text-sm text-on-surface',
              'placeholder:text-on-surface-variant/50',
              'glass-input dark:glass-input-dark',
              'focus:bg-white/80 dark:focus:bg-white/8 focus:border-white/70 dark:focus:border-white/15 focus:outline-none',
              'transition-all duration-200',
            ].join(' ')}
            aria-label="Access password for extraction"
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
        <div className="mt-3">
          <PasswordStrengthMeter password={password} />
        </div>
      </div>
    </div>
  )
}
