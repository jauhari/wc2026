import bundledTrends from "@/data/trends-keywords.json"
import { SITE_KEYWORDS } from "@/lib/seo/constants"

let cached: string[] | null = null

/** Keyword SEO dari file bundled — tanpa network (cepat untuk halaman detail). */
export function getBundledSeoKeywords(): string[] {
  if (cached) return cached
  const dynamic = (bundledTrends as { keywords?: string[] }).keywords ?? []
  const seen = new Set<string>()
  const out: string[] = []
  for (const kw of [...SITE_KEYWORDS, ...dynamic]) {
    const key = kw.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(kw)
  }
  cached = out.slice(0, 40)
  return cached
}