"use client"

import { GoalIcon, HandHelpingIcon } from "lucide-react"

import { CountryFlag } from "@/components/country-flag"
import { FavoriteButton } from "@/components/favorite-button"
import type { Scorer, Team } from "@/lib/types"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function StatsPlayersClient({
  topScorers,
  topAssists,
  hasAssistData,
  teamMap,
}: {
  topScorers: Scorer[]
  topAssists: Scorer[]
  hasAssistData: boolean
  teamMap: Record<string, Team>
}) {
  return (
    <Tabs defaultValue="scorers">
      <TabsList>
        <TabsTrigger value="scorers" className="gap-1.5">
          <GoalIcon className="size-4" />
          Top Skor
        </TabsTrigger>
        <TabsTrigger value="assists" className="gap-1.5">
          <HandHelpingIcon className="size-4" />
          Top Assist
        </TabsTrigger>
      </TabsList>
      <TabsContent value="scorers">
        <PlayerTable
          rows={topScorers.slice(0, 15)}
          metric="goals"
          metricLabel="Gol"
          teamMap={teamMap}
        />
      </TabsContent>
      <TabsContent value="assists">
        {hasAssistData ? (
          <PlayerTable
            rows={topAssists.slice(0, 15)}
            metric="assists"
            metricLabel="Assist"
            teamMap={teamMap}
          />
        ) : (
          <Card className="mt-3">
            <CardContent className="flex flex-col items-center gap-2 p-8 text-center">
              <HandHelpingIcon className="size-8 text-muted-foreground/60" />
              <p className="text-sm font-medium">Data assist belum tersedia</p>
              <p className="max-w-md text-sm text-muted-foreground">
                Data assist belum bisa dimuat dari FIFA API saat ini. Coba refresh nanti —
                sumber openfootball sendiri tidak mencatat assist per gol.
              </p>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  )
}

function PlayerTable({
  rows,
  metric,
  metricLabel,
  teamMap,
}: {
  rows: Scorer[]
  metric: "goals" | "assists"
  metricLabel: string
  teamMap: Record<string, Team>
}) {
  return (
    <Card className="mt-3">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10 pl-4">#</TableHead>
              <TableHead>Pemain</TableHead>
              <TableHead>Tim</TableHead>
              <TableHead className="text-center">Pos</TableHead>
              <TableHead className="text-right">{metricLabel}</TableHead>
              <TableHead className="w-10 pr-4" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((p, i) => {
              const team = teamMap[p.teamId]
              return (
                <TableRow key={p.id}>
                  <TableCell className="w-10 pl-4 font-mono text-sm text-muted-foreground">
                    {i + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="size-8">
                        <AvatarFallback className="bg-muted text-xs">
                          {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {team && (
                      <span className="flex items-center gap-1.5 text-sm">
                        <CountryFlag code={team.flag} size="sm" title={team.name} />
                        {team.shortName}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="font-mono text-xs">
                      {p.position}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-bold tabular-nums text-primary">{p[metric]}</span>
                  </TableCell>
                  <TableCell className="pr-4">
                    <FavoriteButton kind="player" id={p.id} label={p.name} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}