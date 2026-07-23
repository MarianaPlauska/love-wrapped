import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Pause, Play, Share2, Volume2, VolumeX } from 'lucide-react';

import { OwnerAccess } from './components/OwnerAccess';
import { SetupPanel } from './components/SetupPanel';
import { FavoriteMomentSlide } from './components/Slides/FavoriteMomentSlide';
import { FoodAnswerSlide } from './components/Slides/FoodAnswerSlide';
import { HoursStorySlide } from './components/Slides/HoursStorySlide';
import { IntroSlide } from './components/Slides/IntroSlide';
import { MemoriesSlide } from './components/Slides/MemoriesSlide';
import { MetricsSlide } from './components/Slides/MetricsSlide';
import { MusicPlayerSlide } from './components/Slides/MusicPlayerSlide';
import { OriginSlide } from './components/Slides/OriginSlide';
import { PlacesMapSlide } from './components/Slides/PlacesMapSlide';
import { RelationshipSeriesSlide } from './components/Slides/RelationshipSeriesSlide';
import { SpotifyStorySlide } from './components/Slides/SpotifyStorySlide';
import { TapRevealRankingSlide } from './components/Slides/TapRevealRankingSlide';
import { WheelSlide } from './components/Slides/WheelSlide';
import { SummarySlide } from './components/Slides/SummarySlide';
import { VersusSlide } from './components/Slides/VersusSlide';
import { YearPosterSlide } from './components/Slides/YearPosterSlide';
import { LoveReasonsSlide } from './components/Slides/LoveReasonsSlide';
import { LoveLetterSlide } from './components/Slides/LoveLetterSlide';
import { TimelineSlide } from './components/Slides/TimelineSlide';
import wrappedData, { type WrappedData } from './data/wrappedData';
import { canManageGifts, loadOwnerGift, loadSharedGift, saveOwnerGift } from './lib/giftRepository';
import { isSupabaseConfigured, supabase } from './lib/supabase';
import { audioThemes } from './utils/audio';
import { beginSpotifyImport, consumeSpotifyImport, isSpotifyImportConfigured } from './utils/spotifyAuth';
import { loadWrappedData, normalizeWrappedData, resetWrappedData, saveWrappedData } from './utils/wrappedStorage';
import { getSongCoverImage } from './utils/wrappedImages';

const slides = [
  'intro', 'origin', 'hours-story', 'metrics',
  'food-reveal', 'food-answer', 'song-reveal', 'music-player', 'spotify-story',
  'favorite-moment', 'relationship-series', 'places-map',
  'memories', 'versus-1', 'versus-2', 'year-poster', 'wheel',
  'love-letter', 'timeline', 'love-reasons', 'summary',
] as const;
const progressUpdateMs = 32;

type SlideKey = (typeof slides)[number];

const clampIndex = (index: number): number => {
  if (index < 0) return slides.length - 1;
  if (index >= slides.length) return 0;
  return index;
};

const getDaysTogether = (startDate: string): number => {
  const start = new Date(startDate).getTime();
  if (Number.isNaN(start)) return 0;
  const differenceInMilliseconds = Date.now() - start;
  return Math.max(0, Math.floor(differenceInMilliseconds / 86_400_000));
};

export default function App() {
  const [data, setData] = useState<WrappedData>(() => loadWrappedData(wrappedData));
  const [isAdminRoute, setIsAdminRoute] = useState(() => {
    const parameters = new URLSearchParams(window.location.search);
    return window.location.hash === '#admin' || window.location.hash.startsWith('#error=') || parameters.get('admin') === '1';
  });
  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState(false);
  const [ownerAccess, setOwnerAccess] = useState<'unknown' | 'granted' | 'denied'>('unknown');
  const [isOwnerGiftLoaded, setIsOwnerGiftLoaded] = useState(false);
  const [ownerGiftLoadError, setOwnerGiftLoadError] = useState('');
  const [ownerGiftId, setOwnerGiftId] = useState<string | undefined>();
  const [shareUrl, setShareUrl] = useState<string | undefined>();
  const [isSharedGiftLoading, setIsSharedGiftLoading] = useState(() => Boolean(new URLSearchParams(window.location.search).get('gift')));
  const [sharedGiftError, setSharedGiftError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [shareFeedback, setShareFeedback] = useState('');
  const [audioHintVisible, setAudioHintVisible] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressTimerRef = useRef<number | null>(null);
  const progressRef = useRef(0);
  const pointerStartX = useRef<number | null>(null);
  const pointerStartY = useRef<number | null>(null);
  const pointerStartTime = useRef<number>(0);

  const currentSlide = slides[currentIndex] as SlideKey;
  const daysTogether = useMemo(() => getDaysTogether(data.startDate), [data.startDate]);
  const hoursTogether = useMemo(() => daysTogether * 24, [daysTogether]);
  const currentAudioSource = useMemo(() => audioThemes.find((theme) => theme.id === data.audioTheme)?.source ?? audioThemes[0].source, [data.audioTheme]);
  const songCoverImage = useMemo(() => getSongCoverImage(data), [data]);
  const authError = useMemo(() => {
    if (!window.location.hash.startsWith('#error=')) return '';
    const parameters = new URLSearchParams(window.location.hash.slice(1));
    return parameters.get('error_code') === 'otp_expired'
      ? 'Este link expirou ou já foi usado. Solicite um novo link abaixo e abra apenas o email mais recente.'
      : 'Não foi possível concluir o acesso. Solicite um novo link abaixo.';
  }, []);
  const isLocalEditor = isAdminRoute && !isSupabaseConfigured;
  const canOpenEditor = !new URLSearchParams(window.location.search).get('gift');
  const isRemoteEditorReady = isAdminRoute && isOwnerAuthenticated && ownerAccess === 'granted' && isOwnerGiftLoaded;
  const isSetupOpen = isLocalEditor || isRemoteEditorReady;

  useEffect(() => {
    const updateRoute = () => {
      const parameters = new URLSearchParams(window.location.search);
      setIsAdminRoute(window.location.hash === '#admin' || window.location.hash.startsWith('#error=') || parameters.get('admin') === '1');
    };
    window.addEventListener('hashchange', updateRoute);
    window.addEventListener('popstate', updateRoute);
    return () => {
      window.removeEventListener('hashchange', updateRoute);
      window.removeEventListener('popstate', updateRoute);
    };
  }, []);

  useEffect(() => {
    if (!isOwnerAuthenticated || ownerAccess !== 'granted' || !isSupabaseConfigured) {
      setIsOwnerGiftLoaded(false);
      setOwnerGiftLoadError('');
      return;
    }

    let isActive = true;
    setIsOwnerGiftLoaded(false);
    setOwnerGiftLoadError('');

    void loadOwnerGift()
      .then((gift) => {
        if (!isActive) return;
        if (gift) {
          setData(normalizeWrappedData(gift.payload, wrappedData));
          setOwnerGiftId(gift.id);
          setShareUrl(`${window.location.origin}${window.location.pathname}?gift=${gift.share_token}`);
        }
        setIsOwnerGiftLoaded(true);
      })
      .catch((error: unknown) => {
        if (!isActive) return;
        setOwnerGiftLoadError(error instanceof Error ? error.message : 'Não foi possível carregar o presente salvo.');
      });

    return () => {
      isActive = false;
    };
  }, [isOwnerAuthenticated, ownerAccess]);

  useEffect(() => {
    if (!isOwnerAuthenticated || !isSupabaseConfigured) {
      setOwnerAccess('unknown');
      return;
    }

    void canManageGifts().then((canManage) => setOwnerAccess(canManage ? 'granted' : 'denied'));
  }, [isOwnerAuthenticated]);

  useEffect(() => {
    if (!isOwnerAuthenticated || !isSpotifyImportConfigured) return;

    void consumeSpotifyImport()
      .then((tracks) => {
        if (!tracks?.length) return;
        setData((current) => ({
          ...current,
          spotify: { ...current.spotify, featuredUri: tracks[0].uri },
          slides: {
            ...current.slides,
            songs: {
              ...current.slides.songs,
              entries: current.slides.songs.entries.map((entry, index) => {
                const track = tracks[index];
                return track ? { ...entry, title: track.name, subtitle: track.artist, detail: 'A música importada do Spotify.' } : entry;
              }),
            },
          },
        }));
      })
      .catch(() => undefined);
  }, [isOwnerAuthenticated]);

  useEffect(() => {
    const shareToken = new URLSearchParams(window.location.search).get('gift');
    if (!shareToken || !isSupabaseConfigured) {
      setIsSharedGiftLoading(false);
      return;
    }

    void loadSharedGift(shareToken)
      .then((sharedData) => {
        setShareUrl(`${window.location.origin}${window.location.pathname}?gift=${shareToken}`);
        setData(normalizeWrappedData(sharedData, wrappedData));
      })
      .catch(() => setSharedGiftError('Este presente não está disponível ou o link está incorreto.'))
      .finally(() => setIsSharedGiftLoading(false));
  }, []);

  useEffect(() => {
    if (!supabase) return;

    void supabase.auth.getSession().then(({ data: sessionData }) => setIsOwnerAuthenticated(Boolean(sessionData.session)));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsOwnerAuthenticated(Boolean(session));
      if (!session) setOwnerAccess('unknown');
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const isInteractiveSlide = currentSlide === 'food-reveal' || currentSlide === 'song-reveal' || currentSlide === 'wheel';

  useEffect(() => {
    progressRef.current = 0;
    setProgress(0);
  }, [currentIndex]);

  useEffect(() => {
    if (isSetupOpen || isPaused || isHolding || isInteractiveSlide) return;

    const startedAt = performance.now() - (progressRef.current * data.slideDurationMs);

    const tick = () => {
      const elapsed = performance.now() - startedAt;
      const nextProgress = Math.min(1, elapsed / data.slideDurationMs);
      progressRef.current = nextProgress;
      setProgress(nextProgress);

      if (nextProgress >= 1) {
        progressRef.current = 0;
        setCurrentIndex((value) => clampIndex(value + 1));
        return;
      }

      progressTimerRef.current = window.setTimeout(tick, progressUpdateMs);
    };

    progressTimerRef.current = window.setTimeout(tick, progressUpdateMs);

    return () => {
      if (progressTimerRef.current !== null) window.clearTimeout(progressTimerRef.current);
    };
  }, [currentIndex, data.slideDurationMs, isSetupOpen, isPaused, isHolding, isInteractiveSlide]);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    audioElement.loop = true;
    audioElement.volume = 0.35;

    if (audioEnabled && !isSetupOpen) {
      void audioElement.play().catch(() => undefined);
      return;
    }

    audioElement.pause();
  }, [audioEnabled, isSetupOpen]);

  const moveSlide = (direction: 'previous' | 'next') => {
    progressRef.current = 0;
    setProgress(0);
    setCurrentIndex((value) => clampIndex(direction === 'previous' ? value - 1 : value + 1));
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    pointerStartX.current = event.clientX;
    pointerStartY.current = event.clientY;
    pointerStartTime.current = performance.now();
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsHolding(true);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    setIsHolding(false);
    if (pointerStartX.current == null || pointerStartY.current == null) return;

    const deltaX = event.clientX - pointerStartX.current;
    const deltaY = event.clientY - pointerStartY.current;
    const deltaTime = performance.now() - pointerStartTime.current;
    const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
    const swipeThreshold = 56;
    const target = event.target as HTMLElement;
    const isInteractiveControl = Boolean(target.closest('button, a, input, select, textarea, label'));

    if (isHorizontal && Math.abs(deltaX) > swipeThreshold && deltaTime < 600) {
      moveSlide(deltaX > 0 ? 'previous' : 'next');
    } else if (Math.abs(deltaX) < 12 && Math.abs(deltaY) < 12 && deltaTime < 350 && !isInteractiveControl) {
      const bounds = event.currentTarget.getBoundingClientRect();
      moveSlide(event.clientX < bounds.left + (bounds.width * 0.34) ? 'previous' : 'next');
    }

    pointerStartX.current = null;
    pointerStartY.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const cancelPointerInteraction = () => {
    pointerStartX.current = null;
    pointerStartY.current = null;
    setIsHolding(false);
  };

  const handleShare = async () => {
    const shareToken = new URLSearchParams(window.location.search).get('gift');
    const url = shareUrl ?? (shareToken ? `${window.location.origin}${window.location.pathname}?gift=${shareToken}` : window.location.href);
    try {
      if (navigator.share) {
        await navigator.share({ title: data.title, text: 'Wrapped das Mariannnas', url });
        setShareFeedback('Presente compartilhado.');
      } else {
        await navigator.clipboard.writeText(url);
        setShareFeedback('Link copiado.');
      }
      window.setTimeout(() => setShareFeedback(''), 2500);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setShareFeedback('Não foi possível compartilhar este link.');
    }
  };

  const handleSave = async (nextData: WrappedData): Promise<string | undefined> => {
    const theme = audioThemes.find((item) => item.id === nextData.audioTheme);
    const dataWithAudio = theme ? { ...nextData, audio: { label: theme.label, source: theme.source } } : nextData;

    if (isSupabaseConfigured) {
      const gift = await saveOwnerGift(dataWithAudio, ownerGiftId);
      setOwnerGiftId(gift.id);
      const nextShareUrl = `${window.location.origin}${window.location.pathname}?gift=${gift.share_token}`;
      setShareUrl(nextShareUrl);
      setData(normalizeWrappedData(gift.payload, wrappedData));
      setCurrentIndex(0);
      return nextShareUrl;
    } else {
      saveWrappedData(dataWithAudio);
    }

    setData(dataWithAudio);
    setCurrentIndex(0);
    return undefined;
  };

  const handleRestoreDefaults = () => {
    resetWrappedData();
    setData(wrappedData);
    setCurrentIndex(0);
    window.location.hash = '';
  };

  const handleSpotifyImport = async () => {
    await beginSpotifyImport();
  };

  const renderCurrentSlide = () => {
    if (currentSlide === 'origin') {
      return <OriginSlide data={data.slides.origin} palette={data.palettes.intro} />;
    }

    if (currentSlide === 'hours-story') {
      return <HoursStorySlide hoursTogether={hoursTogether} data={data.slides.hoursStory} palette={data.palettes.metrics} />;
    }

    if (currentSlide === 'spotify-story') {
      return (
        <SpotifyStorySlide
          data={data.slides.spotifyStory}
          palette={data.palettes.summary}
          song={data.slides.songs.entries[0]}
          coverImage={songCoverImage ?? data.heroImages[data.slides.spotifyStory.coverSlot]}
          spotifyUri={data.spotify.featuredUri}
        />
      );
    }

    if (currentSlide === 'wheel') {
      return <WheelSlide data={data.slides.wheel} palette={data.palettes.tracks} />;
    }

    if (currentSlide === 'places-map') {
      return <PlacesMapSlide data={data.slides.placesMap} palette={data.palettes.intro} />;
    }

    if (currentSlide === 'food-reveal') {
      return <TapRevealRankingSlide data={data.slides.foods} palette={data.palettes.tracks} category="food" onReveal={() => moveSlide('next')} />;
    }

    if (currentSlide === 'food-answer') {
      return <FoodAnswerSlide data={data.slides.foods} palette={data.palettes.tracks} />;
    }

    if (currentSlide === 'song-reveal') {
      return <TapRevealRankingSlide data={data.slides.songs} palette={data.palettes.summary} category="music" onReveal={() => moveSlide('next')} />;
    }

    if (currentSlide === 'music-player') {
      return <MusicPlayerSlide data={data.slides.songs} palette={data.palettes.summary} spotifyUri={data.spotify.featuredUri} coverImage={songCoverImage} />;
    }

    switch (currentSlide) {
      case 'intro':
        return <IntroSlide data={data.slides.intro} palette={data.palettes.intro} heroImage={data.heroImages.intro} secondaryHeroImage={data.heroImages.introSecondary} year={data.year} coupleNames={data.coupleNames} />;
      case 'metrics':
        return <MetricsSlide daysTogether={daysTogether} data={data.slides.metrics} palette={data.palettes.metrics} />;
      case 'favorite-moment':
        return <FavoriteMomentSlide data={data.slides.favoriteMoment} palette={data.palettes.tracks} />;
      case 'relationship-series':
        return <RelationshipSeriesSlide data={data.slides.relationshipSeries} palette={data.palettes.genre} />;
      case 'memories':
        return <MemoriesSlide data={data.slides.memories} palette={data.palettes.tracks} photos={data.memoryPhotos} />;
      case 'versus-1':
        return <VersusSlide data={data.slides.versus} palette={data.palettes.genre} page={0} />;
      case 'versus-2':
        return <VersusSlide data={data.slides.versus} palette={data.palettes.genre} page={1} />;
      case 'year-poster':
        return <YearPosterSlide data={data.slides.yearPoster} palette={data.palettes.summary} coupleNames={data.coupleNames} year={data.year} />;
      case 'love-reasons':
        return <LoveReasonsSlide data={data.slides.loveReasons} palette={data.palettes.summary} />;
      case 'love-letter':
        return <LoveLetterSlide data={data.slides.loveLetter} palette={data.palettes.summary} coupleNames={data.coupleNames} />;
      case 'timeline':
        return <TimelineSlide data={data.slides.timeline} palette={data.palettes.summary} />;
      case 'summary':
        return <SummarySlide data={data.slides.summary} palette={data.palettes.summary} daysTogether={daysTogether} coupleNames={data.coupleNames} year={data.year} food={data.slides.foods.entries[0]?.title ?? 'Pizza'} song={data.slides.songs.entries[0]?.title ?? 'Nossa música'} favoriteMoment={data.slides.favoriteMoment.title} relationshipSeries={data.slides.relationshipSeries.title} memoryCount={data.memoryPhotos.length} verdictCount={data.slides.versus.items.length} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[100dvh] overflow-hidden bg-zinc-950 text-white">
      <div className="mx-auto h-[100dvh] w-full max-w-[430px] bg-zinc-950">
        {isSharedGiftLoading ? (
          <div className="flex h-full items-center justify-center px-8 text-center">
            <p className="font-display text-3xl leading-tight text-lime-300">Preparando seu presente...</p>
          </div>
        ) : sharedGiftError ? (
          <div className="flex h-full items-center justify-center px-8 text-center">
            <div>
              <p className="font-display text-3xl leading-tight text-rose-300">Presente indisponível</p>
              <p className="mt-4 text-sm leading-6 text-white/60">{sharedGiftError}</p>
            </div>
          </div>
        ) : ownerGiftLoadError && isAdminRoute && ownerAccess === 'granted' ? (
          <div className="flex h-full items-center justify-center px-8 text-center">
            <div>
              <p className="font-display text-3xl leading-tight text-rose-300">Não foi possível abrir o editor</p>
              <p className="mt-4 text-sm leading-6 text-white/60">Seus dados não foram substituídos. Recarregue a página para tentar buscar novamente na Supabase.</p>
              <p className="mt-3 break-words text-xs leading-5 text-rose-200/70">{ownerGiftLoadError}</p>
              <button type="button" onClick={() => window.location.reload()} className="mt-6 rounded-xl bg-lime-300 px-5 py-3 text-sm font-bold text-zinc-950">Tentar novamente</button>
            </div>
          </div>
        ) : isAdminRoute && isOwnerAuthenticated && ownerAccess === 'granted' && !isOwnerGiftLoaded ? (
          <div className="flex h-full items-center justify-center px-8 text-center">
            <div>
              <p className="font-display text-3xl leading-tight text-lime-300">Carregando seu presente salvo...</p>
              <p className="mt-4 text-sm leading-6 text-white/60">O editor só será aberto depois de confirmar os dados na Supabase.</p>
            </div>
          </div>
        ) : isSetupOpen ? (
          <SetupPanel key={ownerGiftId ?? 'new-gift'} data={data} shareUrl={shareUrl} spotifyImportAvailable={isSpotifyImportConfigured} onClose={() => { window.location.assign(shareUrl ?? window.location.pathname); }} onRestoreDefaults={handleRestoreDefaults} onSave={handleSave} onSpotifyImport={handleSpotifyImport} />
        ) : isAdminRoute ? (
          <OwnerAccess accessDenied={ownerAccess === 'denied'} accessError={authError} />
        ) : (
          <div className="relative flex h-full flex-col overflow-hidden bg-zinc-950">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(163,230,53,0.13),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.16),_transparent_36%)]" />
            <audio ref={audioRef} src={currentAudioSource} preload="auto" playsInline loop />

            <header className="relative z-30 shrink-0 px-4 pt-3 sm:pt-4">
              <div className="mb-2 flex items-center justify-between gap-3 text-[0.67rem] uppercase tracking-[0.2em] text-white/50 sm:mb-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="truncate">{data.title}</span>
                  {canOpenEditor && (
                    <button type="button" onClick={() => { window.location.assign(`${window.location.pathname}?admin=1`); }} className="shrink-0 font-semibold text-lime-300 hover:text-lime-200">
                      Editar
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { void handleShare(); }}
                    aria-label="Compartilhar presente"
                    title="Compartilhar presente"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/8 text-white/80 backdrop-blur transition hover:bg-white/12"
                  >
                    <Share2 aria-hidden="true" size={17} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPaused((value) => !value)}
                    aria-label={isPaused ? 'Continuar carrossel' : 'Pausar carrossel'}
                    title={isPaused ? 'Continuar carrossel' : 'Pausar carrossel'}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/8 text-white/80 backdrop-blur transition hover:bg-white/12"
                  >
                    {isPaused ? <Play aria-hidden="true" size={17} /> : <Pause aria-hidden="true" size={17} />}
                  </button>
                  <button type="button" onClick={() => { setAudioEnabled((value) => !value); setAudioHintVisible(false); }} aria-label={audioEnabled ? 'Desligar áudio' : 'Ligar áudio'} title={audioEnabled ? 'Desligar trilha de fundo' : 'Ligar trilha de fundo'} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/8 text-white/80 backdrop-blur transition hover:bg-white/12">{audioEnabled ? <Volume2 aria-hidden="true" size={17} /> : <VolumeX aria-hidden="true" size={17} />}</button>
                </div>
              </div>
              {!audioEnabled && audioHintVisible && currentIndex < 3 && (
                <p className="mb-2 text-right text-[0.65rem] normal-case tracking-normal text-white/55">
                  Toque no ícone de som para a trilha de fundo
                </p>
              )}
              {shareFeedback && <p role="status" className="mb-2 text-right text-[0.65rem] normal-case tracking-normal text-lime-200">{shareFeedback}</p>}
              <div className="grid gap-0.5 sm:gap-1" style={{ gridTemplateColumns: `repeat(${slides.length}, minmax(0, 1fr))` }}>
                {slides.map((slide, index) => {
                  const fill = index < currentIndex ? 1 : index === currentIndex ? progress : 0;
                  return (
                    <div key={slide} className="h-1 overflow-hidden rounded-full bg-white/10 sm:h-1.5">
                      <motion.div className="h-full rounded-full bg-lime-400" initial={false} animate={{ scaleX: fill }} transition={{ ease: 'linear', duration: 0.02 }} style={{ transformOrigin: 'left' }} />
                    </div>
                  );
                })}
              </div>
            </header>

            <div
              className="relative z-10 min-h-0 flex-1 touch-none px-3 pb-2 pt-3 sm:pb-3 sm:pt-4"
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerCancel={cancelPointerInteraction}
              onPointerLeave={(event) => { if (event.pointerType === 'mouse') cancelPointerInteraction(); }}
            >
              <div className="relative z-10 h-full w-full overflow-hidden rounded-[2rem]">
                <AnimatePresence mode="wait">
                  <motion.div key={currentSlide} initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -24, scale: 0.98 }} transition={{ duration: 0.42, ease: 'easeOut' }} className="h-full">
                    {renderCurrentSlide()}
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}