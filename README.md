# Random Picker

Undian pemenang acak atau manual dari daftar anggota — lengkap dengan CRUD anggota (nama, No. HP, posisi), timeline pengundian, animasi, dan efek suara. Cocok untuk giveaway, arisan, game, dan pembagian tugas. UI berbahasa Indonesia.

**Live:** [https://picker.ponjong.workers.dev/](https://picker.ponjong.workers.dev/)

> Repo ini sebelumnya adalah **World Cup 2026 Monitor**. Setelah turnamennya selesai, seluruh kode & halaman WC2026 dilepas — proyek ini sekarang murni Random Picker. Kode WC2026 Monitor (sebelum pivot) tetap dibekukan di branch [`archive/wc2026-monitor`](../../tree/archive/wc2026-monitor) kalau suatu saat dibutuhkan lagi.

## Fitur

- **Kelola anggota (CRUD)** — tambah detail (Nama, No. HP, Posisi) lewat form, atau tambah cepat (paste banyak nama sekaligus); edit & hapus kapan saja
- **Undian acak** — animasi slot-machine sebelum berhenti di pemenang
- **Pilih manual** — tombol "Pilih" langsung per anggota
- **Timeline pengundian** — riwayat pemenang berurutan (nomor, metode, waktu, posisi/HP), bukan asal pilih tanpa jejak
- **Confetti + efek suara** — animasi reveal & fanfare sintetis (Web Audio API, tanpa file eksternal) saat pemenang terpilih, dengan toggle mute
- **Client-only** — semua data tersimpan di `localStorage` perangkat Anda, tidak ada backend/database

## Stack

- Next.js 16 + React 19 + shadcn/ui + Tailwind CSS 4
- Deploy: [OpenNext Cloudflare](https://opennext.js.org/cloudflare) → Cloudflare Workers

## Development

```bash
npm install
npm run dev          # http://localhost:3260
npm run typecheck
npm run lint
```

## Environment

Salin `.env.example` ke `.env.local`:

| Variable | Wajib | Keterangan |
|----------|-------|------------|
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
| `npm run build:cf` | Build OpenNext untuk Workers |
| `npm run deploy:cf` | Deploy artifact `.open-next` ke Cloudflare |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |

> **Catatan deploy:** jalankan `npm run build:cf` dulu, baru `npm run deploy:cf`. Deploy saja tanpa rebuild dapat mengunggah build lama.

## Deploy ke Cloudflare

```bash
npm run build:cf
npm run deploy:cf
```

Worker: `picker` · Observability & logs aktif di Cloudflare Dashboard.

## Struktur penting

```
app/
  page.tsx                    # Random Picker (satu-satunya halaman)
components/
  random-picker-client.tsx    # UI utama: stage acak, tabel anggota, tab timeline
  member-form-sheet.tsx       # Form tambah/edit anggota
  picker-timeline.tsx         # Linimasa riwayat pengundian
  confetti-burst.tsx          # Efek confetti canvas
hooks/
  use-random-picker.tsx       # State CRUD anggota & antrian (localStorage)
lib/
  random-picker.ts            # Tipe & util Random Picker
  audio/picker-sounds.ts      # Efek suara sintetis (Web Audio API)
  seo/                        # Metadata & keyword SEO
```

## Changelog

Lihat [CHANGELOG.md](./CHANGELOG.md).
