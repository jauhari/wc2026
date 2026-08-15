import {
  HomeIcon,
  TrophyIcon,
  ListOrderedIcon,
  CalendarDaysIcon,
  NetworkIcon,
  BarChart3Icon,
  ShieldIcon,
  StarIcon,
  DicesIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  description: string
  /** Menandai item sebagai bagian arsip Piala Dunia 2026 (turnamen sudah selesai). */
  archive?: boolean
}

export const navItems: NavItem[] = [
  { title: "Random Picker", href: "/", icon: DicesIcon, description: "Undian pemenang acak & manual" },
  { title: "Ringkasan", href: "/wc2026", icon: HomeIcon, description: "Ringkasan turnamen", archive: true },
  { title: "Hasil", href: "/matches", icon: TrophyIcon, description: "Hasil pertandingan", archive: true },
  { title: "Klasemen", href: "/standings", icon: ListOrderedIcon, description: "Klasemen grup", archive: true },
  { title: "Jadwal", href: "/schedule", icon: CalendarDaysIcon, description: "Jadwal pertandingan", archive: true },
  { title: "Bagan", href: "/bracket", icon: NetworkIcon, description: "Bagan guguran", archive: true },
  { title: "Stats", href: "/stats", icon: BarChart3Icon, description: "Statistik pemain & tim", archive: true },
  { title: "Tim", href: "/teams", icon: ShieldIcon, description: "Daftar tim peserta", archive: true },
  { title: "Favorit", href: "/favorites", icon: StarIcon, description: "Tim & pemain favorit Anda", archive: true },
]
