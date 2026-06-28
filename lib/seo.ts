import type { Metadata } from "next"

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://wc2026.ponjong.workers.dev"

export const SITE_NAME = "World Cup 2026 Monitor"
export const SITE_TAGLINE = "WE ARE 26"
export const SITE_DESCRIPTION =
  "Pantau Piala Dunia FIFA 2026: hasil pertandingan, klasemen grup, jadwal lengkap, bagan guguran, dan statistik pemain. Tuan rumah USA, Kanada & Meksiko."

export const SITE_KEYWORDS = [
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

const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "World Cup 2026 Monitor — Pantau hasil, klasemen, jadwal & statistik",
}

export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: SITE_KEYWORDS,
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

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}): Metadata {
  const url = path.startsWith("http") ? path : `${SITE_URL}${path}`

  return {
    title,
    description,
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