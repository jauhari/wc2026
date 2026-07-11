import {
  getTournamentData,
  getTeam,
  getBracketByRound,
  roundOrder,
  roundLabels,
} from "@/lib/data/tournament"
import type { KnockoutRound } from "@/lib/types"
import {
  BracketClient,
  type BracketRoundView,
  type BracketTeamView,
} from "@/components/bracket-client"
import { quickPageMetadata } from "@/lib/seo"

export const metadata = quickPageMetadata({
  title: "Bagan Guguran",
  description:
    "Bagan knockout Piala Dunia 2026: babak 32 besar, 16 besar, perempat final, semi final, dan final.",
  path: "/bracket",
})

export const dynamic = "force-dynamic"

const ROUND_CHIP: Record<KnockoutRound, string> = {
  R32: "32 Besar",
  R16: "16 Besar",
  QF: "Perempat",
  SF: "Semi",
  "3RD": "Juara 3",
  FINAL: "Final",
}

function toTeamView(
  data: Awaited<ReturnType<typeof getTournamentData>>,
  teamId: string | null
): BracketTeamView | null {
  if (!teamId) return null
  try {
    const t = getTeam(data, teamId)
    return { id: t.id, shortName: t.shortName, flag: t.flag }
  } catch {
    return null
  }
}

export default async function BracketPage() {
  const data = await getTournamentData()

  const rounds: BracketRoundView[] = roundOrder.map((round) => ({
    round,
    label: roundLabels[round],
    shortLabel: ROUND_CHIP[round],
    matches: getBracketByRound(data, round).map((m) => ({
      id: m.id,
      kickoff: m.kickoff,
      status: m.status,
      home: toTeamView(data, m.homeId),
      away: toTeamView(data, m.awayId),
      homeScore: m.homeScore,
      awayScore: m.awayScore,
    })),
  }))

  return <BracketClient rounds={rounds} />
}
