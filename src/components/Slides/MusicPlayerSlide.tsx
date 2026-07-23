import { motion } from 'framer-motion';
import { Heart, Music2, Play, SkipBack, SkipForward } from 'lucide-react';

import type { WrappedData } from '../../data/wrappedData';
import { getSpotifyEmbedUrl } from '../../utils/spotify';
import { isRenderableImageSource } from '../../utils/wrappedImages';
import { SlidePill, SlideScrollBody, SlideSurface } from './Shared';

type MusicPlayerSlideProps = {
  data: WrappedData['slides']['songs'];
  palette: WrappedData['palettes']['summary'];
  spotifyUri: string;
  coverImage?: string;
};

export const MusicPlayerSlide = ({ data, palette, spotifyUri, coverImage }: MusicPlayerSlideProps) => {
  const song = data.entries[0];
  const spotifyEmbedUrl = getSpotifyEmbedUrl(spotifyUri, true);
  const spotifyOpenUrl = spotifyEmbedUrl?.replace('/embed/', '/').split('?')[0] ?? null;
  const resolvedCover = isRenderableImageSource(coverImage) ? coverImage : '/images/couple/memory-1.svg';

  return (
    <SlideSurface palette={palette} className="justify-between bg-zinc-950">
      <div className="relative z-20 flex shrink-0 items-center justify-between px-6 pt-6 text-white">
        <SlidePill>{data.label}</SlidePill>
        <span className="text-xs font-black uppercase tracking-[0.18em] text-[#1ed760]">Faixa da história</span>
      </div>

      <SlideScrollBody className="px-6 pb-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto aspect-square w-full max-w-[220px] overflow-hidden rounded-lg shadow-[0_24px_60px_rgba(30,215,96,0.25)] sm:max-w-[240px]"
        >
          {resolvedCover ? (
            <img src={resolvedCover} alt={song.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-zinc-900">
              <Music2 size={64} className="text-white/30" />
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
            className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#1ed760]"
            aria-label="Curtir"
          >
            <Heart size={18} fill="currentColor" />
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4"
        >
          <div className="h-1 overflow-hidden rounded-full bg-white/20">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '62%' }}
              transition={{ delay: 0.9, duration: 1.2 }}
              className="h-full bg-[#1ed760]"
            />
          </div>
          <div className="mt-2 flex justify-between text-[0.6rem] font-bold text-white/40">
            <span>1:24</span>
            <span>3:42</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-2 flex items-center justify-between px-2"
        >
          <button className="text-white/60 hover:text-white" aria-label="Voltar">
            <SkipBack size={24} fill="currentColor" />
          </button>
          {spotifyOpenUrl ? (
            <motion.a
              href={spotifyOpenUrl}
              target="_blank"
              rel="noreferrer"
              whileTap={{ scale: 0.92 }}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1ed760] text-zinc-950 shadow-lg shadow-[#1ed760]/30 sm:h-16 sm:w-16"
              aria-label="Ouvir no Spotify"
            >
              <Play size={26} fill="currentColor" className="ml-1" />
            </motion.a>
          ) : (
            <motion.button
              whileTap={{ scale: 0.92 }}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1ed760] text-zinc-950 shadow-lg shadow-[#1ed760]/30 sm:h-16 sm:w-16"
              aria-label="Play"
            >
              <Play size={26} fill="currentColor" className="ml-1" />
            </motion.button>
          )}
          <button className="text-white/60 hover:text-white" aria-label="Avançar">
            <SkipForward size={24} fill="currentColor" />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95 }}
          className="relative z-20 mt-5"
        >
          <div className="rounded-2xl bg-zinc-900/80 p-4 backdrop-blur-sm">
            <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#1ed760]">Sobre o casal</p>
            <p className="mt-2 text-sm font-medium leading-relaxed text-white/85">{song.detail}</p>
          </div>

          {spotifyEmbedUrl && (
            <p className="mt-3 text-center text-xs leading-5 text-white/55">
              No próximo slide, o player do Spotify toca a faixa que você escolheu.
            </p>
          )}
        </motion.div>
      </SlideScrollBody>
    </SlideSurface>
  );
};
