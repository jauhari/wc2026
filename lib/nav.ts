import { DicesIcon } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  description: string
}

export const navItems: NavItem[] = [
  {
    title: "Random Picker",
    href: "/",
    icon: DicesIcon,
    description: "Undian pemenang acak & manual",
  },
]
