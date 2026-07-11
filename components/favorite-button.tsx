"use client"

import * as React from "react"
import { StarIcon } from "lucide-react"

import { useFavorites } from "@/hooks/use-favorites"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type FavoriteKind = "team" | "player"

export function FavoriteButton({
  kind,
  id,
  label,
  size = "icon-sm",
  className,
  onClick,
}: {
  kind: FavoriteKind
  id: string
  label?: string
  size?: "icon-sm" | "icon"
  className?: string
  onClick?: (e: React.MouseEvent) => void
}) {
  const { ready, isTeamFavorite, isPlayerFavorite, toggleTeamFavorite, togglePlayerFavorite } =
    useFavorites()

  const active =
    kind === "team" ? isTeamFavorite(id) : isPlayerFavorite(id)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onClick?.(e)
    if (kind === "team") {
      toggleTeamFavorite(id, label)
    } else {
      togglePlayerFavorite(id, label)
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size={size}
      aria-label={active ? "Hapus dari favorit" : "Tambah ke favorit"}
      aria-pressed={active}
      disabled={!ready}
      onClick={handleClick}
      className={cn(
        "shrink-0 text-muted-foreground hover:text-amber-500",
        active && "text-amber-500 hover:text-amber-600",
        className
      )}
    >
      <StarIcon
        className={cn("size-4 transition-transform", active && "fill-amber-500")}
      />
    </Button>
  )
}