import { ScheduleClient } from "@/components/schedule-client"
import { getTournamentData } from "@/lib/data/tournament"
import { enrichMatches } from "@/lib/enrich-matches"
import { hostNations } from "@/lib/data/stadiums"

export const revalidate = 120

export default async function SchedulePage() {
  const data = await getTournamentData()

  return (
    <ScheduleClient
      matches={enrichMatches(data, data.matches)}
      hostNations={hostNations}
    />
  )
}