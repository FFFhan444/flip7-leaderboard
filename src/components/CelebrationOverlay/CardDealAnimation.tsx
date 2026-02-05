import { motion } from 'framer-motion'

const CARD_NUMBERS = [0, 1, 2, 3, 4, 5, 6, 7]

type CardDealAnimationProps = {
  phase: 'deal' | 'flip' | 'done'
  onDealComplete: () => void
  onFlipComplete: () => void
}

export function CardDealAnimation({ phase, onDealComplete, onFlipComplete }: CardDealAnimationProps) {
  return (
    <div className="flex items-center justify-center gap-2 md:gap-3">
      {CARD_NUMBERS.map((num, index) => (
        <motion.div
          key={index}
          className="relative w-14 h-20 md:w-18 md:h-26"
          style={{ perspective: 1000 }}
        >
          <motion.div
            className="w-full h-full"
            style={{ transformStyle: 'preserve-3d' }}
            initial={{
              x: -500,
              y: -300,
              rotateZ: -180,
              opacity: 0,
            }}
            animate={
              phase === 'deal' || phase === 'flip' || phase === 'done'
                ? {
                    x: 0,
                    y: 0,
                    rotateZ: 0,
                    rotateY: phase === 'flip' || phase === 'done' ? 180 : 0,
                    opacity: 1,
                  }
                : {}
            }
            transition={{
              x: { delay: index * 0.25, duration: 0.5, ease: 'easeOut' },
              y: { delay: index * 0.25, duration: 0.5, ease: 'easeOut' },
              rotateZ: { delay: index * 0.25, duration: 0.5, ease: 'easeOut' },
              rotateY: { delay: index * 0.12, duration: 0.4, ease: 'easeInOut' },
              opacity: { delay: index * 0.25, duration: 0.2 },
            }}
            onAnimationComplete={() => {
              if (index === 7) {
                if (phase === 'deal') {
                  setTimeout(onDealComplete, 300)
                } else if (phase === 'flip') {
                  setTimeout(onFlipComplete, 300)
                }
              }
            }}
          >
            {/* Card Back */}
            <div
              className="absolute inset-0 shadow-lg flex items-center justify-center bg-pastel"
              style={{
                backfaceVisibility: 'hidden',
                border: '3px solid #1A1A1A',
              }}
            >
              <div className="w-10 h-14 md:w-12 md:h-18 border-2 border-dark/30" />
            </div>

            {/* Card Front */}
            <div
              className="absolute inset-0 shadow-lg flex items-center justify-center bg-pastel"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                border: '3px solid #1A1A1A',
              }}
            >
              <span className="font-title text-3xl md:text-4xl text-dark">
                {num}
              </span>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}
