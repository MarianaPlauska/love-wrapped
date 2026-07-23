import { motion } from 'framer-motion';

import type { WrappedPalette, WrappedRanking } from '../../data/wrappedData';
import { RankingArtwork } from './RankingArtwork';
import { GlowOrb, SlidePill, SlideSurface } from './Shared';

const categoryDoodles: Record<'food' | 'music', string[]> = {
  food: ['🍴', '❤️', '🔥', '✨', '🧂'],
  music: ['🎵', '🎧', '⭐', '🔊', '💿'],
};

type RankingRevealSlideProps = {
  data: WrappedRanking;
  itemIndex: number;
  palette: WrappedPalette;
  category: 'food' | 'music';
};

export const RankingRevealSlide = ({ data, itemIndex, palette, category }: RankingRevealSlideProps) => {
  const item = data.entries[itemIndex];
  const doodles = categoryDoodles[category];

  return (
    <SlideSurface palette={palette} className="justify-between">
      <GlowOrb color={category === 'food' ? 'rgba(251, 146, 60, 0.18)' : 'rgba(232, 121, 249, 0.18)'} className="right-0 top-0 h-48 w-48" />
      <div className="flex items-start justify-between px-6 pt-6">
        <SlidePill>{data.label}</SlidePill>
        <span className="text-xs font-bold tracking-[0.16em] text-white/50">{item.rank} / {data.entries.length}</span>
      </div>
      <motion.div key={item.rank} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55, ease: 'easeOut' }} className="relative z-10 flex flex-1 flex-col justify-center px-7 pb-10">
        <div className="flex items-end justify-between gap-4">
          <motion.p
            initial={{ opacity: 0, scale: 1.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 140, damping: 14, delay: 0.05 }}
            className={`font-display text-[7rem] leading-[0.7] ${item.accent}`}
          >
            0{item.rank}
          </motion.p>
          <RankingArtwork visual={item.visual} category={category} />
        </div>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-6 text-xs font-bold uppercase tracking-[0.26em] text-white/55"
        >
          {item.subtitle}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.35 }}
          className="mt-3 max-w-[11ch] font-display text-5xl leading-[0.92] text-white"
        >
          {item.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.45 }}
          className="mt-6 max-w-[27ch] text-base leading-7 text-white/72"
        >
          {item.detail}
        </motion.p>
        <div className="pointer-events-none absolute right-2 top-1/3 flex flex-col gap-4 text-2xl opacity-60">
          {doodles.slice(0, 3).map((doodle, index) => (
            <motion.span
              key={index}
              animate={{ y: [0, -10, 0], rotate: [0, 12, -12, 0] }}
              transition={{ duration: 2.5 + index * 0.3, repeat: Infinity, ease: 'easeInOut', delay: index * 0.2 }}
            >
              {doodle}
            </motion.span>
          ))}
        </div>
      </motion.div>
      <p className="px-7 pb-7 text-[0.68rem] uppercase tracking-[0.2em] text-white/45">Toque para revelar a próxima posição</p>
    </SlideSurface>
  );
};

type RankingCompleteSlideProps = {
  data: WrappedRanking;
  palette: WrappedPalette;
  category: 'food' | 'music';
};

export const RankingCompleteSlide = ({ data, palette, category }: RankingCompleteSlideProps) => (
  <SlideSurface palette={palette} className="justify-between">
    <div className="px-6 pt-6"><SlidePill>{data.label}: completo</SlidePill></div>
    <div className="flex flex-1 flex-col px-6 pb-8 pt-5">
      <h2 className="max-w-[12ch] font-display text-4xl leading-[0.95] text-white">{data.headline}</h2>
      <p className="mt-3 text-sm leading-6 text-white/65">{data.subtitle}</p>
      <div className="mt-6 space-y-2">
        {data.entries.map((item, index) => (
          <motion.div key={item.rank} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: index * 0.06 }} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/15 px-3 py-2">
            <span className={`font-display text-2xl ${item.accent}`}>0{item.rank}</span>
            <RankingArtwork visual={item.visual} category={category} compact />
            <div className="min-w-0"><p className="truncate font-semibold text-white">{item.title}</p><p className="truncate text-xs text-white/55">{item.subtitle}</p></div>
          </motion.div>
        ))}
      </div>
    </div>
  </SlideSurface>
);