"use client"

import { FavoriteButton } from "@/components/favorite-button"
import { Badge } from "@/components/ui/badge"

export function TeamScorerChip({
  id,
  name,
  goals,
}: {
  id: string
  name: string
  goals: number
}) {
  return (
    <div className="flex items-center gap-1 rounded-lg border bg-card px-2 py-1.5 text-sm">
      <FavoriteButton kind="player" id={id} label={name} size="icon-sm" />
      <span className="font-medium">{name}</span>
      <Badge variant="secondary" className="text-[10px]">
        ⚽ {goals}
      </Badge>
    </div>
  )
}