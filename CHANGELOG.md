# Changelog

Semua perubahan penting pada project ini dicatat di sini.

## [Unreleased] — 2026-08-16 (4)

### Import/export data & edit riwayat pengundian (SvelteKit)

- **Menu Data** (dropdown di header) — ekspor & impor:
  - Ekspor backup lengkap (.json) — anggota + riwayat pengundian
  - Ekspor daftar anggota (.csv) — bisa dibuka/diedit di Excel
  - Impor backup (.json) — memulihkan/menimpa seluruh data (dengan konfirmasi)
  - Impor anggota (.csv) — tambah anggota massal dari spreadsheet, duplikat nama dilewati
- **Edit entri Timeline** — tombol edit (pensil) per entri pengundian, buka form untuk
  mengubah **tanggal & jam menang** dan metode (Acak/Manual)
- File baru: `src/lib/data-io.ts` (helper CSV/unduh file),
  `src/lib/components/DataMenu.svelte`, `src/lib/components/HistoryEditForm.svelte`
- `src/lib/stores/picker.svelte.ts`: tambah `importMembers`, `restoreBackup`,
  `updateHistoryEntry`

## [Unreleased] — 2026-08-16 (3)

### Migrasi ke SvelteKit + Svelte 5 + Tailwind CSS 4

Seluruh aplikasi Random Picker (Next.js/React) dimigrasi penuh ke
**SvelteKit + Svelte 5 (runes) + Tailwind CSS 4**, dengan paritas fitur
100%. Kode Next.js sebelumnya tetap tersedia di branch
`claude/random-picker-app-4d9qvd`.

- **State**: `useState`/`useSyncExternalStore` → kelas berbasis `$state`/
  `$derived` di `src/lib/stores/picker.svelte.ts` (`src/lib/stores/theme.svelte.ts`
  untuk dark/light mode + shortcut `d`)
- **Komponen**: shadcn/ui (Radix-based) → primitif Tailwind native
  (`Button`, `Badge`, `EmptyState`) + `<dialog>` native untuk modal
  tambah/edit anggota (menggantikan Sheet)
- **Ikon**: `lucide-react` → `@lucide/svelte`; **Toast**: `sonner` →
  `svelte-sonner`
- **Routing**: App Router (`app/page.tsx`) → satu route di
  `src/routes/+page.svelte`, semua logika & UI dalam satu file sesuai
  arsitektur "single, clean" yang diminta
- **SEO**: `generateMetadata`/`ImageResponse` → blok `<svelte:head>`
  lengkap (title, description, OG, Twitter card, JSON-LD) + OG image
  statis (`static/og-image.svg`), sitemap dinamis di
  `src/routes/sitemap.xml/+server.ts`
- **Deploy**: OpenNext Cloudflare → `@sveltejs/adapter-cloudflare`
  (`wrangler.jsonc` disesuaikan, binding `WORKER_SELF_REFERENCE` yang
  khusus OpenNext dihapus karena tidak relevan untuk SvelteKit)
- **localStorage key dipertahankan** (`wc2026-random-picker`,
  `wc2026-random-picker-muted`) — data anggota & antrian pengguna lama
  otomatis terbaca di versi baru (domain sama)
- Build sekarang menghasilkan bundle client yang jauh lebih kecil (total
  ~60KB gzip di seluruh chunk) dibanding build Next.js sebelumnya

## [Unreleased] — 2026-08-16 (2)

### Hapus total arsip WC2026

Menyusul pivot sebelumnya, arsip Piala Dunia 2026 sekarang dihapus penuh —
proyek ini murni Random Picker. Kode WC2026 sebelumnya tetap tersedia di
branch `archive/wc2026-monitor` kalau dibutuhkan lagi.

- **Routing** — halaman `/wc2026`, `/matches`, `/standings`, `/schedule`,
  `/bracket`, `/stats`, `/teams`, `/favorites`, dan API `/api/tournament`
  dihapus. Sidebar sekarang hanya berisi satu item: Random Picker
- **Komponen, hook, lib WC2026 dihapus**: `bracket-client`, `favorites-*`,
  `match-*`, `matches-client`, `schedule-client`, `stats-*`, `team-*`,
  `teams-client`, `tournament-auto-refresh`, `country-flag`,
  `data-freshness`, `use-favorites`, `lib/api/*` (openfootball, FIFA,
  BallDontLie), `lib/data/*` (tournament, stadiums, dll), dan tipe terkait
  di `lib/types.ts`
- **UI primitives yang jadi tak terpakai ikut dihapus**: `avatar`, `chart`
  (+ dependency `recharts`), `progress`, `scroll-area`, `select`,
  `toggle`/`toggle-group`
- **Data & script**: `data/openfootball-2026.json`,
  `scripts/sync-data.mjs`, `scripts/sync-keywords.mjs` dihapus.
  `data/trends-keywords.json` diisi ulang dengan keyword SEO relevan
  Random Picker (sebelumnya berisi keyword Piala Dunia)
- `app/sitemap.ts` disederhanakan (tidak lagi bergantung data turnamen),
  `lib/seo.ts` kehilangan fungsi metadata yang sudah tidak dipakai
- `next.config.ts`: hapus `images.remotePatterns` untuk `flagcdn.com`
- `.env.example`: hapus `BALLDONTLIE_API_KEY`
- Build sekarang 100% statis — semua rute pre-render tanpa fetch data
  server saat runtime

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
