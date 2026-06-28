import { ImageResponse } from "next/og"

export const alt = "World Cup 2026 Monitor — Pantau hasil, klasemen, jadwal & statistik"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #3CAC3B 0%, #2A398D 100%)",
          color: "#ffffff",
          padding: "64px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              fontSize: 48,
              fontWeight: 900,
              background: "rgba(255,255,255,0.15)",
              borderRadius: 16,
              padding: "12px 24px",
            }}
          >
            26
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, opacity: 0.9 }}>
            FIFA World Cup 2026
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ fontSize: 64, fontWeight: 900, lineHeight: 1.1, maxWidth: 900 }}>
            World Cup 2026 Monitor
          </div>
          <div style={{ fontSize: 32, opacity: 0.92, maxWidth: 800, lineHeight: 1.35 }}>
            Hasil · Klasemen · Jadwal · Bagan · Statistik
          </div>
          <div style={{ fontSize: 22, opacity: 0.75 }}>
            USA · Kanada · Meksiko · 11 Juni – 19 Juli 2026
          </div>
        </div>

        <div style={{ display: "flex", gap: 0, height: 12, borderRadius: 6, overflow: "hidden" }}>
          <div style={{ flex: 1, background: "#E61D25" }} />
          <div style={{ flex: 1, background: "#FFFFFF" }} />
          <div style={{ flex: 1, background: "#2A398D" }} />
        </div>
      </div>
    ),
    { ...size }
  )
}