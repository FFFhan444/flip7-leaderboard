import { useState, useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { SplashScreen } from './components/SplashScreen'
import { LeaderboardTable } from './components/LeaderboardTable'
import { AddPlayerForm } from './components/AddPlayerForm'
import { CelebrationOverlay } from './components/CelebrationOverlay/CelebrationOverlay'
import { DockWinOverlay } from './components/DockWinOverlay'
import { ViewToggle } from './components/scoreboard/ViewToggle'
import { ScoreboardTable } from './components/scoreboard/ScoreboardTable'
import { CardSelectorTray } from './components/scoreboard/CardSelectorTray'
import { AddScoreboardPlayerForm } from './components/scoreboard/AddScoreboardPlayerForm'
import { usePlayers } from './hooks/usePlayers'
import { useScoreboard } from './hooks/useScoreboard'
import { useVisualViewportHeight } from './hooks/useVisualViewportHeight'
import { useLockDocumentScroll } from './hooks/useLockDocumentScroll'
import type { Player } from './lib/supabase'
import type { ScoreboardPlayer, Card } from './lib/scoreboard'
import './index.css'

function App() {
  const { players, loading, addPlayer, recordWin, dockWin, deletePlayer } = usePlayers()
  const scoreboard = useScoreboard()
  const viewportHeight = useVisualViewportHeight()
  useLockDocumentScroll()
  const [showSplash, setShowSplash] = useState(true)
  const [splashMinTimePassed, setSplashMinTimePassed] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [showDockWin, setShowDockWin] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [activeView, setActiveView] = useState<'leaderboard' | 'scoreboard'>('leaderboard')
  const [scoringPlayer, setScoringPlayer] = useState<ScoreboardPlayer | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [players.length, scoreboard.players.length])

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

  const handleScorePlayer = (player: ScoreboardPlayer) => {
    setScoringPlayer(player)
  }

  const handleDeleteScoreboardPlayer = (playerId: string) => {
    if (confirm('Are you sure you want to delete this player?')) {
      scoreboard.removePlayer(playerId)
      if (scoringPlayer?.id === playerId) {
        setScoringPlayer(null)
      }
    }
  }

  const handleNewGame = () => {
    if (confirm('Start a new game? Scores will be reset but players will be kept.')) {
      scoreboard.newGame()
      setScoringPlayer(null)
    }
  }

  const handleResetAll = () => {
    if (confirm('Reset everything? All players and scores will be removed.')) {
      scoreboard.resetAll()
      setScoringPlayer(null)
    }
  }

  const handleSubmitRound = (playerId: string, cards: Card[], manualScore?: number) => {
    scoreboard.submitRound(playerId, cards, manualScore)
    setScoringPlayer(null)
  }

  return (
    <>
      <SplashScreen
        isVisible={showSplash}
        onComplete={() => {}}
      />

      <div
        className="fixed top-0 left-0 w-full h-dvh flex flex-col bg-pastel overflow-hidden"
        style={viewportHeight !== null ? { height: `${viewportHeight}px` } : undefined}
      >
        {/* Header */}
        <header className="shrink-0 flex items-center justify-between max-w-2xl w-full mx-auto px-4 pt-8">
          <h1 className="font-title text-5xl text-dark">
            Flip 7
          </h1>
          <ViewToggle activeView={activeView} onViewChange={setActiveView} />
        </header>

        {/* Content */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 py-8">
            {activeView === 'leaderboard' ? (
              <LeaderboardTable
                players={players}
                onRecordWin={handleRecordWin}
                onDockWin={handleDockWin}
                onDeletePlayer={handleDeletePlayer}
              />
            ) : (
              <ScoreboardTable
                players={scoreboard.players}
                onScorePlayer={handleScorePlayer}
                onDeletePlayer={handleDeleteScoreboardPlayer}
                onNewGame={handleNewGame}
                onResetAll={handleResetAll}
                scoringPlayerId={scoringPlayer?.id ?? null}
              />
            )}
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="shrink-0 bg-pastel border-t-2 border-dark">
          <div className="max-w-2xl mx-auto px-4 pt-4 pb-8">
            {activeView === 'leaderboard' ? (
              <AddPlayerForm onAddPlayer={addPlayer} />
            ) : (
              <AnimatePresence mode="wait">
                {scoringPlayer ? (
                  <CardSelectorTray
                    key="card-selector"
                    player={scoringPlayer}
                    onSubmit={handleSubmitRound}
                    onCancel={() => setScoringPlayer(null)}
                  />
                ) : (
                  <AddScoreboardPlayerForm
                    key="add-player"
                    onAddPlayer={scoreboard.addPlayer}
                  />
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

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
