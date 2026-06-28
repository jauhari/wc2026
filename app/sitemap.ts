import type { MetadataRoute } from "next"

import { getTournamentData } from "@/lib/data/tournament"
import { navItems } from "@/lib/nav"
import { SITE_URL } from "@/lib/seo"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await getTournamentData()
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = navItems.map((item) => ({
    url: item.href === "/" ? `${SITE_URL}/` : `${SITE_URL}${item.href}`,
    lastModified: now,
    changeFrequency: item.href === "/" ? "hourly" : "daily",
    priority: item.href === "/" ? 1 : 0.8,
  }))

  const matchPages: MetadataRoute.Sitemap = data.matches.map((m) => ({
    url: `${SITE_URL}/matches/${m.id}`,
    lastModified: now,
    changeFrequency: m.status === "live" ? "always" : "weekly",
    priority: m.status === "live" ? 0.9 : 0.6,
  }))

  const teamPages: MetadataRoute.Sitemap = data.teams.map((t) => ({
    url: `${SITE_URL}/teams/${t.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  return [...staticPages, ...matchPages, ...teamPages]
}