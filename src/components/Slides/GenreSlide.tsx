import { motion } from 'framer-motion';

import type { WrappedData } from '../../data/wrappedData';
import { SlidePill, SlideSurface } from './Shared';

type GenreSlideProps = {
  data: WrappedData['slides']['genre'];
  palette: WrappedData['palettes']['genre'];
};

export const GenreSlide = ({ data, palette }: GenreSlideProps) => {
  return (
    <SlideSurface palette={palette} className="justify-between">
      <div className="px-6 pt-6">
        <SlidePill>{data.label}</SlidePill>
      </div>
      <div className="flex flex-1 items-center px-6 pb-10 pt-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="w-full space-y-4"
        >
          <div className="grid grid-cols-[1.15fr_0.85fr] gap-3">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.24em] text-white/60">Gênero mais vivido</p>
              <p className="mt-3 font-display text-2xl leading-tight text-white">{data.genre}</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4 backdrop-blur">
              <div className="flex h-full flex-col justify-between">
                <p className="text-xs uppercase tracking-[0.24em] text-white/60">Caos</p>
                <div className="text-5xl font-display leading-none text-white">{data.percentage}%</div>
              </div>
            </div>
          </div>
          <div className="space-y-3 rounded-[1.5rem] border border-white/10 bg-black/20 p-4 backdrop-blur">
            {data.bars.map((bar) => (
              <div key={bar.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm text-white/72">
                  <span>{bar.label}</span>
                  <span className="font-semibold text-white/90">{bar.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${bar.value}%` }} transition={{ duration: 0.8, delay: 0.2 }} className="h-full rounded-full bg-white" />
                </div>
              </div>
            ))}
          </div>
          <p className="max-w-[28ch] text-sm leading-6 text-white/72">{data.descriptor}</p>
        </motion.div>
      </div>
      <p className="px-6 pb-5 text-[0.65rem] uppercase tracking-[0.22em] text-white/45">{data.subcopy}</p>
    </SlideSurface>
  );
};
