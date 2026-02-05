import { useState, useEffect } from 'react'
import { Trophy } from 'lucide-react'
import { SplashScreen } from './components/SplashScreen'
import { LeaderboardTable } from './components/LeaderboardTable'
import { AddPlayerForm } from './components/AddPlayerForm'
import { RecordWinModal } from './components/RecordWinModal'
import { CelebrationOverlay } from './components/CelebrationOverlay/CelebrationOverlay'
import { DockWinOverlay } from './components/DockWinOverlay'
import { usePlayers } from './hooks/usePlayers'
import type { Player } from './lib/supabase'
import './index.css'

function App() {
  const { players, loading, addPlayer, recordWin, dockWin, deletePlayer } = usePlayers()
  const [showSplash, setShowSplash] = useState(true)
  const [splashMinTimePassed, setSplashMinTimePassed] = useState(false)
  const [showWinModal, setShowWinModal] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [showDockWin, setShowDockWin] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashMinTimePassed(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (splashMinTimePassed && !loading) {
      setShowSplash(false)
    }
  }, [splashMinTimePassed, loading])

  const handleSelectWinner = async (player: Player) => {
    setSelectedPlayer(player)
    setShowWinModal(false)
    setShowCelebration(true)
    await recordWin(player.id)
  }

  const handleRecordWin = async (player: Player) => {
    setSelectedPlayer(player)
    setShowCelebration(true)
    await recordWin(player.id)
  }

  const handleDockWin = async (player: Player) => {
    if (player.wins <= 0) return
    setSelectedPlayer(player)
    setShowDockWin(true)
    await dockWin(player.id)
  }

  const handleCelebrationComplete = () => {
    setShowCelebration(false)
    setSelectedPlayer(null)
  }

  const handleDockWinComplete = () => {
    setShowDockWin(false)
    setSelectedPlayer(null)
  }

  const handleDeletePlayer = async (playerId: string) => {
    if (confirm('Are you sure you want to delete this player?')) {
      await deletePlayer(playerId)
    }
  }

  return (
    <>
      <SplashScreen
        isVisible={showSplash}
        onComplete={() => {}}
      />

      <div className="min-h-screen bg-pastel pb-48">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Header */}
          <header className="text-center mb-8">
            <h1 className="font-title text-5xl text-dark">
              Flip 7
            </h1>
          </header>

          {/* Leaderboard */}
          <LeaderboardTable
            players={players}
            onRecordWin={handleRecordWin}
            onDockWin={handleDockWin}
            onDeletePlayer={handleDeletePlayer}
          />
        </div>
      </div>

      {/* Sticky Bottom Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-pastel border-t-2 border-dark/20">
        <div className="max-w-2xl mx-auto px-4 py-4 space-y-3">
          <AddPlayerForm onAddPlayer={addPlayer} />
          <button
            onClick={() => setShowWinModal(true)}
            disabled={players.length === 0}
            className="w-full py-4 bg-dark text-pastel font-semibold text-lg flex items-center justify-center gap-2 hover:bg-dark-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed pixel-corners-dark"
          >
            <Trophy className="w-6 h-6" />
            Record a Win
          </button>
        </div>
      </div>

      {/* Record Win Modal */}
      <RecordWinModal
        isOpen={showWinModal}
        players={players}
        onSelectWinner={handleSelectWinner}
        onClose={() => setShowWinModal(false)}
      />

      {/* Celebration Overlay */}
      <CelebrationOverlay
        isVisible={showCelebration}
        winnerName={selectedPlayer?.name || ''}
        onComplete={handleCelebrationComplete}
      />

      {/* Dock Win Overlay */}
      <DockWinOverlay
        isVisible={showDockWin}
        playerName={selectedPlayer?.name || ''}
        onComplete={handleDockWinComplete}
      />
    </>
  )
}

export default App
