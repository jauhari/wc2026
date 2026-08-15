# Changelog

Semua perubahan penting pada project ini dicatat di sini.

## [Unreleased] — 2026-08-15

### Fitur

- **Random Picker** — undian pemenang acak & manual dengan tracking antrian sukses
  - Halaman `/random-picker`
  - Tambah anggota (input multi-baris/koma), pilih pemenang acak (animasi slot-machine) atau manual
  - Antrian sukses berurutan (nomor, metode, waktu) — tersimpan di `localStorage`
  - Efek suara sintetis (Web Audio API, tanpa file eksternal) + toggle mute
  - Animasi reveal & confetti (canvas) saat pemenang berhasil dipilih
  - State: `hooks/use-random-picker.tsx`, `lib/random-picker.ts`
  - Komponen: `components/random-picker-client.tsx`, `components/confetti-burst.tsx`
  - Nav item **Random Picker** di sidebar

## [Unreleased] — 2026-07-11

### Mobile UX

- **Bagan guguran mobile-friendly**
  - Mode **Per babak**: chip pilih babak + tombol prev/next; kartu match full width (tidak terpotong)
  - Mode **Bagan penuh**: board horizontal dengan scroll native + tombol panah + snap
  - Komponen baru: `components/bracket-client.tsx`
  - Layout `min-w-0` / `overflow-x-hidden` agar scroll horizontal tidak “macet” di shell sidebar
- **Sidebar mobile menutup setelah navigasi**
  - Klik logo atau item menu memanggil `setOpenMobile(false)` di mobile
  - File: `components/app-sidebar.tsx`

### Fitur

- **Favorit** (tim & pemain) via `localStorage`
  - Halaman `/favorites`
  - Provider: `hooks/use-favorites.tsx`, `lib/favorites.ts`
  - Tombol favorit di tim, scorers, section di beranda
- **Auto-refresh turnamen** di client (`components/tournament-auto-refresh.tsx`)
  - Interval lebih cepat saat ada pertandingan live
- **Indikator data freshness** di header (`components/data-freshness.tsx`)
- **API** `GET /api/tournament` — ringkasan live count, source, total goals
- Nav item **Favorit** di sidebar

### Data & performa

- Cache turnamen diperketat (30s memory, 60s openfootball, 30s overlay FIFA)
- Client refresh: 15s (live) / 30s (normal)
- `open-next.config.ts`: render dinamis di Worker (bukan static-assets incremental cache) agar data bisa diperbarui
- `prebuild:cf` menjalankan `sync-data` + `sync-keywords`
- Data openfootball & keywords di-sync terbaru (104 matches)

### Docs

- README diperbarui: fitur, arsitektur data, catatan deploy build-then-deploy
- CHANGELOG ditambahkan

### Deploy

- Live: https://wc2026.ponjong.workers.dev/
- Worker name: `wc2026` (Cloudflare)

---

## Sebelumnya (ringkas, dari history git)

- SEO dinamis (Google Trends + Suggest), metadata & social cards
- Prerender / static assets cache tuning, perbaikan ISR vs static assets
- Halaman detail match cepat tanpa external API calls di path statis
- Integrasi openfootball + FIFA overlay + BallDontLie opsional
- UI shadcn/sidebar, klasemen, jadwal, stats, teams
