import { TEAM_META } from "@/lib/data/meta"
import type { Match } from "@/lib/types"

import type { BdlPlayerAssist } from "@/lib/api/balldontlie"

const API = "https://api.fifa.com/api/v3"
const SEASON = "285023"

const FIFA_CODE_TO_TEAM = Object.fromEntries(
  Object.entries(TEAM_META).map(([name, meta]) => [meta.code, name])
) as Record<string, string>

interface FifaPaged<T> {
  Results: T[]
  ContinuationToken?: string | null
}

interface FifaCalendarMatch {
  MatchNumber: number | null
  MatchStatus: number
  ResultType: number
  MatchTime: string | null
  HomeTeamScore: number | null
  AwayTeamScore: number | null
}

interface FifaPlayerStat {
  GoalsScored: number
  Assists: number
  ActualMinutesPlayed?: number | null
  PlayerInfo: {
    IdCountry: string
    PlayerName: Array<{ Description: string }>
  }
}

function formatPlayerName(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => {
      if (part.length <= 3 && part === part.toUpperCase()) return part
      return part.charAt(0) + part.slice(1).toLowerCase()
    })
    .join(" ")
}

function mapMatchStatus(m: FifaCalendarMatch): Match["status"] | null {
  if (m.HomeTeamScore == null || m.AwayTeamScore == null) return null
  if (m.MatchStatus === 0 && m.ResultType === 1) return "finished"
  if (m.MatchStatus !== 0) return "live"
  return "finished"
}

/** Live scores from FIFA public API (gratis, tanpa API key). */
export async function fetchFifaLiveOverlay(): Promise<
  Map<number, { status: Match["status"]; homeScore: number | null; awayScore: number | null; minute?: string }>
> {
  const overlay = new Map<
    number,
    { status: Match["status"]; homeScore: number | null; awayScore: number | null; minute?: string }
  >()

  const url = new URL(`${API}/calendar/matches`)
  url.searchParams.set("language", "en")
  url.searchParams.set("count", "500")
  url.searchParams.set("idSeason", SEASON)

  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) return overlay

  const body = (await res.json()) as FifaPaged<FifaCalendarMatch>
  for (const m of body.Results ?? []) {
    if (!m.MatchNumber) continue
    const status = mapMatchStatus(m)
    if (!status) continue
    overlay.set(m.MatchNumber, {
      status,
      homeScore: m.HomeTeamScore,
      awayScore: m.AwayTeamScore,
      minute: status === "live" ? (m.MatchTime ?? "LIVE") : undefined,
    })
  }

  return overlay
}

/** Statistik assist dari FIFA public API (gratis, tanpa API key). */
export async function fetchFifaAssistStats(): Promise<BdlPlayerAssist[]> {
  const url = new URL(`${API}/topseasonplayerstatistics/season/${SEASON}/topscorers`)
  url.searchParams.set("language", "en")
  url.searchParams.set("count", "1500")

  const res = await fetch(url, { next: { revalidate: 300 } })
  if (!res.ok) return []

  const body = (await res.json()) as { PlayerStatsList?: FifaPlayerStat[] }
  return (body.PlayerStatsList ?? [])
    .filter((p) => p.Assists > 0)
    .map((p) => {
      const rawName = p.PlayerInfo.PlayerName[0]?.Description ?? ""
      const teamName = FIFA_CODE_TO_TEAM[p.PlayerInfo.IdCountry] ?? ""
      return {
        name: formatPlayerName(rawName),
        teamName,
        assists: p.Assists,
        goals: p.GoalsScored ?? 0,
        minutes: p.ActualMinutesPlayed ?? 0,
        position: null,
      }
    })
    .filter((r) => r.teamName)
}