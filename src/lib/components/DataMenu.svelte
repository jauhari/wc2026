<script lang="ts">
  import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
  import DownloadIcon from "@lucide/svelte/icons/download";
  import UploadIcon from "@lucide/svelte/icons/upload";

  import Button from "$lib/components/Button.svelte";

  interface Props {
    onExportJson: () => void;
    onExportCsv: () => void;
    onImportJson: (file: File) => void;
    onImportCsv: (file: File) => void;
  }

  let { onExportJson, onExportCsv, onImportJson, onImportCsv }: Props = $props();

  let open = $state(false);
  let menuEl = $state<HTMLDivElement | null>(null);
  let jsonInputEl = $state<HTMLInputElement | null>(null);
  let csvInputEl = $state<HTMLInputElement | null>(null);

  function handleWindowClick(event: MouseEvent) {
    if (open && menuEl && !menuEl.contains(event.target as Node)) open = false;
  }

  function pick(action: () => void) {
    action();
    open = false;
  }

  function handleJsonFile(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) onImportJson(file);
    (event.target as HTMLInputElement).value = "";
  }

  function handleCsvFile(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) onImportCsv(file);
    (event.target as HTMLInputElement).value = "";
  }
</script>

<svelte:window onclick={handleWindowClick} />

<div class="relative" bind:this={menuEl}>
  <Button variant="outline" onclick={() => (open = !open)}>
    Data
    <ChevronDownIcon class="size-4" />
  </Button>

  {#if open}
    <div
      class="absolute right-0 z-20 mt-1 w-64 rounded-lg border border-border bg-card p-1 text-sm shadow-lg"
    >
      <p class="px-2.5 pt-1.5 pb-1 text-xs font-medium text-muted-foreground">Ekspor</p>
      <button
        type="button"
        class="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left hover:bg-muted"
        onclick={() => pick(onExportJson)}
      >
        <DownloadIcon class="size-4" />
        Backup lengkap (.json)
      </button>
      <button
        type="button"
        class="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left hover:bg-muted"
        onclick={() => pick(onExportCsv)}
      >
        <DownloadIcon class="size-4" />
        Daftar anggota (.csv)
      </button>

      <div class="my-1 border-t border-border"></div>

      <p class="px-2.5 pt-1.5 pb-1 text-xs font-medium text-muted-foreground">Impor</p>
      <button
        type="button"
        class="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left hover:bg-muted"
        onclick={() => {
          jsonInputEl?.click();
          open = false;
        }}
      >
        <UploadIcon class="size-4" />
        Pulihkan backup (.json)
      </button>
      <button
        type="button"
        class="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left hover:bg-muted"
        onclick={() => {
          csvInputEl?.click();
          open = false;
        }}
      >
        <UploadIcon class="size-4" />
        Tambah anggota (.csv)
      </button>
    </div>
  {/if}

  <input
    bind:this={jsonInputEl}
    type="file"
    accept="application/json,.json"
    class="hidden"
    onchange={handleJsonFile}
  />
  <input
    bind:this={csvInputEl}
    type="file"
    accept=".csv,text/csv"
    class="hidden"
    onchange={handleCsvFile}
  />
</div>
