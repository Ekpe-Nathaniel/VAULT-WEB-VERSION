import { motion } from 'framer-motion'
import { AuthCard } from '@/components/sections/AuthCard'

export function Login() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <AuthCard />
    </motion.div>
  )
}
