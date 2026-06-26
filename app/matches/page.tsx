import { MatchesClient } from "@/components/matches-client"
import { getTournamentData, getTeam, getStadium } from "@/lib/data/tournament"

export const revalidate = 60

function enrich(data: Awaited<ReturnType<typeof getTournamentData>>, list: typeof data.matches) {
  return list.map((match) => ({
    match,
    home: getTeam(data, match.homeId),
    away: getTeam(data, match.awayId),
    stadium: getStadium(data, match.stadiumId),
  }))
}

export default async function MatchesPage() {
  const data = await getTournamentData()

  return (
    <MatchesClient
      live={enrich(data, data.liveMatches)}
      finished={enrich(data, data.finishedMatches)}
      upcoming={enrich(data, data.upcomingMatches)}
    />
  )
}