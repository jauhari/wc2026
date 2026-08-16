<script lang="ts">
  import DicesIcon from "@lucide/svelte/icons/dices";
  import PencilIcon from "@lucide/svelte/icons/pencil";
  import Wand2Icon from "@lucide/svelte/icons/wand-2";

  import type { PickerHistoryEntry, PickerMember } from "$lib/types";
  import Badge from "$lib/components/Badge.svelte";
  import Button from "$lib/components/Button.svelte";
  import { cn } from "$lib/utils";

  interface Props {
    history: PickerHistoryEntry[];
    members: PickerMember[];
    onEdit: (entry: PickerHistoryEntry) => void;
  }

  let { history, members, onEdit }: Props = $props();

  const memberMap = $derived(new Map(members.map((m) => [m.id, m])));
  const ordered = $derived([...history].reverse());
</script>

<div class="relative">
  <div
    aria-hidden="true"
    class="absolute inset-y-4 left-4 w-px -translate-x-1/2 bg-border"
  ></div>
  <ol class="relative flex flex-col gap-4">
    {#each ordered as entry, i (entry.id)}
      {@const order = history.length - i}
      {@const member = memberMap.get(entry.memberId)}
      <li class="flex gap-3">
        <span
          class={cn(
            "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2 bg-background text-xs font-bold tabular-nums",
            i === 0
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-muted-foreground"
          )}
        >
          {order}
        </span>
        <div
          class="flex flex-1 flex-col gap-1 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2"
        >
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="font-semibold">{entry.name}</span>
            <div class="flex shrink-0 items-center gap-1">
              <Badge variant="outline" class="gap-1 text-[10px]">
                {#if entry.method === "manual"}
                  <Wand2Icon class="size-3" />
                {:else}
                  <DicesIcon class="size-3" />
                {/if}
                {entry.method === "manual" ? "Manual" : "Acak"}
              </Badge>
              <Button
                size="icon-sm"
                variant="ghost"
                aria-label={`Edit data ${entry.name}`}
                onclick={() => onEdit(entry)}
              >
                <PencilIcon class="size-3.5" />
              </Button>
            </div>
          </div>
          {#if member?.position || member?.phone}
            <span class="text-xs text-muted-foreground">
              {[member?.position, member?.phone].filter(Boolean).join(" · ")}
            </span>
          {/if}
          <span class="text-xs text-muted-foreground tabular-nums">
            {new Date(entry.pickedAt).toLocaleString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
        </div>
      </li>
    {/each}
  </ol>
</div>
