import type { Metadata } from "next"

import { getBundledSeoKeywords } from "@/lib/seo/bundled-keywords"
import { getMergedSeoKeywords } from "@/lib/seo/keywords"
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
} from "@/lib/seo/constants"

export {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
} from "@/lib/seo/constants"

const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "World Cup 2026 Monitor — Pantau hasil, klasemen, jadwal & statistik",
}

export function metadataWithKeywords(keywords: string[]): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${SITE_NAME} — ${SITE_TAGLINE}`,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    applicationName: SITE_NAME,
    keywords,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "sports",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: SITE_URL,
      siteName: SITE_NAME,
      title: `${SITE_NAME} — ${SITE_TAGLINE}`,
      description: SITE_DESCRIPTION,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE_NAME} — ${SITE_TAGLINE}`,
      description: SITE_DESCRIPTION,
      images: [OG_IMAGE.url],
    },
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
      apple: [{ url: "/apple-icon.svg", type: "image/svg+xml", sizes: "180x180" }],
    },
    appleWebApp: {
      capable: true,
      title: "WC 2026",
      statusBarStyle: "default",
    },
  }
}

/** Metadata statis dengan keyword bundled (tanpa network). */
export const baseMetadata: Metadata = metadataWithKeywords(getBundledSeoKeywords())

/** Metadata beranda + keyword dinamis dari Google Trends/Suggest. */
export async function buildRootMetadata(): Promise<Metadata> {
  const keywords = await getMergedSeoKeywords()
  return metadataWithKeywords(keywords)
}

function pageMetadataBase({
  title,
  description,
  path,
  keywords,
}: {
  title: string
  description: string
  path: string
  keywords: string[]
}): Metadata {
  const url = path.startsWith("http") ? path : `${SITE_URL}${path}`

  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "id_ID",
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  }
}

/** Metadata halaman — tanpa network (cepat). */
export function quickPageMetadata(opts: {
  title: string
  description: string
  path: string
}): Metadata {
  return pageMetadataBase({ ...opts, keywords: getBundledSeoKeywords() })
}

/** Metadata halaman + keyword live dari Google (hanya halaman utama). */
export async function pageMetadata(opts: {
  title: string
  description: string
  path: string
}): Promise<Metadata> {
  const keywords = await getMergedSeoKeywords()
  return pageMetadataBase({ ...opts, keywords })
}