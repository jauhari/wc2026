import type { Match } from "@/lib/types"

const BASE = "https://api.balldontlie.io/fifa/worldcup/v1"

interface BdlTeam {
  id: number
  name: string
  abbreviation: string | null
}

interface BdlMatch {
  id: number
  match_number: number | null
  datetime: string
  status: string
  clock_display: string | null
  home_team: BdlTeam | null
  away_team: BdlTeam | null
  home_score: number | null
  away_score: number | null
  stage: { name: string }
  group: { name: string } | null
}

interface BdlResponse {
  data: BdlMatch[]
  meta?: { next_cursor?: number | null }
}

function mapStatus(status: string): Match["status"] {
  if (status === "in_progress") return "live"
  if (status === "completed") return "finished"
  return "scheduled"
}

/** Overlay live scores from BallDontLie when API key is available (GOAT tier). */
export async function fetchLiveOverlay(
  apiKey: string
): Promise<Map<number, { status: Match["status"]; homeScore: number | null; awayScore: number | null; minute?: string }>> {
  const overlay = new Map<
    number,
    { status: Match["status"]; homeScore: number | null; awayScore: number | null; minute?: string }
  >()

  let cursor: number | undefined
  do {
    const url = new URL(`${BASE}/matches`)
    url.searchParams.set("seasons[]", "2026")
    url.searchParams.set("per_page", "100")
    if (cursor) url.searchParams.set("cursor", String(cursor))

    const res = await fetch(url, {
      headers: { Authorization: apiKey },
      next: { revalidate: 30 },
    })
    if (!res.ok) return overlay

    const body = (await res.json()) as BdlResponse
    for (const m of body.data) {
      if (!m.match_number) continue
      overlay.set(m.match_number, {
        status: mapStatus(m.status),
        homeScore: m.home_score,
        awayScore: m.away_score,
        minute: m.clock_display ?? undefined,
      })
    }
    cursor = body.meta?.next_cursor ?? undefined
  } while (cursor)

  return overlay
}

interface BdlPage<T> {
  data: T[]
  meta?: { next_cursor?: number | null }
}

interface BdlRosterEntry {
  team_id: number
  player: {
    name: string
    short_name?: string | null
    position?: string | null
  }
  goals: number
  assists: number
  minutes_played: number
}

interface BdlMatchEvent {
  incident_type: string
  is_home: boolean | null
  player: { name: string } | null
  assist_player: { name: string } | null
  match_id: number
}

interface BdlMatchTeams {
  id: number
  home_team: BdlTeam | null
  away_team: BdlTeam | null
}

export interface BdlPlayerAssist {
  name: string
  teamName: string
  assists: number
  goals: number
  position?: string | null
  minutes: number
}

async function fetchAllPages<T>(
  path: string,
  apiKey: string,
  revalidate: number
): Promise<T[]> {
  const rows: T[] = []
  let cursor: number | undefined

  do {
    const url = new URL(`${BASE}/${path}`)
    url.searchParams.set("seasons[]", "2026")
    url.searchParams.set("per_page", "100")
    if (cursor) url.searchParams.set("cursor", String(cursor))

    const res = await fetch(url, {
      headers: { Authorization: apiKey },
      next: { revalidate },
    })
    if (!res.ok) break

    const body = (await res.json()) as BdlPage<T>
    rows.push(...body.data)
    cursor = body.meta?.next_cursor ?? undefined
  } while (cursor)

  return rows
}

/** Tournament assist totals from BallDontLie rosters (GOAT tier). */
export async function fetchRosterAssists(apiKey: string): Promise<BdlPlayerAssist[]> {
  const rosters = await fetchAllPages<BdlRosterEntry>("rosters", apiKey, 60)
  if (!rosters.length) return []

  const teams = await fetchAllPages<BdlTeam>("teams", apiKey, 3600)
  const teamName = new Map(teams.map((t) => [t.id, t.name]))

  return rosters
    .filter((r) => r.assists > 0)
    .map((r) => ({
      name: r.player.name,
      teamName: teamName.get(r.team_id) ?? "",
      assists: r.assists,
      goals: r.goals,
      position: r.player.position,
      minutes: r.minutes_played,
    }))
    .filter((r) => r.teamName)
}

/** Fallback: hitung assist dari match events (goal + assist_player). */
export async function fetchAssistsFromEvents(apiKey: string): Promise<BdlPlayerAssist[]> {
  const [events, matches] = await Promise.all([
    fetchAllPages<BdlMatchEvent>("match_events", apiKey, 60),
    fetchAllPages<BdlMatchTeams>("matches", apiKey, 60),
  ])
  if (!events.length) return []

  const matchTeams = new Map(
    matches.map((m) => [
      m.id,
      { home: m.home_team?.name ?? "", away: m.away_team?.name ?? "" },
    ])
  )

  const tally = new Map<string, BdlPlayerAssist>()

  for (const ev of events) {
    if (ev.incident_type !== "goal" || !ev.assist_player?.name) continue
    const teams = matchTeams.get(ev.match_id)
    if (!teams) continue

    const teamName = ev.is_home ? teams.home : teams.away
    if (!teamName) continue

    const key = `${ev.assist_player.name}|${teamName}`
    const row = tally.get(key)
    if (row) {
      row.assists++
    } else {
      tally.set(key, {
        name: ev.assist_player.name,
        teamName,
        assists: 1,
        goals: 0,
        minutes: 0,
      })
    }
  }

  return [...tally.values()]
}

export async function fetchAssistStats(apiKey: string): Promise<BdlPlayerAssist[]> {
  const fromRosters = await fetchRosterAssists(apiKey)
  if (fromRosters.length) return fromRosters
  return fetchAssistsFromEvents(apiKey)
}