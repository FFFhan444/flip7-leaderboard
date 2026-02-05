import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CardDealAnimation } from './CardDealAnimation'
import { WinnerReveal } from './WinnerReveal'

type CelebrationOverlayProps = {
  isVisible: boolean
  winnerName: string
  onComplete: () => void
}

type Phase = 'deal' | 'flip' | 'reveal' | 'done'

export function CelebrationOverlay({ isVisible, winnerName, onComplete }: CelebrationOverlayProps) {
  const [phase, setPhase] = useState<Phase>('deal')

  useEffect(() => {
    if (isVisible) {
      setPhase('deal')
    }
  }, [isVisible])

  const handleDealComplete = () => {
    setPhase('flip')
  }

  const handleFlipComplete = () => {
    setPhase('reveal')
  }

  const handleRevealComplete = () => {
    setPhase('done')
    onComplete()
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-dark/90 backdrop-blur-sm" />

          {/* Content */}
          <div className="relative z-10 w-full max-w-4xl px-4">
            {phase !== 'reveal' ? (
              <div className="flex flex-col items-center">
                <motion.p
                  className="font-title text-pastel text-xl mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {phase === 'deal' ? 'Dealing cards...' : 'Revealing...'}
                </motion.p>
                <CardDealAnimation
                  phase={phase as 'deal' | 'flip' | 'done'}
                  onDealComplete={handleDealComplete}
                  onFlipComplete={handleFlipComplete}
                />
              </div>
            ) : (
              <WinnerReveal
                winnerName={winnerName}
                onComplete={handleRevealComplete}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
