/** Seed queries untuk Google Suggest (related searches). */
export const KEYWORD_SEEDS = [
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
] as const

const TRENDS_RSS = "https://trends.google.com/trending/rss?geo=ID"
const SUGGEST_API = "https://suggestqueries.google.com/complete/search"

/** Pola agar trending Google ID relevan dengan sepak bola / Piala Dunia. */
const FOOTBALL_TREND_RE =
  /piala|dunia|world\s*cup|fifa|vs\.?|sepak\s*bola|soccer|timnas|argentin|brazil|inggris|england|spain|portugal|france|german|mexic|usa|kanada|belgi|belg|holland|nether|ital|croat|japan|korea|austral|uruguay|colomb|panama|morocc|nigeria|senegal|algeri|austria|jordan|jordani|skor|klasemen|jadwal|final|grup/i

export interface TrendsKeywordSnapshot {
  updatedAt: string
  keywords: string[]
  sources: {
    trends: number
    suggest: number
    bundled: number
  }
}

function normalizeKeyword(raw: string): string {
  return raw
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
}

function parseSuggestBody(text: string): string[] {
  try {
    const parsed = JSON.parse(text) as [string, string[]]
    return (parsed[1] ?? []).map(normalizeKeyword).filter(Boolean)
  } catch {
    return []
  }
}

function parseTrendsRss(xml: string): string[] {
  const titles: string[] = []
  const re = /<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(xml))) {
    const title = normalizeKeyword(m[1])
    if (!title || title === "Daily Search Trends") continue
    titles.push(title)
  }
  return titles
}

function isFootballRelevant(keyword: string): boolean {
  return FOOTBALL_TREND_RE.test(keyword)
}

async function fetchGoogleSuggest(query: string): Promise<string[]> {
  const url = new URL(SUGGEST_API)
  url.searchParams.set("client", "firefox")
  url.searchParams.set("hl", "id")
  url.searchParams.set("q", query)

  const res = await fetch(url, {
    headers: { "User-Agent": "WC2026-Monitor/1.0" },
    next: { revalidate: 21_600 },
  })
  if (!res.ok) return []
  return parseSuggestBody(await res.text())
}

async function fetchGoogleTrendsRss(): Promise<string[]> {
  const res = await fetch(TRENDS_RSS, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; WC2026-Monitor/1.0)" },
    next: { revalidate: 3600 },
  })
  if (!res.ok) return []
  return parseTrendsRss(await res.text()).filter(isFootballRelevant)
}

/** Ambil keyword trending dari Google Trends RSS + Google Suggest. */
export async function fetchLiveTrendKeywords(): Promise<{
  trends: string[]
  suggest: string[]
}> {
  const suggestResults = await Promise.all(
    KEYWORD_SEEDS.map((seed) => fetchGoogleSuggest(seed))
  )
  const suggest = [...new Set(suggestResults.flat())]

  let trends: string[] = []
  try {
    trends = await fetchGoogleTrendsRss()
  } catch {
    trends = []
  }

  return { trends, suggest }
}

export function mergeKeywordLists(
  ...lists: string[][]
): TrendsKeywordSnapshot["keywords"] {
  const seen = new Set<string>()
  const out: string[] = []

  for (const list of lists) {
    for (const raw of list) {
      const kw = normalizeKeyword(raw)
      const key = kw.toLowerCase()
      if (!kw || kw.length < 3 || kw.length > 80 || seen.has(key)) continue
      seen.add(key)
      out.push(kw)
    }
  }

  return out.slice(0, 40)
}