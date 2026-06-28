import { TeamsClient } from "@/components/teams-client"
import { getTournamentData } from "@/lib/data/tournament"

export const revalidate = 120

export default async function TeamsPage() {
  const data = await getTournamentData()
  return <TeamsClient teams={data.teams} />
}