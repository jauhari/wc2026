"use client"

import * as React from "react"
import { RefreshCwIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  CLIENT_REFRESH_LIVE_MS,
  CLIENT_REFRESH_MS,
} from "@/lib/data/constants"

interface TournamentStatus {
  fetchedAt: string
  source: string
  liveCount: number
}

function isTournamentWindow(): boolean {
  const now = Date.now()
  const start = Date.UTC(2026, 5, 11)
  const end = Date.UTC(2026, 6, 20)
  return now >= start && now <= end
}

export function DataFreshness() {
  const [status, setStatus] = React.useState<TournamentStatus | null>(null)
  const liveCountRef = React.useRef(0)

  React.useEffect(() => {
    if (!isTournamentWindow()) return

    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined

    const poll = async () => {
      try {
        const res = await fetch("/api/tournament", { cache: "no-store" })
        if (!res.ok) return
        const body = (await res.json()) as TournamentStatus
        if (!cancelled) {
          liveCountRef.current = body.liveCount
          setStatus(body)
        }
      } catch {
        /* abaikan */
      }
    }

    const schedule = () => {
      const interval =
        liveCountRef.current > 0 ? CLIENT_REFRESH_LIVE_MS : CLIENT_REFRESH_MS
      timer = setTimeout(async () => {
        await poll()
        schedule()
      }, interval)
    }

    void poll().then(schedule)
    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [])

  if (!status) return null

  const updated = new Date(status.fetchedAt).toLocaleTimeString("id-ID", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="hidden items-center gap-2 sm:flex">
      {status.liveCount > 0 && (
        <Badge variant="destructive" className="gap-1 font-normal">
          <span className="size-1.5 animate-pulse rounded-full bg-current" />
          {status.liveCount} live
        </Badge>
      )}
      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
        <RefreshCwIcon className="size-3" />
        {updated} WIB
      </span>
    </div>
  )
}