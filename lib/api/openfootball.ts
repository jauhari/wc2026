export const OPENFOOTBALL_URL =
  "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json"

export interface OpenFootballGoal {
  name: string
  minute: string
  /** Pemain assist — jika tersedia di sumber data */
  assist?: string
  penalty?: boolean
  owngoal?: boolean
}

export interface OpenFootballMatch {
  round: string
  date: string
  time: string
  team1: string
  team2: string
  group?: string
  ground: string
  num?: number
  score?: { ft: [number, number]; ht?: [number, number] }
  goals1?: OpenFootballGoal[]
  goals2?: OpenFootballGoal[]
}

export interface OpenFootballData {
  name: string
  matches: OpenFootballMatch[]
}

export async function fetchOpenFootball(): Promise<OpenFootballData> {
  const res = await fetch(OPENFOOTBALL_URL, {
    cache: "no-store",
  })
  if (!res.ok) throw new Error(`openfootball fetch failed: ${res.status}`)
  return res.json() as Promise<OpenFootballData>
}

export async function fetchOpenFootballLocal(): Promise<OpenFootballData> {
  const { readFile } = await import("node:fs/promises")
  const { join } = await import("node:path")
  const raw = await readFile(join(process.cwd(), "data", "openfootball-2026.json"), "utf8")
  return JSON.parse(raw) as OpenFootballData
}