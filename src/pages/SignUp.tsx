import { motion } from 'framer-motion'
import { SignUpCard } from '@/components/sections/SignUpCard'

export function SignUp() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <SignUpCard />
    </motion.div>
  )
}
