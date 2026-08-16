"use client"

import * as React from "react"
import {
  CheckIcon,
  DicesIcon,
  HistoryIcon,
  ListPlusIcon,
  PartyPopperIcon,
  PencilIcon,
  PlusIcon,
  RotateCcwIcon,
  ShuffleIcon,
  Trash2Icon,
  UsersIcon,
  Volume2Icon,
  VolumeXIcon,
  Wand2Icon,
} from "lucide-react"
import { toast } from "sonner"

import { ConfettiBurst } from "@/components/confetti-burst"
import { MemberFormSheet } from "@/components/member-form-sheet"
import { PickerTimeline } from "@/components/picker-timeline"
import { useRandomPicker } from "@/hooks/use-random-picker"
import { playPickerFanfare, playPickerTick } from "@/lib/audio/picker-sounds"
import {
  parseMemberNames,
  type MemberInput,
  type PickerMember,
} from "@/lib/random-picker"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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
    addMember,
    updateMember,
    removeMember,
    clearMembers,
    resetQueue,
    undoLast,
    commitPick,
  } = useRandomPicker()

  const [bulkInput, setBulkInput] = React.useState("")
  const [quickAddOpen, setQuickAddOpen] = React.useState(false)
  const [formOpen, setFormOpen] = React.useState(false)
  const [formKey, setFormKey] = React.useState(0)
  const [editingMember, setEditingMember] = React.useState<PickerMember | null>(
    null
  )
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

  const openCreateSheet = () => {
    setEditingMember(null)
    setFormKey((k) => k + 1)
    setFormOpen(true)
  }

  const openEditSheet = (member: PickerMember) => {
    setEditingMember(member)
    setFormKey((k) => k + 1)
    setFormOpen(true)
  }

  const handleFormSubmit = (input: MemberInput) => {
    if (editingMember) {
      updateMember(editingMember.id, input)
    } else {
      addMember(input)
    }
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
      !window.confirm("Reset antrian sukses? Semua anggota akan bisa dipilih lagi.")
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
              spinning && "animate-picker-shake border-primary/50 bg-muted/50",
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
                !spinning && remaining.length > 0 && "animate-picker-glow-pulse"
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
            {remaining.length} dari {members.length} anggota tersisa untuk diacak.
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
                <TabsTrigger value="timeline" className="gap-1.5">
                  <HistoryIcon className="size-4" />
                  Timeline
                  <CountBadge count={history.length} />
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="members" className="flex flex-col gap-3 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-muted-foreground">
                  Kelola daftar anggota — tambah, ubah, atau hapus.
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    onClick={() => setQuickAddOpen((v) => !v)}
                  >
                    <ListPlusIcon className="size-4" />
                    Tambah Cepat
                  </Button>
                  <Button size="sm" className="gap-1.5" onClick={openCreateSheet}>
                    <PlusIcon className="size-4" />
                    Tambah Anggota
                  </Button>
                </div>
              </div>

              {quickAddOpen && (
                <form
                  onSubmit={handleAddMembers}
                  className="flex flex-col gap-2 rounded-lg border p-3"
                >
                  <textarea
                    value={bulkInput}
                    onChange={(e) => setBulkInput(e.target.value)}
                    placeholder={
                      "Tambah banyak nama sekaligus — satu nama per baris\natau pisahkan dengan koma (No. HP & posisi bisa diisi lewat Edit)"
                    }
                    rows={2}
                    className="w-full min-w-0 resize-none rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                  />
                  <Button type="submit" size="sm" className="gap-1.5 self-end">
                    <PlusIcon className="size-4" />
                    Tambah
                  </Button>
                </form>
              )}

              {members.length === 0 ? (
                <Empty className="min-h-40 rounded-lg border border-dashed">
                  <EmptyTitle>Belum ada anggota</EmptyTitle>
                  <EmptyDescription>
                    Klik &quot;Tambah Anggota&quot; untuk mulai mengisi daftar.
                  </EmptyDescription>
                </Empty>
              ) : (
                <div className="max-h-[420px] overflow-y-auto rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>No. HP</TableHead>
                        <TableHead>Posisi</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {members.map((member) => {
                        const entry = history.find(
                          (h) => h.memberId === member.id
                        )
                        return (
                          <TableRow key={member.id}>
                            <TableCell className="font-medium">
                              {member.name}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {member.phone || "—"}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {member.position || "—"}
                            </TableCell>
                            <TableCell>
                              {entry ? (
                                <Badge variant="secondary" className="gap-1">
                                  {entry.method === "manual" ? (
                                    <Wand2Icon className="size-3" />
                                  ) : (
                                    <ShuffleIcon className="size-3" />
                                  )}
                                  #
                                  {history.findIndex((h) => h.id === entry.id) +
                                    1}
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="text-muted-foreground"
                                >
                                  Belum dipilih
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-end gap-1">
                                {!entry && (
                                  <Button
                                    size="icon-sm"
                                    variant="secondary"
                                    disabled={spinning}
                                    aria-label={`Pilih ${member.name}`}
                                    onClick={() => handleManualPick(member)}
                                  >
                                    <Wand2Icon className="size-3.5" />
                                  </Button>
                                )}
                                <Button
                                  size="icon-sm"
                                  variant="ghost"
                                  aria-label={`Edit ${member.name}`}
                                  onClick={() => openEditSheet(member)}
                                >
                                  <PencilIcon className="size-3.5" />
                                </Button>
                                <Button
                                  size="icon-sm"
                                  variant="ghost"
                                  aria-label={`Hapus ${member.name}`}
                                  className="text-muted-foreground hover:text-destructive"
                                  onClick={() => removeMember(member.id)}
                                >
                                  <Trash2Icon className="size-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
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

            <TabsContent value="timeline" className="flex flex-col gap-3 p-3">
              {history.length === 0 ? (
                <Empty className="min-h-40 rounded-lg border border-dashed">
                  <EmptyTitle>Timeline masih kosong</EmptyTitle>
                  <EmptyDescription>
                    Pemenang yang berhasil dipilih (acak maupun manual) akan
                    tercatat di sini secara berurutan, lengkap dengan waktu.
                  </EmptyDescription>
                </Empty>
              ) : (
                <div className="max-h-[480px] overflow-y-auto pr-1">
                  <PickerTimeline history={history} members={members} />
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

      <MemberFormSheet
        key={formKey}
        open={formOpen}
        onOpenChange={setFormOpen}
        member={editingMember}
        onSubmit={handleFormSubmit}
      />

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
