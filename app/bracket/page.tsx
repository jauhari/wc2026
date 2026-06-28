import Link from "next/link"

import { CountryFlag } from "@/components/country-flag"
import { TrophyIcon } from "lucide-react"

import {
  getTournamentData,
  getTeam,
  getBracketByRound,
  roundOrder,
  roundLabels,
} from "@/lib/data/tournament"
import { formatKickoff } from "@/lib/data/queries"
import type { BracketMatch } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Bagan Guguran",
  description:
    "Bagan knockout Piala Dunia 2026: babak 32 besar, 16 besar, perempat final, semi final, dan final.",
  path: "/bracket",
})

export const revalidate = 120

export default async function BracketPage() {
  const data = await getTournamentData()

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bagan Guguran</h1>
        <p className="text-sm text-muted-foreground">
          Babak 32 besar hingga final — data resmi turnamen Piala Dunia 2026.
        </p>
      </div>

      <ScrollArea className="w-full whitespace-nowrap rounded-lg">
        <div className="flex gap-4 pb-4 md:min-w-0">
          {roundOrder.map((round) => (
            <RoundColumn
              key={round}
              round={round}
              matches={getBracketByRound(data, round)}
              data={data}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

function RoundColumn({
  round,
  matches,
  data,
}: {
  round: (typeof roundOrder)[number]
  matches: BracketMatch[]
  data: Awaited<ReturnType<typeof getTournamentData>>
}) {
  const isFinal = round === "FINAL"

  return (
    <div className="flex w-72 shrink-0 flex-col gap-3 first:pl-1">
      <div className="sticky top-0 z-10">
        <CardHeader className="rounded-lg border bg-card p-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            {isFinal && <TrophyIcon className="size-4 text-primary" />}
            {roundLabels[round]}
          </CardTitle>
        </CardHeader>
      </div>
      <div className="flex flex-col justify-around gap-3">
        {matches.map((m) => (
          <BracketCard key={m.id} match={m} highlight={isFinal} data={data} />
        ))}
      </div>
    </div>
  )
}

function BracketCard({
  match,
  highlight,
  data,
}: {
  match: BracketMatch
  highlight?: boolean
  data: Awaited<ReturnType<typeof getTournamentData>>
}) {
  const home = match.homeId ? getTeam(data, match.homeId) : null
  const away = match.awayId ? getTeam(data, match.awayId) : null

  const homeWon =
    match.homeScore !== null && match.awayScore !== null && match.homeScore > match.awayScore
  const awayWon =
    match.homeScore !== null && match.awayScore !== null && match.awayScore > match.homeScore

  return (
    <Card className={cn(highlight && "border-primary/50")}>
      <CardHeader className="px-3 py-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="font-mono text-[10px]">
            #{match.id.replace("m", "")}
          </Badge>
          <span className="text-[10px] text-muted-foreground">{formatKickoff(match.kickoff)}</span>
        </div>
      </CardHeader>
      <CardContent className="px-3 pb-3">
        <BracketSide
          flag={home?.flag}
          name={home?.shortName}
          score={match.homeScore}
          won={homeWon}
          teamId={match.homeId}
        />
        <div className="my-1 border-t border-dashed" />
        <BracketSide
          flag={away?.flag}
          name={away?.shortName}
          score={match.awayScore}
          won={awayWon}
          teamId={match.awayId}
        />
        <div className="mt-2 text-[10px] text-muted-foreground">
          {match.status === "finished"
            ? "✅ Selesai"
            : match.status === "live"
              ? "🔴 LIVE"
              : "📅 Terjadwal"}
        </div>
      </CardContent>
    </Card>
  )
}

function BracketSide({
  flag,
  name,
  score,
  won,
  teamId,
}: {
  flag?: string
  name?: string
  score: number | null
  won: boolean
  teamId: string | null
}) {
  const content = (
    <div className="flex items-center justify-between gap-2 rounded px-1 py-0.5">
      <span className="flex min-w-0 items-center gap-2">
        <CountryFlag code={flag ?? "tbd"} size="sm" title={name} />
        <span
          className={cn(
            "truncate text-sm",
            !name && "italic text-muted-foreground",
            won && "font-semibold"
          )}
        >
          {name ?? "TBD"}
        </span>
      </span>
      {score !== null && (
        <span
          className={cn(
            "font-mono text-sm font-bold tabular-nums",
            !won && "text-muted-foreground"
          )}
        >
          {score}
        </span>
      )}
    </div>
  )
  return teamId ? <Link href={`/teams/${teamId}`}>{content}</Link> : content
}