import type { WrappedData } from '../data/wrappedData';

const storageKey = 'love-wrapped-data-v1';

export const normalizeWrappedData = (data: Partial<WrappedData>, fallback: WrappedData): WrappedData => {
  const storedSlides = data.slides as Partial<WrappedData['slides']> | undefined;
  const isCurrentSchema = data.schemaVersion === fallback.schemaVersion;
  const storedVersus = storedSlides?.versus;
  const versusItems = storedVersus
    ? [...storedVersus.items, ...fallback.slides.versus.items.slice(storedVersus.items.length)].slice(0, 10)
    : fallback.slides.versus.items;
  const storedHeroImages = data.heroImages?.intro === '/images/couple/cover.jpg'
    ? { ...data.heroImages, intro: fallback.heroImages.intro }
    : data.heroImages;
  const storedOrigin = storedSlides?.origin?.backgroundImage === '/images/couple/cover.jpg'
    ? { ...storedSlides.origin, backgroundImage: fallback.slides.origin.backgroundImage }
    : storedSlides?.origin;
  const storedFavoriteMoment = storedSlides?.favoriteMoment?.backgroundImage === '/images/couple/cover.jpg'
    ? { ...storedSlides.favoriteMoment, backgroundImage: fallback.slides.favoriteMoment.backgroundImage }
    : storedSlides?.favoriteMoment;
  const storedFoods = storedSlides?.foods?.backgroundImage === '/images/ranking/food-bg.svg'
    ? { ...storedSlides.foods, backgroundImage: fallback.slides.foods.backgroundImage }
    : storedSlides?.foods;
  const storedSongs = storedSlides?.songs?.backgroundImage === '/images/ranking/music-bg.svg'
    ? { ...storedSlides.songs, backgroundImage: fallback.slides.songs.backgroundImage }
    : storedSlides?.songs;

  return {
    ...fallback,
    ...data,
    schemaVersion: fallback.schemaVersion,
    audioTheme: data.audioTheme ?? 'love',
    audio: { ...fallback.audio, ...data.audio },
    spotify: { ...fallback.spotify, ...data.spotify },
    heroImages: { ...fallback.heroImages, ...storedHeroImages },
    memoryPhotos: data.memoryPhotos ?? fallback.memoryPhotos,
    palettes: {
      intro: { ...fallback.palettes.intro, ...data.palettes?.intro },
      metrics: { ...fallback.palettes.metrics, ...data.palettes?.metrics },
      genre: { ...fallback.palettes.genre, ...data.palettes?.genre },
      tracks: { ...fallback.palettes.tracks, ...data.palettes?.tracks },
      summary: { ...fallback.palettes.summary, ...data.palettes?.summary },
    },
    slides: {
      ...fallback.slides,
      ...storedSlides,
      intro: isCurrentSchema ? { ...fallback.slides.intro, ...storedSlides?.intro } : fallback.slides.intro,
      origin: { ...fallback.slides.origin, ...storedOrigin },
      foods: isCurrentSchema && storedFoods
        ? { ...fallback.slides.foods, ...storedFoods, entries: storedFoods.entries.slice(0, 1) }
        : fallback.slides.foods,
      songs: isCurrentSchema && storedSongs
        ? { ...fallback.slides.songs, ...storedSongs, entries: storedSongs.entries.slice(0, 1) }
        : fallback.slides.songs,
      favoriteMoment: { ...fallback.slides.favoriteMoment, ...storedFavoriteMoment },
      relationshipSeries: { ...fallback.slides.relationshipSeries, ...storedSlides?.relationshipSeries },
      versus: storedVersus
        ? { ...fallback.slides.versus, ...storedVersus, items: versusItems }
        : fallback.slides.versus,
      metrics: { ...fallback.slides.metrics, ...storedSlides?.metrics },
      hoursStory: { ...fallback.slides.hoursStory, ...storedSlides?.hoursStory },
      spotifyStory: { ...fallback.slides.spotifyStory, ...storedSlides?.spotifyStory },
      genre: { ...fallback.slides.genre, ...storedSlides?.genre },
      moments: { ...fallback.slides.moments, ...storedSlides?.moments },
      memories: { ...fallback.slides.memories, ...storedSlides?.memories },
      yearPoster: isCurrentSchema ? { ...fallback.slides.yearPoster, ...storedSlides?.yearPoster } : fallback.slides.yearPoster,
      loveReasons: { ...fallback.slides.loveReasons, ...storedSlides?.loveReasons },
      loveLetter: { ...fallback.slides.loveLetter, ...storedSlides?.loveLetter },
      timeline: storedSlides?.timeline
        ? { ...fallback.slides.timeline, ...storedSlides.timeline, events: storedSlides.timeline.events.slice(0, 5) }
        : fallback.slides.timeline,
      summary: isCurrentSchema ? { ...fallback.slides.summary, ...storedSlides?.summary } : fallback.slides.summary,
    },
  };
};

export const loadWrappedData = (fallback: WrappedData): WrappedData => {
  try {
    const storedValue = window.localStorage.getItem(storageKey);

    if (!storedValue) {
      return fallback;
    }

    const parsed = JSON.parse(storedValue) as Partial<WrappedData>;
    return normalizeWrappedData(parsed, fallback);
  } catch {
    return fallback;
  }
};

export const saveWrappedData = (data: WrappedData): boolean => {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
};

export const resetWrappedData = (): void => {
  window.localStorage.removeItem(storageKey);
};