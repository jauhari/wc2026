<script lang="ts">
  interface Props {
    title: string;
    description: string;
  }

  let { title, description }: Props = $props();
</script>

<div
  class="flex min-h-40 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center"
>
  <p class="text-sm font-medium">{title}</p>
  <p class="text-sm text-muted-foreground">{description}</p>
</div>
