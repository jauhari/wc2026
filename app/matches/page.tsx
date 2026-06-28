import { MatchesClient } from "@/components/matches-client"
import { getTournamentData } from "@/lib/data/tournament"
import { enrichMatches } from "@/lib/enrich-matches"

export const revalidate = 120

export default async function MatchesPage() {
  const data = await getTournamentData()

  return (
    <MatchesClient
      live={enrichMatches(data, data.liveMatches)}
      finished={enrichMatches(data, data.finishedMatches)}
      upcoming={enrichMatches(data, data.upcomingMatches)}
    />
  )
}