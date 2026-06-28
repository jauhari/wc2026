import { defineCloudflareConfig } from "@opennextjs/cloudflare"
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache"

export default defineCloudflareConfig({
  /** SSG dari build — tanpa Worker render ulang tiap request. */
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
  /** Preload route modules saat Worker start — navigasi lebih cepat. */
  routePreloadingBehavior: "onStart",
})