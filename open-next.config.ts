import { defineCloudflareConfig } from "@opennextjs/cloudflare"

export default defineCloudflareConfig({
  /** Preload route modules saat Worker start — navigasi lebih cepat. */
  routePreloadingBehavior: "onStart",
})