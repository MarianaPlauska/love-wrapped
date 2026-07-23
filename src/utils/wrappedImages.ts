import type { WrappedData } from '../data/wrappedData';

export type ImageSlot = 'intro' | 'introSecondary' | 'summary' | 'origin-bg' | 'food-bg' | 'song-bg' | 'favorite-moment' | 'series-bg' | 'sky' | 'memory-0' | 'memory-1' | 'memory-2' | 'memory-3' | 0 | 1 | 2 | 3;

export const imageLabels: Array<{ slot: ImageSlot; label: string }> = [
  { slot: 'intro', label: 'Círculo da Mariana' },
  { slot: 'introSecondary', label: 'Círculo da Marianna' },
  { slot: 'origin-bg', label: 'Fundo: onde tudo começou' },
  { slot: 'food-bg', label: 'Fundo: comida do casal' },
  { slot: 'song-bg', label: 'Fundo: música do casal' },
  { slot: 'favorite-moment', label: 'Foto: jogo do Fluminense' },
  { slot: 'series-bg', label: 'Fundo: série do casal' },
  { slot: 'sky', label: 'Imagem da carta celeste' },
  { slot: 'summary', label: 'Capa do card final' },
  { slot: 'memory-0', label: 'Polaroid 1' },
  { slot: 'memory-1', label: 'Polaroid 2' },
  { slot: 'memory-2', label: 'Polaroid 3' },
  { slot: 'memory-3', label: 'Polaroid 4' },
  { slot: 0, label: 'Foto do quadrante 1' },
  { slot: 1, label: 'Foto do quadrante 2' },
  { slot: 2, label: 'Foto do quadrante 3' },
  { slot: 3, label: 'Foto do quadrante 4' },
];

export const setWrappedImage = (data: WrappedData, slot: ImageSlot, source: string): WrappedData => {
  if (slot === 'sky') {
    return { ...data, slides: { ...data.slides, origin: { ...data.slides.origin, skyImage: source } } };
  }

  const backgroundSlides = {
    'origin-bg': 'origin',
    'food-bg': 'foods',
    'song-bg': 'songs',
    'favorite-moment': 'favoriteMoment',
    'series-bg': 'relationshipSeries',
  } as const;

  if (slot in backgroundSlides) {
    const slideKey = backgroundSlides[slot as keyof typeof backgroundSlides];
    return {
      ...data,
      slides: {
        ...data.slides,
        [slideKey]: { ...data.slides[slideKey], backgroundImage: source },
      },
    };
  }

  if (slot === 'intro' || slot === 'introSecondary' || slot === 'summary') {
    return { ...data, heroImages: { ...data.heroImages, [slot]: source } };
  }

  if (typeof slot === 'string' && slot.startsWith('memory-')) {
    const index = Number(slot.replace('memory-', ''));
    return {
      ...data,
      memoryPhotos: data.memoryPhotos.map((photo, photoIndex) => photoIndex === index ? { ...photo, image: source } : photo),
    };
  }

  return {
    ...data,
    slides: {
      ...data.slides,
      summary: {
        ...data.slides.summary,
        cells: data.slides.summary.cells.map((cell, index) => index === slot ? { ...cell, image: source } : cell),
      },
    },
  };
};
