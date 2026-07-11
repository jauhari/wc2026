import { getTournamentData } from "@/lib/data/tournament"

export const dynamic = "force-dynamic"

export async function GET() {
  const data = await getTournamentData()

  return Response.json(
    {
      fetchedAt: data.fetchedAt,
      source: data.source,
      liveCount: data.liveMatches.length,
      finishedCount: data.finishedMatches.length,
      totalGoals: data.totalGoals,
    },
    {
      headers: { "Cache-Control": "no-store" },
    }
  )
}