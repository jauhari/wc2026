# Random Picker

Undian pemenang acak atau manual dari daftar anggota — lengkap dengan antrian sukses, animasi, dan efek suara. Cocok untuk giveaway, arisan, game, dan pembagian tugas. UI berbahasa Indonesia.

**Live:** [https://wc2026.ponjong.workers.dev/](https://wc2026.ponjong.workers.dev/)

Aplikasi ini sebelumnya adalah **World Cup 2026 Monitor**. Karena turnamennya sudah selesai, beranda sekarang jadi Random Picker — semua halaman WC 2026 masih ada di sidebar sebagai arsip. Kode asli WC2026 Monitor (sebelum pivot) dibekukan di branch [`archive/wc2026-monitor`](../../tree/archive/wc2026-monitor).

## Fitur

- **Random Picker** (`/`) — tambah anggota, acak atau pilih manual, antrian sukses, animasi + confetti + efek suara sintetis, mute toggle
- **Arsip Piala Dunia 2026** — hasil, klasemen, jadwal, bagan guguran, statistik, tim, dan favorit, tetap dipertahankan sebagai referensi:
  - **Ringkasan** — rekap turnamen, top skor, tim tuan rumah
  - **Hasil** — filter live / selesai / terjadwal
  - **Klasemen** — 12 grup (A–L)
  - **Jadwal** — semua 104 pertandingan per hari
  - **Bagan** — knockout R32 → Final (mode per babak & bagan penuh)
  - **Stats** — top skor, top assist, grafik gol per grup
  - **Tim** — profil 48 tim peserta + detail per tim
  - **Favorit** — tim & pemain favorit (disimpan di `localStorage`)
- **SEO** — metadata, sitemap, robots, Open Graph, keywords (Trends + Suggest)

## Stack

- Next.js 16 + React 19 + shadcn/ui + Tailwind CSS 4
- Deploy: [OpenNext Cloudflare](https://opennext.js.org/cloudflare) → Cloudflare Workers
- Data arsip WC2026: [openfootball/worldcup.json](https://github.com/openfootball/worldcup.json) + FIFA API (gratis) + BallDontLie (opsional)

## Development

```bash
npm install
npm run dev          # http://localhost:3260
npm run sync-data    # tarik data terbaru dari openfootball (arsip WC2026)
npm run typecheck
npm run lint
```

## Environment

Salin `.env.example` ke `.env.local`:

| Variable | Wajib | Keterangan |
|----------|-------|------------|
| `BALLDONTLIE_API_KEY` | Opsional | Live score & assist arsip WC2026 dari BallDontLie |
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

## Struktur penting

```
app/                 # App Router
  page.tsx            # Random Picker (beranda)
  wc2026/              # Ringkasan arsip WC2026
  matches/ standings/ schedule/ bracket/ stats/ teams/ favorites/  # arsip WC2026
components/          # UI + random-picker-client, confetti, bracket-client, favorites
hooks/               # use-random-picker, use-favorites, use-mobile
lib/
  random-picker.ts    # state & tipe Random Picker
  audio/               # efek suara sintetis (Web Audio API)
  api/                 # openfootball, fifa, balldontlie (arsip WC2026)
  data/                # tournament transform, cache, meta, constants (arsip WC2026)
  seo/                 # metadata & keywords
data/                # openfootball + trends keywords (bundled, arsip WC2026)
scripts/             # sync-data, sync-keywords, setup CF analytics
```

## Data arsip WC2026

1. **openfootball** — jadwal, skor, pencetak gol (utama)
2. **FIFA API** — overlay skor live & statistik assist (gratis, tanpa key)
3. **BallDontLie** — override live & assist jika API key tersedia

Random Picker dan Favorit bersifat client-only (`localStorage`, tidak ada backend user).

## Changelog

Lihat [CHANGELOG.md](./CHANGELOG.md).
