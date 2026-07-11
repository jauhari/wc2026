"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import {
  CLIENT_REFRESH_LIVE_MS,
  CLIENT_REFRESH_MS,
} from "@/lib/data/constants"

function isTournamentWindow(): boolean {
  const now = Date.now()
  const start = Date.UTC(2026, 5, 11)
  const end = Date.UTC(2026, 6, 20)
  return now >= start && now <= end
}

export function TournamentAutoRefresh() {
  const router = useRouter()
  const liveCountRef = React.useRef(0)

  React.useEffect(() => {
    if (!isTournamentWindow()) return

    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined

    const schedule = () => {
      const interval =
        liveCountRef.current > 0 ? CLIENT_REFRESH_LIVE_MS : CLIENT_REFRESH_MS
      timer = setTimeout(tick, interval)
    }

    const tick = async () => {
      if (cancelled) return
      try {
        const res = await fetch("/api/tournament", { cache: "no-store" })
        if (res.ok) {
          const body = (await res.json()) as { liveCount?: number }
          liveCountRef.current = body.liveCount ?? 0
        }
      } catch {
        /* tetap refresh halaman meski status API gagal */
      }
      router.refresh()
      schedule()
    }

    schedule()
    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [router])

  return null
}