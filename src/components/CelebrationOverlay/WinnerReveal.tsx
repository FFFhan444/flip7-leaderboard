import { useEffect } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Trophy } from 'lucide-react'
import { useColors } from '../../context/ColorContext'

type WinnerRevealProps = {
  winnerName: string
  onComplete: () => void
}

export function WinnerReveal({ winnerName, onComplete }: WinnerRevealProps) {
  const { pastel, pastelLight, pastelDark } = useColors()

  useEffect(() => {
    // Fire confetti from both sides
    const duration = 3000
    const end = Date.now() + duration

    const colors = [pastel, pastelLight, pastelDark, '#1A1A1A', '#2D2D2D']

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors,
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors,
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()

    // Big burst in the center
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: 0.5, y: 0.5 },
        colors,
      })
    }, 200)

    const timer = setTimeout(onComplete, 4000)
    return () => clearTimeout(timer)
  }, [onComplete, pastel, pastelLight, pastelDark])

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', duration: 0.6 }}
    >
      <motion.div
        className="inline-block mb-6"
        animate={{
          rotate: [0, -10, 10, -10, 10, 0],
          scale: [1, 1.1, 1.1, 1.1, 1.1, 1],
        }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Trophy className="w-24 h-24 text-pastel mx-auto drop-shadow-lg" />
      </motion.div>

      <motion.p
        className="font-title text-2xl text-pastel mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Winner!
      </motion.p>

      <motion.h2
        className="font-title text-5xl md:text-7xl text-pastel mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, type: 'spring' }}
      >
        {winnerName}
      </motion.h2>

      <motion.button
        className="px-8 py-4 bg-pastel text-dark font-bold text-lg hover:bg-pastel-dark transition-colors pixel-corners"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        onClick={onComplete}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Continue
      </motion.button>
    </motion.div>
  )
}
