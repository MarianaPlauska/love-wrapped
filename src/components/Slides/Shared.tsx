import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

import type { WrappedPalette } from '../../data/wrappedData';

export type SlideSurfaceProps = {
  palette: WrappedPalette;
  children: ReactNode;
  className?: string;
  backgroundImage?: string;
};

export const GrainOverlay = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 z-[5] opacity-[0.055]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    }}
  />
);

export const GlowOrb = ({
  color = 'rgba(163, 230, 53, 0.22)',
  className = '',
}: {
  color?: string;
  className?: string;
}) => (
  <div
    aria-hidden="true"
    className={`pointer-events-none absolute rounded-full blur-[70px] ${className}`}
    style={{ background: color }}
  />
);

export const StickerPhoto = ({
  src,
  alt,
  size = 'md',
  className = '',
}: {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) => {
  const sizeClasses = {
    sm: 'h-24 w-24',
    md: 'h-36 w-36',
    lg: 'h-56 w-56',
    xl: 'h-72 w-72',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 160, damping: 16 }}
      className={`relative shrink-0 ${sizeClasses[size]} ${className}`}
    >
      <div className="absolute -inset-[6px] rounded-full border-[3px] border-white bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_10px_30px_rgba(0,0,0,0.35)]" />
      <img
        src={src}
        alt={alt}
        onError={(event) => { event.currentTarget.src = '/images/intro-poster.svg'; }}
        className="relative h-full w-full rounded-full object-cover"
      />
    </motion.div>
  );
};

export const SlideSurface = ({ palette, children, className, backgroundImage }: SlideSurfaceProps) => {
  return (
    <section
      className={`relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br ${palette.background} shadow-glow ${className ?? ''}`}
    >
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={backgroundImage}
            alt=""
            className="h-full w-full object-cover"
            onError={(event) => { event.currentTarget.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className={`pointer-events-none absolute inset-0 bg-gradient-to-t ${palette.backgroundAlt}`} />
        </div>
      )}
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${palette.backgroundAlt}`} />
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.38)_1px,transparent_0)] [background-size:24px_24px]" />
      <GrainOverlay />
      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </section>
  );
};

export const SlidePill = ({ children }: { children: ReactNode }) => (
  <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-white/75 backdrop-blur">
    {children}
  </span>
);

export const SlideScrollBody = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={`relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch] ${className}`}>
    {children}
  </div>
);
