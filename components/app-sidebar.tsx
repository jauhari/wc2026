"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { CloudIcon, TrophyIcon } from "lucide-react"

import { CountryFlag } from "@/components/country-flag"
import { navItems } from "@/lib/nav"
import { hostNations } from "@/lib/data/stadiums"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" prefetch>
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <TrophyIcon className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">World Cup 2026</span>
                  <span className="truncate text-xs text-muted-foreground">
                    WE ARE 26
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigasi</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href)
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                    >
                      <Link href={item.href} prefetch>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>Tuan Rumah</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="flex flex-col gap-1 px-2">
              {hostNations.map((n) => (
                <div
                  key={n.code}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm"
                >
                  <CountryFlag code={n.flag} size="sm" title={n.name} />
                  <span className="text-sidebar-foreground/80">{n.name}</span>
                </div>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex flex-col gap-1 px-2 py-1 group-data-[collapsible=icon]:hidden">
              <a
                href="https://dash.cloudflare.com/?to=/:account/workers-and-pages/view/wc2026/production/observability"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md py-1 text-xs text-sidebar-foreground/70 transition-colors hover:text-sidebar-accent-foreground"
              >
                <CloudIcon className="size-3.5 shrink-0" />
                <span>Worker Metrics</span>
              </a>
              <a
                href="https://dash.cloudflare.com/?to=/:account/web-analytics"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md py-1 pl-5 text-xs text-sidebar-foreground/60 transition-colors hover:text-sidebar-accent-foreground"
              >
                <span>Web Analytics</span>
              </a>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <TricolorStrip />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

/** Subtle United 2026 tricolor accent strip (green | blue | red) */
function TricolorStrip() {
  return (
    <div
      className={cn(
        "flex h-2 w-full overflow-hidden rounded-full",
        "opacity-80 group-data-[collapsible=icon]:hidden"
      )}
      aria-hidden
    >
      <span className="bg-brand-green h-full flex-1" />
      <span className="bg-brand-blue h-full flex-1" />
      <span className="bg-brand-red h-full flex-1" />
    </div>
  )
}
