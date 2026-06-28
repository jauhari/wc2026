"use client"

import * as React from "react"
import { CalendarDaysIcon, ChevronRightIcon } from "lucide-react"

import { CountryFlag } from "@/components/country-flag"
import { MatchDetailSheet } from "@/components/match-detail-sheet"
import type { EnrichedMatch } from "@/lib/match-enriched"
import type { Country } from "@/lib/types"
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
  const [selected, setSelected] = React.useState<EnrichedMatch | null>(null)
  const [sheetOpen, setSheetOpen] = React.useState(false)

  const filtered = React.useMemo(() => {
    if (filter === "ALL") return matches
    return matches.filter((m) => m.stadium.country === filter)
  }, [filter, matches])

  const byDay = groupMatchesByDay(filtered.map((e) => e.match))
  const days = Object.entries(byDay)

  const openDetail = (item: EnrichedMatch) => {
    setSelected(item)
    setSheetOpen(true)
  }

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Jadwal Pertandingan</h1>
          <p className="text-sm text-muted-foreground">
            Jadwal lengkap 104 pertandingan — ketuk baris untuk detail gol & info.
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
              <CountryFlag code={n.flag} size="xs" className="mr-1" />
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
                  return (
                    <ScheduleRow
                      key={m.id}
                      {...enriched}
                      onOpen={() => openDetail(enriched)}
                    />
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      <MatchDetailSheet data={selected} open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  )
}

function ScheduleRow({
  match,
  home,
  away,
  stadium,
  onOpen,
}: EnrichedMatch & { onOpen: () => void }) {
  const hasScore = match.homeScore !== null && match.awayScore !== null
  const homeWon = hasScore && (match.homeScore as number) > (match.awayScore as number)
  const awayWon = hasScore && (match.awayScore as number) > (match.homeScore as number)

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onOpen()
        }
      }}
      className="cursor-pointer py-0 transition-colors hover:border-primary/40 hover:bg-muted/30 active:scale-[0.995]"
    >
      <CardContent className="flex items-center gap-3 p-3">
        <div className="flex w-12 shrink-0 flex-col items-center">
          <span className="text-sm font-semibold tabular-nums">{formatTime(match.kickoff)}</span>
          <span className="text-[10px] text-muted-foreground">{stadium.country}</span>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          <span
            className={cn(
              "flex items-center gap-1.5 truncate text-sm",
              hasScore && !homeWon && "text-muted-foreground"
            )}
          >
            <CountryFlag code={home.flag} size="sm" title={home.name} />
            {home.shortName}
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
          <span
            className={cn(
              "flex items-center gap-1.5 truncate text-sm",
              hasScore && !awayWon && "text-muted-foreground"
            )}
          >
            {away.shortName}
            <CountryFlag code={away.flag} size="sm" title={away.name} />
          </span>
        </div>

        <div className="hidden w-44 shrink-0 items-center justify-end gap-1 sm:flex">
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
          <ChevronRightIcon className="size-4 text-primary" />
        </div>
      </CardContent>
    </Card>
  )
}