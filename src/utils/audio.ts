const clampToUint16 = (value: number): number => Math.max(0, Math.min(0xffff, value));

const writeString = (view: DataView, offset: number, value: string): number => {
  for (let index = 0; index < value.length; index += 1) {
    view.setUint8(offset + index, value.charCodeAt(index));
  }
  return offset + value.length;
};

const encodeWav = (samples: Float32Array, sampleRate: number): ArrayBuffer => {
  const bytesPerSample = 2;
  const blockAlign = bytesPerSample;
  const buffer = new ArrayBuffer(44 + samples.length * bytesPerSample);
  const view = new DataView(buffer);

  let offset = 0;
  offset = writeString(view, offset, 'RIFF');
  view.setUint32(offset, 36 + samples.length * bytesPerSample, true);
  offset += 4;
  offset = writeString(view, offset, 'WAVE');
  offset = writeString(view, offset, 'fmt ');
  view.setUint32(offset, 16, true);
  offset += 4;
  view.setUint16(offset, 1, true);
  offset += 2;
  view.setUint16(offset, 1, true);
  offset += 2;
  view.setUint32(offset, sampleRate, true);
  offset += 4;
  view.setUint32(offset, sampleRate * blockAlign, true);
  offset += 4;
  view.setUint16(offset, blockAlign, true);
  offset += 2;
  view.setUint16(offset, 16, true);
  offset += 2;
  offset = writeString(view, offset, 'data');
  view.setUint32(offset, samples.length * bytesPerSample, true);
  offset += 4;

  samples.forEach((sample, index) => {
    const clipped = Math.max(-1, Math.min(1, sample));
    view.setInt16(offset + index * bytesPerSample, clipped < 0 ? clipped * 0x8000 : clipped * 0x7fff, true);
  });

  return buffer;
};

const toBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }
  return btoa(binary);
};

type AudioTheme = 'love' | 'chill' | 'neon';

const generateTheme = (theme: AudioTheme): { label: string; source: string } => {
  const sampleRate = 22050;
  const durationSeconds = 4;
  const totalSamples = sampleRate * durationSeconds;
  const samples = new Float32Array(totalSamples);

  const themes: Record<AudioTheme, number[]> = {
    love: [261.63, 329.63, 392.0, 493.88],
    chill: [196.0, 246.94, 293.66, 349.23],
    neon: [220.0, 277.18, 329.63, 415.3],
  };

  const melody = themes[theme];

  for (let index = 0; index < totalSamples; index += 1) {
    const time = index / sampleRate;
    const step = Math.floor(time * 2) % melody.length;
    const frequency = melody[step];
    const envelope = Math.exp(-time * 0.25) * 0.22;
    const modulation = Math.sin(2 * Math.PI * frequency * time);
    const shimmer = Math.sin(2 * Math.PI * (frequency * 0.5) * time) * 0.12;
    samples[index] = (modulation + shimmer) * envelope;
  }

  return {
    label: theme === 'love' ? 'Love Theme' : theme === 'chill' ? 'Chill Vibe' : 'Neon Night',
    source: `data:audio/wav;base64,${toBase64(encodeWav(samples, sampleRate))}`,
  };
};

export const buildWrappedAudioDataUri = (): string => generateTheme('love').source;

export const audioThemes: Array<{ id: AudioTheme; label: string; source: string }> = [
  { id: 'love', ...generateTheme('love') },
  { id: 'chill', ...generateTheme('chill') },
  { id: 'neon', ...generateTheme('neon') },
];

export type { AudioTheme };
