import Image from "next/image"

import { flagUrl, FLAG_SIZES, type FlagSize } from "@/lib/flags"
import { cn } from "@/lib/utils"

export function CountryFlag({
  code,
  size = "md",
  className,
  title,
  ring = true,
}: {
  code: string
  size?: FlagSize
  className?: string
  title?: string
  ring?: boolean
}) {
  const { px, cdn } = FLAG_SIZES[size]
  const isPlaceholder = !code || code === "tbd"

  if (isPlaceholder) {
    return (
      <span
        title={title ?? "TBD"}
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-sm bg-muted text-muted-foreground",
          ring && "ring-1 ring-border/60",
          className
        )}
        style={{ width: px, height: Math.round(px * 0.75) }}
      >
        <span className="text-[8px] font-bold">?</span>
      </span>
    )
  }

  const h = Math.round(px * 0.75)

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 overflow-hidden rounded-sm",
        ring && "shadow-sm ring-1 ring-black/10 dark:ring-white/15",
        className
      )}
      style={{ width: px, height: h }}
      title={title}
    >
      <Image
        src={flagUrl(code, cdn)}
        alt={title ? `Bendera ${title}` : `Bendera ${code}`}
        width={px}
        height={h}
        className="size-full object-cover"
        unoptimized
      />
    </span>
  )
}