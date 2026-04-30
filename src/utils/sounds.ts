/**
 * Synthesised unlock sounds via Web Audio API.
 * No audio files needed — pure oscillator synthesis.
 */

/** macOS-style soft ascending chime (C major arpeggio) */
export function playMacUnlock(): void {
  try {
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    // C5 → E5 → G5 → C6 — gentle, warm, Mac-like
    const notes = [
      { freq: 523.25, t: 0.00 },
      { freq: 659.25, t: 0.10 },
      { freq: 783.99, t: 0.20 },
      { freq: 1046.5, t: 0.30 },
    ];

    notes.forEach(({ freq, t }) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      const at   = now + t;

      osc.type = 'sine';
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0, at);
      gain.gain.linearRampToValueAtTime(0.18, at + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.001, at + 1.1);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(at);
      osc.stop(at + 1.15);
    });

    setTimeout(() => ctx.close(), 2500);
  } catch {
    /* Web Audio unavailable — silent fail */
  }
}

/** iOS-style short mechanical click/unlock tap */
export function playIOSUnlock(): void {
  try {
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    // Primary click: fast high-to-low sweep
    const osc1  = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1800, now);
    osc1.frequency.exponentialRampToValueAtTime(600, now + 0.035);
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.45, now + 0.003);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.055);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.06);

    // Soft resonant tail
    const osc2  = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.value = 430;
    gain2.gain.setValueAtTime(0, now + 0.008);
    gain2.gain.linearRampToValueAtTime(0.08, now + 0.018);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.008);
    osc2.stop(now + 0.2);

    setTimeout(() => ctx.close(), 500);
  } catch {
    /* silent fail */
  }
}
