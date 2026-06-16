import { motion } from 'framer-motion'
import { HeroSection } from '@/components/sections/HeroSection'
import { FeatureCards } from '@/components/sections/FeatureCards'
import { DevelopersSection } from '@/components/sections/DevelopersSection'
import { AuthCard } from '@/components/sections/AuthCard'

export function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <HeroSection />
      <FeatureCards />
      <DevelopersSection />
      <AuthCard />
    </motion.div>
  )
}
