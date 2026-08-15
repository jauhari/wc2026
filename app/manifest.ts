import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Random Picker — Acak, Adil, Seru",
    short_name: "Random Picker",
    description:
      "Undian pemenang acak atau manual dengan antrian sukses, animasi, dan efek suara.",
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
