<script lang="ts">
  import type { MemberInput, PickerMember } from "$lib/types";
  import Button from "$lib/components/Button.svelte";

  interface Props {
    member: PickerMember | null;
    onSubmit: (input: MemberInput) => void;
    onCancel: () => void;
  }

  let { member, onSubmit, onCancel }: Props = $props();

  // `member` is only read once — the parent remounts this component (via {#if})
  // each time the form opens, so this is a fresh snapshot every time.
  let name = $state(member?.name ?? "");
  let phone = $state(member?.phone ?? "");
  let position = $state(member?.position ?? "");

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name, phone, position });
  }
</script>

<form onsubmit={handleSubmit} class="flex flex-col gap-4">
  <div class="flex flex-col gap-1.5">
    <label for="member-name" class="text-sm font-medium">
      Nama <span class="text-destructive">*</span>
    </label>
    <!-- svelte-ignore a11y_autofocus -->
    <input
      id="member-name"
      bind:value={name}
      placeholder="cth. Budi Santoso"
      autofocus
      required
      class="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
    />
  </div>
  <div class="flex flex-col gap-1.5">
    <label for="member-phone" class="text-sm font-medium">No. HP</label>
    <input
      id="member-phone"
      bind:value={phone}
      placeholder="cth. 0812xxxxxxxx"
      inputmode="tel"
      class="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
    />
  </div>
  <div class="flex flex-col gap-1.5">
    <label for="member-position" class="text-sm font-medium">Posisi</label>
    <input
      id="member-position"
      bind:value={position}
      placeholder="cth. Staff, Ketua RT, dst."
      class="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
    />
  </div>

  <div class="flex flex-col gap-2 pt-2 sm:flex-row-reverse">
    <Button type="submit" class="sm:flex-1">
      {member ? "Simpan Perubahan" : "Tambah Anggota"}
    </Button>
    <Button type="button" variant="outline" class="sm:flex-1" onclick={onCancel}
      >Batal</Button
    >
  </div>
</form>
