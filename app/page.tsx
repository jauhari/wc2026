import type { Metadata } from "next"
import Link from "next/link"
import { TrophyIcon, GoalIcon, UsersIcon, CalendarDaysIcon, ArrowRightIcon, FlameIcon } from "lucide-react"

import { getTournamentData, getTeam } from "@/lib/data/tournament"
import { buildRootMetadata } from "@/lib/seo"
import { enrichMatches } from "@/lib/enrich-matches"
import { hostNations } from "@/lib/data/stadiums"
import { CountryFlag } from "@/components/country-flag"
import { MatchCard } from "@/components/match-card"
import { FavoritesHomeSection } from "@/components/favorites-home-section"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  return buildRootMetadata()
}

export default async function HomePage() {
  const data = await getTournamentData()
  const nextUp = enrichMatches(data, data.upcomingMatches.slice(0, 4))
  const liveNow = enrichMatches(data, data.liveMatches)
  const favoriteMatches = enrichMatches(
    data,
    [...data.liveMatches, ...data.upcomingMatches]
  )
  const topScorer = data.topScorers[0]
  const finishedCount = data.finishedMatches.length

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <Card className="relative overflow-hidden border-none bg-gradient-to-br from-brand-green via-primary to-primary text-primary-foreground">
        <div className="absolute inset-0 opacity-20" aria-hidden>
          <div className="absolute -right-10 -top-10 size-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-16 left-10 size-72 rounded-full bg-brand-blue/40 blur-3xl" />
        </div>
        <CardContent className="relative flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div className="flex flex-col gap-3">
            <Badge className="w-fit bg-white/20 text-primary-foreground hover:bg-white/30">
              11 Juni – 19 Juli 2026
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              FIFA World Cup 2026
            </h1>
            <p className="max-w-lg text-primary-foreground/90">
              Pantau seluruh turnamen — hasil, klasemen, jadwal, bagan, dan statistik.
              Tuan rumah tiga negara:
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {hostNations.map((n) => (
                <span key={n.code} className="flex items-center gap-1.5 text-sm font-medium text-primary-foreground/95">
                  <CountryFlag code={n.flag} size="md" title={n.name} ring={false} />
                  {n.name}
                </span>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button asChild variant="secondary">
                <Link href="/schedule">
                  Lihat Jadwal
                  <ArrowRightIcon data-icon="inline-end" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/30 bg-transparent text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
              >
                <Link href="/bracket">Bagan Guguran</Link>
              </Button>
            </div>
          </div>
          <div className="text-right">
            <div className="text-6xl font-black leading-none tracking-tighter md:text-7xl">
              26
            </div>
            <div className="text-sm font-medium uppercase tracking-widest text-primary-foreground/80">
              WE ARE
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          icon={<UsersIcon className="size-5" />}
          label="Tim Peserta"
          value={String(data.teams.length)}
          hint="12 grup"
        />
        <StatTile
          icon={<GoalIcon className="size-5" />}
          label="Total Gol"
          value={String(data.totalGoals)}
          hint={`${finishedCount} pertandingan selesai`}
        />
        <StatTile
          icon={<CalendarDaysIcon className="size-5" />}
          label="Total Pertandingan"
          value="104"
          hint="72 grup + 32 guguran"
        />
        <StatTile
          icon={<TrophyIcon className="size-5" />}
          label="Stadion"
          value={String(data.stadiums.length)}
          hint="3 negara tuan rumah"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          {liveNow.length > 0 && (
            <section className="flex flex-col gap-3">
              <SectionTitle icon={<FlameIcon className="size-4 text-destructive" />}>
                Sedang Berlangsung
              </SectionTitle>
              <div className="grid gap-3 sm:grid-cols-2">
                {liveNow.map((item) => (
                  <MatchCard key={item.match.id} {...item} />
                ))}
              </div>
            </section>
          )}

          <FavoritesHomeSection matches={favoriteMatches} />

          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <SectionTitle icon={<CalendarDaysIcon className="size-4" />}>
                Pertandingan Mendatang
              </SectionTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/schedule">
                  Semua
                  <ArrowRightIcon data-icon="inline-end" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {nextUp.map((item) => (
                <MatchCard key={item.match.id} {...item} compact />
              ))}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-6">
          {topScorer && (
            <Card>
              <CardHeader>
                <CardDescription>Pencetak Gol Terbanyak</CardDescription>
                <CardTitle className="flex items-center gap-2">
                  <GoalIcon className="size-5 text-primary" />
                  Top Skor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="size-12">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {topScorer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 flex-col">
                    <span className="font-semibold">{topScorer.name}</span>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CountryFlag
                        code={getTeam(data, topScorer.teamId).flag}
                        size="xs"
                        title={getTeam(data, topScorer.teamId).name}
                      />
                      {getTeam(data, topScorer.teamId).name}
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold tabular-nums text-primary">
                      {topScorer.goals}
                    </div>
                    <div className="text-[10px] uppercase text-muted-foreground">gol</div>
                  </div>
                </div>
                <Separator className="my-3" />
                <Button asChild variant="outline" className="w-full">
                  <Link href="/stats">Lihat Semua Statistik</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Tuan Rumah</CardTitle>
              <CardDescription>Tiga negara penyelenggara</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {hostNations.map((n) => (
                <div
                  key={n.code}
                  className="flex items-center justify-between rounded-lg border bg-card px-3 py-2"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <CountryFlag code={n.flag} size="lg" title={n.name} />
                    {n.name}
                  </span>
                  <Badge variant="secondary">{n.code}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <p className="text-center text-[10px] text-muted-foreground">
            Data diperbarui:{" "}
            {new Date(data.fetchedAt).toLocaleString("id-ID", {
              timeZone: "Asia/Jakarta",
            })}{" "}
            WIB · {data.source}
          </p>
        </div>
      </div>
    </div>
  )
}

function StatTile({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode
  label: string
  value: string
  hint: string
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold leading-none tabular-nums">{value}</span>
          <span className="text-sm font-medium">{label}</span>
          <span className="text-xs text-muted-foreground">{hint}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function SectionTitle({
  icon,
  children,
}: {
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <h2 className="flex items-center gap-2 text-lg font-semibold">
      {icon}
      {children}
    </h2>
  )
}