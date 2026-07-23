import { motion } from 'framer-motion';

import type { WrappedData } from '../../data/wrappedData';
import { GlowOrb, SlidePill, SlideSurface } from './Shared';

type MetricsSlideProps = {
  daysTogether: number;
  data: WrappedData['slides']['metrics'];
  palette: WrappedData['palettes']['metrics'];
};

export const MetricsSlide = ({ daysTogether, data, palette }: MetricsSlideProps) => {
  const digits = String(daysTogether).split('');
  const years = Math.floor(daysTogether / 365);
  const months = Math.floor(daysTogether / 30.44);
  const weeks = Math.floor(daysTogether / 7);
  const nextMilestone = Math.ceil(daysTogether / 100) * 100;
  const milestoneProgress = (daysTogether % 100) || 100;

  return (
    <SlideSurface palette={palette} className="justify-between">
      <div className="relative z-10 px-6 pt-6">
        <SlidePill>{data.label}</SlidePill>
      </div>
      <div className="relative z-10 flex flex-1 flex-col justify-center px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="space-y-4"
        >
          <div className="flex font-display text-[5.5rem] leading-[0.85] tracking-[-0.08em] text-white sm:text-[6.5rem]">
            {digits.map((digit, index) => (
              <motion.span
                key={`${daysTogether}-${index}`}
                initial={{ opacity: 0, y: 40, scale: 0.6 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 150, damping: 14, delay: index * 0.08 }}
              >
                {digit}
              </motion.span>
            ))}
          </div>
          <motion.div
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="max-w-[14ch] text-3xl font-black uppercase tracking-[-0.04em] text-white"
          >
            {data.suffix}
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }} className="max-w-[28ch] text-sm leading-6 text-white/72">{data.subcopy}</motion.p>
        </motion.div>

        <div className="mt-8 grid grid-cols-3 gap-2">
          {[
            { value: years, label: years === 1 ? 'ano inteiro' : 'anos inteiros' },
            { value: months, label: 'meses em nós' },
            { value: weeks, label: 'semanas juntas' },
          ].map((metric, index) => (
            <motion.div key={metric.label} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 + index * 0.12 }} className="border-t border-white/30 pt-3">
              <p className="font-display text-3xl leading-none text-lime-300">{metric.value}</p>
              <p className="mt-2 text-[0.58rem] font-bold uppercase leading-4 tracking-[0.14em] text-white/55">{metric.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-8">
          <div className="flex justify-between text-[0.6rem] font-bold uppercase tracking-[0.16em] text-white/50">
            <span>Próximo marco</span>
            <span>{nextMilestone} dias</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden bg-white/10">
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: milestoneProgress / 100 }} transition={{ duration: 1, delay: 1.3 }} className="h-full origin-left bg-lime-300" />
          </div>
        </motion.div>
      </div>
    </SlideSurface>
  );
};
