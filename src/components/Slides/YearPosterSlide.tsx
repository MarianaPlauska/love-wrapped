import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

import type { WrappedData } from '../../data/wrappedData';
import { SlidePill, SlideSurface } from './Shared';

type YearPosterSlideProps = {
  data: WrappedData['slides']['yearPoster'];
  palette: WrappedData['palettes']['summary'];
  coupleNames: string;
  year: number;
};

export const YearPosterSlide = ({ data, palette, coupleNames, year }: YearPosterSlideProps) => {
  const sparkles = Array.from({ length: 14 }, (_, index) => ({
    left: `${(index * 31 + 7) % 94}%`,
    top: `${(index * 47 + 9) % 88}%`,
    delay: (index % 7) * 0.2,
  }));

  return (
    <SlideSurface palette={palette} className="justify-between bg-black">
      <div className="flex items-center justify-between px-6 pt-6 text-[0.65rem] font-bold uppercase tracking-[0.24em] text-white/45">
        <span>{coupleNames || 'Nós duas'}</span>
        <span>{year}</span>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-7 text-center">
        {sparkles.map((sparkle, index) => (
          <motion.span key={index} aria-hidden="true" animate={{ opacity: [0.15, 1, 0.15], scale: [0.6, 1.35, 0.6], rotate: [0, 45, 90] }} transition={{ duration: 2.2, delay: sparkle.delay, repeat: Infinity }} style={{ left: sparkle.left, top: sparkle.top }} className="absolute text-lg text-lime-200">✦</motion.span>
        ))}
        <motion.div
          aria-hidden="true"
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: [0.4, 1.05, 0.9], opacity: [0, 0.65, 0.35] }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
          className="absolute h-64 w-64 rounded-full border-[30px] border-rose-500/35"
        />
        <motion.div animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 1.6, repeat: Infinity }} className="absolute text-rose-400/35">
          <Heart aria-hidden="true" size={210} fill="currentColor" strokeWidth={1} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: 'easeOut' }}
          className="relative z-10"
        >
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-lime-300">Antes de terminar</p>
          <h2 className="mx-auto mt-5 max-w-[11ch] font-display text-[2.35rem] leading-[0.92] text-white min-[390px]:text-[2.55rem] min-[430px]:text-[2.85rem]">
            {'Eu te amo eternamente, gatinha'.split(' ').map((word, index) => (
              <motion.span key={word} initial={{ opacity: 0, y: 25, filter: 'blur(7px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.55, delay: 0.45 + index * 0.14 }} className="mr-[0.2em] inline-block">{word}</motion.span>
            ))}
          </h2>
          <div className="mx-auto mt-7 h-1 w-20 bg-rose-500" />
          <p className="mx-auto mt-6 max-w-[26ch] text-sm leading-6 text-white/65">{data.quote}</p>
        </motion.div>
      </div>

      <p className="px-6 pb-6 text-center text-[0.65rem] uppercase tracking-[0.24em] text-white/40">
        Sempre nós duas
      </p>
    </SlideSurface>
  );
};
