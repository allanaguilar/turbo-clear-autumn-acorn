type SfxName =
  | "place"
  | "deny"
  | "bolt"
  | "shell"
  | "beam"
  | "orb"
  | "boom"
  | "kill"
  | "leak"
  | "wave"
  | "coin"
  | "upgrade"
  | "click"
  | "win"
  | "lose"
  | "boss";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noise: AudioBuffer | null = null;
let muted = false;
let voices = 0;

function context(): AudioContext | null {
  return ctx;
}

export function isMuted(): boolean {
  return muted;
}

export function unlockAudio(): void {
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  if (!ctx) {
    ctx = new AC({ latencyHint: "interactive" });
    master = ctx.createGain();
    master.gain.value = 0.7;
    master.connect(ctx.destination);
    const samples = ctx.sampleRate * 0.4;
    noise = ctx.createBuffer(1, samples, ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < samples; i++) data[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === "suspended") void ctx.resume();
}

export function resumeAudio(): void {
  if (ctx && ctx.state === "suspended") void ctx.resume();
}

export function setMuted(next: boolean): void {
  muted = next;
  if (!ctx || !master) return;
  master.gain.setTargetAtTime(next ? 0 : 0.7, ctx.currentTime, 0.02);
}

function gainNode(peak: number, dur: number): GainNode | null {
  if (!ctx || !master || muted) return null;
  if (voices > 14) return null;
  const gain = ctx.createGain();
  const now = ctx.currentTime;
  gain.connect(master);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.001, peak), now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(0.04, dur));
  return gain;
}

function tone(freq: number, dur: number, type: OscillatorType, peak: number, slide = 0): void {
  if (!ctx) return;
  const gain = gainNode(peak, dur);
  if (!gain) return;
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), ctx.currentTime + dur);
  osc.connect(gain);
  voices += 1;
  osc.onended = () => {
    voices = Math.max(0, voices - 1);
    osc.disconnect();
    gain.disconnect();
  };
  osc.start();
  osc.stop(ctx.currentTime + dur + 0.02);
}

function hiss(dur: number, peak: number, rate = 1): void {
  if (!ctx || !noise) return;
  const gain = gainNode(peak, dur);
  if (!gain) return;
  const src = ctx.createBufferSource();
  src.buffer = noise;
  src.playbackRate.value = rate;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 900 * rate;
  filter.Q.value = 0.6;
  src.connect(filter);
  filter.connect(gain);
  voices += 1;
  src.onended = () => {
    voices = Math.max(0, voices - 1);
    src.disconnect();
    filter.disconnect();
    gain.disconnect();
  };
  src.start();
  src.stop(ctx.currentTime + dur);
}

export function playSfx(name: SfxName): void {
  if (!context() || muted) return;
  switch (name) {
    case "place":
      tone(210, 0.08, "triangle", 0.08);
      hiss(0.06, 0.04, 0.6);
      break;
    case "deny":
      tone(140, 0.09, "square", 0.04, -40);
      break;
    case "bolt":
      tone(520 + Math.random() * 60, 0.05, "square", 0.035, 80);
      break;
    case "shell":
      tone(130, 0.12, "sine", 0.07, -70);
      break;
    case "beam":
      tone(880, 0.07, "sawtooth", 0.03, 220);
      break;
    case "orb":
      tone(360 + Math.random() * 40, 0.08, "triangle", 0.04);
      break;
    case "boom":
      tone(90, 0.16, "sine", 0.08, -40);
      hiss(0.12, 0.05, 0.4);
      break;
    case "kill":
      tone(660, 0.06, "triangle", 0.05);
      tone(880, 0.08, "sine", 0.04);
      break;
    case "leak":
      tone(180, 0.2, "sine", 0.07, -100);
      break;
    case "wave":
      tone(196, 0.18, "triangle", 0.06, 40);
      tone(294, 0.22, "sine", 0.04);
      break;
    case "coin":
      tone(740, 0.07, "sine", 0.05);
      tone(980, 0.1, "triangle", 0.04);
      break;
    case "upgrade":
      tone(440, 0.07, "triangle", 0.05, 80);
      tone(660, 0.1, "sine", 0.04);
      break;
    case "click":
      tone(480, 0.04, "square", 0.03);
      break;
    case "boss":
      tone(90, 0.35, "sawtooth", 0.05, -30);
      tone(140, 0.3, "sine", 0.05);
      break;
    case "win":
      tone(392, 0.12, "triangle", 0.06);
      tone(523, 0.14, "sine", 0.05);
      tone(659, 0.2, "triangle", 0.05);
      break;
    case "lose":
      tone(311, 0.18, "sine", 0.06, -40);
      tone(196, 0.28, "triangle", 0.05, -60);
      break;
    default:
      break;
  }
}
