import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import type { WrappedData } from '../../data/wrappedData';
import { SlidePill, SlideSurface } from './Shared';

type WheelSlideProps = {
  data: WrappedData['slides']['wheel'];
  palette: WrappedData['palettes']['tracks'];
};

const wheelColors = ['#1ed760', '#f472b6', '#22d3ee', '#fbbf24', '#a78bfa', '#fb7185'];

export const WheelSlide = ({ data, palette }: WheelSlideProps) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const spinWheel = () => {
    if (isSpinning || data.items.length === 0) return;

    setIsSpinning(true);
    setSelectedIndex(null);

    const itemAngle = 360 / data.items.length;
    const randomIndex = Math.floor(Math.random() * data.items.length);
    const targetRotation = 360 * 5 + (360 - randomIndex * itemAngle - itemAngle / 2);

    setRotation((current) => current + targetRotation);

    window.setTimeout(() => {
      setIsSpinning(false);
      setSelectedIndex(randomIndex);
    }, 3000);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (selectedIndex === null && !isSpinning) {
        void spinWheel();
      }
    }, 1200);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <SlideSurface palette={palette} className="justify-between">
      <div className="relative z-20 px-6 pt-6">
        <SlidePill>{data.label}</SlidePill>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 max-w-[18ch] font-display text-3xl leading-tight text-white"
        >
          {data.headline}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-2 text-sm text-white/60"
        >
          {data.subcopy}
        </motion.p>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-4">
        <div className="relative">
          {/* Ponteiro */}
          <div className="absolute -top-3 left-1/2 z-20 -translate-x-1/2">
            <div className="h-0 w-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-lime-300 drop-shadow-lg" />
          </div>

          {/* Roleta */}
          <motion.div
            animate={{ rotate: rotation }}
            transition={{ duration: 3, ease: [0.15, 0, 0.15, 1] }}
            className="relative h-64 w-64 rounded-full border-4 border-white/15 shadow-2xl"
            style={{ background: `conic-gradient(${data.items.map((_, index) => `${wheelColors[index % wheelColors.length]} ${index * (360 / data.items.length)}deg ${(index + 1) * (360 / data.items.length)}deg`).join(', ')})` }}
          >
            {data.items.map((item, index) => {
              const angle = index * (360 / data.items.length);
              return (
                <div
                  key={index}
                  className="absolute left-1/2 top-1/2 flex w-28 origin-left -translate-y-1/2 items-center justify-center"
                  style={{
                    transform: `rotate(${angle + 360 / data.items.length / 2}deg) translateX(40px)`,
                  }}
                >
                  <span className="rotate-180 text-center text-[10px] font-black uppercase tracking-wider text-zinc-950 drop-shadow-sm" style={{ writingMode: 'vertical-rl' }}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </motion.div>

          {/* Centro */}
          <button
            type="button"
            onClick={spinWheel}
            disabled={isSpinning}
            className="absolute left-1/2 top-1/2 z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-zinc-950 text-xs font-black uppercase tracking-wider text-lime-300 shadow-xl ring-4 ring-white/20 active:scale-95 disabled:opacity-70"
          >
            {isSpinning ? '...' : 'Girar'}
          </button>
        </div>

        {/* Resultado */}
        <div className="mt-8 min-h-[120px] w-full max-w-[280px] rounded-2xl bg-white/8 p-4 text-center backdrop-blur-sm">
          {selectedIndex !== null ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-[0.65rem] font-black uppercase tracking-[0.2em]" style={{ color: wheelColors[selectedIndex % wheelColors.length] }}>
                {data.items[selectedIndex].label}
              </p>
              <p className="mt-2 text-lg font-display font-black leading-tight text-white">
                {data.items[selectedIndex].content}
              </p>
            </motion.div>
          ) : (
            <p className="text-sm text-white/50">Toque em &quot;Girar&quot; para ver a surpresa do casal.</p>
          )}
        </div>
      </div>
    </SlideSurface>
  );
};
