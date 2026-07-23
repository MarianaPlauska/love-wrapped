import { motion } from 'framer-motion';

import type { WrappedData } from '../../data/wrappedData';
import { SlidePill, SlideSurface } from './Shared';

type HoursStorySlideProps = {
  hoursTogether: number;
  data: WrappedData['slides']['hoursStory'];
  palette: WrappedData['palettes']['metrics'];
};

export const HoursStorySlide = ({ hoursTogether, data, palette }: HoursStorySlideProps) => {
  const digits = String(hoursTogether.toLocaleString('pt-BR')).split('');
  const rows = 6;

  return (
    <SlideSurface palette={palette} className="justify-between overflow-hidden">
      <div className="relative z-10 flex-none px-6 pt-6">
        <SlidePill>{data.label}</SlidePill>
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-center px-6 py-2">
        {/* Fundo animado: números repetidos subindo */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center overflow-hidden opacity-[0.12]">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <motion.p
              key={rowIndex}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + rowIndex * 0.1, duration: 0.6 }}
              className="font-display text-[4.2rem] font-black leading-[0.78] tracking-[-0.06em] text-white"
            >
              {hoursTogether.toLocaleString('pt-BR')}
            </motion.p>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 text-center text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/60"
        >
          {data.subcopy}
        </motion.p>

        <div className="relative z-10 mt-2 flex justify-center overflow-hidden font-display text-[5.5rem] font-black leading-none tracking-[-0.06em] text-white">
          {digits.map((char, index) => (
            <motion.span
              key={`${hoursTogether}-${index}`}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 160, damping: 13, delay: index * 0.06 }}
              className={char === '.' ? 'mx-1' : ''}
            >
              {char}
            </motion.span>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="relative z-10 mt-2 text-center text-lg font-black uppercase tracking-[-0.02em] text-lime-300"
        >
          {data.headline}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="relative z-10 mx-6 mb-6 rounded-2xl bg-white/8 p-4 backdrop-blur-sm"
      >
        <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-lime-300">Fato curioso</p>
        <p className="mt-2 text-sm font-medium leading-relaxed text-white/90">{data.funFact}</p>
      </motion.div>
    </SlideSurface>
  );
};
