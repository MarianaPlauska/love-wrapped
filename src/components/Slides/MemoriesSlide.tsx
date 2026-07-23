import { motion } from 'framer-motion';

import type { WrappedData } from '../../data/wrappedData';
import { SlidePill, SlideSurface } from './Shared';

type MemoriesSlideProps = {
  data: WrappedData['slides']['memories'];
  palette: WrappedData['palettes']['tracks'];
  photos: WrappedData['memoryPhotos'];
};

export const MemoriesSlide = ({ data, palette, photos }: MemoriesSlideProps) => {
  return (
    <SlideSurface palette={palette} className="justify-between">
      <div className="px-6 pt-6">
        <SlidePill>{data.label}</SlidePill>
      </div>

      <div className="flex flex-1 flex-col px-6 pb-8 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="space-y-3"
        >
          <h2 className="max-w-[12ch] font-display text-4xl leading-[0.95] tracking-[-0.05em] text-white">
            {data.headline}
          </h2>
          <p className="max-w-[28ch] text-sm leading-6 text-white/72">{data.subtitle}</p>
        </motion.div>

        <div className="relative mt-6 flex-1">
          {photos.map((photo, index) => {
            const positions = [
              { left: '2%', top: '4%', z: 30 },
              { right: '4%', top: '18%', z: 20 },
              { left: '12%', top: '46%', z: 40 },
              { right: '8%', top: '56%', z: 10 },
            ];
            const pos = positions[index % positions.length];

            return (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.75, rotate: photo.rotation - 10 }}
                animate={{ opacity: 1, scale: 1, rotate: photo.rotation }}
                transition={{ type: 'spring', stiffness: 140, damping: 15, delay: index * 0.12 }}
                style={{ ...pos, zIndex: pos.z }}
                className="absolute w-[42%]"
              >
                <div className="relative bg-white p-[7%] pb-[18%] shadow-[0_14px_40px_rgba(0,0,0,0.45)]">
                  <div
                    className={`absolute -top-3 left-1/2 h-7 w-12 -translate-x-1/2 rotate-[-2deg] ${photo.tapeColor} opacity-80 shadow-sm`}
                  />
                  <img
                    src={photo.image}
                    alt={photo.caption}
                    onError={(event) => { event.currentTarget.src = '/images/intro-poster.svg'; }}
                    className="aspect-square w-full object-cover"
                  />
                  <p className="absolute bottom-[4%] left-0 right-0 text-center font-hand text-sm text-zinc-800">
                    {photo.caption}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-4 right-6 text-4xl">📸</div>
    </SlideSurface>
  );
};
