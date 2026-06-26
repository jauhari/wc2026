import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon, MapPinIcon, GoalIcon } from "lucide-react"

import { getTournamentData, getTeam, getStadium } from "@/lib/data/tournament"
import { formatKickoff, formatDate, stageLabel } from "@/lib/data/queries"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const revalidate = 60

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

  const hasScore = match.homeScore !== null && match.awayScore !== null
  const homeWon = hasScore && (match.homeScore as number) > (match.awayScore as number)
  const awayWon = hasScore && (match.awayScore as number) > (match.homeScore as number)

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <Button asChild variant="ghost" size="sm" className="w-fit">
        <Link href="/matches">
          <ArrowLeftIcon data-icon="inline-start" />
          Semua Pertandingan
        </Link>
      </Button>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{stageLabel(match.stage)}</Badge>
            {match.matchNumber && (
              <Badge variant="secondary" className="font-mono">
                #{match.matchNumber}
              </Badge>
            )}
            {match.status === "live" && (
              <Badge variant="destructive" className="gap-1">
                <span className="size-1.5 animate-pulse rounded-full bg-white" />
                LIVE {match.minute}
              </Badge>
            )}
            {match.status === "finished" && <Badge variant="secondary">Selesai</Badge>}
          </div>
          <span className="text-sm text-muted-foreground">{formatDate(match.kickoff)}</span>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <TeamBlock team={home} score={match.homeScore} won={homeWon} align="end" />
            <div className="flex flex-col items-center gap-1">
              {hasScore ? (
                <span className="font-mono text-4xl font-black tabular-nums">
                  {match.homeScore} - {match.awayScore}
                </span>
              ) : (
                <span className="text-2xl font-bold text-muted-foreground">vs</span>
              )}
              <span className="text-xs text-muted-foreground">{formatKickoff(match.kickoff)}</span>
            </div>
            <TeamBlock team={away} score={match.awayScore} won={awayWon} align="start" />
          </div>

          <Separator />

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPinIcon className="size-4 shrink-0" />
            <span>
              {stadium.name}, {stadium.city} ({stadium.country})
            </span>
          </div>
        </CardContent>
      </Card>

      {goals && (goals.home.length > 0 || goals.away.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GoalIcon className="size-5 text-primary" />
              Daftar Gol
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <GoalList team={home} goals={goals.home} />
            <GoalList team={away} goals={goals.away} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function TeamBlock({
  team,
  score,
  won,
  align,
}: {
  team: ReturnType<typeof getTeam>
  score: number | null
  won: boolean
  align: "start" | "end"
}) {
  return (
    <Link
      href={`/teams/${team.id}`}
      className={cn(
        "flex flex-col gap-2 transition-opacity hover:opacity-80",
        align === "end" ? "items-end text-right" : "items-start text-left"
      )}
    >
      <span className="text-5xl">{team.flag}</span>
      <span className={cn("text-lg font-bold", won && "text-primary")}>{team.name}</span>
      <Badge variant="outline" className="font-mono">
        {team.code}
      </Badge>
      {score !== null && (
        <span className="font-mono text-2xl font-bold tabular-nums">{score}</span>
      )}
    </Link>
  )
}

function GoalList({
  team,
  goals,
}: {
  team: ReturnType<typeof getTeam>
  goals: { name: string; minute: string; penalty?: boolean; owngoal?: boolean }[]
}) {
  if (goals.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        {team.shortName}: tidak ada gol
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-2">
      <span className="font-semibold">
        {team.flag} {team.shortName}
      </span>
      <ul className="flex flex-col gap-1 text-sm">
        {goals.map((g, i) => (
          <li key={i} className="flex items-center gap-2">
            <GoalIcon className="size-3.5 text-primary" />
            <span className="font-medium">{g.name}</span>
            <span className="text-muted-foreground">
              {g.minute}'
              {g.penalty && " (P)"}
              {g.owngoal && " (OG)"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}