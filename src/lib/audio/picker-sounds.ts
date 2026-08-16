/** Efek suara sintetis (Web Audio API) — tanpa file audio eksternal. */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;
  if (!audioCtx) audioCtx = new Ctor();
  if (audioCtx.state === "suspended") void audioCtx.resume();
  return audioCtx;
}

function tone(
  ctx: AudioContext,
  {
    freq,
    start,
    duration,
    type = "sine",
    peak = 0.12,
  }: {
    freq: number;
    start: number;
    duration: number;
    type?: OscillatorType;
    peak?: number;
  }
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peak, start + Math.min(0.02, duration / 4));
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

/** Suara "tik" pendek — dipakai saat nama berputar. */
export function playPickerTick(muted: boolean) {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  tone(ctx, {
    freq: 720,
    start: ctx.currentTime,
    duration: 0.05,
    type: "square",
    peak: 0.06,
  });
}

/** Fanfare kemenangan — dipakai saat pemenang berhasil dipilih. */
export function playPickerFanfare(muted: boolean) {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => {
    tone(ctx, {
      freq,
      start: ctx.currentTime + i * 0.09,
      duration: 0.4,
      type: "triangle",
      peak: 0.14,
    });
  });
}
