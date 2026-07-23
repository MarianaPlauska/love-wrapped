import { motion } from 'framer-motion';

import type { WrappedData } from '../../data/wrappedData';
import { SlidePill, SlideSurface } from './Shared';

type FavoriteMomentSlideProps = {
  data: WrappedData['slides']['favoriteMoment'];
  palette: WrappedData['palettes']['tracks'];
};

const formatDate = (date: string) => {
  const parsedDate = new Date(`${date}T12:00:00`);

  if (Number.isNaN(parsedDate.getTime())) return date;

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(parsedDate);
};

export const FavoriteMomentSlide = ({ data, palette }: FavoriteMomentSlideProps) => (
  <SlideSurface palette={palette} className="justify-between bg-[#15110f]">
    <div className="relative z-20 px-6 pt-6">
      <SlidePill>{data.label}</SlidePill>
    </div>

    <motion.div
      initial={{ opacity: 0, y: -28, rotate: -4, scale: 0.86 }}
      animate={{ opacity: 1, y: 0, rotate: -1.5, scale: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 15, delay: 0.15 }}
      className="relative mx-7 mt-7 h-[42%] overflow-hidden border-[10px] border-white bg-white shadow-[0_24px_70px_rgba(0,0,0,0.55)]"
    >
      <motion.img
        src={data.backgroundImage}
        alt={data.title}
        initial={{ filter: 'grayscale(1) brightness(1.8)', scale: 1.14 }}
        animate={{ filter: 'grayscale(0) brightness(1)', scale: 1 }}
        transition={{ duration: 1.8, delay: 0.45, ease: 'easeOut' }}
        className="h-full w-full object-cover"
      />
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 1.35, delay: 0.35, ease: 'easeInOut' }}
        className="absolute inset-0 origin-right bg-[#d8d0c3]"
      />
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 1.05, ease: 'easeOut' }}
      className="relative z-10 mt-auto px-7 pb-8"
    >
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/65">
        {formatDate(data.date)}
      </p>
      <h2 className="mt-3 max-w-[11ch] font-display text-[3.35rem] leading-[0.88] text-white">
        {data.title.split(' ').map((word, index) => (
          <motion.span key={`${word}-${index}`} initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: 1.25 + index * 0.12 }} className="mr-[0.2em] inline-block">{word}</motion.span>
        ))}
      </h2>
      <div className="mt-6 border-l-2 border-lime-300 pl-4">
        <p className="font-semibold text-white">{data.subtitle}</p>
        <p className="mt-2 max-w-[29ch] text-sm leading-6 text-white/75">{data.detail}</p>
      </div>
    </motion.div>
  </SlideSurface>
);
