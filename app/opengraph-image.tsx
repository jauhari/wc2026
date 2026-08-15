import { ImageResponse } from "next/og"

export const alt = "Random Picker — undian pemenang acak & manual"
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 72,
              height: 72,
              background: "rgba(255,255,255,0.92)",
              borderRadius: 18,
              fontSize: 40,
            }}
          >
            🎲
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, opacity: 0.9 }}>
            Random Picker
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ fontSize: 64, fontWeight: 900, lineHeight: 1.1, maxWidth: 900 }}>
            Acak, Adil, Seru
          </div>
          <div style={{ fontSize: 32, opacity: 0.92, maxWidth: 800, lineHeight: 1.35 }}>
            Pilih pemenang acak atau manual · antrian sukses
          </div>
          <div style={{ fontSize: 22, opacity: 0.75 }}>
            Animasi & efek suara · cocok untuk giveaway, arisan, dan game
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          {["#E61D25", "#FFFFFF", "#2A398D", "#3CAC3B"].map((color) => (
            <div
              key={color}
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: color,
              }}
            />
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
