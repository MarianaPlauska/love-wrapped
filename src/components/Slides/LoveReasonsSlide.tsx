import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

import type { WrappedData } from '../../data/wrappedData';
import { SlidePill, SlideScrollBody, SlideSurface } from './Shared';

type LoveReasonsSlideProps = {
  data: WrappedData['slides']['loveReasons'];
  palette: WrappedData['palettes']['summary'];
};

export const LoveReasonsSlide = ({ data, palette }: LoveReasonsSlideProps) => (
  <SlideSurface palette={palette} className="justify-between">
    <div className="relative z-20 shrink-0 px-6 pt-6">
      <SlidePill>{data.label}</SlidePill>
    </div>

    <SlideScrollBody className="px-7 pb-4">
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-[26ch] text-xl font-semibold leading-tight text-white sm:text-2xl"
      >
        {data.headline}
      </motion.p>

      <ul className="mt-5 space-y-2.5 pb-2">
        {data.reasons.slice(0, 6).map((reason, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -28 : 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.25 + index * 0.18 }}
            className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 sm:px-4 sm:py-3"
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
    </SlideScrollBody>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4 }}
      className="relative z-20 shrink-0 px-6 pb-5 text-center text-xs uppercase tracking-[0.24em] text-white/45"
    >
      Sempre tem mais um motivo
    </motion.div>
  </SlideSurface>
);
