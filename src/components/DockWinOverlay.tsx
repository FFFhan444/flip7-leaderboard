import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Frown } from 'lucide-react'

type DockWinOverlayProps = {
  isVisible: boolean
  playerName: string
  onComplete: () => void
}

export function DockWinOverlay({ isVisible, playerName, onComplete }: DockWinOverlayProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onComplete, 1500)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onComplete}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-dark/80 backdrop-blur-sm" />

          {/* Content */}
          <motion.div
            className="relative z-10 text-center"
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.4 }}
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 0.5,
                repeat: 2,
              }}
            >
              <Frown className="w-24 h-24 text-pastel mx-auto mb-4" strokeWidth={1.5} />
            </motion.div>

            <motion.p
              className="font-title text-2xl text-pastel mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Oops!
            </motion.p>

            <motion.p
              className="text-white text-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              -1 win for <span className="font-semibold">{playerName}</span>
            </motion.p>

            {/* Floating -1 animations */}
            {[...Array(5)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute font-title text-3xl text-pastel pointer-events-none"
                initial={{
                  opacity: 1,
                  x: Math.random() * 200 - 100,
                  y: 0,
                }}
                animate={{
                  opacity: 0,
                  y: -150,
                  rotate: Math.random() * 40 - 20,
                }}
                transition={{
                  duration: 1.2,
                  delay: i * 0.1,
                  ease: 'easeOut',
                }}
                style={{
                  left: '50%',
                  top: '30%',
                }}
              >
                -1
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
