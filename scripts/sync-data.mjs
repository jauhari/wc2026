#!/usr/bin/env node
/**
 * Sync World Cup 2026 data from openfootball/worldcup.json (GitHub).
 * Run: npm run sync-data
 */
import { writeFile, mkdir } from "node:fs/promises"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const URL =
  "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json"
const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, "..", "data", "openfootball-2026.json")

const res = await fetch(URL)
if (!res.ok) {
  console.error(`Failed to fetch: ${res.status} ${res.statusText}`)
  process.exit(1)
}

const data = await res.json()
await mkdir(dirname(OUT), { recursive: true })
await writeFile(OUT, JSON.stringify(data, null, 2), "utf8")

const finished = data.matches?.filter((m) => m.score?.ft).length ?? 0
console.log(`✓ Synced ${data.matches?.length ?? 0} matches (${finished} with results)`)
console.log(`  → ${OUT}`)