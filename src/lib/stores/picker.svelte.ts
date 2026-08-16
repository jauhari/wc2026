import { browser } from "$app/environment";
import { toast } from "svelte-sonner";

import {
  PICKER_MUTED_STORAGE_KEY,
  PICKER_STORAGE_KEY,
  getRemainingMembers,
  makeId,
  parsePickerState,
  type MemberInput,
  type PickerHistoryEntry,
  type PickerMember,
  type PickerState,
} from "$lib/types";

class PickerStore {
  members = $state<PickerMember[]>([]);
  history = $state<PickerHistoryEntry[]>([]);
  muted = $state(false);
  ready = $state(false);

  remaining = $derived.by(() =>
    getRemainingMembers({ members: this.members, history: this.history })
  );

  /** Baca dari localStorage — dipanggil sekali saat halaman mount. */
  load() {
    if (!browser || this.ready) return;
    const state: PickerState = parsePickerState(localStorage.getItem(PICKER_STORAGE_KEY));
    this.members = state.members;
    this.history = state.history;
    this.muted = localStorage.getItem(PICKER_MUTED_STORAGE_KEY) === "1";
    this.ready = true;
  }

  #persist() {
    if (!browser) return;
    localStorage.setItem(
      PICKER_STORAGE_KEY,
      JSON.stringify({
        members: this.members,
        history: this.history,
      } satisfies PickerState)
    );
  }

  setMuted(next: boolean) {
    this.muted = next;
    if (browser) localStorage.setItem(PICKER_MUTED_STORAGE_KEY, next ? "1" : "0");
  }

  addMembers(names: string[]) {
    if (names.length === 0) return;
    // eslint-disable-next-line svelte/prefer-svelte-reactivity -- local, discarded after this call
    const existingKeys = new Set(this.members.map((m) => m.name.toLowerCase()));
    const added: PickerMember[] = [];
    for (const name of names) {
      const key = name.toLowerCase();
      if (existingKeys.has(key)) continue;
      existingKeys.add(key);
      added.push({ id: makeId(), name, phone: "", position: "" });
    }
    if (added.length === 0) {
      toast.info("Semua nama sudah ada di daftar");
      return;
    }
    this.members = [...this.members, ...added];
    this.#persist();
    toast.success(`${added.length} anggota ditambahkan`);
  }

  addMember(input: MemberInput) {
    const name = input.name.trim();
    if (!name) return;
    const member: PickerMember = {
      id: makeId(),
      name,
      phone: input.phone?.trim() ?? "",
      position: input.position?.trim() ?? "",
    };
    this.members = [...this.members, member];
    this.#persist();
    toast.success(`${member.name} ditambahkan ke daftar anggota`);
  }

  updateMember(id: string, input: MemberInput) {
    const name = input.name.trim();
    if (!name) return;
    this.members = this.members.map((m) =>
      m.id === id
        ? {
            ...m,
            name,
            phone: input.phone?.trim() ?? "",
            position: input.position?.trim() ?? "",
          }
        : m
    );
    this.#persist();
    toast.success("Data anggota diperbarui");
  }

  removeMember(id: string) {
    this.members = this.members.filter((m) => m.id !== id);
    this.history = this.history.filter((h) => h.memberId !== id);
    this.#persist();
  }

  clearMembers() {
    this.members = [];
    this.history = [];
    this.#persist();
    toast.success("Daftar anggota & antrian sukses dikosongkan");
  }

  resetQueue() {
    this.history = [];
    this.#persist();
    toast.success("Antrian sukses direset — semua anggota bisa dipilih lagi");
  }

  undoLast() {
    if (this.history.length === 0) return;
    this.history = this.history.slice(0, -1);
    this.#persist();
    toast.info("Pilihan terakhir dibatalkan");
  }

  commitPick(member: PickerMember, method: PickerHistoryEntry["method"]) {
    if (this.history.some((h) => h.memberId === member.id)) return;
    const entry: PickerHistoryEntry = {
      id: makeId(),
      memberId: member.id,
      name: member.name,
      pickedAt: Date.now(),
      method,
    };
    this.history = [...this.history, entry];
    this.#persist();
  }
}

export const picker = new PickerStore();
