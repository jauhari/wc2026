<script lang="ts">
  import { onDestroy } from "svelte";
  import { toast } from "svelte-sonner";

  import CheckIcon from "@lucide/svelte/icons/check";
  import DicesIcon from "@lucide/svelte/icons/dices";
  import HistoryIcon from "@lucide/svelte/icons/history";
  import ListPlusIcon from "@lucide/svelte/icons/list-plus";
  import PartyPopperIcon from "@lucide/svelte/icons/party-popper";
  import PencilIcon from "@lucide/svelte/icons/pencil";
  import PlusIcon from "@lucide/svelte/icons/plus";
  import RotateCcwIcon from "@lucide/svelte/icons/rotate-ccw";
  import ShuffleIcon from "@lucide/svelte/icons/shuffle";
  import Trash2Icon from "@lucide/svelte/icons/trash-2";
  import UsersIcon from "@lucide/svelte/icons/users";
  import Volume2Icon from "@lucide/svelte/icons/volume-2";
  import VolumeXIcon from "@lucide/svelte/icons/volume-x";
  import Wand2Icon from "@lucide/svelte/icons/wand-2";
  import MoonIcon from "@lucide/svelte/icons/moon";
  import SunIcon from "@lucide/svelte/icons/sun";

  import Badge from "$lib/components/Badge.svelte";
  import Button from "$lib/components/Button.svelte";
  import ConfettiBurst from "$lib/components/ConfettiBurst.svelte";
  import EmptyState from "$lib/components/EmptyState.svelte";
  import MemberForm from "$lib/components/MemberForm.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import PickerTimeline from "$lib/components/PickerTimeline.svelte";
  import { playPickerFanfare, playPickerTick } from "$lib/audio/picker-sounds";
  import { picker } from "$lib/stores/picker.svelte";
  import { theme } from "$lib/stores/theme.svelte";
  import {
    SITE_DESCRIPTION,
    SITE_KEYWORDS,
    SITE_NAME,
    SITE_TAGLINE,
    SITE_URL,
  } from "$lib/constants";
  import { parseMemberNames, type MemberInput, type PickerMember } from "$lib/types";
  import { cn } from "$lib/utils";

  const SPIN_DURATION_MS = 2400;

  picker.load();
  theme.init();

  const jsonLdData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "id",
  });
  const jsonLdScript = `<script type="application/ld+json">${jsonLdData}<` + "/script>";

  let activeTab = $state<"members" | "timeline">("members");
  let bulkInput = $state("");
  let quickAddOpen = $state(false);
  let formOpen = $state(false);
  let editingMember = $state<PickerMember | null>(null);
  let spinning = $state(false);
  let displayName = $state<string | null>(null);
  let winner = $state<PickerMember | null>(null);
  let revealKey = $state(0);
  let confettiTrigger = $state(0);
  let spinTimeoutId: ReturnType<typeof setTimeout> | null = null;

  onDestroy(() => {
    if (spinTimeoutId) clearTimeout(spinTimeoutId);
  });

  function finalizePick(member: PickerMember, method: "random" | "manual") {
    displayName = member.name;
    spinning = false;
    winner = member;
    revealKey += 1;
    picker.commitPick(member, method);
    playPickerFanfare(picker.muted);
    confettiTrigger += 1;
  }

  function handleRandomPick() {
    if (spinning) return;
    const pool = picker.remaining;
    if (pool.length === 0) {
      toast.error("Tidak ada anggota tersisa untuk diacak");
      return;
    }
    if (pool.length === 1) {
      finalizePick(pool[0], "random");
      return;
    }

    spinning = true;
    winner = null;
    const finalWinner = pool[Math.floor(Math.random() * pool.length)];

    let elapsed = 0;
    let interval = 70;
    const tick = () => {
      const candidate = pool[Math.floor(Math.random() * pool.length)];
      displayName = candidate.name;
      playPickerTick(picker.muted);
      elapsed += interval;
      interval = Math.min(interval * 1.18, 260);
      if (elapsed < SPIN_DURATION_MS) {
        spinTimeoutId = setTimeout(tick, interval);
      } else {
        finalizePick(finalWinner, "random");
      }
    };
    tick();
  }

  function handleManualPick(member: PickerMember) {
    if (spinning) return;
    finalizePick(member, "manual");
    toast.success(`${member.name} dipilih manual sebagai pemenang`);
  }

  function handleAddMembers(event: SubmitEvent) {
    event.preventDefault();
    const names = parseMemberNames(bulkInput);
    if (names.length === 0) return;
    picker.addMembers(names);
    bulkInput = "";
  }

  function openCreateForm() {
    editingMember = null;
    formOpen = true;
  }

  function openEditForm(member: PickerMember) {
    editingMember = member;
    formOpen = true;
  }

  function handleFormSubmit(input: MemberInput) {
    if (editingMember) {
      picker.updateMember(editingMember.id, input);
    } else {
      picker.addMember(input);
    }
    formOpen = false;
  }

  function handleClearMembers() {
    if (picker.members.length === 0) return;
    if (
      !confirm(
        "Hapus semua anggota dan antrian sukses? Tindakan ini tidak bisa dibatalkan."
      )
    ) {
      return;
    }
    picker.clearMembers();
    winner = null;
    displayName = null;
  }

  function handleResetQueue() {
    if (picker.history.length === 0) return;
    if (!confirm("Reset antrian sukses? Semua anggota akan bisa dipilih lagi.")) return;
    picker.resetQueue();
    winner = null;
    displayName = null;
  }

  function handleUndo() {
    picker.undoLast();
    winner = null;
    displayName = null;
  }

  const stageText = $derived(
    spinning
      ? displayName
      : winner
        ? winner.name
        : picker.members.length === 0
          ? "Tambahkan anggota dulu"
          : picker.remaining.length === 0
            ? "Semua sudah dipilih"
            : "Siap diacak!"
  );

  function entryFor(memberId: string) {
    return picker.history.find((h) => h.memberId === memberId);
  }
</script>

<svelte:head>
  <title>{SITE_NAME} — {SITE_TAGLINE}</title>
  <meta name="description" content={SITE_DESCRIPTION} />
  <meta name="keywords" content={SITE_KEYWORDS.join(", ")} />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href={SITE_URL} />

  <meta property="og:type" content="website" />
  <meta property="og:url" content={SITE_URL} />
  <meta property="og:site_name" content={SITE_NAME} />
  <meta property="og:title" content="{SITE_NAME} — {SITE_TAGLINE}" />
  <meta property="og:description" content={SITE_DESCRIPTION} />
  <meta property="og:image" content="{SITE_URL}/og-image.svg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:locale" content="id_ID" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{SITE_NAME} — {SITE_TAGLINE}" />
  <meta name="twitter:description" content={SITE_DESCRIPTION} />
  <meta name="twitter:image" content="{SITE_URL}/og-image.svg" />

  <meta name="theme-color" content="#3CAC3B" />
  <meta name="apple-mobile-web-app-title" content={SITE_NAME} />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <link rel="manifest" href="/manifest.webmanifest" />

  <!-- eslint-disable-next-line svelte/no-at-html-tags -- jsonLdScript is a JSON.stringify of static, known-safe data, not user input -->
  {@html jsonLdScript}
</svelte:head>

<div class="mx-auto flex max-w-4xl flex-col gap-5 p-4 md:p-6">
  <div class="flex flex-wrap items-start justify-between gap-3">
    <div>
      <h1 class="flex items-center gap-2 text-2xl font-bold tracking-tight">
        <DicesIcon class="size-6 text-primary" />
        Random Picker
      </h1>
      <p class="text-sm text-muted-foreground">
        {picker.members.length} anggota · {picker.remaining.length} tersisa · {picker
          .history.length} sudah masuk antrian sukses — data disimpan di perangkat Anda.
      </p>
    </div>
    <div class="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        aria-label={picker.muted ? "Aktifkan suara" : "Matikan suara"}
        onclick={() => picker.setMuted(!picker.muted)}
      >
        {#if picker.muted}
          <VolumeXIcon class="size-4" />
        {:else}
          <Volume2Icon class="size-4" />
        {/if}
      </Button>
      <Button
        variant="outline"
        size="icon"
        aria-label="Ganti tema"
        onclick={() => theme.toggle()}
      >
        {#if theme.current === "dark"}
          <SunIcon class="size-4" />
        {:else}
          <MoonIcon class="size-4" />
        {/if}
      </Button>
    </div>
  </div>

  <div class="relative overflow-hidden rounded-xl border bg-card">
    <ConfettiBurst trigger={confettiTrigger} />
    <div class="flex flex-col items-center gap-6 px-4 py-10">
      {#key revealKey}
        <div
          class={cn(
            "relative flex min-h-28 w-full max-w-md flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 text-center",
            winner &&
              !spinning &&
              "animate-picker-winner-pop border-primary bg-primary/5",
            spinning && "animate-picker-shake border-primary/50 bg-muted/50",
            !winner && !spinning && "border-border bg-muted/30"
          )}
        >
          {#if winner && !spinning}
            <PartyPopperIcon class="size-6 text-primary" aria-hidden="true" />
          {/if}
          <span
            class={cn(
              "text-2xl font-bold tracking-tight break-words sm:text-3xl",
              spinning && "text-muted-foreground blur-[0.5px]",
              winner && !spinning && "text-primary"
            )}
          >
            {stageText}
          </span>
          {#if winner && !spinning}
            <Badge variant="default" class="gap-1">
              <CheckIcon class="size-3" />
              Terpilih #{picker.history.length}
            </Badge>
          {/if}
        </div>
      {/key}

      <div class="flex flex-wrap items-center justify-center gap-2">
        <Button
          size="lg"
          onclick={handleRandomPick}
          disabled={spinning || picker.remaining.length === 0}
          class={cn(
            !spinning && picker.remaining.length > 0 && "animate-picker-glow-pulse"
          )}
        >
          <ShuffleIcon class="size-4" />
          {spinning ? "Mengacak…" : "Acak Sekarang"}
        </Button>
        <Button
          variant="outline"
          onclick={handleUndo}
          disabled={spinning || picker.history.length === 0}
        >
          <RotateCcwIcon class="size-4" />
          Batalkan Terakhir
        </Button>
      </div>

      <p class="text-sm text-muted-foreground">
        {picker.remaining.length} dari {picker.members.length} anggota tersisa untuk diacak.
      </p>
    </div>
  </div>

  <div class="rounded-xl border bg-card">
    <div class="border-b px-3 pt-3">
      <div
        class="inline-flex w-full items-center gap-1 rounded-lg bg-muted p-[3px] text-muted-foreground"
        role="tablist"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "members"}
          onclick={() => (activeTab = "members")}
          class={cn(
            "inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium transition-colors",
            activeTab === "members"
              ? "bg-background text-foreground shadow-sm"
              : "hover:text-foreground"
          )}
        >
          <UsersIcon class="size-4" />
          Anggota
          <span
            class="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold tabular-nums"
          >
            {picker.members.length}
          </span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "timeline"}
          onclick={() => (activeTab = "timeline")}
          class={cn(
            "inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium transition-colors",
            activeTab === "timeline"
              ? "bg-background text-foreground shadow-sm"
              : "hover:text-foreground"
          )}
        >
          <HistoryIcon class="size-4" />
          Timeline
          <span
            class="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold tabular-nums"
          >
            {picker.history.length}
          </span>
        </button>
      </div>
    </div>

    {#if activeTab === "members"}
      <div class="flex flex-col gap-3 p-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <p class="text-sm text-muted-foreground">
            Kelola daftar anggota — tambah, ubah, atau hapus.
          </p>
          <div class="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onclick={() => (quickAddOpen = !quickAddOpen)}
            >
              <ListPlusIcon class="size-4" />
              Tambah Cepat
            </Button>
            <Button size="sm" onclick={openCreateForm}>
              <PlusIcon class="size-4" />
              Tambah Anggota
            </Button>
          </div>
        </div>

        {#if quickAddOpen}
          <form
            onsubmit={handleAddMembers}
            class="flex flex-col gap-2 rounded-lg border p-3"
          >
            <textarea
              bind:value={bulkInput}
              placeholder="Tambah banyak nama sekaligus — satu nama per baris
atau pisahkan dengan koma (No. HP &amp; posisi bisa diisi lewat Edit)"
              rows="2"
              class="w-full min-w-0 resize-none rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            ></textarea>
            <Button type="submit" size="sm" class="self-end">
              <PlusIcon class="size-4" />
              Tambah
            </Button>
          </form>
        {/if}

        {#if picker.members.length === 0}
          <EmptyState
            title="Belum ada anggota"
            description="Klik &quot;Tambah Anggota&quot; untuk mulai mengisi daftar."
          />
        {:else}
          <div class="max-h-[420px] overflow-y-auto rounded-lg border">
            <table class="w-full caption-bottom text-sm">
              <thead class="[&_tr]:border-b">
                <tr class="border-b">
                  <th
                    class="h-10 px-2 text-left align-middle font-medium whitespace-nowrap"
                    >Nama</th
                  >
                  <th
                    class="h-10 px-2 text-left align-middle font-medium whitespace-nowrap"
                    >No. HP</th
                  >
                  <th
                    class="h-10 px-2 text-left align-middle font-medium whitespace-nowrap"
                    >Posisi</th
                  >
                  <th
                    class="h-10 px-2 text-left align-middle font-medium whitespace-nowrap"
                    >Status</th
                  >
                  <th
                    class="h-10 px-2 text-right align-middle font-medium whitespace-nowrap"
                    >Aksi</th
                  >
                </tr>
              </thead>
              <tbody class="[&_tr:last-child]:border-0">
                {#each picker.members as member (member.id)}
                  {@const entry = entryFor(member.id)}
                  <tr class="border-b transition-colors hover:bg-muted/50">
                    <td class="p-2 align-middle font-medium whitespace-nowrap"
                      >{member.name}</td
                    >
                    <td class="p-2 align-middle whitespace-nowrap text-muted-foreground"
                      >{member.phone || "—"}</td
                    >
                    <td class="p-2 align-middle whitespace-nowrap text-muted-foreground"
                      >{member.position || "—"}</td
                    >
                    <td class="p-2 align-middle whitespace-nowrap">
                      {#if entry}
                        <Badge variant="secondary" class="gap-1">
                          {#if entry.method === "manual"}
                            <Wand2Icon class="size-3" />
                          {:else}
                            <ShuffleIcon class="size-3" />
                          {/if}
                          #{picker.history.findIndex((h) => h.id === entry.id) + 1}
                        </Badge>
                      {:else}
                        <Badge variant="outline" class="text-muted-foreground"
                          >Belum dipilih</Badge
                        >
                      {/if}
                    </td>
                    <td class="p-2 align-middle whitespace-nowrap">
                      <div class="flex justify-end gap-1">
                        {#if !entry}
                          <Button
                            size="icon-sm"
                            variant="secondary"
                            disabled={spinning}
                            aria-label={`Pilih ${member.name}`}
                            onclick={() => handleManualPick(member)}
                          >
                            <Wand2Icon class="size-3.5" />
                          </Button>
                        {/if}
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          aria-label={`Edit ${member.name}`}
                          onclick={() => openEditForm(member)}
                        >
                          <PencilIcon class="size-3.5" />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          aria-label={`Hapus ${member.name}`}
                          class="text-muted-foreground hover:text-destructive"
                          onclick={() => picker.removeMember(member.id)}
                        >
                          <Trash2Icon class="size-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}

        {#if picker.members.length > 0}
          <Button
            variant="destructive"
            size="sm"
            class="self-start"
            onclick={handleClearMembers}
          >
            <Trash2Icon class="size-3.5" />
            Hapus Semua
          </Button>
        {/if}
      </div>
    {:else}
      <div class="flex flex-col gap-3 p-3">
        {#if picker.history.length === 0}
          <EmptyState
            title="Timeline masih kosong"
            description="Pemenang yang berhasil dipilih (acak maupun manual) akan tercatat di sini secara berurutan, lengkap dengan waktu."
          />
        {:else}
          <div class="max-h-[480px] overflow-y-auto pr-1">
            <PickerTimeline history={picker.history} members={picker.members} />
          </div>
        {/if}

        {#if picker.history.length > 0}
          <Button
            variant="outline"
            size="sm"
            class="self-start"
            onclick={handleResetQueue}
          >
            <RotateCcwIcon class="size-3.5" />
            Reset Antrian
          </Button>
        {/if}
      </div>
    {/if}
  </div>

  {#if formOpen}
    <Modal
      open={formOpen}
      onOpenChange={(v) => (formOpen = v)}
      title={editingMember ? "Edit Anggota" : "Tambah Anggota"}
      description={editingMember
        ? "Perbarui data anggota."
        : "Isi data anggota baru — hanya nama yang wajib."}
    >
      <MemberForm
        member={editingMember}
        onSubmit={handleFormSubmit}
        onCancel={() => (formOpen = false)}
      />
    </Modal>
  {/if}

  {#if !picker.ready}
    <p class="text-center text-xs text-muted-foreground">Memuat data tersimpan…</p>
  {/if}
</div>
