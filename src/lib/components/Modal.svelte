<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    children?: Snippet;
  }

  let { open, onOpenChange, title, description, children }: Props = $props();
  let dialogEl = $state<HTMLDialogElement | null>(null);

  $effect(() => {
    if (!dialogEl) return;
    if (open && !dialogEl.open) {
      dialogEl.showModal();
    } else if (!open && dialogEl.open) {
      dialogEl.close();
    }
  });

  function handleClose() {
    onOpenChange(false);
  }

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === dialogEl) onOpenChange(false);
  }
</script>

<dialog
  bind:this={dialogEl}
  onclose={handleClose}
  onclick={handleBackdropClick}
  class="m-auto w-[calc(100%-2rem)] max-w-sm rounded-xl border border-border bg-card p-0 text-card-foreground shadow-lg"
>
  <div class="flex flex-col gap-4 p-5">
    <div class="flex flex-col gap-1">
      <h2 class="text-base font-semibold">{title}</h2>
      {#if description}
        <p class="text-sm text-muted-foreground">{description}</p>
      {/if}
    </div>
    {@render children?.()}
  </div>
</dialog>
