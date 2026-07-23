import { motion } from 'framer-motion';
import { Heart, Play, SkipBack, SkipForward } from 'lucide-react';

import type { WrappedData } from '../../data/wrappedData';
import { getSpotifyEmbedUrl } from '../../utils/spotify';
import { SlidePill, SlideSurface } from './Shared';

type SpotifyStorySlideProps = {
  data: WrappedData['slides']['spotifyStory'];
  palette: WrappedData['palettes']['summary'];
  song: WrappedData['slides']['songs']['entries'][number];
  coverImage: string;
  spotifyUri: string;
};

export const SpotifyStorySlide = ({ data, palette, song, coverImage, spotifyUri }: SpotifyStorySlideProps) => {
  const embedUrl = getSpotifyEmbedUrl(spotifyUri, true) ?? '';

  return (
    <SlideSurface palette={palette} className="justify-between bg-zinc-950">
      <div className="relative z-20 flex items-center justify-between px-6 pt-6 text-white">
        <SlidePill>{data.label}</SlidePill>
        <span className="text-xs font-black uppercase tracking-[0.18em] text-[#1ed760]">Faixa da história</span>
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto aspect-[4/5] w-full max-w-[280px] overflow-hidden rounded-2xl shadow-[0_28px_70px_rgba(30,215,96,0.22)]"
        >
          {coverImage ? (
            <img src={coverImage} alt={song.title} className="h-full w-full object-cover" />
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
          className="mt-6 flex items-end justify-between"
        >
          <div className="min-w-0">
            <h2 className="truncate font-display text-3xl font-black leading-none text-white">{song.title}</h2>
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-5"
        >
          <div className="h-1.5 overflow-hidden rounded-full bg-white/20">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '58%' }}
              transition={{ delay: 0.9, duration: 1.2 }}
              className="h-full bg-[#1ed760]"
            />
          </div>
          <div className="mt-2 flex justify-between text-[0.65rem] font-bold text-white/40">
            <span>0:42</span>
            <span>3:18</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="mt-2 flex items-center justify-between px-2"
        >
          <button className="text-white/60" aria-label="Voltar">
            <SkipBack size={28} fill="currentColor" />
          </button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#1ed760] text-zinc-950 shadow-lg shadow-[#1ed760]/30"
            aria-label="Play"
          >
            <Play size={30} fill="currentColor" className="ml-1" />
          </motion.button>
          <button className="text-white/60" aria-label="Avançar">
            <SkipForward size={28} fill="currentColor" />
          </button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="relative z-20 px-6 pb-6"
      >
        <div className="rounded-2xl bg-zinc-900/80 p-4 backdrop-blur-sm">
          <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#1ed760]">Sobre o casal</p>
          <p className="mt-2 text-sm font-medium leading-relaxed text-white/85">{song.detail}</p>
        </div>

        {embedUrl && (
          <iframe
            src={embedUrl}
            width="100%"
            height="80"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Spotify player"
            className="mt-3 rounded-xl"
          />
        )}
      </motion.div>
    </SlideSurface>
  );
};
