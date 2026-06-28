import Link from "next/link"
import {
  GoalIcon,
  HandHelpingIcon,
  MapPinIcon,
  ClockIcon,
  HashIcon,
  ExternalLinkIcon,
} from "lucide-react"

import { CountryFlag } from "@/components/country-flag"
import type { MatchGoals } from "@/lib/match-enriched"
import { formatKickoff, formatDate, stageLabel } from "@/lib/data/queries"
import type { Match, Stadium, Team } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function MatchDetailContent({
  match,
  home,
  away,
  stadium,
  goals,
  showFullPageLink = true,
}: {
  match: Match
  home: Team
  away: Team
  stadium: Stadium
  goals?: MatchGoals
  showFullPageLink?: boolean
}) {
  const hasScore = match.homeScore !== null && match.awayScore !== null
  const homeWon = hasScore && (match.homeScore as number) > (match.awayScore as number)
  const awayWon = hasScore && (match.awayScore as number) > (match.homeScore as number)
  const hasGoals = goals && (goals.home.length > 0 || goals.away.length > 0)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">{stageLabel(match.stage)}</Badge>
        {match.matchNumber && (
          <Badge variant="secondary" className="gap-1 font-mono">
            <HashIcon className="size-3" />
            {match.matchNumber}
          </Badge>
        )}
        {match.status === "live" && (
          <Badge variant="destructive" className="gap-1">
            <span className="size-1.5 animate-pulse rounded-full bg-white" />
            LIVE {match.minute}
          </Badge>
        )}
        {match.status === "finished" && <Badge variant="secondary">Selesai</Badge>}
        {match.status === "scheduled" && (
          <Badge variant="outline">Belum dimulai</Badge>
        )}
      </div>

      <p className="text-sm text-muted-foreground">{formatDate(match.kickoff)}</p>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <TeamBlock team={home} won={homeWon} align="end" />
        <div className="flex flex-col items-center gap-1">
          {hasScore ? (
            <>
              <span className="font-mono text-3xl font-black tabular-nums">
                {match.homeScore} - {match.awayScore}
              </span>
              {goals?.ht && (
                <span className="text-xs text-muted-foreground">
                  HT {goals.ht[0]} - {goals.ht[1]}
                </span>
              )}
            </>
          ) : (
            <span className="text-xl font-bold text-muted-foreground">vs</span>
          )}
          <span className="text-xs text-muted-foreground">{formatKickoff(match.kickoff)}</span>
        </div>
        <TeamBlock team={away} won={awayWon} align="start" />
      </div>

      <div className="flex flex-col gap-2 rounded-lg border bg-muted/30 p-3 text-sm">
        <div className="flex items-start gap-2 text-muted-foreground">
          <MapPinIcon className="mt-0.5 size-4 shrink-0" />
          <span>
            {stadium.name}, {stadium.city} ({stadium.country})
          </span>
        </div>
        {goals?.round && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <ClockIcon className="size-4 shrink-0" />
            <span>{goals.round}</span>
          </div>
        )}
      </div>

      {hasGoals ? (
        <>
          <Separator />
          <div className="flex flex-col gap-3">
            <h3 className="flex items-center gap-2 font-semibold">
              <GoalIcon className="size-4 text-primary" />
              Daftar Gol
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <GoalList team={home} goals={goals.home} />
              <GoalList team={away} goals={goals.away} />
            </div>
          </div>
        </>
      ) : match.status === "finished" ? (
        <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
          Detail pencetak gol belum tersedia untuk pertandingan ini.
        </p>
      ) : null}

      {showFullPageLink && (
        <Button asChild variant="outline" className="w-full">
          <Link href={`/matches/${match.id}`}>
            Buka halaman lengkap
            <ExternalLinkIcon data-icon="inline-end" className="size-4" />
          </Link>
        </Button>
      )}
    </div>
  )
}

function TeamBlock({
  team,
  won,
  align,
}: {
  team: Team
  won: boolean
  align: "start" | "end"
}) {
  return (
    <Link
      href={`/teams/${team.id}`}
      className={cn(
        "flex flex-col gap-1.5 transition-opacity hover:opacity-80",
        align === "end" ? "items-end text-right" : "items-start text-left"
      )}
    >
      <CountryFlag code={team.flag} size="2xl" title={team.name} className="rounded-md shadow-md" />
      <span className={cn("text-sm font-bold leading-tight", won && "text-primary")}>
        {team.name}
      </span>
      <Badge variant="outline" className="font-mono text-[10px]">
        {team.code}
      </Badge>
    </Link>
  )
}

function GoalList({
  team,
  goals,
}: {
  team: Team
  goals: MatchGoals["home"]
}) {
  if (goals.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5 font-medium text-foreground">
          <CountryFlag code={team.flag} size="sm" title={team.name} />
          {team.shortName}
        </span>
        <span className="mt-1 block">Tidak ada gol</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="flex items-center gap-2 font-semibold">
        <CountryFlag code={team.flag} size="sm" title={team.name} />
        {team.shortName}
      </span>
      <ul className="flex flex-col gap-2">
        {goals.map((g, i) => (
          <li
            key={i}
            className="flex flex-col gap-0.5 rounded-md border bg-card px-3 py-2 text-sm"
          >
            <div className="flex items-center gap-2">
              <GoalIcon className="size-3.5 shrink-0 text-primary" />
              <span className="font-medium">{g.name}</span>
              <span className="ml-auto font-mono text-xs text-muted-foreground">
                {g.minute}&apos;
                {g.penalty && " (P)"}
                {g.owngoal && " (OG)"}
              </span>
            </div>
            {g.assist && (
              <div className="flex items-center gap-1.5 pl-5 text-xs text-muted-foreground">
                <HandHelpingIcon className="size-3" />
                Assist: {g.assist}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}