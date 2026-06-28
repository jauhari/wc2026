"use client"

import type { EnrichedMatch } from "@/lib/match-enriched"
import { MatchDetailContent } from "@/components/match-detail-content"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

export function MatchDetailSheet({
  data,
  open,
  onOpenChange,
}: {
  data: EnrichedMatch | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!data) return null

  const { match, home, away, stadium, goals } = data
  const title =
    match.homeScore !== null && match.awayScore !== null
      ? `${home.shortName} ${match.homeScore} - ${match.awayScore} ${away.shortName}`
      : `${home.shortName} vs ${away.shortName}`

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto rounded-t-2xl px-4 pb-8">
        <SheetHeader className="px-0 text-left">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>Detail pertandingan & pencetak gol</SheetDescription>
        </SheetHeader>
        <MatchDetailContent
          match={match}
          home={home}
          away={away}
          stadium={stadium}
          goals={goals}
        />
      </SheetContent>
    </Sheet>
  )
}