"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { navItems } from "@/lib/nav"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

export function AppHeader() {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const current = navItems.find((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
  )

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b">
      <div className="flex w-full items-center gap-2 px-3">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-1 data-[orientation=vertical]:h-4" />
        <div className="flex flex-1 items-center gap-2 overflow-hidden">
          {current?.icon && (
            <current.icon className="size-4 text-primary" data-icon="inline-start" />
          )}
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-sm font-semibold">{current?.title}</span>
            <span className="truncate text-xs text-muted-foreground">
              {current?.description}
            </span>
          </div>
        </div>
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Ganti tema"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            {resolvedTheme === "dark" ? (
              <SunIcon data-icon="inline-start" />
            ) : (
              <MoonIcon data-icon="inline-start" />
            )}
          </Button>
        )}
      </div>
    </header>
  )
}
