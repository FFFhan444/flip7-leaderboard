import { motion } from 'framer-motion'
import { Trophy, Trash2, Plus, Minus } from 'lucide-react'
import type { Player } from '../lib/supabase'

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
      {players.map((player, index) => (
        <motion.div
          key={player.id}
          layout
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-pastel p-4 pixel-corners"
        >
          <div className="flex items-center gap-3">
            {/* Position */}
            <div className="w-8 h-8 border-2 border-dark flex items-center justify-center flex-shrink-0">
              <span className="font-title text-dark text-sm">{index + 1}</span>
            </div>

            {/* Name */}
            <div className="flex-grow min-w-0">
              <h3 className="text-lg font-semibold text-dark truncate">
                {player.name}
              </h3>
            </div>

            {/* Wins */}
            <div className="flex items-center gap-1.5 text-dark">
              <Trophy className="w-5 h-5" />
              <span className="font-bold text-xl">{player.wins}</span>
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
      ))}
    </div>
  )
}
