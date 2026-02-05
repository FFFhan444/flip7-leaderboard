import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Player } from '../lib/supabase'

const STORAGE_KEY = 'flip7-players'

function getLocalPlayers(): Player[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

function setLocalPlayers(players: Player[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(players))
}

export function usePlayers() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPlayers = useCallback(async () => {
    if (supabase) {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('wins', { ascending: false })

      if (error) {
        setError(error.message)
      } else {
        setPlayers(data || [])
      }
    } else {
      setPlayers(getLocalPlayers().sort((a, b) => b.wins - a.wins))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchPlayers()

    if (supabase) {
      const channel = supabase
        .channel('players-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'players' },
          () => {
            fetchPlayers()
          }
        )
        .subscribe()

      return () => {
        supabase?.removeChannel(channel)
      }
    }
  }, [fetchPlayers])

  const addPlayer = async (name: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedName = name.trim()

    if (!trimmedName) {
      return { success: false, error: 'Name cannot be empty' }
    }

    const existingPlayer = players.find(
      p => p.name.toLowerCase() === trimmedName.toLowerCase()
    )
    if (existingPlayer) {
      return { success: false, error: 'A player with this name already exists' }
    }

    if (supabase) {
      const { error } = await supabase
        .from('players')
        .insert({ name: trimmedName, wins: 0 })

      if (error) {
        return { success: false, error: error.message }
      }
    } else {
      const newPlayer: Player = {
        id: crypto.randomUUID(),
        name: trimmedName,
        wins: 0,
        created_at: new Date().toISOString()
      }
      const updated = [...getLocalPlayers(), newPlayer]
      setLocalPlayers(updated)
      setPlayers(updated.sort((a, b) => b.wins - a.wins))
    }

    return { success: true }
  }

  const recordWin = async (playerId: string): Promise<{ success: boolean; error?: string }> => {
    const player = players.find(p => p.id === playerId)
    if (!player) {
      return { success: false, error: 'Player not found' }
    }

    if (supabase) {
      const { error } = await supabase
        .from('players')
        .update({ wins: player.wins + 1 })
        .eq('id', playerId)

      if (error) {
        return { success: false, error: error.message }
      }
    } else {
      const localPlayers = getLocalPlayers()
      const updated = localPlayers.map(p =>
        p.id === playerId ? { ...p, wins: p.wins + 1 } : p
      )
      setLocalPlayers(updated)
      setPlayers(updated.sort((a, b) => b.wins - a.wins))
    }

    return { success: true }
  }

  const dockWin = async (playerId: string): Promise<{ success: boolean; error?: string }> => {
    const player = players.find(p => p.id === playerId)
    if (!player) {
      return { success: false, error: 'Player not found' }
    }

    if (player.wins <= 0) {
      return { success: false, error: 'Cannot have negative wins' }
    }

    if (supabase) {
      const { error } = await supabase
        .from('players')
        .update({ wins: player.wins - 1 })
        .eq('id', playerId)

      if (error) {
        return { success: false, error: error.message }
      }
    } else {
      const localPlayers = getLocalPlayers()
      const updated = localPlayers.map(p =>
        p.id === playerId ? { ...p, wins: p.wins - 1 } : p
      )
      setLocalPlayers(updated)
      setPlayers(updated.sort((a, b) => b.wins - a.wins))
    }

    return { success: true }
  }

  const deletePlayer = async (playerId: string): Promise<{ success: boolean; error?: string }> => {
    if (supabase) {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', playerId)

      if (error) {
        return { success: false, error: error.message }
      }
    } else {
      const localPlayers = getLocalPlayers()
      const updated = localPlayers.filter(p => p.id !== playerId)
      setLocalPlayers(updated)
      setPlayers(updated.sort((a, b) => b.wins - a.wins))
    }

    return { success: true }
  }

  return {
    players,
    loading,
    error,
    addPlayer,
    recordWin,
    dockWin,
    deletePlayer,
    refetch: fetchPlayers
  }
}
