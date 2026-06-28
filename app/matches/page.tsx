import { MatchesClient } from "@/components/matches-client"
import { getTournamentDataStaticSync } from "@/lib/data/tournament"
import { enrichMatches } from "@/lib/enrich-matches"
import { quickPageMetadata } from "@/lib/seo"

export const metadata = quickPageMetadata({
  title: "Hasil Pertandingan",
  description:
    "Hasil Piala Dunia 2026: pertandingan live, selesai, dan terjadwal. Skor real-time dari 104 laga.",
  path: "/matches",
})

export const dynamic = "force-static"

export default async function MatchesPage() {
  const data = getTournamentDataStaticSync()

  return (
    <MatchesClient
      live={enrichMatches(data, data.liveMatches)}
      finished={enrichMatches(data, data.finishedMatches)}
      upcoming={enrichMatches(data, data.upcomingMatches)}
    />
  )
}