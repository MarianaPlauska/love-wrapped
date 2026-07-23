import { motion } from 'framer-motion';
import { Music2 } from 'lucide-react';

import type { WrappedData } from '../../data/wrappedData';
import { getSpotifyEmbedUrl } from '../../utils/spotify';
import { SlidePill, SlideSurface } from './Shared';

type MusicPlayerSlideProps = {
  data: WrappedData['slides']['songs'];
  palette: WrappedData['palettes']['summary'];
  spotifyUri: string;
};

export const MusicPlayerSlide = ({ data, palette, spotifyUri }: MusicPlayerSlideProps) => {
  const song = data.entries[0];
  const spotifyEmbedUrl = getSpotifyEmbedUrl(spotifyUri);

  return (
    <SlideSurface palette={palette} className="justify-between bg-[#1ed760]">
      <div className="relative z-20 flex items-center justify-between px-6 pt-6 text-zinc-950">
        <SlidePill>{data.label}</SlidePill>
        <span className="text-xs font-black uppercase tracking-[0.18em]">Faixa da história</span>
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-center overflow-hidden px-7 text-zinc-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute -right-20 top-16 h-72 w-72 rounded-full border-[70px] border-zinc-950 shadow-[0_0_0_12px_rgba(24,24,27,0.2)]"
        >
          <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1ed760]" />
        </motion.div>

        <motion.p initial={{ opacity: 0, x: -80 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65 }} className="relative z-10 text-xs font-black uppercase tracking-[0.28em]">
          {song.subtitle}
        </motion.p>
        <motion.h2 initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} className="relative z-10 mt-5 max-w-[8ch] font-display text-[4.6rem] leading-[0.82]">
          {song.title}
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="relative z-10 mt-6 max-w-[25ch] text-sm font-semibold leading-6">
          {song.detail}
        </motion.p>
      </div>

      <motion.div initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="relative z-20 px-5 pb-6">
        {spotifyEmbedUrl ? (
          <div className="overflow-hidden rounded-md bg-black shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            <iframe
              title="Nossa música no Spotify"
              src={spotifyEmbedUrl}
              width="100%"
              height="152"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="flex items-center gap-4 rounded-md bg-zinc-950 p-5 text-white">
            <Music2 aria-hidden="true" className="shrink-0 text-[#1ed760]" size={32} />
            <p className="text-sm leading-6 text-white/70">Escolha a faixa no editor para tocar pelo player do Spotify.</p>
          </div>
        )}
      </motion.div>
    </SlideSurface>
  );
};
