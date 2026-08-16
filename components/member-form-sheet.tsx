"use client"

import * as React from "react"

import type { MemberInput, PickerMember } from "@/lib/random-picker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

interface MemberFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** null = mode tambah, terisi = mode edit. */
  member: PickerMember | null
  onSubmit: (input: MemberInput) => void
}

export function MemberFormSheet({
  open,
  onOpenChange,
  member,
  onSubmit,
}: MemberFormSheetProps) {
  const [name, setName] = React.useState(member?.name ?? "")
  const [phone, setPhone] = React.useState(member?.phone ?? "")
  const [position, setPosition] = React.useState(member?.position ?? "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({ name, phone, position })
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
          <SheetHeader>
            <SheetTitle>{member ? "Edit Anggota" : "Tambah Anggota"}</SheetTitle>
            <SheetDescription>
              {member
                ? "Perbarui data anggota."
                : "Isi data anggota baru — hanya nama yang wajib."}
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-4 px-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="member-name" className="text-sm font-medium">
                Nama <span className="text-destructive">*</span>
              </label>
              <Input
                id="member-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="cth. Budi Santoso"
                autoFocus
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="member-phone" className="text-sm font-medium">
                No. HP
              </label>
              <Input
                id="member-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="cth. 0812xxxxxxxx"
                inputMode="tel"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="member-position" className="text-sm font-medium">
                Posisi
              </label>
              <Input
                id="member-position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="cth. Staff, Ketua RT, dst."
              />
            </div>
          </div>

          <SheetFooter>
            <Button type="submit">
              {member ? "Simpan Perubahan" : "Tambah Anggota"}
            </Button>
            <SheetClose asChild>
              <Button type="button" variant="outline">
                Batal
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
