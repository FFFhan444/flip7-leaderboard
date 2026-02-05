import { motion } from 'framer-motion'
import { Trophy, Trash2, Plus, Minus, Crown } from 'lucide-react'
import type { Player } from '../lib/supabase'

// Pixel goat in profile view standing on the winner card (GOAT = Greatest Of All Time)
function PixelGoat() {
  return (
    <motion.div
      className="absolute z-20"
      style={{
        top: -52,
        left: 8
      }}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', bounce: 0.4, delay: 0.3 }}
    >
      <svg width="50" height="48" viewBox="0 0 132 126" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M62 126H55V121H62V126ZM118 125H111V120H118V125ZM48 118H41V113H48V118ZM34 7H27V14H19V21H27V28H34V35H41V42H48V49H69V55H118V48H125V41H132V62H125V69H118V83H111V97H118V117H111V104H104V110H97V97H83V90H62V118H55V90H48V110H41V83H34V76H27V56H20V42H13V48H0V34H6V14H13V7H20V0H34V7ZM104 118H97V113H104V118ZM15 26V33H22V26H15ZM41 14H34V7H41V14Z" className="fill-dark"/>
      </svg>
    </motion.div>
  )
}

// Pixel confetti component for the leader - emits from border edges
function PixelConfetti() {
  // Create random pixels along each edge, hugging closer to the border
  const pixels = [
    // Top edge - random positions
    ...Array.from({ length: 8 }, (_, i) => ({
      id: `top-${i}`,
      x: Math.random() * 100,
      y: -2,
      dx: (Math.random() - 0.5) * 30,
      dy: -10 - Math.random() * 20,
      delay: Math.random() * 4,
      size: Math.random() > 0.5 ? 2 : 1.5,
    })),
    // Bottom edge - random positions
    ...Array.from({ length: 8 }, (_, i) => ({
      id: `bottom-${i}`,
      x: Math.random() * 100,
      y: 102,
      dx: (Math.random() - 0.5) * 30,
      dy: 10 + Math.random() * 20,
      delay: Math.random() * 4,
      size: Math.random() > 0.5 ? 2 : 1.5,
    })),
    // Left edge - random positions
    ...Array.from({ length: 4 }, (_, i) => ({
      id: `left-${i}`,
      x: -2,
      y: Math.random() * 100,
      dx: -10 - Math.random() * 15,
      dy: (Math.random() - 0.5) * 20,
      delay: Math.random() * 4,
      size: Math.random() > 0.5 ? 2 : 1.5,
    })),
    // Right edge - random positions
    ...Array.from({ length: 4 }, (_, i) => ({
      id: `right-${i}`,
      x: 102,
      y: Math.random() * 100,
      dx: 10 + Math.random() * 15,
      dy: (Math.random() - 0.5) * 20,
      delay: Math.random() * 4,
      size: Math.random() > 0.5 ? 2 : 1.5,
    })),
  ]

  return (
    <div className="absolute inset-0 overflow-visible pointer-events-none">
      {pixels.map((pixel) => (
        <motion.div
          key={pixel.id}
          className="absolute bg-dark"
          style={{
            left: `${pixel.x}%`,
            top: `${pixel.y}%`,
            width: pixel.size * 4,
            height: pixel.size * 4,
          }}
          animate={{
            opacity: [0, 1, 1, 0],
            x: [0, pixel.dx, pixel.dx * 1.5],
            y: [0, pixel.dy, pixel.dy * 1.5],
          }}
          transition={{
            duration: 1.5 + Math.random(),
            delay: pixel.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}

type LeaderboardTableProps = {
  players: Player[]
  onRecordWin: (player: Player) => void
  onDockWin: (player: Player) => void
  onDeletePlayer: (playerId: string) => void
}

export function LeaderboardTable({ players, onRecordWin, onDockWin, onDeletePlayer }: LeaderboardTableProps) {
  if (players.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-dark-muted text-lg">No players yet. Add someone to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {players.map((player, index) => {
        const isLeader = index === 0

        return (
        <motion.div
          key={player.id}
          layout
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`bg-pastel p-4 pixel-corners relative ${isLeader ? 'ring-2 ring-dark scale-[1.02] z-10 mt-12 mb-4' : ''}`}
        >
          {isLeader && <PixelGoat />}
          {isLeader && <PixelConfetti />}
          <div className="flex items-center gap-3 relative z-10">
            {/* Position */}
            <div className={`w-8 h-8 border-2 border-dark flex items-center justify-center flex-shrink-0 ${isLeader ? 'bg-dark' : ''}`}>
              {isLeader ? (
                <Crown className="w-5 h-5 text-pastel" />
              ) : (
                <span className="font-title text-dark text-sm">{index + 1}</span>
              )}
            </div>

            {/* Name */}
            <div className="flex-grow min-w-0">
              <h3 className={`font-semibold text-dark truncate ${isLeader ? 'text-xl' : 'text-lg'}`}>
                {player.name}
              </h3>
            </div>

            {/* Wins */}
            <div className="flex items-center gap-1.5 text-dark">
              {isLeader && <Trophy className="w-5 h-5" />}
              <span className={`font-bold ${isLeader ? 'text-2xl' : 'text-xl'}`}>{player.wins}</span>
            </div>

            {/* Win buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => onDockWin(player)}
                disabled={player.wins <= 0}
                className="w-10 h-10 border-2 border-dark flex items-center justify-center text-dark hover:bg-dark hover:text-pastel transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-dark"
                title="Remove win"
              >
                <Minus className="w-5 h-5" />
              </button>
              <button
                onClick={() => onRecordWin(player)}
                className="w-10 h-10 bg-dark text-pastel flex items-center justify-center hover:bg-dark-soft transition-colors pixel-corners-dark"
                title="Add win"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Delete */}
            <button
              onClick={() => onDeletePlayer(player.id)}
              className="p-2 text-dark-muted hover:text-dark transition-colors"
              title="Delete player"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
        )
      })}
    </div>
  )
}
