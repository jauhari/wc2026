<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { Toaster } from "svelte-sonner";

  import "../app.css";
  import { env } from "$env/dynamic/public";
  import { registerThemeHotkey } from "$lib/stores/theme.svelte";

  let { children } = $props();

  const cfAnalyticsToken = env.PUBLIC_CF_WEB_ANALYTICS_TOKEN;

  let unregisterHotkey: (() => void) | null = null;

  onMount(() => {
    unregisterHotkey = registerThemeHotkey();
  });

  onDestroy(() => {
    unregisterHotkey?.();
  });
</script>

<svelte:head>
  {#if cfAnalyticsToken}
    <script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={`{"token": "${cfAnalyticsToken}"}`}
    ></script>
  {/if}
</svelte:head>

<main class="min-h-svh bg-background text-foreground antialiased">
  {@render children()}
</main>

<Toaster richColors position="top-right" />
