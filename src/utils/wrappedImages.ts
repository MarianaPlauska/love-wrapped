import type { WrappedData } from '../data/wrappedData';

export type ImageSlot = 'intro' | 'introSecondary' | 'summary' | 'origin-bg' | 'food-bg' | 'song-bg' | 'favorite-moment' | 'series-bg' | 'sky' | 'memory-0' | 'memory-1' | 'memory-2' | 'memory-3' | 'timeline-0' | 'timeline-1' | 'timeline-2' | 'timeline-3' | 'timeline-4' | 0 | 1 | 2 | 3;

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

export const getWrappedImage = (data: WrappedData, slot: ImageSlot): string | undefined => {
  if (slot === 'sky') {
    return data.slides.origin.skyImage;
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
    return (data.slides[slideKey] as { backgroundImage: string }).backgroundImage;
  }

  if (slot === 'intro' || slot === 'introSecondary' || slot === 'summary') {
    return data.heroImages[slot];
  }

  if (typeof slot === 'string' && slot.startsWith('memory-')) {
    const index = Number(slot.replace('memory-', ''));
    return data.memoryPhotos[index]?.image;
  }

  if (typeof slot === 'string' && slot.startsWith('timeline-')) {
    const index = Number(slot.replace('timeline-', ''));
    return data.slides.timeline?.events[index]?.image;
  }

  return data.slides.summary.cells[slot as number]?.image;
};

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

  if (typeof slot === 'string' && slot.startsWith('timeline-')) {
    const index = Number(slot.replace('timeline-', ''));
    return {
      ...data,
      slides: {
        ...data.slides,
        timeline: {
          ...(data.slides.timeline ?? { label: '', headline: '', subcopy: '', events: [] }),
          events: (data.slides.timeline?.events ?? []).map((event, eventIndex) => eventIndex === index ? { ...event, image: source } : event),
        },
      },
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
