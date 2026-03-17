import { Trophy, Calculator } from 'lucide-react'

type ViewToggleProps = {
  activeView: 'leaderboard' | 'scoreboard'
  onViewChange: (view: 'leaderboard' | 'scoreboard') => void
}

export function ViewToggle({ activeView, onViewChange }: ViewToggleProps) {
  const nextView = activeView === 'leaderboard' ? 'scoreboard' : 'leaderboard'
  const Icon = nextView === 'leaderboard' ? Trophy : Calculator

  return (
    <button
      onClick={() => onViewChange(nextView)}
      className="w-10 h-10 border-2 border-dark flex items-center justify-center text-dark hover:bg-dark hover:text-pastel transition-colors"
      title={`Switch to ${nextView}`}
    >
      <Icon className="w-5 h-5" />
    </button>
  )
}
