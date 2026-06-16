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
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="Create a strong key"
            className={[
              'w-full rounded-full px-5 py-3 text-sm text-on-surface',
              'placeholder:text-on-surface-variant/50',
              'glass-input dark:glass-input-dark',
              'focus:bg-white/80 dark:focus:bg-white/8 focus:border-white/70 dark:focus:border-white/15 focus:outline-none',
              'transition-all duration-200',
            ].join(' ')}
            aria-label="Access password for extraction"
          />
        </div>
        <div className="mt-3">
          <PasswordStrengthMeter password={password} />
        </div>
      </div>
    </div>
  )
}
