import { motion } from 'framer-motion';

import type { WrappedData } from '../../data/wrappedData';
import { SlidePill, SlideSurface } from './Shared';

type TimelineSlideProps = {
  data: WrappedData['slides']['timeline'];
  palette: WrappedData['palettes']['summary'];
};

export const TimelineSlide = ({ data, palette }: TimelineSlideProps) => (
  <SlideSurface palette={palette} className="justify-between">
    <div className="relative z-20 px-6 pt-6">
      <SlidePill>{data.label}</SlidePill>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-4 max-w-[15ch] font-display text-3xl leading-tight text-white"
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

    <div className="relative z-10 flex-1 overflow-y-auto px-7 py-4">
      <div className="relative ml-3 border-l border-lime-300/40 pl-6">
        {data.events.slice(0, 5).map((event, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -24 : 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.18 }}
            className="relative mb-5 last:mb-0"
          >
            <span className="absolute -left-[31px] top-1 flex h-3 w-3 items-center justify-center rounded-full bg-lime-300 ring-4 ring-zinc-950">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-950" />
            </span>
            <div className="flex gap-3">
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  onError={(event) => { event.currentTarget.style.display = 'none'; }}
                  className="h-16 w-16 shrink-0 rounded-lg border border-white/10 object-cover"
                />
              )}
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-300">{event.date}</p>
                <h3 className="mt-1 font-display text-lg leading-tight text-white">{event.title}</h3>
                <p className="mt-1 max-w-[28ch] text-sm leading-5 text-white/70">{event.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </SlideSurface>
);
