import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

import type { WrappedData } from '../../data/wrappedData';
import { SlidePill, SlideSurface } from './Shared';

type LoveReasonsSlideProps = {
  data: WrappedData['slides']['loveReasons'];
  palette: WrappedData['palettes']['summary'];
};

export const LoveReasonsSlide = ({ data, palette }: LoveReasonsSlideProps) => (
  <SlideSurface palette={palette} className="justify-between">
    <div className="relative z-20 px-6 pt-6">
      <SlidePill>{data.label}</SlidePill>
    </div>

    <div className="relative z-10 flex flex-1 flex-col justify-center px-7">
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-[26ch] text-2xl font-semibold leading-tight text-white"
      >
        {data.headline}
      </motion.p>

      <ul className="mt-7 space-y-3">
        {data.reasons.slice(0, 6).map((reason, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -28 : 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.25 + index * 0.18 }}
            className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
          >
            <Heart
              aria-hidden="true"
              size={16}
              className="mt-1 shrink-0 text-lime-300"
              fill="currentColor"
            />
            <span className="text-sm leading-6 text-white/90">{reason}</span>
          </motion.li>
        ))}
      </ul>
    </div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4 }}
      className="px-6 pb-6 text-center text-xs uppercase tracking-[0.24em] text-white/45"
    >
      Sempre tem mais um motivo
    </motion.div>
  </SlideSurface>
);
