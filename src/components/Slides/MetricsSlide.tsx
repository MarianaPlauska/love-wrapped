import { motion } from 'framer-motion';

import type { WrappedData } from '../../data/wrappedData';
import { SlidePill, SlideSurface } from './Shared';

type MetricsSlideProps = {
  daysTogether: number;
  data: WrappedData['slides']['metrics'];
  palette: WrappedData['palettes']['metrics'];
};

export const MetricsSlide = ({ daysTogether, data, palette }: MetricsSlideProps) => {
  const digits = String(daysTogether).split('');
  const hoursTogether = daysTogether * 24;
  const years = Math.floor(daysTogether / 365);
  const months = Math.floor(daysTogether / 30.44);

  const repeatedColors = ['text-amber-400', 'text-fuchsia-400', 'text-cyan-400', 'text-lime-400', 'text-rose-400', 'text-yellow-400'];
  const barData = [0.35, 0.55, 0.42, 0.78, 0.6, 0.9, 0.48, 0.82, 0.66, 0.95, 0.52, 0.88];

  return (
    <SlideSurface palette={palette} className="justify-between">
      <div className="relative z-10 flex-none px-5 pt-5">
        <SlidePill>{data.label}</SlidePill>
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-center overflow-hidden px-5 py-2">
        {/* Efeito Spotify Wrapped: número repetido em cores */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center opacity-[0.10]">
          {repeatedColors.slice(0, 5).map((color, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
              className={`font-display text-[4rem] font-black leading-[0.82] tracking-[-0.06em] ${color}`}
            >
              {daysTogether.toLocaleString('pt-BR')}
            </motion.p>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 text-center"
        >
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.22em] text-white/60">{data.subcopy}</p>
          <div className="flex justify-center font-display text-[5rem] font-black leading-none tracking-[-0.06em] text-white sm:text-[5.5rem]">
            {digits.map((digit, index) => (
              <motion.span
                key={`${daysTogether}-${index}`}
                initial={{ opacity: 0, y: 50, scale: 0.5 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 160, damping: 13, delay: index * 0.07 }}
              >
                {digit}
              </motion.span>
            ))}
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg font-black uppercase tracking-[-0.02em] text-lime-300"
          >
            {data.suffix}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="relative z-10 mt-4 flex justify-center gap-6"
        >
          <div className="text-center">
            <p className="font-display text-xl font-black text-white">{hoursTogether.toLocaleString('pt-BR')}</p>
            <p className="mt-0.5 text-[0.55rem] font-bold uppercase tracking-[0.16em] text-white/55">horas</p>
          </div>
          <div className="text-center">
            <p className="font-display text-xl font-black text-white">{months}</p>
            <p className="mt-0.5 text-[0.55rem] font-bold uppercase tracking-[0.16em] text-white/55">meses</p>
          </div>
          <div className="text-center">
            <p className="font-display text-xl font-black text-white">{years}</p>
            <p className="mt-0.5 text-[0.55rem] font-bold uppercase tracking-[0.16em] text-white/55">anos</p>
          </div>
        </motion.div>
      </div>

      {/* Gráfico de barras estilo Wrapped */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="relative z-10 flex-none px-5 pb-5"
      >
        <div className="flex h-20 items-end justify-between gap-[3px]">
          {barData.map((value, index) => (
            <motion.div
              key={index}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 1.2 + index * 0.05, duration: 0.4 }}
              style={{ height: `${value * 100}%` }}
              className="w-full origin-bottom rounded-t-sm bg-gradient-to-t from-yellow-500 to-yellow-300"
            />
          ))}
        </div>
        <p className="mt-2 text-center text-[0.55rem] font-bold uppercase tracking-[0.16em] text-white/45">
          Cada dia ao seu lado é um acerto na playlist da vida
        </p>
      </motion.div>
    </SlideSurface>
  );
};
