import { FeatureCard } from '@/components/sections/FeatureCard'

const features = [
  {
    title: 'End-to-End Encryption',
    description: 'Your data is encrypted before leaving your device. Military-grade AES-256 encryption ensures absolute privacy.',
    icon: 'Shield',
  },
  {
    title: 'Steganography Engine',
    description: 'Hide information in plain sight using advanced algorithms. Seamlessly embed data within images without perceptible changes.',
    icon: 'EyeOff',
  },
  {
    title: 'Local First Privacy',
    description: 'Sensitive data remains under your control. Zero-knowledge architecture means we never see your secrets.',
    icon: 'Lock',
  },
]

export function FeatureCards() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
