import { motion } from 'framer-motion';
import { Mail, Heart } from 'lucide-react';

import type { WrappedData } from '../../data/wrappedData';
import { SlidePill, SlideSurface } from './Shared';

type LoveLetterSlideProps = {
  data: WrappedData['slides']['loveLetter'];
  palette: WrappedData['palettes']['summary'];
  coupleNames: string;
};

export const LoveLetterSlide = ({ data, palette, coupleNames }: LoveLetterSlideProps) => (
  <SlideSurface palette={palette} className="justify-between">
    <div className="relative z-20 px-6 pt-6">
      <SlidePill>Carta de amor</SlidePill>
    </div>

    <div className="relative z-10 flex flex-1 flex-col justify-center px-7">
      <motion.div
        initial={{ opacity: 0, rotateX: 12, y: 30 }}
        animate={{ opacity: 1, rotateX: 0, y: 0 }}
        transition={{ duration: 0.75, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.07] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm"
      >
        <div className="absolute right-5 top-5 text-rose-300/40">
          <Mail size={32} />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-xs font-bold uppercase tracking-[0.28em] text-rose-200"
        >
          {data.greeting || `Para ${coupleNames || 'você'}`}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 1.2 }}
          className="mt-5 text-base leading-7 text-white/90"
        >
          {data.body.split('\n').map((paragraph, index) => (
            <p key={index} className={index > 0 ? 'mt-4' : ''}>
              {paragraph}
            </p>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mt-7 flex items-center gap-2 text-sm font-semibold text-rose-200"
        >
          <Heart size={14} fill="currentColor" />
          {data.signature || 'Com amor'}
        </motion.div>
      </motion.div>
    </div>

    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4 }}
      className="px-6 pb-6 text-center text-xs uppercase tracking-[0.24em] text-white/45"
    >
      Escrita só para você
    </motion.p>
  </SlideSurface>
);
