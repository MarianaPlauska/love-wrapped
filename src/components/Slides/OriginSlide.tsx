import { motion } from 'framer-motion';

import type { WrappedData } from '../../data/wrappedData';
import { SkyChart } from './SkyChart';
import { SlidePill, SlideSurface } from './Shared';

type OriginSlideProps = {
  data: WrappedData['slides']['origin'];
  palette: WrappedData['palettes']['intro'];
};

const AnimatedDate = ({ date }: { date: string }) => {
  const tokens = date.split(/(\s+)/);

  return (
    <h2 className="mt-5 max-w-[12ch] font-display text-5xl leading-[0.92] text-white">
      {tokens.map((token, index) => (
        <span key={index} className="inline-block whitespace-pre">
          {token.split('').map((char, charIndex) => (
            <motion.span
              key={`${index}-${charIndex}`}
              initial={{ opacity: 0, y: 30, rotate: -5 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.45, delay: (index * 0.15) + (charIndex * 0.05), ease: 'easeOut' }}
              className="inline-block"
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </span>
      ))}
    </h2>
  );
};

export const OriginSlide = ({ data, palette }: OriginSlideProps) => {
  return (
    <SlideSurface palette={palette} backgroundImage={data.backgroundImage} className="justify-between">
      <div className="relative z-10 px-6 pt-6"><SlidePill>{data.label}</SlidePill></div>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }} className="relative z-10 flex flex-1 flex-col justify-center px-7 pb-7">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-lime-200">O primeiro capítulo</p>
        <AnimatedDate date={data.date} />
        <motion.p
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.55 }}
          className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-white/60"
        >
          {data.location}
        </motion.p>
        <motion.div initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.75, delay: 0.75 }}>
          <SkyChart constellation={data.constellation || 'Gêmeos'} moon={data.moon} observation={data.observation} image={data.skyImage} />
        </motion.div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.35 }} className="mt-4 max-w-[32ch] text-xs leading-5 text-white/65">
          {data.note}
        </motion.p>
      </motion.div>
    </SlideSurface>
  );
};