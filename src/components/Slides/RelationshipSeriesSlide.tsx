import { motion } from 'framer-motion';

import type { WrappedData } from '../../data/wrappedData';
import { SlidePill, SlideSurface } from './Shared';

type RelationshipSeriesSlideProps = {
  data: WrappedData['slides']['relationshipSeries'];
  palette: WrappedData['palettes']['genre'];
};

export const RelationshipSeriesSlide = ({ data, palette }: RelationshipSeriesSlideProps) => (
  <SlideSurface palette={palette} backgroundImage={data.backgroundImage} className="justify-between">
    <div className="flex items-center justify-between px-6 pt-6">
      <SlidePill>{data.label}</SlidePill>
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Temporada atual</span>
    </div>

    <div className="flex flex-1 flex-col justify-center overflow-hidden px-7 pb-10">
      <motion.div
        initial={{ opacity: 0, x: -120 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.7, delay: 0.25 }} className="mb-6 h-2 w-24 origin-left bg-amber-300" />
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/55">Se a nossa história fosse uma série</p>
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, x: 150 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.85, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="mt-4 max-w-[11ch] font-display text-[3.8rem] leading-[0.88] text-white"
      >
        {data.title}
      </motion.h2>
      <motion.p initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.75 }} className="mt-6 max-w-[28ch] text-lg font-semibold leading-7 text-white">{data.subtitle}</motion.p>
      <motion.p initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 1 }} className="mt-3 max-w-[30ch] text-sm leading-6 text-white/65">{data.detail}</motion.p>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }} className="absolute -right-14 bottom-24 h-40 w-40 rounded-full border-[18px] border-amber-300/25 border-l-transparent" />
    </div>

    <div className="border-t border-white/15 px-7 py-5 text-[0.65rem] font-bold uppercase tracking-[0.24em] text-white/45">
      Comédia de parceria · episódios sem roteiro
    </div>
  </SlideSurface>
);
