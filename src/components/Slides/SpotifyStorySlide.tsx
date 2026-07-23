import { motion } from 'framer-motion';
import { Heart, Play, SkipBack, SkipForward } from 'lucide-react';

import type { WrappedData } from '../../data/wrappedData';
import { getSpotifyEmbedUrl } from '../../utils/spotify';
import { isRenderableImageSource } from '../../utils/wrappedImages';
import { SlidePill, SlideScrollBody, SlideSurface } from './Shared';

type SpotifyStorySlideProps = {
  data: WrappedData['slides']['spotifyStory'];
  palette: WrappedData['palettes']['summary'];
  song: WrappedData['slides']['songs']['entries'][number];
  coverImage: string;
  spotifyUri: string;
};

export const SpotifyStorySlide = ({ data, palette, song, coverImage, spotifyUri }: SpotifyStorySlideProps) => {
  const embedUrl = getSpotifyEmbedUrl(spotifyUri, true) ?? '';
  const resolvedCover = isRenderableImageSource(coverImage) ? coverImage : undefined;

  return (
    <SlideSurface palette={palette} className="justify-between bg-zinc-950">
      <div className="relative z-20 flex shrink-0 items-center justify-between px-6 pt-6 text-white">
        <SlidePill>{data.label}</SlidePill>
        <span className="text-xs font-black uppercase tracking-[0.18em] text-[#1ed760]">Player Spotify</span>
      </div>

      <SlideScrollBody className="px-6 pb-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto aspect-square w-full max-w-[220px] overflow-hidden rounded-2xl shadow-[0_28px_70px_rgba(30,215,96,0.22)] sm:max-w-[240px]"
        >
          {resolvedCover ? (
            <img src={resolvedCover} alt={song.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-zinc-900">
              <span className="text-white/30">Sem foto</span>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-5 flex items-end justify-between"
        >
          <div className="min-w-0">
            <h2 className="truncate font-display text-2xl font-black leading-none text-white sm:text-3xl">{song.title}</h2>
            <p className="mt-2 truncate text-sm font-semibold text-white/70">{song.subtitle}</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="ml-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#1ed760]"
            aria-label="Curtir"
          >
            <Heart size={20} fill="currentColor" />
          </motion.button>
        </motion.div>

        {(data.headline || data.subcopy) && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4"
          >
            {data.headline && <p className="text-lg font-semibold leading-tight text-white">{data.headline}</p>}
            {data.subcopy && <p className="mt-1 text-sm text-white/65">{data.subcopy}</p>}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="relative z-20 mt-5"
        >
          <div className="rounded-2xl bg-zinc-900/80 p-4 backdrop-blur-sm">
            <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#1ed760]">Sobre o casal</p>
            <p className="mt-2 text-sm font-medium leading-relaxed text-white/85">{song.detail}</p>
          </div>

          {embedUrl && (
            <>
              <p className="mt-3 text-center text-xs leading-5 text-white/55">
                Toque em play no player abaixo para ouvir no Spotify.
              </p>
              <iframe
                src={embedUrl}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="Spotify player"
                className="mt-3 rounded-xl"
              />
            </>
          )}
        </motion.div>
      </SlideScrollBody>
    </SlideSurface>
  );
};
