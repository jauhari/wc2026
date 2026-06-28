import type { EnrichedMatch } from "@/lib/match-enriched"
import type { getTournamentData } from "@/lib/data/tournament"
import { getTeam, getStadium } from "@/lib/data/tournament"
import type { Match } from "@/lib/types"

export function enrichMatches(
  data: Awaited<ReturnType<typeof getTournamentData>>,
  list: Match[]
): EnrichedMatch[] {
  return list.map((match) => ({
    match,
    home: getTeam(data, match.homeId),
    away: getTeam(data, match.awayId),
    stadium: getStadium(data, match.stadiumId),
    goals: data.matchGoals[match.id],
  }))
}