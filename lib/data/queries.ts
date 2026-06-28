import type { Match } from "@/lib/types"

/** Semua jadwal ditampilkan dalam WIB (UTC+7), terlepas dari timezone server. */
const WIB = "Asia/Jakarta"

export function formatKickoff(iso: string): string {
  const d = new Date(iso)
  return `${d.toLocaleString("id-ID", {
    timeZone: WIB,
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })} WIB`
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    timeZone: WIB,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function formatTime(iso: string): string {
  return `${new Date(iso).toLocaleTimeString("id-ID", {
    timeZone: WIB,
    hour: "2-digit",
    minute: "2-digit",
  })} WIB`
}

export function groupMatchesByDay(list: Match[]): Record<string, Match[]> {
  const out: Record<string, Match[]> = {}
  const sorted = [...list].sort((a, b) => a.kickoff.localeCompare(b.kickoff))
  for (const m of sorted) {
    const day = new Date(m.kickoff).toLocaleDateString("id-ID", {
      timeZone: WIB,
      weekday: "long",
      day: "numeric",
      month: "long",
    })
    out[day] ??= []
    out[day].push(m)
  }
  return out
}

export function stageLabel(stage: Match["stage"]): string {
  if (typeof stage === "string" && stage.length === 1) return `Grup ${stage}`
  const labels: Record<string, string> = {
    R32: "Babak 32",
    R16: "Babak 16",
    QF: "Perempat Final",
    SF: "Semi Final",
    "3RD": "Juara 3",
    FINAL: "Final",
  }
  return labels[stage] ?? String(stage)
}