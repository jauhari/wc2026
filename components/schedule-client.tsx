"use client"

import * as React from "react"
import { CalendarDaysIcon } from "lucide-react"

import type { Country, Match, Stadium, Team } from "@/lib/types"

export interface EnrichedMatch {
  match: Match
  home: Team
  away: Team
  stadium: Stadium
}
import { groupMatchesByDay, formatTime, stageLabel } from "@/lib/data/queries"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Card, CardContent } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty"

type Filter = "ALL" | Country

export function ScheduleClient({
  matches,
  hostNations,
}: {
  matches: EnrichedMatch[]
  hostNations: { code: Country; flag: string }[]
}) {
  const [filter, setFilter] = React.useState<Filter>("ALL")

  const filtered = React.useMemo(() => {
    if (filter === "ALL") return matches
    return matches.filter((m) => m.stadium.country === filter)
  }, [filter, matches])

  const byDay = groupMatchesByDay(filtered.map((e) => e.match))
  const days = Object.entries(byDay)

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Jadwal Pertandingan</h1>
          <p className="text-sm text-muted-foreground">
            Jadwal lengkap 104 pertandingan diurutkan berdasarkan hari.
          </p>
        </div>
        <ToggleGroup
          type="single"
          value={filter}
          onValueChange={(v) => v && setFilter(v as Filter)}
          variant="outline"
        >
          <ToggleGroupItem value="ALL">Semua</ToggleGroupItem>
          {hostNations.map((n) => (
            <ToggleGroupItem key={n.code} value={n.code}>
              <span className="mr-1">{n.flag}</span>
              {n.code}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {days.length === 0 ? (
        <Empty className="min-h-48 rounded-lg border border-dashed">
          <EmptyTitle>Tidak ada pertandingan</EmptyTitle>
          <EmptyDescription>
            Tidak ada pertandingan untuk negara tuan rumah ini.
          </EmptyDescription>
        </Empty>
      ) : (
        <div className="flex flex-col gap-6">
          {days.map(([day, dayMatches]) => (
            <section key={day} className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <CalendarDaysIcon className="size-4 text-primary" />
                <h2 className="text-base font-semibold">{day}</h2>
                <Badge variant="secondary" className="font-mono">
                  {dayMatches.length} laga
                </Badge>
              </div>
              <div className="flex flex-col gap-2">
                {dayMatches.map((m) => {
                  const enriched = filtered.find((e) => e.match.id === m.id)!
                  return <ScheduleRow key={m.id} {...enriched} />
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

function ScheduleRow({
  match,
  home,
  away,
  stadium,
}: {
  match: Match
  home: Team
  away: Team
  stadium: Stadium
}) {
  const hasScore = match.homeScore !== null && match.awayScore !== null
  const homeWon = hasScore && (match.homeScore as number) > (match.awayScore as number)
  const awayWon = hasScore && (match.awayScore as number) > (match.homeScore as number)

  return (
    <Card className="py-0">
      <CardContent className="flex items-center gap-3 p-3">
        <div className="flex w-12 shrink-0 flex-col items-center">
          <span className="text-sm font-semibold tabular-nums">{formatTime(match.kickoff)}</span>
          <span className="text-[10px] text-muted-foreground">{stadium.country}</span>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          <span className={cn("truncate text-sm", hasScore && !homeWon && "text-muted-foreground")}>
            {home.flag} {home.shortName}
          </span>
        </div>

        <div className="flex min-w-14 items-center justify-center gap-1 rounded-md bg-muted px-2 py-1 font-mono text-sm font-bold tabular-nums">
          {match.status === "scheduled" ? (
            <span className="text-muted-foreground">vs</span>
          ) : (
            <>
              <span className={cn(!homeWon && "text-muted-foreground")}>{match.homeScore}</span>
              <span className="text-muted-foreground">-</span>
              <span className={cn(!awayWon && "text-muted-foreground")}>{match.awayScore}</span>
            </>
          )}
        </div>

        <div className="flex flex-1 items-center gap-2">
          <span className={cn("truncate text-sm", hasScore && !awayWon && "text-muted-foreground")}>
            {away.shortName} {away.flag}
          </span>
        </div>

        <div className="hidden w-44 shrink-0 items-center justify-end sm:flex">
          {match.status === "live" && (
            <Badge variant="destructive" className="gap-1">
              <span className="size-1.5 animate-pulse rounded-full bg-white" />
              {match.minute}
            </Badge>
          )}
          {match.status === "finished" && <Badge variant="secondary">FT</Badge>}
          {match.status === "scheduled" && (
            <Badge variant="outline" className="font-mono">
              {stageLabel(match.stage)}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}