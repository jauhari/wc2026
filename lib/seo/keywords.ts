import bundledTrends from "@/data/trends-keywords.json"
import {
  fetchLiveTrendKeywords,
  mergeKeywordLists,
  type TrendsKeywordSnapshot,
} from "@/lib/api/google-keywords"
import { SITE_KEYWORDS } from "@/lib/seo/constants"
import { withTTL } from "@/lib/data/ttl-cache"
import { withTimeout } from "@/lib/utils/timeout"

const KEYWORDS_CACHE_TTL_MS = 6 * 60 * 60 * 1000 // 6 jam
const KEYWORDS_FETCH_TIMEOUT_MS = 2_000

function bundledSnapshot(): TrendsKeywordSnapshot {
  const data = bundledTrends as TrendsKeywordSnapshot
  return {
    updatedAt: data.updatedAt ?? new Date(0).toISOString(),
    keywords: data.keywords ?? [],
    sources: data.sources ?? { trends: 0, suggest: 0, bundled: data.keywords?.length ?? 0 },
  }
}

async function refreshKeywords(): Promise<TrendsKeywordSnapshot> {
  const bundled = bundledSnapshot()

  try {
    const live = await withTimeout(fetchLiveTrendKeywords(), KEYWORDS_FETCH_TIMEOUT_MS)
    const merged = mergeKeywordLists(
      [...SITE_KEYWORDS],
      live.suggest,
      live.trends,
      bundled.keywords
    )

    if (merged.length > SITE_KEYWORDS.length) {
      return {
        updatedAt: new Date().toISOString(),
        keywords: merged,
        sources: {
          trends: live.trends.length,
          suggest: live.suggest.length,
          bundled: 0,
        },
      }
    }
  } catch {
    /* fallback di bawah */
  }

  return {
    ...bundled,
    keywords: mergeKeywordLists([...SITE_KEYWORDS], bundled.keywords),
    sources: { ...bundled.sources, bundled: bundled.keywords.length },
  }
}

export async function getSeoKeywordSnapshot(): Promise<TrendsKeywordSnapshot> {
  return withTTL("seo-keywords-v1", KEYWORDS_CACHE_TTL_MS, refreshKeywords)
}

export async function getMergedSeoKeywords(): Promise<string[]> {
  const snap = await getSeoKeywordSnapshot()
  return snap.keywords
}