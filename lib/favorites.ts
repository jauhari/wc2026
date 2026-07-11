export const FAVORITES_STORAGE_KEY = "wc2026-favorites"

export interface FavoritesState {
  teams: string[]
  players: string[]
}

export const EMPTY_FAVORITES: FavoritesState = {
  teams: [],
  players: [],
}

export function parseFavorites(raw: string | null): FavoritesState {
  if (!raw) return EMPTY_FAVORITES
  try {
    const parsed = JSON.parse(raw) as Partial<FavoritesState>
    return {
      teams: Array.isArray(parsed.teams) ? parsed.teams.filter((id) => typeof id === "string") : [],
      players: Array.isArray(parsed.players) ? parsed.players.filter((id) => typeof id === "string") : [],
    }
  } catch {
    return EMPTY_FAVORITES
  }
}