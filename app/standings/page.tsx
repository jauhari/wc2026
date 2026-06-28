import Link from "next/link"

import { CountryFlag } from "@/components/country-flag"

import { GROUPS } from "@/lib/data/meta"
import { getTournamentData, getGroupStandings } from "@/lib/data/tournament"
import type { GroupId, StandingRow, Team } from "@/lib/types"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Klasemen Grup",
  description:
    "Klasemen 12 grup Piala Dunia 2026 (A–L). Poin, selisih gol, dan peringkat tim menuju babak 32 besar.",
  path: "/standings",
})

export const revalidate = 120

export default async function StandingsPage() {
  const data = await getTournamentData()

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Klasemen Grup</h1>
        <p className="text-sm text-muted-foreground">
          12 grup (A–L), masing-masing 4 tim. Dua besar plus 8 peringkat ketiga
          terbaik lolos ke babak 32 besar.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {GROUPS.map((groupId) => (
          <GroupCard
            key={groupId}
            groupId={groupId}
            rows={getGroupStandings(data, groupId)}
            teamMap={data.teamMap}
          />
        ))}
      </div>
    </div>
  )
}

function GroupCard({
  groupId,
  rows,
  teamMap,
}: {
  groupId: GroupId
  rows: StandingRow[]
  teamMap: Record<string, Team>
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 font-bold text-primary">
            {groupId}
          </span>
          Grup {groupId}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-8 pl-4 text-xs">Tim</TableHead>
              <TableHead className="h-8 w-8 text-center text-xs" title="Main">MP</TableHead>
              <TableHead className="h-8 w-8 text-center text-xs text-primary" title="Menang">W</TableHead>
              <TableHead className="h-8 w-8 text-center text-xs" title="Seri">D</TableHead>
              <TableHead className="h-8 w-8 text-center text-xs text-destructive" title="Kalah">L</TableHead>
              <TableHead className="h-8 w-10 text-center text-xs" title="Selisih Gol">GD</TableHead>
              <TableHead className="h-8 w-10 pr-4 text-center text-xs" title="Poin">Pts</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, idx) => (
              <StandingRowComponent
                key={row.teamId}
                row={row}
                position={idx + 1}
                team={teamMap[row.teamId]}
              />
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-6 text-center text-sm text-muted-foreground">
                  Belum ada data klasemen
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Legend />
      </CardContent>
    </Card>
  )
}

function StandingRowComponent({
  row,
  position,
  team,
}: {
  row: StandingRow
  position: number
  team: Team
}) {
  const qualifies = position <= 2

  if (!team) return null

  return (
    <TableRow>
      <TableCell className="py-2 pl-4">
        <Link
          href={`/teams/${team.id}`}
          className="flex items-center gap-2 hover:text-primary"
        >
          <span
            className={cn(
              "flex size-5 shrink-0 items-center justify-center rounded text-[10px] font-bold",
              position <= 2 && "bg-primary/15 text-primary",
              position === 3 && "bg-accent/15 text-accent-foreground",
              position === 4 && "text-muted-foreground"
            )}
          >
            {position}
          </span>
          <CountryFlag code={team.flag} size="sm" title={team.name} />
          <span className="truncate font-medium">{team.shortName}</span>
        </Link>
      </TableCell>
      <TableCell className="py-2 text-center text-sm tabular-nums">{row.played}</TableCell>
      <TableCell className="py-2 text-center text-sm tabular-nums text-primary">{row.won}</TableCell>
      <TableCell className="py-2 text-center text-sm tabular-nums text-muted-foreground">
        {row.drawn}
      </TableCell>
      <TableCell className="py-2 text-center text-sm tabular-nums text-destructive">
        {row.lost}
      </TableCell>
      <TableCell className="py-2 text-center text-sm tabular-nums">
        {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
      </TableCell>
      <TableCell className="py-2 pr-4 text-center">
        <span className={cn("font-bold tabular-nums", qualifies && "text-primary")}>
          {row.points}
        </span>
      </TableCell>
    </TableRow>
  )
}

function Legend() {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 px-4 pb-3 pt-2 text-[10px] text-muted-foreground">
      <span className="flex items-center gap-1">
        <span className="size-2 rounded-full bg-primary" />
        2 besar
      </span>
      <span className="flex items-center gap-1">
        <span className="size-2 rounded-full bg-accent" />
        Peringkat ketiga (terbaik 8)
      </span>
      <span>MP=Main · W=Menang · D=Seri · L=Kalah</span>
    </div>
  )
}