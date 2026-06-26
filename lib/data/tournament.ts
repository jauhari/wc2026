import { cache } from "react"

import {
  fetchOpenFootball,
  fetchOpenFootballLocal,
  type OpenFootballGoal,
  type OpenFootballMatch,
} from "@/lib/api/openfootball"
import { fetchLiveOverlay } from "@/lib/api/balldontlie"
import {
  GROUND_TO_STADIUM,
  GROUPS,
  KNOCKOUT_LABELS,
  ROUND_TO_KNOCKOUT,
  TEAM_META,
  groupLetter,
  isPlaceholderTeam,
  teamSlug,
} from "@/lib/data/meta"
import type {
  BracketMatch,
  GroupId,
  KnockoutRound,
  Match,
  MatchStatus,
  Scorer,
  Stadium,
  StandingRow,
  Team,
} from "@/lib/types"

export interface TournamentData {
  teams: Team[]
  teamMap: Record<string, Team>
  stadiums: Stadium[]
  stadiumMap: Record<string, Stadium>
  matches: Match[]
  matchMap: Record<string, Match>
  standingsByGroup: Record<GroupId, StandingRow[]>
  bracketMatches: BracketMatch[]
  scorers: Scorer[]
  topScorers: Scorer[]
  topAssists: Scorer[]
  liveMatches: Match[]
  finishedMatches: Match[]
  upcomingMatches: Match[]
  totalGoals: number
  fetchedAt: string
  source: string
  matchGoals: Record<string, { home: OpenFootballGoal[]; away: OpenFootballGoal[] }>
}

export { KNOCKOUT_LABELS as roundLabels }
export const roundOrder: KnockoutRound[] = ["R32", "R16", "QF", "SF", "3RD", "FINAL"]

function parseKickoff(date: string, time: string): string {
  const m = time.match(/^(\d{2}):(\d{2})\s+UTC([+-]?\d+)/)
  if (!m) return `${date}T18:00:00Z`
  const [, hh, mm, offset] = m
  const sign = offset.startsWith("-") ? "-" : "+"
  const abs = offset.replace(/^[-+]/, "").padStart(2, "0")
  return `${date}T${hh}:${mm}:00${sign}${abs}:00`
}

function inferStatus(
  kickoffIso: string,
  hasScore: boolean,
  overlay?: { status: MatchStatus; minute?: string }
): { status: MatchStatus; minute?: string } {
  if (overlay) return { status: overlay.status, minute: overlay.minute }
  if (hasScore) return { status: "finished" }
  const kickoff = new Date(kickoffIso).getTime()
  const now = Date.now()
  const matchEnd = kickoff + 2.5 * 60 * 60 * 1000
  if (now < kickoff) return { status: "scheduled" }
  if (now >= kickoff && now <= matchEnd) return { status: "live", minute: "LIVE" }
  return { status: "scheduled" }
}

function buildTeam(name: string, group: GroupId | null): Team {
  const meta = TEAM_META[name]
  const placeholder = isPlaceholderTeam(name)
  return {
    id: teamSlug(name),
    name: placeholder ? name : name,
    shortName: placeholder
      ? name
      : name.length > 14
        ? (meta?.code ?? name.slice(0, 12))
        : name,
    code: meta?.code ?? name.slice(0, 3).toUpperCase(),
    flag: meta?.flag ?? "tbd",
    group: group ?? "A", // only used for real teams; placeholders excluded from standings
    pot: 3,
    titles: meta?.titles ?? 0,
    confederation: meta?.confederation ?? "TBD",
  }
}

function buildStadiums(): { stadiums: Stadium[]; stadiumMap: Record<string, Stadium> } {
  const stadiums = Object.values(GROUND_TO_STADIUM)
  const stadiumMap = Object.fromEntries(stadiums.map((s) => [s.id, s]))
  return { stadiums, stadiumMap }
}

function emptyStanding(teamId: string): StandingRow {
  return {
    teamId,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
  }
}

function computeStandings(matches: Match[], teams: Team[]): Record<GroupId, StandingRow[]> {
  const teamGroup = Object.fromEntries(teams.map((t) => [t.id, t.group]))
  const rows: Record<GroupId, Record<string, StandingRow>> = {} as Record<
    GroupId,
    Record<string, StandingRow>
  >

  for (const g of GROUPS) rows[g] = {}

  for (const m of matches) {
    if (typeof m.stage !== "string" || m.stage.length !== 1) continue
    if (m.status !== "finished" || m.homeScore === null || m.awayScore === null) continue

    const group = m.stage as GroupId
    rows[group][m.homeId] ??= emptyStanding(m.homeId)
    rows[group][m.awayId] ??= emptyStanding(m.awayId)

    const home = rows[group][m.homeId]
    const away = rows[group][m.awayId]
    const hs = m.homeScore
    const as = m.awayScore

    home.played++
    away.played++
    home.goalsFor += hs
    home.goalsAgainst += as
    away.goalsFor += as
    away.goalsAgainst += hs

    if (hs > as) {
      home.won++
      home.points += 3
      away.lost++
    } else if (hs < as) {
      away.won++
      away.points += 3
      home.lost++
    } else {
      home.drawn++
      away.drawn++
      home.points++
      away.points++
    }
  }

  // Ensure all real group teams appear (skip knockout placeholders like 1F, W73)
  for (const t of teams) {
    if (isPlaceholderTeam(t.name)) continue
    rows[t.group][t.id] ??= emptyStanding(t.id)
  }

  const out = {} as Record<GroupId, StandingRow[]>
  for (const g of GROUPS) {
    out[g] = Object.values(rows[g])
      .map((r) => ({ ...r, goalDifference: r.goalsFor - r.goalsAgainst }))
      .sort(
        (a, b) =>
          b.points - a.points ||
          b.goalDifference - a.goalDifference ||
          b.goalsFor - a.goalsFor ||
          a.teamId.localeCompare(b.teamId)
      )
  }
  return out
}

function buildScorers(
  raw: OpenFootballMatch[],
  matchIds: Map<string, string>,
  teamIds: Map<string, string>
): Scorer[] {
  const map = new Map<string, Scorer>()

  for (const m of raw) {
    if (!m.score?.ft) continue
    const matchId = matchIds.get(`${m.date}|${m.team1}|${m.team2}|${m.num ?? ""}`)
    if (!matchId) continue

    const addGoal = (goal: OpenFootballGoal, teamName: string) => {
      const teamId = teamIds.get(teamName)
      if (!teamId || isPlaceholderTeam(teamName)) return
      const key = `${goal.name}|${teamId}`
      const existing = map.get(key)
      if (existing) {
        existing.goals++
      } else {
        map.set(key, {
          id: teamSlug(`${goal.name}-${teamId}`),
          name: goal.name,
          teamId,
          position: "FW",
          goals: 1,
          assists: 0,
          minutes: 0,
        })
      }
    }

    for (const g of m.goals1 ?? []) {
      if (!g.owngoal) addGoal(g, m.team1)
    }
    for (const g of m.goals2 ?? []) {
      if (!g.owngoal) addGoal(g, m.team2)
    }
  }

  return [...map.values()].sort((a, b) => b.goals - a.goals || a.name.localeCompare(b.name))
}

function buildBracket(matches: Match[]): BracketMatch[] {
  const knockout = matches.filter((m) => typeof m.stage !== "string" || m.stage.length > 1)
  const byRound = {} as Record<KnockoutRound, Match[]>
  for (const r of roundOrder) byRound[r] = []

  for (const m of knockout) {
    const round = m.stage as KnockoutRound
    byRound[round]?.push(m)
  }

  const bracket: BracketMatch[] = []
  for (const round of roundOrder) {
    const list = (byRound[round] ?? []).sort((a, b) => a.kickoff.localeCompare(b.kickoff))
    list.forEach((m, index) => {
      const homeWon =
        m.homeScore !== null && m.awayScore !== null && m.homeScore > m.awayScore
      const awayWon =
        m.homeScore !== null && m.awayScore !== null && m.awayScore > m.homeScore
      bracket.push({
        id: m.id,
        round,
        index,
        homeId: m.homeId,
        awayId: m.awayId,
        homeScore: m.homeScore,
        awayScore: m.awayScore,
        winnerId: homeWon ? m.homeId : awayWon ? m.awayId : null,
        nextMatchId: null,
        kickoff: m.kickoff,
        status: m.status,
      })
    })
  }
  return bracket
}

function transform(
  raw: OpenFootballMatch[],
  liveOverlay?: Map<number, { status: MatchStatus; homeScore: number | null; awayScore: number | null; minute?: string }>
): TournamentData {
  const { stadiums, stadiumMap } = buildStadiums()
  const teamNames = new Set<string>()
  const teamGroups = new Map<string, GroupId>()

  for (const m of raw) {
    teamNames.add(m.team1)
    teamNames.add(m.team2)
    const g = groupLetter(m.group)
    if (g) {
      teamGroups.set(m.team1, g)
      teamGroups.set(m.team2, g)
    }
  }

  const teams = [...teamNames]
    .filter((n) => !isPlaceholderTeam(n))
    .map((name) => buildTeam(name, teamGroups.get(name) ?? null))
    .sort((a, b) => a.name.localeCompare(b.name))

  const teamMap = Object.fromEntries(teams.map((t) => [t.id, t]))
  const nameToId = new Map(teams.map((t) => [t.name, t.id]))

  const resolveTeamId = (name: string): string => {
    if (nameToId.has(name)) return nameToId.get(name)!
    const slug = teamSlug(name)
    if (!teamMap[slug]) {
      teamMap[slug] = buildTeam(name, null)
      teams.push(teamMap[slug])
      nameToId.set(name, slug)
    }
    return slug
  }

  const matches: Match[] = []
  const matchKeyToId = new Map<string, string>()
  const matchGoals: TournamentData["matchGoals"] = {}

  raw.forEach((m, idx) => {
    const stadium = GROUND_TO_STADIUM[m.ground]
    if (!stadium) return

    const kickoff = parseKickoff(m.date, m.time)
    const hasScore = Boolean(m.score?.ft)
    const overlay = m.num ? liveOverlay?.get(m.num) : undefined
    const { status, minute } = inferStatus(kickoff, hasScore, overlay)

    const group = groupLetter(m.group)
    const knockout = ROUND_TO_KNOCKOUT[m.round]
    const stage: GroupId | KnockoutRound = group ?? knockout ?? "A"

    const homeScore = overlay?.homeScore ?? (hasScore ? m.score!.ft[0] : null)
    const awayScore = overlay?.awayScore ?? (hasScore ? m.score!.ft[1] : null)

    const id = m.num ? `m${m.num}` : `m${idx + 1}`
    const match: Match = {
      id,
      kickoff,
      status: overlay ? overlay.status : status,
      homeId: resolveTeamId(m.team1),
      awayId: resolveTeamId(m.team2),
      homeScore,
      awayScore,
      stadiumId: stadium.id,
      stage,
      minute: overlay?.minute ?? (status === "live" ? minute : undefined),
      matchNumber: m.num,
    }

    matches.push(match)
    matchKeyToId.set(`${m.date}|${m.team1}|${m.team2}|${m.num ?? ""}`, id)
    if (m.goals1 || m.goals2) {
      matchGoals[id] = { home: m.goals1 ?? [], away: m.goals2 ?? [] }
    }
  })

  const matchMap = Object.fromEntries(matches.map((m) => [m.id, m]))
  const standingsByGroup = computeStandings(matches, teams)
  const scorers = buildScorers(raw, matchKeyToId, nameToId)
  const topScorers = [...scorers].sort((a, b) => b.goals - a.goals || b.assists - a.assists)
  const topAssists = [...topScorers].sort((a, b) => b.assists - a.assists || b.goals - a.goals)
  const bracketMatches = buildBracket(matches)

  const liveMatches = matches.filter((m) => m.status === "live")
  const finishedMatches = matches
    .filter((m) => m.status === "finished")
    .sort((a, b) => b.kickoff.localeCompare(a.kickoff))
  const upcomingMatches = matches
    .filter((m) => m.status === "scheduled")
    .sort((a, b) => a.kickoff.localeCompare(b.kickoff))
  const totalGoals = matches
    .filter((m) => m.status !== "scheduled")
    .reduce((s, m) => s + (m.homeScore ?? 0) + (m.awayScore ?? 0), 0)

  const realTeams = teams.filter((t) => !isPlaceholderTeam(t.name))

  return {
    teams: realTeams,
    teamMap,
    stadiums,
    stadiumMap,
    matches,
    matchMap,
    standingsByGroup,
    bracketMatches,
    scorers,
    topScorers,
    topAssists,
    liveMatches,
    finishedMatches,
    upcomingMatches,
    totalGoals,
    fetchedAt: new Date().toISOString(),
    source: liveOverlay ? "openfootball+balldontlie" : "openfootball",
    matchGoals,
  }
}

async function loadRaw(): Promise<{ data: Awaited<ReturnType<typeof fetchOpenFootball>>; source: string }> {
  try {
    const data = await fetchOpenFootball()
    return { data, source: "openfootball" }
  } catch {
    const data = await fetchOpenFootballLocal()
    return { data, source: "openfootball-local" }
  }
}

export const getTournamentData = cache(async (): Promise<TournamentData> => {
  const { data } = await loadRaw()
  let overlay: Awaited<ReturnType<typeof fetchLiveOverlay>> | undefined
  const apiKey = process.env.BALLDONTLIE_API_KEY
  if (apiKey) {
    try {
      overlay = await fetchLiveOverlay(apiKey)
    } catch {
      /* optional */
    }
  }
  const result = transform(data.matches, overlay)
  return { ...result, source: overlay ? "openfootball+balldontlie" : result.source }
})

export function getGroupStandings(data: TournamentData, groupId: GroupId): StandingRow[] {
  return data.standingsByGroup[groupId] ?? []
}

export function getTeam(data: TournamentData, id: string): Team {
  const team = data.teamMap[id]
  if (!team) throw new Error(`Unknown team id: ${id}`)
  return team
}

export function getStadium(data: TournamentData, id: string): Stadium {
  const stadium = data.stadiumMap[id]
  if (!stadium) throw new Error(`Unknown stadium id: ${id}`)
  return stadium
}

export function getBracketByRound(data: TournamentData, round: KnockoutRound): BracketMatch[] {
  return data.bracketMatches.filter((m) => m.round === round)
}

export function matchesForTeam(data: TournamentData, teamId: string): Match[] {
  return data.matches
    .filter((m) => m.homeId === teamId || m.awayId === teamId)
    .sort((a, b) => a.kickoff.localeCompare(b.kickoff))
}