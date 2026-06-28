"use client"

import * as React from "react"
import { MapPinIcon, ChevronRightIcon, GoalIcon } from "lucide-react"

import { CountryFlag } from "@/components/country-flag"
import { MatchDetailSheet } from "@/components/match-detail-sheet"
import type { EnrichedMatch } from "@/lib/match-enriched"
import { formatKickoff, formatTime, stageLabel } from "@/lib/data/queries"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function MatchCard({
  match,
  home,
  away,
  stadium,
  goals,
  compact = false,
}: EnrichedMatch & { compact?: boolean }) {
  const [open, setOpen] = React.useState(false)

  const isLive = match.status === "live"
  const isFinished = match.status === "finished"
  const hasScore = match.homeScore !== null && match.awayScore !== null
  const homeWon = hasScore && (match.homeScore as number) > (match.awayScore as number)
  const awayWon = hasScore && (match.awayScore as number) > (match.homeScore as number)
  const allGoals = [...(goals?.home ?? []), ...(goals?.away ?? [])]

  return (
    <>
      <Card
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            setOpen(true)
          }
        }}
        className={cn(
          "cursor-pointer overflow-hidden transition-colors hover:border-primary/50 hover:shadow-sm active:scale-[0.99]",
          isLive && "border-destructive/40"
        )}
      >
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
              team={home}
              score={match.homeScore}
              highlight={isFinished && homeWon}
              isLive={isLive}
            />
            <TeamRow
              team={away}
              score={match.awayScore}
              highlight={isFinished && awayWon}
              isLive={isLive}
            />
          </div>

          {isFinished && allGoals.length > 0 && (
            <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 border-t pt-2.5 text-xs text-muted-foreground">
              <GoalIcon className="size-3 shrink-0 text-primary" />
              {allGoals.slice(0, 4).map((g, i) => (
                <span key={i} className="whitespace-nowrap">
                  <span className="font-medium text-foreground">{g.name}</span> {g.minute}&apos;
                </span>
              ))}
              {allGoals.length > 4 && (
                <span className="text-primary">+{allGoals.length - 4} gol</span>
              )}
            </div>
          )}

          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
              <MapPinIcon className="size-3 shrink-0" />
              <span className="truncate">
                {stadium.name}, {stadium.city}
              </span>
            </div>
            <span className="flex shrink-0 items-center gap-0.5 text-xs font-medium text-primary">
              Detail
              <ChevronRightIcon className="size-3.5" />
            </span>
          </div>
        </CardContent>
      </Card>

      <MatchDetailSheet
        data={{ match, home, away, stadium, goals }}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}

function TeamRow({
  team,
  score,
  highlight,
  isLive,
}: {
  team: EnrichedMatch["home"]
  score: number | null
  highlight: boolean
  isLive: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-md px-1.5 py-1">
      <div className="flex min-w-0 items-center gap-2">
        <CountryFlag code={team.flag} size="md" title={team.name} />
        <span
          className={cn(
            "truncate text-sm",
            highlight ? "font-semibold text-foreground" : "text-foreground/90"
          )}
        >
          {team.shortName}
        </span>
        <span className="text-[10px] text-muted-foreground">{team.code}</span>
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