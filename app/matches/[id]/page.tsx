import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"

import { MatchDetailContent } from "@/components/match-detail-content"
import { getTournamentData, getTeam, getStadium } from "@/lib/data/tournament"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const revalidate = 120

export async function generateStaticParams() {
  const data = await getTournamentData()
  return data.matches.map((m) => ({ id: m.id }))
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
        <Link href="/matches">
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