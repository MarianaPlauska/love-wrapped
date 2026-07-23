import { motion } from 'framer-motion';

import type { WrappedData } from '../../data/wrappedData';
import { SlidePill, SlideSurface } from './Shared';

type VersusSlideProps = {
  data: WrappedData['slides']['versus'];
  palette: WrappedData['palettes']['genre'];
  page: 0 | 1;
};

export const VersusSlide = ({ data, palette, page }: VersusSlideProps) => {
  const items = data.items.slice(page * 5, (page + 1) * 5);

  return (
    <SlideSurface palette={palette} className="justify-between">
      <div className="px-6 pt-6">
        <SlidePill>{data.label}</SlidePill>
      </div>

      <div className="flex flex-1 flex-col px-6 pb-6 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="space-y-2"
        >
          <h2 className="max-w-[12ch] font-display text-[2.7rem] leading-[0.92] text-white">
            {data.headline}
          </h2>
          <p className="max-w-[31ch] text-xs leading-5 text-white/72">{page === 0 ? data.subtitle : 'Mais cinco respostas que dizem bastante sobre nós duas.'}</p>
        </motion.div>

        <div className="mt-4 space-y-2">
          {items.map((item, index) => {
            const itemNumber = (page * 5) + index + 1;
            const answer = item.winner === 'left' ? item.leftLabel : item.winner === 'right' ? item.rightLabel : 'Empate';

            return (
            <motion.div
              key={item.topic}
              initial={{ opacity: 0, x: index % 2 === 0 ? -36 : 36 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.55 }}
              className="relative min-h-[4.4rem] overflow-hidden rounded-[1.1rem] border border-white/10 bg-black/25 px-3 py-2.5"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 shrink-0 font-display text-xl text-white/30">{String(itemNumber).padStart(2, '0')}</span>
                <span className="flex-1 text-[0.68rem] font-semibold uppercase leading-4 tracking-[0.08em] text-white/80">
                  {item.topic}
                </span>
                <motion.span
                  initial={{ opacity: 0, scale: 0.4, rotate: -8 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.35 + index * 0.55 }}
                  className={`min-w-16 rounded-lg px-2 py-1.5 text-center text-xs font-black ${
                    item.winner === 'left' ? 'bg-lime-300 text-zinc-950' : item.winner === 'right' ? 'bg-fuchsia-300 text-zinc-950' : 'bg-amber-300 text-zinc-950'
                  }`}
                >
                  {answer}
                </motion.span>
              </div>
            </motion.div>
            );
          })}
        </div>

        <p className="mt-auto pt-3 text-right text-[0.6rem] font-bold uppercase tracking-[0.18em] text-white/35">Parte {page + 1} de 2</p>
      </div>
    </SlideSurface>
  );
};
