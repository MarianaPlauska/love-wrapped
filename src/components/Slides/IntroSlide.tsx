import { motion } from 'framer-motion';

import type { WrappedData } from '../../data/wrappedData';
import { SlideSurface } from './Shared';

type IntroSlideProps = {
  data: WrappedData['slides']['intro'];
  palette: WrappedData['palettes']['intro'];
  heroImage: string;
  secondaryHeroImage: string;
  year: number;
  coupleNames: string;
};

export const IntroSlide = ({ data, palette, heroImage, secondaryHeroImage, year, coupleNames }: IntroSlideProps) => {
  const openingWords = ['NÓS', 'DUAS', 'EM REPLAY'];

  return (
    <SlideSurface palette={palette} className="justify-between bg-black">
      <motion.div
        aria-hidden="true"
        initial={{ scale: 0.2, opacity: 0 }}
        animate={{ scale: [0.2, 1.1, 0.85], opacity: [0, 0.9, 0.35] }}
        transition={{ duration: 1.8, delay: 1.25, ease: 'easeOut' }}
        className="absolute left-1/2 top-[42%] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border-[28px] border-lime-300/35"
      />
      <motion.div
        aria-hidden="true"
        initial={{ rotate: -30, scale: 0, opacity: 0 }}
        animate={{ rotate: 18, scale: 1, opacity: 0.8 }}
        transition={{ duration: 0.8, delay: 1.7, ease: 'backOut' }}
        className="absolute -right-24 top-20 h-44 w-80 bg-rose-500"
      />

      <div className="relative z-20 flex items-center justify-between px-6 pt-6 text-[0.68rem] font-bold uppercase tracking-[0.24em] text-white/55">
        <span>{year}</span>
        <span>{coupleNames || 'Nós duas'}</span>
      </div>

      <div className="relative z-20 flex flex-1 flex-col items-center justify-center px-6 pb-8 text-center">
        <div className="h-24">
          {openingWords.map((word, index) => (
            <motion.p
              key={word}
              initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
              animate={{ opacity: [0, 1, 1, 0], y: [24, 0, 0, -18], filter: ['blur(10px)', 'blur(0px)', 'blur(0px)', 'blur(6px)'] }}
              transition={{ duration: 1.2, delay: index * 0.72, times: [0, 0.25, 0.72, 1], ease: 'easeOut' }}
              className="absolute left-0 right-0 font-display text-5xl leading-none text-white"
            >
              {word}
            </motion.p>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.72, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 140, damping: 16, delay: 2.65 }}
          className="relative mt-1 h-44 w-[17rem]"
        >
          <div className="absolute left-0 top-0 h-40 w-40 rounded-full border border-lime-300/55" />
          <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full border border-rose-300/55" />
          <img src={heroImage} onError={(event) => { event.currentTarget.src = '/images/couple/memory-1.svg'; }} alt="Foto da Mariana" className="absolute left-1 top-1 h-40 w-40 rounded-full border-4 border-white object-cover shadow-[0_20px_70px_rgba(0,0,0,0.55)]" />
          <img src={secondaryHeroImage} onError={(event) => { event.currentTarget.src = '/images/couple/memory-2.svg'; }} alt="Foto da Marianna" className="absolute bottom-1 right-1 h-40 w-40 rounded-full border-4 border-white object-cover shadow-[0_20px_70px_rgba(0,0,0,0.55)]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 2.95, ease: 'easeOut' }}
          className="mt-6"
        >
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-lime-300">{data.eyebrow}</p>
          <h1 className="mx-auto mt-3 max-w-[11ch] font-display text-[3.4rem] leading-[0.86] text-white">
            Wrapped das Mariannnas
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 3.2, ease: 'easeOut' }}
            className="mx-auto mt-4 max-w-[28ch] text-sm leading-6 text-white/70"
          >
            {data.body}
          </motion.p>
        </motion.div>
      </div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.5 }} className="relative z-20 px-6 pb-6 text-center text-[0.65rem] uppercase tracking-[0.25em] text-white/40">
        {data.kicker}
      </motion.p>
    </SlideSurface>
  );
};
