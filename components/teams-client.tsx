"use client"

import * as React from "react"
import Link from "next/link"

import type { GroupId, Team } from "@/lib/types"
import { GROUPS } from "@/lib/data/meta"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty"

export function TeamsClient({ teams }: { teams: Team[] }) {
  const [groupFilter, setGroupFilter] = React.useState<"ALL" | GroupId>("ALL")

  const filtered =
    groupFilter === "ALL" ? teams : teams.filter((t) => t.group === groupFilter)

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tim Peserta</h1>
          <p className="text-sm text-muted-foreground">
            {teams.length} tim dari seluruh dunia, terbagi dalam 12 grup.
          </p>
        </div>
        <Select value={groupFilter} onValueChange={(v) => setGroupFilter(v as "ALL" | GroupId)}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Pilih grup" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Grup</SelectLabel>
              <SelectItem value="ALL">Semua Grup</SelectItem>
              {GROUPS.map((g) => (
                <SelectItem key={g} value={g}>
                  Grup {g}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Empty className="min-h-48 rounded-lg border border-dashed">
          <EmptyTitle>Tidak ada tim</EmptyTitle>
          <EmptyDescription>Tidak ada tim untuk grup ini.</EmptyDescription>
        </Empty>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((team) => (
            <Link key={team.id} href={`/teams/${team.id}`}>
              <Card className="transition-colors hover:border-primary/50 hover:bg-muted/40">
                <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
                  <span className="text-4xl leading-none">{team.flag}</span>
                  <span className="font-semibold leading-tight">{team.shortName}</span>
                  <div className="flex flex-wrap items-center justify-center gap-1">
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {team.code}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px]">
                      Grup {team.group}
                    </Badge>
                  </div>
                  {team.titles > 0 && (
                    <span className="text-[10px] text-muted-foreground">
                      🏆 {team.titles}× juara
                    </span>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}