import { motion } from 'framer-motion';

import type { WrappedData } from '../../data/wrappedData';
import { SlidePill, SlideSurface } from './Shared';

type FoodAnswerSlideProps = {
  data: WrappedData['slides']['foods'];
  palette: WrappedData['palettes']['tracks'];
};

const pizzaParticles = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  delay: (index % 6) * 0.18,
  duration: 2.8 + (index % 4) * 0.35,
  size: 22 + (index % 3) * 10,
  rotation: (index % 2 === 0 ? 1 : -1) * (18 + index * 7),
}));

export const FoodAnswerSlide = ({ data, palette }: FoodAnswerSlideProps) => {
  const answer = data.entries[0];

  return (
    <SlideSurface palette={palette} className="justify-between bg-[#ff6437]">
      <div className="relative z-20 flex items-center justify-between px-6 pt-6">
        <SlidePill>A resposta</SlidePill>
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-950/60">Sem discussão</span>
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {pizzaParticles.map((particle) => (
          <motion.span
            key={particle.id}
            initial={{ y: -80, x: 0, rotate: 0, opacity: 0 }}
            animate={{ y: '110vh', x: [0, 18, -12, 8], rotate: particle.rotation, opacity: [0, 1, 1, 0] }}
            transition={{ duration: particle.duration, delay: particle.delay, repeat: Infinity, ease: 'linear' }}
            style={{ left: particle.left, fontSize: particle.size }}
            className="absolute top-0"
          >
            🍕
          </motion.span>
        ))}
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-7 text-center text-zinc-950">
        <motion.p
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45 }}
          className="text-xs font-black uppercase tracking-[0.3em]"
        >
          {answer.subtitle}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, scale: 0.25, rotate: -8 }}
          animate={{ opacity: 1, scale: [0.25, 1.15, 1], rotate: [-8, 3, 0] }}
          transition={{ duration: 0.85, delay: 0.2, ease: 'backOut' }}
          className="mt-5 font-display text-[6.6rem] leading-[0.76]"
        >
          {answer.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          className="mt-7 max-w-[26ch] text-base font-semibold leading-7"
        >
          {answer.detail}
        </motion.p>
      </div>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 1.1 }}
        className="relative z-10 mx-7 mb-8 h-2 origin-left bg-zinc-950"
      />
    </SlideSurface>
  );
};
