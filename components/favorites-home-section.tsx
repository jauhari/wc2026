"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRightIcon, StarIcon } from "lucide-react"

import { MatchCard } from "@/components/match-card"
import { useFavorites } from "@/hooks/use-favorites"
import type { EnrichedMatch } from "@/lib/match-enriched"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function FavoritesHomeSection({ matches }: { matches: EnrichedMatch[] }) {
  const { ready, favoriteTeams } = useFavorites()

  if (!ready || favoriteTeams.length === 0) return null

  const relevant = matches.filter(
    (m) =>
      favoriteTeams.includes(m.home.id) ||
      favoriteTeams.includes(m.away.id)
  )

  if (relevant.length === 0) return null

  const live = relevant.filter((m) => m.match.status === "live")
  const upcoming = relevant.filter((m) => m.match.status === "scheduled")
  const display = [...live, ...upcoming].slice(0, 4)

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <StarIcon className="size-4 fill-amber-500 text-amber-500" />
          Tim Favorit Anda
        </h2>
        <Button asChild variant="ghost" size="sm">
          <Link href="/favorites">
            Semua Favorit
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Pertandingan Mendatang & Live</CardTitle>
          <CardDescription>
            {favoriteTeams.length} tim favorit · {display.length} pertandingan relevan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {display.map((item) => (
              <MatchCard key={item.match.id} {...item} compact />
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}