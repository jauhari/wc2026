# Changelog

Semua perubahan penting pada project ini dicatat di sini.

## [Unreleased] — 2026-08-16

### Random Picker: CRUD anggota & timeline

- **Data anggota diperluas** — tiap anggota kini punya Nama, No. HP, dan
  Posisi (bukan cuma nama)
- **CRUD lengkap** di tab Anggota:
  - Tambah anggota detail (Nama/HP/Posisi) lewat sheet form, atau Tambah
    Cepat (paste banyak nama sekaligus, HP/posisi bisa diisi belakangan)
  - Edit anggota (ikon pensil) — ubah nama/HP/posisi kapan saja
  - Hapus per anggota atau hapus semua
  - Daftar anggota ditampilkan sebagai tabel (Nama, No. HP, Posisi, Status,
    Aksi) bukan list sederhana
- **Timeline pengundian** — tab "Antrian Sukses" diganti jadi **Timeline**
  bergaya linimasa (node bernomor + garis penghubung), menampilkan posisi/HP
  anggota dan waktu lengkap (tanggal + jam) tiap kali ada yang terpilih
- File baru: `components/member-form-sheet.tsx`, `components/picker-timeline.tsx`
- `lib/random-picker.ts`: tipe `PickerMember` tambah `phone`/`position`,
  migrasi otomatis data lama yang belum punya field ini
- `hooks/use-random-picker.tsx`: tambah `addMember`/`updateMember` untuk
  create/update terstruktur

## [Unreleased] — 2026-08-15

### Pivot: Random Picker jadi aplikasi utama

Piala Dunia FIFA 2026 sudah selesai, jadi beranda situs ini sekarang **Random
Picker**. Semua halaman & data WC2026 tetap ada, dipindah jadi bagian arsip.
Kode sebelum pivot dibekukan di branch `archive/wc2026-monitor`.

- **Routing**
  - `/` — sekarang Random Picker (sebelumnya beranda ringkasan turnamen)
  - `/wc2026` — ringkasan turnamen WC2026 (dipindah dari `/`)
  - Halaman lain (`/matches`, `/standings`, `/schedule`, `/bracket`,
    `/stats`, `/teams`, `/favorites`) tidak berubah, sekarang dikelompokkan
    sebagai "Piala Dunia 2026 · Arsip" di sidebar
- **Branding** — nama situs, tagline, deskripsi SEO, manifest PWA, favicon,
  Open Graph image, dan JSON-LD diganti ke identitas Random Picker
  (`lib/seo/constants.ts`, `app/manifest.ts`, `app/icon.svg`,
  `app/opengraph-image.tsx`, `components/site-json-ld.tsx`)
- `package.json` `name` → `random-picker`
- Cloudflare Worker (`wrangler.jsonc` `name` & `WORKER_SELF_REFERENCE`) → `picker`,
  jadi live URL berubah ke `https://picker.ponjong.workers.dev`. Worker `wc2026`
  lama tidak dihapus otomatis — deploy `picker` membuat worker baru terpisah.

### Fitur

- **Random Picker** — undian pemenang acak & manual dengan tracking antrian sukses
  - Tambah anggota (input multi-baris/koma), pilih pemenang acak (animasi slot-machine) atau manual
  - Antrian sukses berurutan (nomor, metode, waktu) — tersimpan di `localStorage`
  - Efek suara sintetis (Web Audio API, tanpa file eksternal) + toggle mute
  - Animasi reveal & confetti (canvas) saat pemenang berhasil dipilih
  - State: `hooks/use-random-picker.tsx`, `lib/random-picker.ts`
  - Komponen: `components/random-picker-client.tsx`, `components/confetti-burst.tsx`

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
