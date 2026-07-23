import { motion } from 'framer-motion';

import type { WrappedData } from '../../data/wrappedData';
import { SlidePill, SlideSurface } from './Shared';

type MomentsSlideProps = {
  data: WrappedData['slides']['moments'];
  palette: WrappedData['palettes']['tracks'];
};

export const MomentsSlide = ({ data, palette }: MomentsSlideProps) => {
  return (
    <SlideSurface palette={palette} className="justify-between">
      <div className="px-6 pt-6">
        <SlidePill>{data.label}</SlidePill>
      </div>
      <div className="flex flex-1 flex-col px-6 pb-8 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          className="space-y-4"
        >
          <h2 className="max-w-[12ch] font-display text-4xl leading-[0.95] tracking-[-0.05em] text-white">
            {data.headline}
          </h2>
          <p className="max-w-[28ch] text-sm leading-6 text-white/72">{data.subtitle}</p>
        </motion.div>
        <div className="mt-6 space-y-3 overflow-hidden rounded-[2rem] border border-white/10 bg-white/8 p-4 backdrop-blur">
          {data.moments.map((moment, index) => (
            <motion.div
              key={moment.rank}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className="flex items-start gap-4 rounded-[1.4rem] border border-white/5 bg-black/18 px-4 py-3"
            >
              <div className={`font-display text-2xl ${moment.accent}`}>0{moment.rank}</div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-white">{moment.title}</div>
                <div className="text-sm text-white/68">{moment.subtitle}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.24em] text-white/45">{moment.detail}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="absolute inset-x-6 bottom-4 flex items-center justify-between text-[0.7rem] uppercase tracking-[0.28em] text-white/45">
        <span>Side A</span>
        <span>Side B</span>
      </div>
    </SlideSurface>
  );
};
