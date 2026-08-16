<script lang="ts">
  import type { Snippet } from "svelte";
  import { cn } from "$lib/utils";

  type Variant = "default" | "outline" | "secondary" | "ghost" | "destructive";
  type Size = "default" | "sm" | "lg" | "icon" | "icon-sm";

  interface Props {
    variant?: Variant;
    size?: Size;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    class?: string;
    "aria-label"?: string;
    onclick?: (event: MouseEvent) => void;
    children?: Snippet;
  }

  let {
    variant = "default",
    size = "default",
    type = "button",
    disabled = false,
    class: className = "",
    onclick,
    children,
    ...rest
  }: Props = $props();

  const variantClasses: Record<Variant, string> = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80",
    outline:
      "border-border bg-background hover:bg-muted hover:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/70",
    ghost: "hover:bg-muted hover:text-foreground dark:hover:bg-muted/50",
    destructive:
      "bg-destructive/10 text-destructive hover:bg-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30",
  };

  const sizeClasses: Record<Size, string> = {
    default: "h-8 gap-1.5 px-2.5",
    sm: "h-7 gap-1 rounded-md px-2.5 text-[0.8rem]",
    lg: "h-9 gap-1.5 px-6 text-base",
    icon: "size-8",
    "icon-sm": "size-7 rounded-md",
  };
</script>

<button
  {type}
  {disabled}
  {onclick}
  class={cn(
    "inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    variantClasses[variant],
    sizeClasses[size],
    className
  )}
  {...rest}
>
  {@render children?.()}
</button>
