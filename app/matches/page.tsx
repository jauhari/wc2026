import { MatchesClient } from "@/components/matches-client"
import { getTournamentData } from "@/lib/data/tournament"
import { enrichMatches } from "@/lib/enrich-matches"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Hasil Pertandingan",
  description:
    "Hasil Piala Dunia 2026: pertandingan live, selesai, dan terjadwal. Skor real-time dari 104 laga.",
  path: "/matches",
})

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