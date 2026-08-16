# Random Picker

Undian pemenang acak atau manual dari daftar anggota — CRUD anggota (nama, No. HP, posisi), timeline pengundian, animasi, dan efek suara. Cocok untuk giveaway, arisan, game, dan pembagian tugas. UI berbahasa Indonesia.

**Live:** [https://picker.ponjong.workers.dev/](https://picker.ponjong.workers.dev/)

> Versi ini adalah migrasi dari implementasi Next.js/React ke **SvelteKit + Svelte 5 (runes) + Tailwind CSS 4**, dengan fitur 100% setara. Kode Next.js sebelumnya ada di branch `claude/random-picker-app-4d9qvd`; snapshot World Cup 2026 Monitor (sebelum jadi Random Picker sama sekali) ada di `archive/wc2026-monitor`.

## Fitur

- **Kelola anggota (CRUD)** — tambah detail (Nama, No. HP, Posisi) lewat form, atau tambah cepat (paste banyak nama sekaligus); edit & hapus kapan saja
- **Undian acak** — animasi slot-machine sebelum berhenti di pemenang
- **Pilih manual** — tombol "Pilih" langsung per anggota
- **Timeline pengundian** — riwayat pemenang berurutan (nomor, metode, waktu, posisi/HP)
- **Confetti + efek suara** — animasi reveal & fanfare sintetis (Web Audio API, tanpa file eksternal), dengan toggle mute
- **Dark/light mode** — otomatis mengikuti sistem, bisa di-toggle manual (atau tekan `d`)
- **Client-only** — semua data tersimpan di `localStorage` perangkat Anda, tidak ada backend/database

## Stack

- SvelteKit + Svelte 5 (runes) + Tailwind CSS 4
- Ikon: [`@lucide/svelte`](https://lucide.dev) · Toast: [`svelte-sonner`](https://github.com/wobsoriano/svelte-sonner)
- Deploy: [`@sveltejs/adapter-cloudflare`](https://svelte.dev/docs/kit/adapter-cloudflare) → Cloudflare Workers

## Development

```bash
npm install
npm run dev       # http://localhost:3260
npm run check     # svelte-check + typecheck
npm run lint      # ESLint
npm run format    # Prettier
```

## Environment

Salin `.env.example` ke `.env.local`:

| Variable | Wajib | Keterangan |
|----------|-------|------------|
| `PUBLIC_SITE_URL` | Opsional | URL publik untuk SEO / OG (default live Workers) |
| `PUBLIC_CF_WEB_ANALYTICS_TOKEN` | Opsional | Cloudflare Web Analytics beacon |

## Deploy ke Cloudflare

```bash
npm run deploy
```

Setara dengan `npm run build && wrangler deploy`. Worker: `picker` · Observability & logs aktif di Cloudflare Dashboard.

## Struktur penting

```
src/
  app.html                        # Shell HTML — blocking theme script (anti-FOUC)
  app.css                         # Tailwind v4 theme tokens, keyframes animasi
  routes/
    +layout.svelte                # Toaster, analytics, shortcut tema
    +page.svelte                  # Satu-satunya halaman — semua UI & logika Random Picker
    sitemap.xml/+server.ts        # Sitemap dinamis
  lib/
    types.ts                      # Tipe data & util parsing (framework-agnostic)
    constants.ts                  # SITE_NAME/URL/DESCRIPTION/KEYWORDS
    audio/picker-sounds.ts        # Efek suara sintetis (Web Audio API)
    stores/
      picker.svelte.ts            # State CRUD anggota & antrian (runes + localStorage)
      theme.svelte.ts             # State dark/light + shortcut "d"
    components/
      Button.svelte, Badge.svelte, EmptyState.svelte, Modal.svelte  # Primitif Tailwind native
      MemberForm.svelte           # Form tambah/edit anggota (dipakai di dalam Modal)
      PickerTimeline.svelte       # Linimasa riwayat pengundian
      ConfettiBurst.svelte        # Efek confetti canvas
static/
  icon.svg, apple-icon.svg, og-image.svg, manifest.webmanifest, robots.txt
```

## Changelog

Lihat [CHANGELOG.md](./CHANGELOG.md).
