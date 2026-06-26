// Domain types for the 2026 FIFA World Cup monitor

export type GroupId = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L"

export type Country = "USA" | "CAN" | "MEX"

export type MatchStatus = "scheduled" | "live" | "finished"

export type KnockoutRound =
  | "R32"
  | "R16"
  | "QF"
  | "SF"
  | "3RD"
  | "FINAL"

export interface Team {
  id: string
  name: string
  shortName: string
  /** ISO-style trigram, e.g. "BRA" */
  code: string
  /** flagcdn.com slug, e.g. "br", "gb-eng" */
  flag: string
  group: GroupId
  /** Pot the team was drawn from (1 = top seeds) */
  pot: 1 | 2 | 3 | 4
  /** Past World Cup titles */
  titles: number
  /** Confederation */
  confederation: string
}

export interface Stadium {
  id: string
  name: string
  city: string
  country: Country
  capacity: number
}

export interface Match {
  id: string
  /** Official FIFA match number (1–104) */
  matchNumber?: number
  /** Kickoff in ISO format (local time at venue) */
  kickoff: string
  status: MatchStatus
  homeId: string
  awayId: string
  homeScore: number | null
  awayScore: number | null
  stadiumId: string
  /** Which group stage group, or the knockout round */
  stage: GroupId | KnockoutRound
  /** Live minute, e.g. "67'" or "HT" when status is live */
  minute?: string
}

export interface StandingRow {
  teamId: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
}

export interface Scorer {
  id: string
  name: string
  teamId: string
  position: string
  goals: number
  assists: number
  /** minutes played */
  minutes: number
}

export interface BracketMatch {
  id: string
  round: KnockoutRound
  /** Index within the round, top-to-bottom */
  index: number
  homeId: string | null
  awayId: string | null
  homeScore: number | null
  awayScore: number | null
  /** Winner advances; null if not yet decided */
  winnerId: string | null
  /** Link to next bracket match id */
  nextMatchId: string | null
  kickoff: string
  status: MatchStatus
}

export interface HostNation {
  code: Country
  name: string
  flag: string
}
