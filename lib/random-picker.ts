export interface PickerMember {
  id: string
  name: string
  /** Nomor HP — opsional. */
  phone: string
  /** Posisi/jabatan — opsional. */
  position: string
}

export interface MemberInput {
  name: string
  phone?: string
  position?: string
}

export type PickMethod = "random" | "manual"

export interface PickerHistoryEntry {
  id: string
  memberId: string
  name: string
  pickedAt: number
  method: PickMethod
}

export interface PickerState {
  members: PickerMember[]
  history: PickerHistoryEntry[]
}

export const PICKER_STORAGE_KEY = "wc2026-random-picker"
export const PICKER_MUTED_STORAGE_KEY = "wc2026-random-picker-muted"

export const EMPTY_PICKER_STATE: PickerState = {
  members: [],
  history: [],
}

function isMember(value: unknown): value is PickerMember {
  return (
    !!value &&
    typeof value === "object" &&
    typeof (value as PickerMember).id === "string" &&
    typeof (value as PickerMember).name === "string"
  )
}

/** Normalisasi entri anggota lama (tanpa phone/position) dari localStorage. */
function normalizeMember(value: PickerMember): PickerMember {
  return {
    id: value.id,
    name: value.name,
    phone: typeof value.phone === "string" ? value.phone : "",
    position: typeof value.position === "string" ? value.position : "",
  }
}

function isHistoryEntry(value: unknown): value is PickerHistoryEntry {
  return (
    !!value &&
    typeof value === "object" &&
    typeof (value as PickerHistoryEntry).id === "string" &&
    typeof (value as PickerHistoryEntry).memberId === "string" &&
    typeof (value as PickerHistoryEntry).name === "string" &&
    typeof (value as PickerHistoryEntry).pickedAt === "number" &&
    ((value as PickerHistoryEntry).method === "random" ||
      (value as PickerHistoryEntry).method === "manual")
  )
}

export function parsePickerState(raw: string | null): PickerState {
  if (!raw) return EMPTY_PICKER_STATE
  try {
    const parsed = JSON.parse(raw) as Partial<PickerState>
    return {
      members: Array.isArray(parsed.members)
        ? parsed.members.filter(isMember).map(normalizeMember)
        : [],
      history: Array.isArray(parsed.history)
        ? parsed.history.filter(isHistoryEntry)
        : [],
    }
  } catch {
    return EMPTY_PICKER_STATE
  }
}

/** Anggota yang belum pernah masuk antrian sukses. */
export function getRemainingMembers(state: PickerState): PickerMember[] {
  const pickedIds = new Set(state.history.map((h) => h.memberId))
  return state.members.filter((m) => !pickedIds.has(m.id))
}

/** Pisahkan input multi-baris/koma jadi nama-nama anggota unik, urutan dipertahankan. */
export function parseMemberNames(raw: string): string[] {
  const seen = new Set<string>()
  const names: string[] = []
  for (const line of raw.split(/[\n,]/)) {
    const name = line.trim()
    if (!name) continue
    const key = name.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    names.push(name)
  }
  return names
}
