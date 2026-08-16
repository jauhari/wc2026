import type { MetadataRoute } from "next"

import { navItems } from "@/lib/nav"
import { SITE_URL } from "@/lib/seo"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return navItems.map((item) => ({
    url: item.href === "/" ? `${SITE_URL}/` : `${SITE_URL}${item.href}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: item.href === "/" ? 1 : 0.8,
  }))
}
