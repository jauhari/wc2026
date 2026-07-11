import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"

import type { Metadata } from "next"

import { MatchDetailContent } from "@/components/match-detail-content"
import {
  getTournamentData,
  getTeam,
  getStadium,
} from "@/lib/data/tournament"
import { stageLabel } from "@/lib/data/queries"
import { quickPageMetadata } from "@/lib/seo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const data = await getTournamentData()
  const match = data.matchMap[id]
  if (!match) return {}

  const home = getTeam(data, match.homeId)
  const away = getTeam(data, match.awayId)
  const hasScore = match.homeScore !== null && match.awayScore !== null
  const score = hasScore ? `${match.homeScore}-${match.awayScore}` : "vs"
  const title = `${home.shortName} ${score} ${away.shortName}`
  const description = hasScore
    ? `Hasil ${home.name} vs ${away.name} (${score}) — ${stageLabel(match.stage)} Piala Dunia 2026. Daftar gol & detail pertandingan.`
    : `Jadwal ${home.name} vs ${away.name} — ${stageLabel(match.stage)} Piala Dunia 2026.`

  return quickPageMetadata({ title, description, path: `/matches/${id}` })
}

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const data = await getTournamentData()
  const match = data.matchMap[id]
  if (!match) notFound()

  const home = getTeam(data, match.homeId)
  const away = getTeam(data, match.awayId)
  const stadium = getStadium(data, match.stadiumId)
  const goals = data.matchGoals[id]

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <Button asChild variant="ghost" size="sm" className="w-fit">
        <Link href="/matches" prefetch>
          <ArrowLeftIcon data-icon="inline-start" />
          Semua Pertandingan
        </Link>
      </Button>

      <Card>
        <CardContent className="p-5 md:p-6">
          <MatchDetailContent
            match={match}
            home={home}
            away={away}
            stadium={stadium}
            goals={goals}
            showFullPageLink={false}
          />
        </CardContent>
      </Card>
    </div>
  )
}