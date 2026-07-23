import { motion } from 'framer-motion';

import type { WrappedData } from '../../data/wrappedData';
import { SlidePill, SlideSurface } from './Shared';

type SummarySlideProps = {
  data: WrappedData['slides']['summary'];
  palette: WrappedData['palettes']['summary'];
  daysTogether: number;
  coupleNames: string;
  year: number;
  food: string;
  song: string;
  favoriteMoment: string;
  relationshipSeries: string;
  memoryCount: number;
  verdictCount: number;
};

export const SummarySlide = ({ data, palette, daysTogether, coupleNames, year, food, song, favoriteMoment, relationshipSeries, memoryCount, verdictCount }: SummarySlideProps) => {
  return (
    <SlideSurface palette={palette} className="justify-between bg-[#171717]">
      <div className="relative z-20 flex items-center justify-between px-5 pt-5">
        <SlidePill>{data.label}</SlidePill>
        <span className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-lime-300">{year} em replay</span>
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-5 pb-5 pt-5">
        <motion.div initial={{ opacity: 0, x: -45 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65 }} className="bg-[#1ed760] p-5 text-zinc-950">
          <p className="text-[0.62rem] font-black uppercase tracking-[0.2em]">Wrapped das Mariannnas</p>
          <h2 className="mt-3 max-w-[10ch] font-display text-[3.25rem] leading-[0.82]">{coupleNames || 'Nós duas'}</h2>
          <div className="mt-5 flex items-end justify-between border-t border-zinc-950/30 pt-3">
            <p className="max-w-[11ch] text-xs font-bold uppercase tracking-[0.12em]">dias vivendo essa história</p>
            <p className="font-display text-6xl leading-none">{daysTogether}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.2 }} className="mt-2 grid flex-1 grid-cols-2 grid-rows-3 gap-2">
          <div className="bg-[#ffd42a] px-3 py-3 text-zinc-950">
            <p className="text-[0.58rem] font-bold uppercase tracking-[0.17em] opacity-60">Nossa comida</p>
            <p className="mt-2 font-display text-xl leading-none">{food}</p>
          </div>
          <div className="bg-[#ff6437] px-3 py-3 text-zinc-950">
            <p className="text-[0.58rem] font-bold uppercase tracking-[0.17em] opacity-60">Nossa série</p>
            <p className="mt-2 font-display text-lg leading-none">{relationshipSeries}</p>
          </div>
          <div className="col-span-2 bg-[#2f52e0] px-3 py-3 text-white">
            <p className="text-[0.58rem] font-bold uppercase tracking-[0.17em] text-white/55">Nossa música</p>
            <p className="mt-2 line-clamp-2 font-display text-2xl leading-none">{song}</p>
          </div>
          <div className="bg-white px-3 py-3 text-zinc-950">
            <p className="text-[0.58rem] font-bold uppercase tracking-[0.17em] opacity-55">Momento favorito</p>
            <p className="mt-2 line-clamp-2 font-display text-lg leading-none">{favoriteMoment}</p>
          </div>
          <div className="grid grid-cols-2 gap-1 bg-[#e879f9] p-3 text-zinc-950">
            <div><p className="font-display text-3xl leading-none">{memoryCount}</p><p className="text-[0.5rem] font-bold uppercase tracking-[0.1em]">memórias</p></div>
            <div><p className="font-display text-3xl leading-none">{verdictCount}</p><p className="text-[0.5rem] font-bold uppercase tracking-[0.1em]">vereditos</p></div>
          </div>
        </motion.div>

        <p className="mt-3 text-center text-[0.62rem] font-bold uppercase tracking-[0.22em] text-white/80">{data.footer}</p>
      </div>
    </SlideSurface>
  );
};
