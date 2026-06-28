import type { OpenFootballGoal } from "@/lib/api/openfootball"
import type { Match, Stadium, Team } from "@/lib/types"

export interface MatchGoals {
  home: OpenFootballGoal[]
  away: OpenFootballGoal[]
  ht?: [number, number]
  round?: string
}

export interface EnrichedMatch {
  match: Match
  home: Team
  away: Team
  stadium: Stadium
  goals?: MatchGoals
}