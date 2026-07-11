import { defineCloudflareConfig } from "@opennextjs/cloudflare"

export default defineCloudflareConfig({
  /** Render dinamis di Worker — data turnamen selalu bisa diperbarui. */
  enableCacheInterception: true,
  routePreloadingBehavior: "onStart",
})