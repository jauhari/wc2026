"use client"

import { FavoriteButton } from "@/components/favorite-button"

export function TeamFavoriteHeader({
  teamId,
  teamName,
}: {
  teamId: string
  teamName: string
}) {
  return (
    <FavoriteButton
      kind="team"
      id={teamId}
      label={teamName}
      size="icon"
      className="size-10"
    />
  )
}