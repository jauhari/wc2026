"use client"

import * as React from "react"
import Link from "next/link"
import { GoalIcon, ShieldIcon, StarIcon, Trash2Icon } from "lucide-react"

import { CountryFlag } from "@/components/country-flag"
import { MatchCard } from "@/components/match-card"
import { useFavorites } from "@/hooks/use-favorites"
import type { EnrichedMatch } from "@/lib/match-enriched"
import type { Scorer, Team } from "@/lib/types"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function FavoritesClient({
  teams,
  scorers,
  teamMatches,
}: {
  teams: Team[]
  scorers: Scorer[]
  teamMatches: EnrichedMatch[]
}) {
  const {
    ready,
    favoriteTeams,
    favoritePlayers,
    removeTeamFavorite,
    removePlayerFavorite,
  } = useFavorites()

  const teamMap = React.useMemo(
    () => Object.fromEntries(teams.map((t) => [t.id, t])),
    [teams]
  )
  const scorerMap = React.useMemo(
    () => Object.fromEntries(scorers.map((s) => [s.id, s])),
    [scorers]
  )

  const favoriteTeamList = favoriteTeams
    .map((id) => teamMap[id])
    .filter(Boolean) as Team[]

  const favoritePlayerList = favoritePlayers
    .map((id) => scorerMap[id])
    .filter(Boolean) as Scorer[]

  const liveMatches = teamMatches.filter((m) => m.match.status === "live")
  const upcomingMatches = teamMatches.filter((m) => m.match.status === "scheduled")

  if (!ready) {
    return (
      <div className="flex flex-col gap-5 p-4 md:p-6">
        <FavoritesHeader teamCount={0} playerCount={0} />
        <Card>
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            Memuat favorit Anda…
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <FavoritesHeader
        teamCount={favoriteTeamList.length}
        playerCount={favoritePlayerList.length}
      />

      {(liveMatches.length > 0 || upcomingMatches.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Pertandingan Tim Favorit</CardTitle>
            <CardDescription>
              Live dan jadwal mendatang dari tim yang Anda simpan.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {liveMatches.length > 0 && (
              <section className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold text-destructive">Sedang Berlangsung</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {liveMatches.map((item) => (
                    <MatchCard key={item.match.id} {...item} />
                  ))}
                </div>
              </section>
            )}
            {upcomingMatches.length > 0 && (
              <section className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold">Mendatang</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {upcomingMatches.slice(0, 6).map((item) => (
                    <MatchCard key={item.match.id} {...item} compact />
                  ))}
                </div>
              </section>
            )}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="teams">
        <TabsList>
          <TabsTrigger value="teams" className="gap-1.5">
            <ShieldIcon className="size-4" />
            Tim Favorit
            <CountBadge count={favoriteTeamList.length} />
          </TabsTrigger>
          <TabsTrigger value="players" className="gap-1.5">
            <GoalIcon className="size-4" />
            Pemain Favorit
            <CountBadge count={favoritePlayerList.length} />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="teams" className="mt-4">
          {favoriteTeamList.length === 0 ? (
            <EmptyState
              title="Belum ada tim favorit"
              description="Ketuk bintang di halaman Tim untuk menyimpan tim favorit Anda."
              href="/teams"
              linkLabel="Jelajahi Tim"
            />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {favoriteTeamList.map((team) => (
                <Card key={team.id} className="overflow-hidden">
                  <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
                    <div className="flex w-full items-start justify-end">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Hapus dari favorit"
                        onClick={() => removeTeamFavorite(team.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    </div>
                    <Link href={`/teams/${team.id}`} className="flex flex-col items-center gap-2">
                      <CountryFlag code={team.flag} size="3xl" title={team.name} ring />
                      <span className="font-semibold leading-tight">{team.shortName}</span>
                      <div className="flex flex-wrap items-center justify-center gap-1">
                        <Badge variant="outline" className="font-mono text-[10px]">
                          {team.code}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px]">
                          Grup {team.group}
                        </Badge>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="players" className="mt-4">
          {favoritePlayerList.length === 0 ? (
            <EmptyState
              title="Belum ada pemain favorit"
              description="Ketuk bintang di halaman Stats untuk menyimpan pemain favorit Anda."
              href="/stats"
              linkLabel="Lihat Statistik"
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {favoritePlayerList.map((player) => {
                const team = teamMap[player.teamId]
                return (
                  <Card key={player.id}>
                    <CardContent className="flex items-center gap-3 p-4">
                      <Avatar className="size-11">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {player.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="truncate font-semibold">{player.name}</span>
                        {team && (
                          <Link
                            href={`/teams/${team.id}`}
                            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                          >
                            <CountryFlag code={team.flag} size="xs" title={team.name} />
                            {team.shortName}
                          </Link>
                        )}
                        <div className="flex gap-2 pt-1">
                          <Badge variant="outline" className="font-mono text-[10px]">
                            {player.position}
                          </Badge>
                          <Badge variant="secondary" className="text-[10px]">
                            ⚽ {player.goals} gol
                          </Badge>
                          {player.assists > 0 && (
                            <Badge variant="secondary" className="text-[10px]">
                              {player.assists} assist
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Hapus dari favorit"
                        onClick={() => removePlayerFavorite(player.id)}
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function FavoritesHeader({
  teamCount,
  playerCount,
}: {
  teamCount: number
  playerCount: number
}) {
  return (
    <div>
      <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
        <StarIcon className="size-6 fill-amber-500 text-amber-500" />
        Favorit Saya
      </h1>
      <p className="text-sm text-muted-foreground">
        {teamCount} tim · {playerCount} pemain — disimpan di perangkat Anda.
      </p>
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

function EmptyState({
  title,
  description,
  href,
  linkLabel,
}: {
  title: string
  description: string
  href: string
  linkLabel: string
}) {
  return (
    <Empty className="min-h-48 rounded-lg border border-dashed">
      <EmptyTitle>{title}</EmptyTitle>
      <EmptyDescription>{description}</EmptyDescription>
      <Button asChild variant="outline" className="mt-3">
        <Link href={href}>{linkLabel}</Link>
      </Button>
    </Empty>
  )
}