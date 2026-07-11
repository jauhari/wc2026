"use client"

import * as React from "react"
import { toast } from "sonner"

import {
  EMPTY_FAVORITES,
  FAVORITES_STORAGE_KEY,
  parseFavorites,
  type FavoritesState,
} from "@/lib/favorites"

interface FavoritesContextValue {
  ready: boolean
  favoriteTeams: string[]
  favoritePlayers: string[]
  isTeamFavorite: (teamId: string) => boolean
  isPlayerFavorite: (playerId: string) => boolean
  toggleTeamFavorite: (teamId: string, label?: string) => void
  togglePlayerFavorite: (playerId: string, label?: string) => void
  removeTeamFavorite: (teamId: string) => void
  removePlayerFavorite: (playerId: string) => void
}

const FavoritesContext = React.createContext<FavoritesContextValue | null>(null)

const listeners = new Set<() => void>()

function readFavorites(): FavoritesState {
  if (typeof window === "undefined") return EMPTY_FAVORITES
  return parseFavorites(localStorage.getItem(FAVORITES_STORAGE_KEY))
}

function writeFavorites(next: FavoritesState) {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next))
  for (const listener of listeners) {
    listener()
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const state = React.useSyncExternalStore(subscribe, readFavorites, () => EMPTY_FAVORITES)
  const ready = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  const toggleTeamFavorite = React.useCallback((teamId: string, label?: string) => {
    const prev = readFavorites()
    const exists = prev.teams.includes(teamId)
    const teams = exists ? prev.teams.filter((id) => id !== teamId) : [...prev.teams, teamId]
    writeFavorites({ ...prev, teams })
    toast.success(
      exists
        ? `${label ?? "Tim"} dihapus dari favorit`
        : `${label ?? "Tim"} ditambahkan ke favorit`
    )
  }, [])

  const togglePlayerFavorite = React.useCallback((playerId: string, label?: string) => {
    const prev = readFavorites()
    const exists = prev.players.includes(playerId)
    const players = exists
      ? prev.players.filter((id) => id !== playerId)
      : [...prev.players, playerId]
    writeFavorites({ ...prev, players })
    toast.success(
      exists
        ? `${label ?? "Pemain"} dihapus dari favorit`
        : `${label ?? "Pemain"} ditambahkan ke favorit`
    )
  }, [])

  const removeTeamFavorite = React.useCallback((teamId: string) => {
    const prev = readFavorites()
    writeFavorites({
      ...prev,
      teams: prev.teams.filter((id) => id !== teamId),
    })
  }, [])

  const removePlayerFavorite = React.useCallback((playerId: string) => {
    const prev = readFavorites()
    writeFavorites({
      ...prev,
      players: prev.players.filter((id) => id !== playerId),
    })
  }, [])

  const value = React.useMemo<FavoritesContextValue>(
    () => ({
      ready,
      favoriteTeams: state.teams,
      favoritePlayers: state.players,
      isTeamFavorite: (teamId) => state.teams.includes(teamId),
      isPlayerFavorite: (playerId) => state.players.includes(playerId),
      toggleTeamFavorite,
      togglePlayerFavorite,
      removeTeamFavorite,
      removePlayerFavorite,
    }),
    [
      ready,
      state.teams,
      state.players,
      toggleTeamFavorite,
      togglePlayerFavorite,
      removeTeamFavorite,
      removePlayerFavorite,
    ]
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const ctx = React.useContext(FavoritesContext)
  if (!ctx) {
    throw new Error("useFavorites must be used within FavoritesProvider")
  }
  return ctx
}