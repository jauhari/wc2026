import { TeamsClient } from "@/components/teams-client"
import { getTournamentData } from "@/lib/data/tournament"
import { quickPageMetadata } from "@/lib/seo"

export const metadata = quickPageMetadata({
  title: "Daftar Tim",
  description:
    "48 tim peserta Piala Dunia 2026 dalam 12 grup. Profil, bendera, dan statistik setiap negara.",
  path: "/teams",
})

export const revalidate = 120

export default async function TeamsPage() {
  const data = await getTournamentData()
  return <TeamsClient teams={data.teams} />
}