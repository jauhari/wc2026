import Link from "next/link"
import { MapPinIcon } from "lucide-react"

import type { Match, Stadium, Team } from "@/lib/types"
import { formatKickoff, formatTime, stageLabel } from "@/lib/data/queries"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"

export function MatchCard({
  match,
  home,
  away,
  stadium,
  compact = false,
}: {
  match: Match
  home: Team
  away: Team
  stadium: Stadium
  compact?: boolean
}) {
  const isLive = match.status === "live"
  const isFinished = match.status === "finished"
  const hasScore = match.homeScore !== null && match.awayScore !== null

  const homeWon = hasScore && (match.homeScore as number) > (match.awayScore as number)
  const awayWon = hasScore && (match.awayScore as number) > (match.homeScore as number)

  return (
    <Link href={`/matches/${match.id}`}>
      <Card className={cn("overflow-hidden transition-colors hover:border-primary/40", isLive && "border-destructive/40")}>
        <CardHeader className="flex flex-row items-center justify-between gap-2 border-b py-2.5">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs">
              {stageLabel(match.stage)}
            </Badge>
            {isLive && (
              <Badge variant="destructive" className="gap-1">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-white" />
                </span>
                LIVE {match.minute}
              </Badge>
            )}
            {isFinished && <Badge variant="secondary">Selesai</Badge>}
            {match.status === "scheduled" && (
              <Badge variant="outline">{formatTime(match.kickoff)}</Badge>
            )}
          </div>
          <span className="truncate text-xs text-muted-foreground">
            {formatKickoff(match.kickoff)}
          </span>
        </CardHeader>
        <CardContent className={cn(compact ? "p-3" : "p-4")}>
          <div className="flex flex-col gap-1.5">
            <TeamRow
              flag={home.flag}
              name={home.shortName}
              code={home.code}
              score={match.homeScore}
              highlight={isFinished && homeWon}
              isLive={isLive}
            />
            <TeamRow
              flag={away.flag}
              name={away.shortName}
              code={away.code}
              score={match.awayScore}
              highlight={isFinished && awayWon}
              isLive={isLive}
            />
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPinIcon className="size-3" />
            <span className="truncate">
              {stadium.name}, {stadium.city}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function TeamRow({
  flag,
  name,
  code,
  score,
  highlight,
  isLive,
}: {
  flag: string
  name: string
  code: string
  score: number | null
  highlight: boolean
  isLive: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-md px-1.5 py-1">
      <div className="flex min-w-0 items-center gap-2">
        <span className="text-lg leading-none">{flag}</span>
        <span
          className={cn(
            "truncate text-sm",
            highlight ? "font-semibold text-foreground" : "text-foreground/90"
          )}
        >
          {name}
        </span>
        <span className="text-[10px] text-muted-foreground">{code}</span>
      </div>
      <span
        className={cn(
          "min-w-6 rounded px-1.5 py-0.5 text-center font-mono text-lg font-bold tabular-nums",
          score === null && "bg-muted text-muted-foreground"
        )}
      >
        {score ?? (isLive ? "·" : "-")}
      </span>
    </div>
  )
}