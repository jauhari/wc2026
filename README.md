# World Cup 2026 Monitor

Pantau Piala Dunia FIFA 2026 — hasil pertandingan, klasemen, jadwal, bagan guguran, dan statistik. UI berbahasa Indonesia, waktu dalam WIB.

**Live:** [https://wc2026.ponjong.workers.dev/](https://wc2026.ponjong.workers.dev/)

## Fitur

- **Beranda** — ringkasan turnamen, pertandingan live & mendatang, top skor
- **Hasil** — filter live / selesai / terjadwal
- **Klasemen** — 12 grup (A–L)
- **Jadwal** — semua 104 pertandingan per hari
- **Bagan** — babak 32 hingga final
- **Stats** — top skor, top assist, grafik gol per grup
- **Tim** — profil 48 tim peserta + detail per tim

## Stack

- Next.js 16 + React 19 + shadcn/ui + Tailwind CSS 4
- Deploy: [OpenNext Cloudflare](https://opennext.js.org/cloudflare) → Cloudflare Workers
- Data: [openfootball/worldcup.json](https://github.com/openfootball/worldcup.json) + FIFA API (gratis) + BallDontLie (opsional)

## Development

```bash
npm install
npm run dev          # http://localhost:3260
npm run sync-data    # tarik data terbaru dari openfootball
```

## Environment

Salin `.env.example` ke `.env.local`:

| Variable | Wajib | Keterangan |
|----------|-------|------------|
| `BALLDONTLIE_API_KEY` | Opsional | Live score & assist dari BallDontLie (GOAT tier) |
| `NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN` | Opsional | Cloudflare Web Analytics beacon |

```bash
npm run setup:cf-analytics   # otomatis provision token (butuh scope Web Analytics)
```

## Scripts

| Command | Fungsi |
|---------|--------|
| `npm run build` | Build Next.js lokal |
| `npm run build:cf` | Build untuk Cloudflare Workers |
| `npm run deploy:cf` | Deploy ke Cloudflare |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |

## Deploy ke Cloudflare

```bash
# Set secret runtime (sekali saja)
npx wrangler secret put BALLDONTLIE_API_KEY

# Build & deploy
npm run build:cf
npm run deploy:cf
```

Worker: `wc2026` · Observability & logs aktif di Cloudflare Dashboard.

## Sumber Data

1. **openfootball** — jadwal, skor, pencetak gol (utama)
2. **FIFA API** — overlay skor live & statistik assist (gratis, tanpa key)
3. **BallDontLie** — override live & assist jika API key tersedia

Data di-cache ISR 30–60 detik. Timestamp & sumber ditampilkan di beranda.