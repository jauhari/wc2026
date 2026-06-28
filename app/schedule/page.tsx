import { ScheduleClient } from "@/components/schedule-client"
import { getTournamentData } from "@/lib/data/tournament"
import { enrichMatches } from "@/lib/enrich-matches"
import { hostNations } from "@/lib/data/stadiums"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Jadwal Pertandingan",
  description:
    "Jadwal lengkap 104 pertandingan Piala Dunia 2026 di USA, Kanada, dan Meksiko. Waktu WIB.",
  path: "/schedule",
})

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