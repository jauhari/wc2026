import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "World Cup 2026 Monitor — WE ARE 26",
    short_name: "WC 2026",
    description:
      "Pantau Piala Dunia 2026: hasil, klasemen, jadwal, bagan, dan statistik.",
    start_url: "/",
    display: "standalone",
    background_color: "#1e2a6b",
    theme_color: "#3CAC3B",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/apple-icon.svg",
        sizes: "180x180",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  }
}