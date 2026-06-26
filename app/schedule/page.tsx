import { ScheduleClient } from "@/components/schedule-client"
import { getTournamentData, getTeam, getStadium } from "@/lib/data/tournament"
import { hostNations } from "@/lib/data/stadiums"

export const revalidate = 60

export default async function SchedulePage() {
  const data = await getTournamentData()

  const matches = data.matches.map((match) => ({
    match,
    home: getTeam(data, match.homeId),
    away: getTeam(data, match.awayId),
    stadium: getStadium(data, match.stadiumId),
  }))

  return <ScheduleClient matches={matches} hostNations={hostNations} />
}