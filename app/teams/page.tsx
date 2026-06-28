import { TeamsClient } from "@/components/teams-client"
import { getTournamentDataStaticSync } from "@/lib/data/tournament"
import { quickPageMetadata } from "@/lib/seo"

export const metadata = quickPageMetadata({
  title: "Daftar Tim",
  description:
    "48 tim peserta Piala Dunia 2026 dalam 12 grup. Profil, bendera, dan statistik setiap negara.",
  path: "/teams",
})

export const dynamic = "force-static"

export default async function TeamsPage() {
  const data = getTournamentDataStaticSync()
  return <TeamsClient teams={data.teams} />
}