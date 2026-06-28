import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon, MapPinIcon, TrophyIcon } from "lucide-react"

import { CountryFlag } from "@/components/country-flag"
import {
  getTournamentData,
  getTeam,
  getGroupStandings,
  matchesForTeam,
  getStadium,
} from "@/lib/data/tournament"
import { formatKickoff } from "@/lib/data/queries"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"

export const revalidate = 120

export async function generateStaticParams() {
  const data = await getTournamentData()
  return data.teams.map((t) => ({ id: t.id }))
}

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const data = await getTournamentData()
  const team = data.teamMap[id]
  if (!team) notFound()

  const standings = getGroupStandings(data, team.group)
  const position = standings.findIndex((r) => r.teamId === team.id) + 1
  const myRow = standings.find((r) => r.teamId === team.id)
  const teamMatches = matchesForTeam(data, team.id)
  const teamScorers = data.scorers.filter((s) => s.teamId === team.id)

  const wins = myRow?.won ?? 0
  const draws = myRow?.drawn ?? 0
  const losses = myRow?.lost ?? 0
  const gf = myRow?.goalsFor ?? 0
  const ga = myRow?.goalsAgainst ?? 0

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <Button asChild variant="ghost" size="sm" className="w-fit">
        <Link href="/teams">
          <ArrowLeftIcon data-icon="inline-start" />
          Semua Tim
        </Link>
      </Button>

      <Card className="overflow-hidden">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
          <CountryFlag code={team.flag} size="3xl" title={team.name} className="rounded-md shadow-md" />
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{team.name}</h1>
              <Badge variant="outline" className="font-mono">
                {team.code}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span>Grup {team.group}</span>
              <span>{team.confederation}</span>
              <span className="flex items-center gap-1">
                <TrophyIcon className="size-3.5" />
                {team.titles > 0 ? `${team.titles}× juara dunia` : "Belum pernah juara"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        <StatBox label="Main" value={myRow?.played ?? 0} />
        <StatBox label="Menang" value={wins} accent="primary" />
        <StatBox label="Seri" value={draws} />
        <StatBox label="Kalah" value={losses} accent="destructive" />
        <StatBox label="Gol" value={`${gf}:${ga}`} />
        <StatBox label="Poin" value={myRow?.points ?? 0} accent="primary" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pertandingan</CardTitle>
            <CardDescription>{teamMatches.length} jadwal turnamen.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {teamMatches.map((m) => {
              const isHome = m.homeId === team.id
              const opp = getTeam(data, isHome ? m.awayId : m.homeId)
              const ourScore = isHome ? m.homeScore : m.awayScore
              const oppScore = isHome ? m.awayScore : m.homeScore
              const hasScore = ourScore !== null && oppScore !== null
              const result = !hasScore
                ? "scheduled"
                : (ourScore as number) > (oppScore as number)
                  ? "win"
                  : (ourScore as number) < (oppScore as number)
                    ? "loss"
                    : "draw"

              return (
                <Link
                  key={m.id}
                  href={`/matches/${m.id}`}
                  className="flex items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2 transition-colors hover:border-primary/40"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <span className="text-muted-foreground">{isHome ? "vs" : "@"}</span>
                    <CountryFlag code={opp.flag} size="md" title={opp.name} />
                    <span className="truncate text-sm font-medium">{opp.shortName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold tabular-nums">
                      {hasScore ? `${ourScore} - ${oppScore}` : formatKickoff(m.kickoff)}
                    </span>
                    {hasScore && (
                      <Badge
                        variant={
                          result === "win" ? "default" : result === "loss" ? "destructive" : "secondary"
                        }
                        className="w-6 justify-center p-0 text-[10px]"
                      >
                        {result === "win" ? "M" : result === "loss" ? "K" : "S"}
                      </Badge>
                    )}
                    {m.status === "live" && (
                      <Badge variant="destructive" className="gap-1 text-[10px]">
                        <span className="size-1 animate-pulse rounded-full bg-white" />
                        {m.minute}
                      </Badge>
                    )}
                  </div>
                </Link>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Klasemen Grup {team.group}</CardTitle>
            <CardDescription>
              Posisi saat ini:{" "}
              <span className="font-semibold text-primary">#{position}</span> dari 4.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4 text-xs">#</TableHead>
                  <TableHead className="text-xs">Tim</TableHead>
                  <TableHead className="text-center text-xs">M</TableHead>
                  <TableHead className="text-center text-xs">GD</TableHead>
                  <TableHead className="pr-4 text-center text-xs">Pts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {standings.map((row, idx) => {
                  const t = getTeam(data, row.teamId)
                  const isMe = row.teamId === team.id
                  return (
                    <TableRow key={row.teamId} className={cn(isMe && "bg-primary/5")}>
                      <TableCell className="pl-4 font-mono text-xs text-muted-foreground">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        <span className="flex items-center gap-2">
                          <CountryFlag code={t.flag} size="xs" title={t.name} />
                          {t.shortName}
                          {isMe && (
                            <Badge variant="secondary" className="text-[10px]">
                              Ini
                            </Badge>
                          )}
                        </span>
                      </TableCell>
                      <TableCell className="text-center tabular-nums">{row.played}</TableCell>
                      <TableCell className="text-center tabular-nums">
                        {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                      </TableCell>
                      <TableCell className="pr-4 text-center font-bold tabular-nums">
                        {row.points}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            <Separator />
            {teamMatches[0] && (
              <div className="flex items-center gap-2 px-4 py-2 text-[11px] text-muted-foreground">
                <MapPinIcon className="size-3" />
                Stadion: {getStadium(data, teamMatches[0].stadiumId).country}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {teamScorers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pencetak Gol</CardTitle>
            <CardDescription>Gol tercipta di Piala Dunia 2026.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {teamScorers.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-2 rounded-lg border bg-card px-3 py-1.5 text-sm"
              >
                <span className="font-medium">{p.name}</span>
                <Badge variant="secondary" className="text-[10px]">
                  ⚽ {p.goals}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function StatBox({
  label,
  value,
  accent,
}: {
  label: string
  value: number | string
  accent?: "primary" | "destructive"
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-0.5 p-3">
        <span
          className={cn(
            "text-2xl font-bold tabular-nums",
            accent === "primary" && "text-primary",
            accent === "destructive" && "text-destructive"
          )}
        >
          {value}
        </span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </CardContent>
    </Card>
  )
}