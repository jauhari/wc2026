import {
  HomeIcon,
  TrophyIcon,
  ListOrderedIcon,
  CalendarDaysIcon,
  NetworkIcon,
  BarChart3Icon,
  ShieldIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  description: string
}

export const navItems: NavItem[] = [
  { title: "Beranda", href: "/", icon: HomeIcon, description: "Ringkasan turnamen" },
  { title: "Hasil", href: "/matches", icon: TrophyIcon, description: "Hasil pertandingan" },
  { title: "Klasemen", href: "/standings", icon: ListOrderedIcon, description: "Klasemen grup" },
  { title: "Jadwal", href: "/schedule", icon: CalendarDaysIcon, description: "Jadwal pertandingan" },
  { title: "Bagan", href: "/bracket", icon: NetworkIcon, description: "Bagan guguran" },
  { title: "Stats", href: "/stats", icon: BarChart3Icon, description: "Statistik pemain & tim" },
  { title: "Tim", href: "/teams", icon: ShieldIcon, description: "Daftar tim peserta" },
]
