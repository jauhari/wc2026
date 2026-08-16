<script lang="ts">
  import type { Snippet } from "svelte";
  import { cn } from "$lib/utils";

  type Variant = "default" | "secondary" | "outline";

  interface Props {
    variant?: Variant;
    class?: string;
    children?: Snippet;
  }

  let { variant = "default", class: className = "", children }: Props = $props();

  const variantClasses: Record<Variant, string> = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    outline: "border-border text-foreground",
  };
</script>

<span
  class={cn(
    "inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:size-3!",
    variantClasses[variant],
    className
  )}
>
  {@render children?.()}
</span>
