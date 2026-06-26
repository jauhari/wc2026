"use client"

import * as React from "react"
import { FlameIcon, CheckCircle2Icon, CalendarClockIcon } from "lucide-react"

import type { Match, Stadium, Team } from "@/lib/types"
import { MatchCard } from "@/components/match-card"

export interface EnrichedMatch {
  match: Match
  home: Team
  away: Team
  stadium: Stadium
}
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function MatchesClient({
  live,
  finished,
  upcoming,
}: {
  live: EnrichedMatch[]
  finished: EnrichedMatch[]
  upcoming: EnrichedMatch[]
}) {
  const [tab, setTab] = React.useState("live")

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Hasil Pertandingan</h1>
        <p className="text-sm text-muted-foreground">
          Semua pertandingan Piala Dunia 2026 — siaran langsung, selesai, dan mendatang.
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="live" className="gap-1.5">
            <FlameIcon className="size-4" />
            Langsung
            <CountBadge count={live.length} />
          </TabsTrigger>
          <TabsTrigger value="finished" className="gap-1.5">
            <CheckCircle2Icon className="size-4" />
            Selesai
            <CountBadge count={finished.length} />
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="gap-1.5">
            <CalendarClockIcon className="size-4" />
            Mendatang
            <CountBadge count={upcoming.length} />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="mt-4">
          <MatchGrid list={live} emptyText="Tidak ada pertandingan langsung saat ini." />
        </TabsContent>
        <TabsContent value="finished" className="mt-4">
          <MatchGrid list={finished} emptyText="Belum ada pertandingan yang selesai." />
        </TabsContent>
        <TabsContent value="upcoming" className="mt-4">
          <MatchGrid list={upcoming} emptyText="Tidak ada pertandingan mendatang." />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CountBadge({ count }: { count: number }) {
  return (
    <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-muted-foreground">
      {count}
    </span>
  )
}

function MatchGrid({
  list,
  emptyText,
}: {
  list: EnrichedMatch[]
  emptyText: string
}) {
  if (list.length === 0) {
    return (
      <Empty className="min-h-48 rounded-lg border border-dashed">
        <EmptyTitle>Belum ada data</EmptyTitle>
        <EmptyDescription>{emptyText}</EmptyDescription>
      </Empty>
    )
  }
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {list.map(({ match, home, away, stadium }) => (
        <MatchCard key={match.id} match={match} home={home} away={away} stadium={stadium} />
      ))}
    </div>
  )
}