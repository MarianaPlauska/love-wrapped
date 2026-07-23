import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

import type { WrappedData } from '../../data/wrappedData';
import { SlidePill, SlideScrollBody, SlideSurface } from './Shared';

type PlacesMapSlideProps = {
  data: WrappedData['slides']['placesMap'];
  palette: WrappedData['palettes']['intro'];
};

export const PlacesMapSlide = ({ data, palette }: PlacesMapSlideProps) => (
  <SlideSurface palette={palette} className="justify-between">
    <div className="relative z-20 shrink-0 px-6 pt-6">
      <SlidePill>{data.label}</SlidePill>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-4 max-w-[18ch] font-display text-2xl leading-tight text-white sm:text-3xl"
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

    <SlideScrollBody className="px-6 py-3">
      <div className="relative mx-auto w-full max-w-[320px] pb-2">
        <div className="absolute bottom-2 left-6 top-4 w-0.5 bg-gradient-to-b from-lime-300 via-cyan-300 to-fuchsia-300 opacity-50" />

        <div className="space-y-3">
          {data.places.map((place, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -24 : 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
              className="relative flex items-start gap-3 pl-2 sm:gap-4"
            >
              <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-950 ring-2 ring-lime-300/60 sm:h-10 sm:w-10">
                <MapPin size={16} className="text-lime-300 sm:hidden" />
                <MapPin size={18} className="hidden text-lime-300 sm:block" />
              </div>
              <div className="flex-1 rounded-2xl bg-white/8 p-3 backdrop-blur-sm">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-lime-300">{place.name}</p>
                <p className="mt-1 text-sm font-medium leading-relaxed text-white/85">{place.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideScrollBody>
  </SlideSurface>
);
