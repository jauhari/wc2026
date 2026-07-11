"use client"

import * as React from "react"
import Link from "next/link"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  LayoutGridIcon,
  ListIcon,
  TrophyIcon,
} from "lucide-react"

import { CountryFlag } from "@/components/country-flag"
import { formatKickoff } from "@/lib/data/queries"
import type { KnockoutRound, MatchStatus } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export interface BracketTeamView {
  id: string
  shortName: string
  flag: string
}

export interface BracketMatchView {
  id: string
  kickoff: string
  status: MatchStatus
  home: BracketTeamView | null
  away: BracketTeamView | null
  homeScore: number | null
  awayScore: number | null
}

export interface BracketRoundView {
  round: KnockoutRound
  label: string
  shortLabel: string
  matches: BracketMatchView[]
}

type ViewMode = "round" | "board"

export function BracketClient({ rounds }: { rounds: BracketRoundView[] }) {
  const firstWithMatches = rounds.findIndex((r) => r.matches.length > 0)
  const [mode, setMode] = React.useState<ViewMode>("round")
  const [roundIndex, setRoundIndex] = React.useState(
    firstWithMatches >= 0 ? firstWithMatches : 0
  )

  const current = rounds[roundIndex] ?? rounds[0]
  const canPrev = roundIndex > 0
  const canNext = roundIndex < rounds.length - 1

  const boardRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(false)

  const updateBoardScrollState = React.useCallback(() => {
    const el = boardRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < max - 4)
  }, [])

  React.useEffect(() => {
    if (mode !== "board") return
    const el = boardRef.current
    if (!el) return
    updateBoardScrollState()
    el.addEventListener("scroll", updateBoardScrollState, { passive: true })
    const ro = new ResizeObserver(updateBoardScrollState)
    ro.observe(el)
    return () => {
      el.removeEventListener("scroll", updateBoardScrollState)
      ro.disconnect()
    }
  }, [mode, rounds, updateBoardScrollState])

  const scrollBoard = (dir: -1 | 1) => {
    const el = boardRef.current
    if (!el) return
    const amount = Math.min(el.clientWidth * 0.85, 300)
    el.scrollBy({ left: dir * amount, behavior: "smooth" })
  }

  const goRound = (index: number) => {
    setRoundIndex(Math.max(0, Math.min(rounds.length - 1, index)))
  }

  return (
    <div className="flex min-w-0 flex-col gap-4 p-4 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight">Bagan Guguran</h1>
          <p className="text-sm text-muted-foreground">
            Babak 32 besar hingga final — pilih babak atau buka bagan penuh.
          </p>
        </div>

        <ToggleGroup
          type="single"
          value={mode}
          onValueChange={(v) => {
            if (v === "round" || v === "board") setMode(v)
          }}
          variant="outline"
          className="w-full shrink-0 sm:w-auto"
        >
          <ToggleGroupItem value="round" aria-label="Per babak" className="flex-1 gap-1.5 sm:flex-none">
            <ListIcon className="size-4" />
            Per babak
          </ToggleGroupItem>
          <ToggleGroupItem value="board" aria-label="Bagan penuh" className="flex-1 gap-1.5 sm:flex-none">
            <LayoutGridIcon className="size-4" />
            Bagan penuh
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {mode === "round" ? (
        <div className="flex min-w-0 flex-col gap-4">
          {/* Round picker — full-width buttons, no hash scroll */}
          <div
            className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label="Pilih babak"
          >
            {rounds.map((r, i) => {
              const active = i === roundIndex
              return (
                <button
                  key={r.round}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => goRound(i)}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "bg-card hover:border-primary/40 hover:bg-accent"
                  )}
                >
                  {r.round === "FINAL" && <TrophyIcon className="size-3" />}
                  {r.shortLabel}
                  <span
                    className={cn(
                      "tabular-nums",
                      active ? "text-primary-foreground/80" : "text-muted-foreground"
                    )}
                  >
                    ({r.matches.length})
                  </span>
                </button>
              )
            })}
          </div>

          {/* Prev / next + title */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="shrink-0"
              disabled={!canPrev}
              onClick={() => goRound(roundIndex - 1)}
              aria-label="Babak sebelumnya"
            >
              <ChevronLeftIcon className="size-4" />
            </Button>
            <div className="min-w-0 flex-1 text-center">
              <p className="truncate text-base font-semibold">
                {current?.round === "FINAL" && (
                  <TrophyIcon className="mr-1.5 inline size-4 text-primary" />
                )}
                {current?.label}
              </p>
              <p className="text-xs text-muted-foreground">
                Babak {roundIndex + 1} dari {rounds.length} · {current?.matches.length ?? 0}{" "}
                laga
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="shrink-0"
              disabled={!canNext}
              onClick={() => goRound(roundIndex + 1)}
              aria-label="Babak berikutnya"
            >
              <ChevronRightIcon className="size-4" />
            </Button>
          </div>

          <RoundMatches matches={current?.matches ?? []} highlight={current?.round === "FINAL"} />
        </div>
      ) : (
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              Geser ke kanan untuk babak berikutnya, atau pakai tombol panah.
            </p>
            <div className="flex shrink-0 gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-8"
                disabled={!canScrollLeft}
                onClick={() => scrollBoard(-1)}
                aria-label="Geser bagan ke kiri"
              >
                <ChevronLeftIcon className="size-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-8"
                disabled={!canScrollRight}
                onClick={() => scrollBoard(1)}
                aria-label="Geser bagan ke kanan"
              >
                <ChevronRightIcon className="size-4" />
              </Button>
            </div>
          </div>

          {/* Dedicated scrollport — not page hash / ScrollArea */}
          <div
            ref={boardRef}
            className={cn(
              "flex w-full max-w-full gap-3 overflow-x-auto overscroll-x-contain pb-3",
              "snap-x snap-mandatory scroll-smooth",
              "touch-pan-x",
              "[-webkit-overflow-scrolling:touch]"
            )}
          >
            {rounds.map((r) => (
              <section
                key={r.round}
                className="flex w-[min(calc(100vw-2.5rem),18rem)] shrink-0 snap-start flex-col gap-3"
              >
                <CardHeader className="rounded-lg border bg-card p-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    {r.round === "FINAL" && <TrophyIcon className="size-4 text-primary" />}
                    <span className="min-w-0 truncate">{r.label}</span>
                    <span className="ml-auto shrink-0 text-xs font-normal text-muted-foreground">
                      {r.matches.length}
                    </span>
                  </CardTitle>
                </CardHeader>
                <RoundMatches
                  matches={r.matches}
                  highlight={r.round === "FINAL"}
                  dense
                />
              </section>
            ))}
            {/* End spacer so last column can snap fully into view */}
            <div className="w-2 shrink-0" aria-hidden />
          </div>
        </div>
      )}
    </div>
  )
}

function RoundMatches({
  matches,
  highlight,
  dense,
}: {
  matches: BracketMatchView[]
  highlight?: boolean
  dense?: boolean
}) {
  if (matches.length === 0) {
    return (
      <p className="rounded-lg border border-dashed px-3 py-8 text-center text-sm text-muted-foreground">
        Belum ada jadwal untuk babak ini
      </p>
    )
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-3",
        !dense && "sm:grid-cols-2 lg:grid-cols-3"
      )}
    >
      {matches.map((m) => (
        <BracketCard key={m.id} match={m} highlight={highlight} />
      ))}
    </div>
  )
}

function BracketCard({
  match,
  highlight,
}: {
  match: BracketMatchView
  highlight?: boolean
}) {
  const homeWon =
    match.homeScore !== null &&
    match.awayScore !== null &&
    match.homeScore > match.awayScore
  const awayWon =
    match.homeScore !== null &&
    match.awayScore !== null &&
    match.awayScore > match.homeScore

  return (
    <Card className={cn("min-w-0", highlight && "border-primary/50")}>
      <CardHeader className="px-3 py-2">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="outline" className="shrink-0 font-mono text-[10px]">
            #{match.id.replace("m", "")}
          </Badge>
          <span className="truncate text-right text-[10px] text-muted-foreground">
            {formatKickoff(match.kickoff)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="px-3 pb-3">
        <BracketSide
          flag={match.home?.flag}
          name={match.home?.shortName}
          score={match.homeScore}
          won={homeWon}
          teamId={match.home?.id ?? null}
        />
        <div className="my-1 border-t border-dashed" />
        <BracketSide
          flag={match.away?.flag}
          name={match.away?.shortName}
          score={match.awayScore}
          won={awayWon}
          teamId={match.away?.id ?? null}
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
            "shrink-0 font-mono text-sm font-bold tabular-nums",
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
