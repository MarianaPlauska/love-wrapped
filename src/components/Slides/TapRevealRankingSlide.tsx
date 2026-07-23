import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import type { WrappedPalette, WrappedRanking } from '../../data/wrappedData';
import { SlidePill, SlideSurface } from './Shared';

const revealLabel: Record<'food' | 'music', string> = {
  food: 'Revelar a comida',
  music: 'Revelar a música',
};

export const TapRevealRankingSlide = ({
  data,
  palette,
  category,
  onReveal,
}: {
  data: WrappedRanking;
  palette: WrappedPalette;
  category: 'food' | 'music';
  onReveal?: () => void;
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const answer = data.entries[0];

  return (
    <SlideSurface palette={palette} backgroundImage={data.backgroundImage} className="justify-between">
      <div className="flex items-start justify-between px-6 pt-6">
        <SlidePill>{data.label}</SlidePill>
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/50">
          {isRevealed ? 'Resposta revelada' : 'Uma resposta'}
        </span>
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-center px-7">
        {!isRevealed && (
          <div aria-hidden="true" className="absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden">
            {['NOSSA', 'ESCOLHA', 'SEMPRE', 'VOLTA'].map((word, index) => (
              <motion.p
                key={word}
                initial={{ opacity: 0, x: index % 2 === 0 ? -120 : 120 }}
                animate={{ opacity: [0, 0.16, 0], x: index % 2 === 0 ? [-120, 20, 120] : [120, -20, -120] }}
                transition={{ duration: 3.2, delay: index * 0.45, repeat: Infinity, repeatDelay: 0.5 }}
                className="whitespace-nowrap font-display text-6xl leading-none text-white"
              >
                {word}
              </motion.p>
            ))}
          </div>
        )}
        <AnimatePresence mode="wait">
          {!isRevealed ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45 }}
              className="flex flex-col items-start"
            >
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-white/55">
                {data.headline}
              </p>
              <h2 className="mt-4 max-w-[12ch] font-display text-[3.5rem] leading-[0.92] text-white">
                {'Toque para descobrir'.split(' ').map((word, index) => (
                  <motion.span
                    key={word}
                    initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.55, delay: 0.25 + index * 0.18 }}
                    className="mr-[0.22em] inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
              </h2>
              <p className="mt-5 max-w-[28ch] text-base leading-7 text-white/70">
                {data.subtitle}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="answer"
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="flex flex-col items-start"
            >
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-white/55">
                {answer.subtitle}
              </p>
              <h2 className={`mt-4 max-w-[11ch] font-display text-[5.2rem] leading-[0.84] ${answer.accent}`}>
                {answer.title}
              </h2>
              <p className="mt-5 max-w-[28ch] text-base leading-7 text-white/75">
                {answer.detail}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-7 pb-7">
        {!isRevealed && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              if (onReveal) {
                onReveal();
                return;
              }
              setIsRevealed(true);
            }}
            className="group relative w-full overflow-hidden rounded-full bg-white px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-black transition-transform active:scale-95"
          >
            <span className="relative z-10">{revealLabel[category]}</span>
          </button>
        )}
      </div>
    </SlideSurface>
  );
};
