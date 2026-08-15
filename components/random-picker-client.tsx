"use client"

import * as React from "react"
import {
  CheckIcon,
  DicesIcon,
  HistoryIcon,
  PartyPopperIcon,
  PlusIcon,
  RotateCcwIcon,
  ShuffleIcon,
  Trash2Icon,
  UsersIcon,
  Volume2Icon,
  VolumeXIcon,
  Wand2Icon,
  XIcon,
} from "lucide-react"
import { toast } from "sonner"

import { ConfettiBurst } from "@/components/confetti-burst"
import { useRandomPicker } from "@/hooks/use-random-picker"
import { playPickerFanfare, playPickerTick } from "@/lib/audio/picker-sounds"
import { parseMemberNames, type PickerMember } from "@/lib/random-picker"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const SPIN_DURATION_MS = 2400

export function RandomPickerClient() {
  const {
    ready,
    members,
    history,
    remaining,
    muted,
    setMuted,
    addMembers,
    removeMember,
    clearMembers,
    resetQueue,
    undoLast,
    commitPick,
  } = useRandomPicker()

  const [bulkInput, setBulkInput] = React.useState("")
  const [spinning, setSpinning] = React.useState(false)
  const [displayName, setDisplayName] = React.useState<string | null>(null)
  const [winner, setWinner] = React.useState<PickerMember | null>(null)
  const [revealKey, setRevealKey] = React.useState(0)
  const [confettiTrigger, setConfettiTrigger] = React.useState(0)
  const spinTimeoutRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) window.clearTimeout(spinTimeoutRef.current)
    }
  }, [])

  const finalizePick = React.useCallback(
    (member: PickerMember, method: "random" | "manual") => {
      setDisplayName(member.name)
      setSpinning(false)
      setWinner(member)
      setRevealKey((n) => n + 1)
      commitPick(member, method)
      playPickerFanfare(muted)
      setConfettiTrigger((n) => n + 1)
    },
    [commitPick, muted]
  )

  const handleRandomPick = () => {
    if (spinning) return
    if (remaining.length === 0) {
      toast.error("Tidak ada anggota tersisa untuk diacak")
      return
    }
    if (remaining.length === 1) {
      finalizePick(remaining[0], "random")
      return
    }

    setSpinning(true)
    setWinner(null)
    const pool = remaining
    const finalWinner = pool[Math.floor(Math.random() * pool.length)]

    let elapsed = 0
    let interval = 70
    const tick = () => {
      const candidate = pool[Math.floor(Math.random() * pool.length)]
      setDisplayName(candidate.name)
      playPickerTick(muted)
      elapsed += interval
      interval = Math.min(interval * 1.18, 260)
      if (elapsed < SPIN_DURATION_MS) {
        spinTimeoutRef.current = window.setTimeout(tick, interval)
      } else {
        finalizePick(finalWinner, "random")
      }
    }
    tick()
  }

  const handleManualPick = (member: PickerMember) => {
    if (spinning) return
    finalizePick(member, "manual")
    toast.success(`${member.name} dipilih manual sebagai pemenang`)
  }

  const handleAddMembers = (e: React.FormEvent) => {
    e.preventDefault()
    const names = parseMemberNames(bulkInput)
    if (names.length === 0) return
    addMembers(names)
    setBulkInput("")
  }

  const handleClearMembers = () => {
    if (members.length === 0) return
    if (
      !window.confirm(
        "Hapus semua anggota dan antrian sukses? Tindakan ini tidak bisa dibatalkan."
      )
    ) {
      return
    }
    clearMembers()
    setWinner(null)
    setDisplayName(null)
  }

  const handleResetQueue = () => {
    if (history.length === 0) return
    if (
      !window.confirm(
        "Reset antrian sukses? Semua anggota akan bisa dipilih lagi."
      )
    )
      return
    resetQueue()
    setWinner(null)
    setDisplayName(null)
  }

  const handleUndo = () => {
    undoLast()
    setWinner(null)
    setDisplayName(null)
  }

  const stageText = spinning
    ? displayName
    : winner
      ? winner.name
      : members.length === 0
        ? "Tambahkan anggota dulu"
        : remaining.length === 0
          ? "Semua sudah dipilih"
          : "Siap diacak!"

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <PickerHeader
        muted={muted}
        setMuted={setMuted}
        total={members.length}
        remaining={remaining.length}
        picked={history.length}
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="relative overflow-hidden">
          <ConfettiBurst trigger={confettiTrigger} />
          <CardContent className="flex flex-col items-center gap-6 py-10">
            <div
              key={revealKey}
              className={cn(
                "relative flex min-h-28 w-full max-w-md flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 text-center",
                winner &&
                  !spinning &&
                  "animate-picker-winner-pop border-primary bg-primary/5",
                spinning &&
                  "animate-picker-shake border-primary/50 bg-muted/50",
                !winner && !spinning && "border-border bg-muted/30"
              )}
            >
              {winner && !spinning && (
                <PartyPopperIcon className="size-6 text-primary" aria-hidden />
              )}
              <span
                className={cn(
                  "font-heading text-2xl font-bold tracking-tight break-words sm:text-3xl",
                  spinning && "text-muted-foreground blur-[0.5px]",
                  winner && !spinning && "text-primary"
                )}
              >
                {stageText}
              </span>
              {winner && !spinning && (
                <Badge variant="default" className="gap-1">
                  <CheckIcon className="size-3" />
                  Terpilih #{history.length}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button
                size="lg"
                onClick={handleRandomPick}
                disabled={spinning || remaining.length === 0}
                className={cn(
                  "gap-2 px-6 text-base",
                  !spinning &&
                    remaining.length > 0 &&
                    "animate-picker-glow-pulse"
                )}
              >
                <ShuffleIcon className="size-4" />
                {spinning ? "Mengacak…" : "Acak Sekarang"}
              </Button>
              <Button
                variant="outline"
                onClick={handleUndo}
                disabled={spinning || history.length === 0}
                className="gap-1.5"
              >
                <RotateCcwIcon className="size-4" />
                Batalkan Terakhir
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              {remaining.length} dari {members.length} anggota tersisa untuk
              diacak.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue="members" className="gap-0">
              <div className="border-b px-3 pt-3">
                <TabsList className="w-full">
                  <TabsTrigger value="members" className="gap-1.5">
                    <UsersIcon className="size-4" />
                    Anggota
                    <CountBadge count={members.length} />
                  </TabsTrigger>
                  <TabsTrigger value="queue" className="gap-1.5">
                    <HistoryIcon className="size-4" />
                    Antrian Sukses
                    <CountBadge count={history.length} />
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="members" className="flex flex-col gap-3 p-3">
                <form
                  onSubmit={handleAddMembers}
                  className="flex flex-col gap-2"
                >
                  <textarea
                    value={bulkInput}
                    onChange={(e) => setBulkInput(e.target.value)}
                    placeholder={
                      "Tambah anggota — satu nama per baris\natau pisahkan dengan koma"
                    }
                    rows={2}
                    className="w-full min-w-0 resize-none rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                  />
                  <Button type="submit" size="sm" className="gap-1.5 self-end">
                    <PlusIcon className="size-4" />
                    Tambah
                  </Button>
                </form>

                {members.length === 0 ? (
                  <Empty className="min-h-40 rounded-lg border border-dashed">
                    <EmptyTitle>Belum ada anggota</EmptyTitle>
                    <EmptyDescription>
                      Tambahkan nama anggota di atas untuk mulai memilih
                      pemenang.
                    </EmptyDescription>
                  </Empty>
                ) : (
                  <div className="flex max-h-[420px] flex-col gap-1.5 overflow-y-auto pr-1">
                    {members.map((member) => {
                      const entry = history.find(
                        (h) => h.memberId === member.id
                      )
                      return (
                        <div
                          key={member.id}
                          className={cn(
                            "flex items-center gap-2 rounded-lg border px-2.5 py-2 text-sm",
                            entry
                              ? "border-border bg-muted/40"
                              : "border-border"
                          )}
                        >
                          <span
                            className={cn(
                              "min-w-0 flex-1 truncate font-medium",
                              entry &&
                                "text-muted-foreground line-through decoration-1"
                            )}
                          >
                            {member.name}
                          </span>
                          {entry ? (
                            <Badge
                              variant="secondary"
                              className="shrink-0 gap-1"
                            >
                              {entry.method === "manual" ? (
                                <Wand2Icon className="size-3" />
                              ) : (
                                <ShuffleIcon className="size-3" />
                              )}
                              #{history.findIndex((h) => h.id === entry.id) + 1}
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              variant="secondary"
                              className="h-7 shrink-0 gap-1 px-2 text-xs"
                              disabled={spinning}
                              onClick={() => handleManualPick(member)}
                            >
                              <Wand2Icon className="size-3.5" />
                              Pilih
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Hapus ${member.name}`}
                            className="shrink-0 text-muted-foreground hover:text-destructive"
                            onClick={() => removeMember(member.id)}
                          >
                            <XIcon className="size-3.5" />
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                )}

                {members.length > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-1.5 self-start"
                    onClick={handleClearMembers}
                  >
                    <Trash2Icon className="size-3.5" />
                    Hapus Semua
                  </Button>
                )}
              </TabsContent>

              <TabsContent value="queue" className="flex flex-col gap-3 p-3">
                {history.length === 0 ? (
                  <Empty className="min-h-40 rounded-lg border border-dashed">
                    <EmptyTitle>Antrian sukses masih kosong</EmptyTitle>
                    <EmptyDescription>
                      Pemenang yang berhasil dipilih (acak maupun manual) akan
                      muncul di sini, berurutan sesuai waktu.
                    </EmptyDescription>
                  </Empty>
                ) : (
                  <div className="flex max-h-[420px] flex-col gap-1.5 overflow-y-auto pr-1">
                    {[...history].reverse().map((entry, i) => {
                      const order = history.length - i
                      return (
                        <div
                          key={entry.id}
                          className="flex items-center gap-2.5 rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-2 text-sm"
                        >
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground tabular-nums">
                            {order}
                          </span>
                          <span className="min-w-0 flex-1 truncate font-medium">
                            {entry.name}
                          </span>
                          <Badge
                            variant="outline"
                            className="shrink-0 gap-1 text-[10px]"
                          >
                            {entry.method === "manual" ? (
                              <Wand2Icon className="size-3" />
                            ) : (
                              <DicesIcon className="size-3" />
                            )}
                            {entry.method === "manual" ? "Manual" : "Acak"}
                          </Badge>
                          <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                            {new Date(entry.pickedAt).toLocaleTimeString(
                              "id-ID",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}

                {history.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 self-start"
                    onClick={handleResetQueue}
                  >
                    <RotateCcwIcon className="size-3.5" />
                    Reset Antrian
                  </Button>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {!ready && (
        <p className="text-center text-xs text-muted-foreground">
          Memuat data tersimpan…
        </p>
      )}
    </div>
  )
}

function PickerHeader({
  muted,
  setMuted,
  total,
  remaining,
  picked,
}: {
  muted: boolean
  setMuted: (v: boolean) => void
  total: number
  remaining: number
  picked: number
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <DicesIcon className="size-6 text-primary" />
          Random Picker
        </h1>
        <p className="text-sm text-muted-foreground">
          {total} anggota · {remaining} tersisa · {picked} sudah masuk antrian
          sukses — data disimpan di perangkat Anda.
        </p>
      </div>
      <Button
        variant="outline"
        size="icon"
        aria-label={muted ? "Aktifkan suara" : "Matikan suara"}
        onClick={() => setMuted(!muted)}
      >
        {muted ? (
          <VolumeXIcon className="size-4" />
        ) : (
          <Volume2Icon className="size-4" />
        )}
      </Button>
    </div>
  )
}

function CountBadge({ count }: { count: number }) {
  return (
    <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground tabular-nums group-data-active:bg-background">
      {count}
    </span>
  )
}
