"use client"

import { DicesIcon, Wand2Icon } from "lucide-react"

import type { PickerHistoryEntry, PickerMember } from "@/lib/random-picker"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function PickerTimeline({
  history,
  members,
}: {
  history: PickerHistoryEntry[]
  members: PickerMember[]
}) {
  const memberMap = new Map(members.map((m) => [m.id, m]))
  const ordered = [...history].reverse()

  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute inset-y-4 left-4 w-px -translate-x-1/2 bg-border"
      />
      <ol className="relative flex flex-col gap-4">
        {ordered.map((entry, i) => {
          const order = history.length - i
          const member = memberMap.get(entry.memberId)
          return (
            <li key={entry.id} className="flex gap-3">
              <span
                className={cn(
                  "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2 bg-background text-xs font-bold tabular-nums",
                  i === 0
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground"
                )}
              >
                {order}
              </span>
              <div className="flex flex-1 flex-col gap-1 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold">{entry.name}</span>
                  <Badge variant="outline" className="shrink-0 gap-1 text-[10px]">
                    {entry.method === "manual" ? (
                      <Wand2Icon className="size-3" />
                    ) : (
                      <DicesIcon className="size-3" />
                    )}
                    {entry.method === "manual" ? "Manual" : "Acak"}
                  </Badge>
                </div>
                {(member?.position || member?.phone) && (
                  <span className="text-xs text-muted-foreground">
                    {[member?.position, member?.phone].filter(Boolean).join(" · ")}
                  </span>
                )}
                <span className="text-xs tabular-nums text-muted-foreground">
                  {new Date(entry.pickedAt).toLocaleString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
