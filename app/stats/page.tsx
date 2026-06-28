import { GoalIcon, HandHelpingIcon } from "lucide-react"

import { CountryFlag } from "@/components/country-flag"
import { StatsChart } from "@/components/stats-chart"
import { GROUPS } from "@/lib/data/meta"
import { getTournamentDataStaticSync, getTeam } from "@/lib/data/tournament"
import type { TournamentData } from "@/lib/data/tournament"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { quickPageMetadata } from "@/lib/seo"

export const metadata = quickPageMetadata({
  title: "Statistik",
  description:
    "Statistik Piala Dunia 2026: top skor, top assist, total gol, dan distribusi gol per grup.",
  path: "/stats",
})

export const dynamic = "force-static"

export default async function StatsPage() {
  const data = getTournamentDataStaticSync()

  const goalsByGroup = GROUPS.map((g) => {
    const groupMatches = data.matches.filter(
      (m) => m.stage === g && m.status !== "scheduled"
    )
    const goals = groupMatches.reduce(
      (sum, m) => sum + (m.homeScore ?? 0) + (m.awayScore ?? 0),
      0
    )
    return { group: `Grup ${g}`, goals }
  })

  const played = data.matches.filter((m) => m.status !== "scheduled")
  const avgGoals = (
    data.totalGoals / Math.max(played.length, 1)
  ).toFixed(2)

  const topScorer = data.topScorers[0]
  const topAssist = data.topAssists[0]

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Statistik</h1>
        <p className="text-sm text-muted-foreground">
          Pencetak gol dan distribusi gol per grup — dihitung dari hasil resmi.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryTile icon={<GoalIcon className="size-5" />} label="Total Gol" value={String(data.totalGoals)} />
        <SummaryTile icon={<HandHelpingIcon className="size-5" />} label="Rata-rata Gol" value={avgGoals} hint="per pertandingan" />
        {topScorer && (
          <SummaryTile icon={<GoalIcon className="size-5" />} label="Top Skor" value={topScorer.name} hint={`${topScorer.goals} gol`} />
        )}
        {topAssist && topAssist.assists > 0 && (
          <SummaryTile icon={<HandHelpingIcon className="size-5" />} label="Top Assist" value={topAssist.name} hint={`${topAssist.assists} assist`} />
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gol per Grup</CardTitle>
          <CardDescription>Total gol babak penyisihan grup.</CardDescription>
        </CardHeader>
        <CardContent>
          <StatsChart data={goalsByGroup} />
        </CardContent>
      </Card>

      <Tabs defaultValue="scorers">
        <TabsList>
          <TabsTrigger value="scorers" className="gap-1.5">
            <GoalIcon className="size-4" />
            Top Skor
          </TabsTrigger>
          <TabsTrigger value="assists" className="gap-1.5">
            <HandHelpingIcon className="size-4" />
            Top Assist
          </TabsTrigger>
        </TabsList>
        <TabsContent value="scorers">
          <PlayerTable rows={data.topScorers.slice(0, 15)} metric="goals" metricLabel="Gol" data={data} />
        </TabsContent>
        <TabsContent value="assists">
          {data.hasAssistData ? (
            <PlayerTable rows={data.topAssists.slice(0, 15)} metric="assists" metricLabel="Assist" data={data} />
          ) : (
            <Card className="mt-3">
              <CardContent className="flex flex-col items-center gap-2 p-8 text-center">
                <HandHelpingIcon className="size-8 text-muted-foreground/60" />
                <p className="text-sm font-medium">Data assist belum tersedia</p>
                <p className="max-w-md text-sm text-muted-foreground">
                  Data assist belum bisa dimuat dari FIFA API saat ini. Coba refresh nanti —
                  sumber openfootball sendiri tidak mencatat assist per gol.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SummaryTile({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode
  label: string
  value: string
  hint?: string
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-lg font-bold leading-tight">{value}</span>
          <span className="text-sm font-medium">{label}</span>
          {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
        </div>
      </CardContent>
    </Card>
  )
}

function PlayerTable({
  rows,
  metric,
  metricLabel,
  data,
}: {
  rows: typeof data.topScorers
  metric: "goals" | "assists"
  metricLabel: string
  data: TournamentData
}) {
  return (
    <Card className="mt-3">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10 pl-4">#</TableHead>
              <TableHead>Pemain</TableHead>
              <TableHead>Tim</TableHead>
              <TableHead className="text-center">Pos</TableHead>
              <TableHead className="pr-4 text-right">{metricLabel}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((p, i) => {
              const team = getTeam(data, p.teamId)
              return (
                <TableRow key={p.id}>
                  <TableCell className="w-10 pl-4 font-mono text-sm text-muted-foreground">
                    {i + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="size-8">
                        <AvatarFallback className="bg-muted text-xs">
                          {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1.5 text-sm">
                      <CountryFlag code={team.flag} size="sm" title={team.name} />
                      {team.shortName}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="font-mono text-xs">
                      {p.position}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-4 text-right">
                    <span className="font-bold tabular-nums text-primary">{p[metric]}</span>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}