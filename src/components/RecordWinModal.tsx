import { motion, AnimatePresence } from 'framer-motion'
import { X, Trophy } from 'lucide-react'
import type { Player } from '../lib/supabase'

type RecordWinModalProps = {
  isOpen: boolean
  players: Player[]
  onSelectWinner: (player: Player) => void
  onClose: () => void
}

export function RecordWinModal({ isOpen, players, onSelectWinner, onClose }: RecordWinModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-dark/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-pastel shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden pixel-corners"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b-2 border-dark/20">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-dark" />
                <h2 className="font-title text-2xl text-dark">Record Win</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-dark/10 transition-colors"
              >
                <X className="w-5 h-5 text-dark" />
              </button>
            </div>

            {/* Player List */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <p className="text-dark-muted mb-4">Select today's winner:</p>
              <div className="space-y-2">
                {players.map((player) => (
                  <motion.button
                    key={player.id}
                    onClick={() => onSelectWinner(player)}
                    className="w-full p-4 bg-pastel text-left hover:bg-pastel-dark transition-colors pixel-corners"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-dark text-lg">
                        {player.name}
                      </span>
                      <span className="text-dark-muted text-sm">
                        {player.wins} wins
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {players.length === 0 && (
                <p className="text-center text-dark-muted py-8">
                  No players yet. Add some players first!
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
