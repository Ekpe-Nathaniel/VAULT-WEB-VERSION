import { cn } from '@/lib/utils'

const footerLinks = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Security Protocol', href: '#' },
  { label: 'Terms of Service', href: '#' },
]

export function Footer() {
  return (
    <footer className="border-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={cn(
          'flex flex-col sm:flex-row items-center justify-between gap-6',
          'py-8'
        )}>
          {/* Links */}
          <nav className="flex items-center gap-6" aria-label="Footer navigation">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs text-on-surface-variant hover:text-on-surface transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-xs text-on-surface-variant">
            &copy; 2025 Vault
          </p>
        </div>
      </div>
    </footer>
  )
}
