# World Cup 2026 Monitor

Pantau Piala Dunia FIFA 2026 — hasil pertandingan, klasemen, jadwal, bagan guguran, dan statistik. UI berbahasa Indonesia, waktu dalam WIB.

**Live:** [https://wc2026.ponjong.workers.dev/](https://wc2026.ponjong.workers.dev/)

## Fitur

- **Beranda** — ringkasan turnamen, pertandingan live & mendatang, top skor, section favorit
- **Hasil** — filter live / selesai / terjadwal
- **Klasemen** — 12 grup (A–L)
- **Jadwal** — semua 104 pertandingan per hari
- **Bagan** — knockout R32 → Final, mode mobile:
  - **Per babak** — pilih babak (chip + panah), kartu full width
  - **Bagan penuh** — scroll horizontal semua kolom + tombol panah
- **Stats** — top skor, top assist, grafik gol per grup
- **Tim** — profil 48 tim peserta + detail per tim
- **Favorit** — tandai tim & pemain (disimpan di `localStorage`)
- **Auto-refresh** — data turnamen diperbarui di client (lebih cepat saat ada laga live)
- **Data freshness** — indikator sumber & timestamp di header
- **SEO** — metadata, sitemap, robots, Open Graph, keywords (Trends + Suggest)

## Stack

- Next.js 16 + React 19 + shadcn/ui + Tailwind CSS 4
- Deploy: [OpenNext Cloudflare](https://opennext.js.org/cloudflare) → Cloudflare Workers
- Data: [openfootball/worldcup.json](https://github.com/openfootball/worldcup.json) + FIFA API (gratis) + BallDontLie (opsional)

## Development

```bash
npm install
npm run dev          # http://localhost:3260
npm run sync-data    # tarik data terbaru dari openfootball
npm run typecheck
npm run lint
```

## Environment

Salin `.env.example` ke `.env.local`:

| Variable | Wajib | Keterangan |
|----------|-------|------------|
| `BALLDONTLIE_API_KEY` | Opsional | Live score & assist dari BallDontLie (GOAT tier) |
| `NEXT_PUBLIC_SITE_URL` | Opsional | URL publik untuk SEO / OG (default live Workers) |
| `NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN` | Opsional | Cloudflare Web Analytics beacon |

```bash
npm run setup:cf-analytics   # otomatis provision token (butuh scope Web Analytics)
```

## Scripts

| Command | Fungsi |
|---------|--------|
| `npm run dev` | Dev server (port 3260) |
| `npm run build` | Build Next.js lokal |
| `npm run build:cf` | Sync data + keywords, build OpenNext untuk Workers |
| `npm run deploy:cf` | Deploy artifact `.open-next` ke Cloudflare |
| `npm run sync-data` | Tarik jadwal/skor openfootball → `data/openfootball-2026.json` |
| `npm run sync-keywords` | Refresh keyword SEO |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |

> **Catatan deploy:** jalankan `npm run build:cf` dulu, baru `npm run deploy:cf`. Deploy saja tanpa rebuild dapat mengunggah build lama.

## Deploy ke Cloudflare

```bash
# Secret runtime (sekali saja, jika dipakai)
npx wrangler secret put BALLDONTLIE_API_KEY

# Build & deploy
npm run build:cf
npm run deploy:cf
```

Worker: `wc2026` · Observability & logs aktif di Cloudflare Dashboard.

## Arsitektur data (ringkas)

```
openfootball (remote, cache ~60s)
    ↓ fallback: data/openfootball-2026.json (bundled)
transform (lib/data/tournament.ts)
    + FIFA live overlay / assist (timeout 1.5s)
    + BallDontLie (opsional)
    ↓
TournamentData → pages / API / client refresh
```

| Layer | TTL / interval |
|-------|----------------|
| Memory turnamen (Worker) | 30s |
| openfootball remote | 60s |
| Overlay FIFA | 30s |
| Client refresh (live) | 15s |
| Client refresh (normal) | 30s |

Endpoint ringkas: `GET /api/tournament` (live count, source, total goals).

## Struktur penting

```
app/                 # App Router (pages + api/tournament)
components/          # UI + bracket-client, favorites, auto-refresh
hooks/               # use-favorites, use-mobile
lib/
  api/               # openfootball, fifa, balldontlie
  data/              # tournament transform, cache, meta, constants
  seo/               # metadata & keywords
data/                # openfootball + trends keywords (bundled)
scripts/             # sync-data, sync-keywords, setup CF analytics
```

## Sumber data

1. **openfootball** — jadwal, skor, pencetak gol (utama)
2. **FIFA API** — overlay skor live & statistik assist (gratis, tanpa key)
3. **BallDontLie** — override live & assist jika API key tersedia

Favorit bersifat client-only (tidak ada backend user).

## Changelog

Lihat [CHANGELOG.md](./CHANGELOG.md).
