<script lang="ts">
  import type { PickerHistoryEntry } from "$lib/types";
  import Button from "$lib/components/Button.svelte";

  interface Props {
    entry: PickerHistoryEntry;
    onSubmit: (input: { pickedAt: number; method: PickerHistoryEntry["method"] }) => void;
    onCancel: () => void;
  }

  let { entry, onSubmit, onCancel }: Props = $props();

  function toLocalInputValue(ts: number): string {
    const d = new Date(ts);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  // `entry` is only read once — the parent remounts this component (via {#if})
  // each time the form opens, so this is a fresh snapshot every time.
  let pickedAtLocal = $state(toLocalInputValue(entry.pickedAt));
  let method = $state<PickerHistoryEntry["method"]>(entry.method);

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    const ts = new Date(pickedAtLocal).getTime();
    if (Number.isNaN(ts)) return;
    onSubmit({ pickedAt: ts, method });
  }
</script>

<form onsubmit={handleSubmit} class="flex flex-col gap-4">
  <div class="flex flex-col gap-1.5">
    <label for="history-date" class="text-sm font-medium">Tanggal &amp; Jam Menang</label>
    <input
      id="history-date"
      type="datetime-local"
      bind:value={pickedAtLocal}
      required
      class="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
    />
  </div>

  <fieldset class="flex flex-col gap-1.5">
    <legend class="text-sm font-medium">Metode</legend>
    <div class="flex gap-2">
      <label
        class="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-input px-2.5 py-1.5 text-sm has-checked:border-primary has-checked:bg-primary/10 has-checked:text-primary"
      >
        <input type="radio" bind:group={method} value="random" class="sr-only" />
        Acak
      </label>
      <label
        class="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-input px-2.5 py-1.5 text-sm has-checked:border-primary has-checked:bg-primary/10 has-checked:text-primary"
      >
        <input type="radio" bind:group={method} value="manual" class="sr-only" />
        Manual
      </label>
    </div>
  </fieldset>

  <div class="flex flex-col gap-2 pt-2 sm:flex-row-reverse">
    <Button type="submit" class="sm:flex-1">Simpan Perubahan</Button>
    <Button type="button" variant="outline" class="sm:flex-1" onclick={onCancel}
      >Batal</Button
    >
  </div>
</form>
