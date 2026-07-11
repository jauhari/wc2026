import { getTournamentData } from "@/lib/data/tournament"
import { enrichMatches } from "@/lib/enrich-matches"
import { FavoritesClient } from "@/components/favorites-client"
import { quickPageMetadata } from "@/lib/seo"

export const metadata = quickPageMetadata({
  title: "Favorit",
  description:
    "Tim favorit dan pemain favorit Anda di Piala Dunia 2026 — disimpan lokal di perangkat.",
  path: "/favorites",
})

export const dynamic = "force-dynamic"

export default async function FavoritesPage() {
  const data = await getTournamentData()

  const favoriteRelevantMatches = enrichMatches(
    data,
    data.matches.filter(
      (m) => m.status === "live" || m.status === "scheduled"
    )
  )

  return (
    <FavoritesClient
      teams={data.teams}
      scorers={data.scorers}
      teamMatches={favoriteRelevantMatches}
    />
  )
}