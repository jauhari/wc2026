"use client"

import * as React from "react"
import { toast } from "sonner"

import {
  EMPTY_PICKER_STATE,
  PICKER_MUTED_STORAGE_KEY,
  PICKER_STORAGE_KEY,
  getRemainingMembers,
  parsePickerState,
  type PickerHistoryEntry,
  type PickerMember,
  type PickerState,
} from "@/lib/random-picker"

const listeners = new Set<() => void>()
const mutedListeners = new Set<() => void>()

// useSyncExternalStore requires a stable (cached) snapshot reference, so state
// lives in these module-level variables and is only replaced on writes.
let cachedState: PickerState | null = null
let cachedMuted: boolean | null = null

function readState(): PickerState {
  if (typeof window === "undefined") return EMPTY_PICKER_STATE
  if (cachedState === null) {
    cachedState = parsePickerState(localStorage.getItem(PICKER_STORAGE_KEY))
  }
  return cachedState
}

function writeState(next: PickerState) {
  cachedState = next
  localStorage.setItem(PICKER_STORAGE_KEY, JSON.stringify(next))
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function readMuted(): boolean {
  if (typeof window === "undefined") return false
  if (cachedMuted === null) {
    cachedMuted = localStorage.getItem(PICKER_MUTED_STORAGE_KEY) === "1"
  }
  return cachedMuted
}

function writeMuted(next: boolean) {
  cachedMuted = next
  localStorage.setItem(PICKER_MUTED_STORAGE_KEY, next ? "1" : "0")
  for (const listener of mutedListeners) listener()
}

function subscribeMuted(listener: () => void) {
  mutedListeners.add(listener)
  return () => mutedListeners.delete(listener)
}

function makeId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function useRandomPicker() {
  const state = React.useSyncExternalStore(
    subscribe,
    readState,
    () => EMPTY_PICKER_STATE
  )
  const ready = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
  const muted = React.useSyncExternalStore(
    subscribeMuted,
    readMuted,
    () => false
  )

  const setMuted = React.useCallback((next: boolean) => {
    writeMuted(next)
  }, [])

  const addMembers = React.useCallback((names: string[]) => {
    if (names.length === 0) return
    const prev = readState()
    const existingKeys = new Set(prev.members.map((m) => m.name.toLowerCase()))
    const added: PickerMember[] = []
    for (const name of names) {
      const key = name.toLowerCase()
      if (existingKeys.has(key)) continue
      existingKeys.add(key)
      added.push({ id: makeId(), name })
    }
    if (added.length === 0) {
      toast.info("Semua nama sudah ada di daftar")
      return
    }
    writeState({ ...prev, members: [...prev.members, ...added] })
    toast.success(`${added.length} anggota ditambahkan`)
  }, [])

  const removeMember = React.useCallback((id: string) => {
    const prev = readState()
    writeState({
      members: prev.members.filter((m) => m.id !== id),
      history: prev.history.filter((h) => h.memberId !== id),
    })
  }, [])

  const clearMembers = React.useCallback(() => {
    writeState({ members: [], history: [] })
    toast.success("Daftar anggota & antrian sukses dikosongkan")
  }, [])

  const resetQueue = React.useCallback(() => {
    const prev = readState()
    writeState({ ...prev, history: [] })
    toast.success("Antrian sukses direset — semua anggota bisa dipilih lagi")
  }, [])

  const undoLast = React.useCallback(() => {
    const prev = readState()
    if (prev.history.length === 0) return
    writeState({ ...prev, history: prev.history.slice(0, -1) })
    toast.info("Pilihan terakhir dibatalkan")
  }, [])

  const commitPick = React.useCallback(
    (member: PickerMember, method: PickerHistoryEntry["method"]) => {
      const prev = readState()
      if (prev.history.some((h) => h.memberId === member.id)) return
      const entry: PickerHistoryEntry = {
        id: makeId(),
        memberId: member.id,
        name: member.name,
        pickedAt: Date.now(),
        method,
      }
      writeState({ ...prev, history: [...prev.history, entry] })
    },
    []
  )

  const remaining = React.useMemo(() => getRemainingMembers(state), [state])

  return {
    ready,
    members: state.members,
    history: state.history,
    remaining,
    muted,
    setMuted,
    addMembers,
    removeMember,
    clearMembers,
    resetQueue,
    undoLast,
    commitPick,
  }
}
