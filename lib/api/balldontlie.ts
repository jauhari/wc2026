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