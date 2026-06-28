/** ISR revalidate untuk halaman (detik). */
export const PAGE_REVALIDATE = 120

/** Cache data turnamen di memory Worker (ms). */
export const TOURNAMENT_CACHE_TTL_MS = 90_000

/** Refresh data openfootball dari GitHub (ms) — jarang, tidak blocking navigasi. */
export const REMOTE_DATA_TTL_MS = 300_000