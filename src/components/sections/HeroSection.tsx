import { motion } from 'framer-motion'
import { ArrowRight, Shield } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { FloatingParticles } from '@/components/particles/FloatingParticles'
import { TextType } from '@/components/animations/TextType'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <FloatingParticles />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div variants={itemVariants} className="mb-8 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full liquid-glass dark:liquid-glass-dark px-4 py-1.5 text-xs font-medium text-primary dark:text-primary-container shadow-ambient-xs">
              <Shield className="h-3.5 w-3.5" />
              Steganography Platform
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-primary text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold text-on-surface leading-[1.1] tracking-tight"
          >
            <TextType
              text="Protect Information Beautifully"
              as="span"
              typingSpeed={40}
              initialDelay={400}
              loop={false}
              showCursor={false}
              className="font-primary font-semibold text-on-surface"
            />
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-6 text-lg sm:text-xl text-on-surface-variant leading-relaxed max-w-2xl mx-auto"
          >
            Hide and reveal sensitive data using industry-leading steganography. Your secrets, protected in plain sight.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" className="w-full sm:w-auto">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              Learn More
            </Button>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="mt-12 text-xs text-on-surface-variant/50"
          >
            Trusted by security professionals worldwide &middot; 100% local-first
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
