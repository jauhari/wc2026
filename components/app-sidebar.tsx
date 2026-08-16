"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { CloudIcon, DicesIcon } from "lucide-react"

import { navItems } from "@/lib/nav"
import { SITE_NAME, SITE_TAGLINE } from "@/lib/seo/constants"
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
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function AppSidebar() {
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar()

  /** Di mobile, tutup sheet setelah navigasi supaya tidak menutupi halaman. */
  const closeMobileSidebar = () => {
    if (isMobile) setOpenMobile(false)
  }

  const renderItem = (item: (typeof navItems)[number]) => {
    const active =
      item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
    return (
      <SidebarMenuItem key={item.href}>
        <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
          <Link href={item.href} prefetch onClick={closeMobileSidebar}>
            <item.icon />
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" prefetch onClick={closeMobileSidebar}>
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <DicesIcon className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{SITE_NAME}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {SITE_TAGLINE}
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
            <SidebarMenu>{navItems.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex flex-col gap-1 px-2 py-1 group-data-[collapsible=icon]:hidden">
              <a
                href="https://dash.cloudflare.com/?to=/:account/workers-and-pages/view/picker/production/observability"
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

/** Subtle brand accent strip (green | blue | red) */
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
