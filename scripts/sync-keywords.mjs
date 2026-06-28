#!/usr/bin/env node
/**
 * Sync SEO keywords dari Google Trends RSS (ID) + Google Suggest.
 * Run: npm run sync-keywords
 */
import { writeFile, mkdir } from "node:fs/promises"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, "..", "data", "trends-keywords.json")

const SEEDS = [
  "piala dunia 2026",
  "world cup 2026",
  "jadwal piala dunia 2026",
  "hasil piala dunia 2026",
  "klasemen piala dunia 2026",
  "jadwal piala dunia 2026 hari ini",
  "hasil piala dunia 2026 hari ini",
  "piala dunia 2026 malam ini",
  "statistik piala dunia 2026",
  "bagan piala dunia 2026",
]

const STATIC = [
  "Piala Dunia 2026",
  "World Cup 2026",
  "FIFA 2026",
  "hasil pertandingan",
  "klasemen Piala Dunia",
  "jadwal Piala Dunia",
  "bagan guguran",
  "statistik pemain",
  "USA Kanada Meksiko",
]

const FOOTBALL_RE =
  /piala|dunia|world\s*cup|fifa|vs\.?|sepak\s*bola|soccer|timnas|argentin|brazil|inggris|england|spain|portugal|france|german|mexic|usa|kanada|belgi|belg|holland|nether|ital|croat|japan|korea|austral|uruguay|colomb|panama|morocc|nigeria|senegal|algeri|austria|jordan|jordani|skor|klasemen|jadwal|final|grup/i

function normalize(s) {
  return s.replace(/&amp;/g, "&").replace(/\s+/g, " ").trim()
}

function merge(...lists) {
  const seen = new Set()
  const out = []
  for (const list of lists) {
    for (const raw of list) {
      const kw = normalize(raw)
      const key = kw.toLowerCase()
      if (!kw || kw.length < 3 || kw.length > 80 || seen.has(key)) continue
      seen.add(key)
      out.push(kw)
    }
  }
  return out.slice(0, 40)
}

async function fetchSuggest(q) {
  const url = new URL("https://suggestqueries.google.com/complete/search")
  url.searchParams.set("client", "firefox")
  url.searchParams.set("hl", "id")
  url.searchParams.set("q", q)
  const res = await fetch(url)
  if (!res.ok) return []
  const data = JSON.parse(await res.text())
  return (data[1] ?? []).map(normalize)
}

async function fetchTrends() {
  const res = await fetch("https://trends.google.com/trending/rss?geo=ID", {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; WC2026-Monitor/1.0)" },
  })
  if (!res.ok) return []
  const xml = await res.text()
  const titles = []
  const re = /<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/gi
  let m
  while ((m = re.exec(xml))) {
    const t = normalize(m[1])
    if (!t || t === "Daily Search Trends") continue
    if (FOOTBALL_RE.test(t)) titles.push(t)
  }
  return titles
}

const suggestLists = await Promise.all(SEEDS.map(fetchSuggest))
const suggest = [...new Set(suggestLists.flat())]
const trends = await fetchTrends()
const keywords = merge(STATIC, suggest, trends)

const payload = {
  updatedAt: new Date().toISOString(),
  keywords,
  sources: { trends: trends.length, suggest: suggest.length, bundled: 0 },
}

await mkdir(dirname(OUT), { recursive: true })
await writeFile(OUT, JSON.stringify(payload, null, 2), "utf8")

console.log(`✓ Synced ${keywords.length} keywords (${trends.length} trends, ${suggest.length} suggest)`)
console.log(`  → ${OUT}`)