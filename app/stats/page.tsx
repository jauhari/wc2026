import { GoalIcon, HandHelpingIcon } from "lucide-react"

import { StatsChart } from "@/components/stats-chart"
import { StatsPlayersClient } from "@/components/stats-players-client"
import { GROUPS } from "@/lib/data/meta"
import { getTournamentData } from "@/lib/data/tournament"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { quickPageMetadata } from "@/lib/seo"

export const metadata = quickPageMetadata({
  title: "Statistik",
  description:
    "Statistik Piala Dunia 2026: top skor, top assist, total gol, dan distribusi gol per grup.",
  path: "/stats",
})

export const dynamic = "force-dynamic"

export default async function StatsPage() {
  const data = await getTournamentData()

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

      <StatsPlayersClient
        topScorers={data.topScorers}
        topAssists={data.topAssists}
        hasAssistData={data.hasAssistData}
        teamMap={data.teamMap}
      />
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

