import { motion } from 'framer-motion';

export const rankingVisualOptions = {
  food: [
    { value: 'pizza', label: 'Pizza em fatias' },
    { value: 'sushi', label: 'Sushi neon' },
    { value: 'burger', label: 'Hamburguer empilhado' },
    { value: 'coffee', label: 'Cafe com vapor' },
    { value: 'pasta', label: 'Massa em espiral' },
  ],
  music: [
    { value: 'vinyl', label: 'Disco em giro' },
    { value: 'cassette', label: 'Fita cassete' },
    { value: 'roadtrip', label: 'Rota de viagem' },
    { value: 'karaoke', label: 'Microfone karaoke' },
    { value: 'starlight', label: 'Estrela brilhante' },
  ],
} as const;

type RankingArtworkProps = {
  visual?: string;
  category: 'food' | 'music';
  compact?: boolean;
};

const ArtworkFrame = ({ children, compact = false }: { children: React.ReactNode; compact?: boolean }) => (
  <motion.div
    initial={{ opacity: 0, rotate: -8, scale: 0.72 }}
    animate={{ opacity: 1, rotate: 0, scale: 1 }}
    transition={{ type: 'spring', stiffness: 170, damping: 16, delay: 0.1 }}
    className={`relative shrink-0 ${compact ? 'h-12 w-12' : 'h-48 w-48'}`}
  >
    {children}
  </motion.div>
);

const PizzaArtwork = ({ compact }: { compact?: boolean }) => (
  <ArtworkFrame compact={compact}>
    <motion.div animate={{ rotate: [0, -5, 4, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }} className="absolute inset-[7%] rotate-[18deg] rounded-[50%_50%_48%_52%] border-[7px] border-amber-100 bg-gradient-to-br from-amber-300 via-orange-400 to-rose-500 shadow-[inset_0_0_0_6px_rgba(145,42,18,0.3),0_18px_35px_rgba(251,146,60,0.22)]">
      <span className="absolute left-[22%] top-[27%] h-[18%] w-[18%] rounded-full bg-rose-900/80" />
      <span className="absolute right-[20%] top-[42%] h-[15%] w-[15%] rounded-full bg-rose-900/80" />
      <span className="absolute bottom-[18%] left-[40%] h-[16%] w-[16%] rounded-full bg-rose-900/80" />
    </motion.div>
    {!compact && <span className="absolute -right-3 top-1 rotate-12 text-5xl text-lime-200">+</span>}
  </ArtworkFrame>
);

const SushiArtwork = ({ compact }: { compact?: boolean }) => (
  <ArtworkFrame compact={compact}>
    <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }} className="absolute inset-[8%] rounded-[38%] bg-white p-[12%] shadow-[0_16px_35px_rgba(244,114,182,0.24)]">
      <div className="h-full w-full rounded-full border-[8px] border-rose-500 bg-orange-300 shadow-[inset_0_0_0_7px_rgba(136,19,55,0.3)]" />
    </motion.div>
    {!compact && <div className="absolute -left-3 top-1/2 h-2 w-16 -rotate-45 rounded-full bg-lime-300" />}
  </ArtworkFrame>
);

const BurgerArtwork = ({ compact }: { compact?: boolean }) => (
  <ArtworkFrame compact={compact}>
    <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }} className="absolute inset-[12%] flex flex-col justify-center gap-[7%]">
      <div className="h-[22%] rounded-t-[100%] border-b-4 border-amber-900/35 bg-gradient-to-b from-amber-200 to-orange-400" />
      <div className="h-[8%] -rotate-2 rounded-full bg-lime-300" />
      <div className="h-[14%] rounded-full bg-rose-900" />
      <div className="h-[8%] rotate-1 rounded-full bg-amber-200" />
      <div className="h-[18%] rounded-b-[100%] bg-gradient-to-b from-orange-400 to-amber-600" />
    </motion.div>
  </ArtworkFrame>
);

const CoffeeArtwork = ({ compact }: { compact?: boolean }) => (
  <ArtworkFrame compact={compact}>
    <motion.div animate={{ rotate: [0, 4, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-[12%] left-[13%] h-[58%] w-[64%] rounded-b-[30%] rounded-t-[10%] border-4 border-fuchsia-100 bg-fuchsia-300 shadow-[0_14px_35px_rgba(232,121,249,0.2)]">
      <div className="absolute -right-[32%] top-[17%] h-[45%] w-[42%] rounded-r-full border-4 border-fuchsia-100" />
      <div className="absolute left-[12%] top-[9%] h-[22%] w-[72%] rounded-full bg-zinc-950" />
    </motion.div>
    {!compact && <><motion.span animate={{ y: [0, -14, 0], opacity: [0.2, 1, 0.2] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute left-[29%] top-0 text-4xl text-cyan-100">~</motion.span><motion.span animate={{ y: [0, -16, 0], opacity: [0.2, 1, 0.2] }} transition={{ duration: 2.5, delay: 0.45, repeat: Infinity }} className="absolute left-[54%] top-[5%] text-4xl text-cyan-100">~</motion.span></>}
  </ArtworkFrame>
);

const PastaArtwork = ({ compact }: { compact?: boolean }) => (
  <ArtworkFrame compact={compact}>
    <motion.div animate={{ rotate: 360 }} transition={{ duration: 9, repeat: Infinity, ease: 'linear' }} className="absolute inset-[9%] rounded-full border-[13px] border-amber-300 shadow-[inset_0_0_0_7px_rgba(251,113,133,0.8)]" />
    <motion.div animate={{ rotate: -360 }} transition={{ duration: 7, repeat: Infinity, ease: 'linear' }} className="absolute inset-[27%] rounded-full border-[10px] border-lime-200" />
  </ArtworkFrame>
);

const VinylArtwork = ({ compact }: { compact?: boolean }) => (
  <ArtworkFrame compact={compact}>
    <motion.div animate={{ rotate: 360 }} transition={{ duration: 7, repeat: Infinity, ease: 'linear' }} className="absolute inset-[4%] rounded-full border-[11px] border-zinc-500 bg-zinc-950 shadow-[inset_0_0_0_5px_rgba(255,255,255,0.12),inset_0_0_0_18px_rgba(255,255,255,0.06),0_16px_35px_rgba(0,0,0,0.35)]">
      <div className="absolute inset-[31%] rounded-full bg-lime-300" />
      <div className="absolute inset-[46%] rounded-full bg-zinc-950" />
    </motion.div>
  </ArtworkFrame>
);

const CassetteArtwork = ({ compact }: { compact?: boolean }) => (
  <ArtworkFrame compact={compact}>
    <motion.div animate={{ rotate: [0, 2, -2, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }} className="absolute inset-[12%] rounded-[16%] border-4 border-cyan-100 bg-fuchsia-400 p-[16%] shadow-[0_15px_35px_rgba(232,121,249,0.25)]">
      <div className="flex h-[45%] items-center justify-around rounded-md bg-zinc-950"><span className="h-[48%] w-[22%] rounded-full border-2 border-cyan-200" /><span className="h-[48%] w-[22%] rounded-full border-2 border-cyan-200" /></div>
      <div className="mt-[12%] h-[28%] rounded-sm bg-amber-200/90" />
    </motion.div>
  </ArtworkFrame>
);

const RoadtripArtwork = ({ compact }: { compact?: boolean }) => (
  <ArtworkFrame compact={compact}>
    <motion.div animate={{ pathLength: [0.1, 1, 0.1] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="absolute inset-[10%] rounded-[45%] border-[10px] border-dashed border-cyan-200 rotate-[32deg]" />
    <motion.span animate={{ x: [0, 18, 0], y: [0, -9, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} className="absolute left-[38%] top-[36%] text-5xl text-lime-300">*</motion.span>
  </ArtworkFrame>
);

const KaraokeArtwork = ({ compact }: { compact?: boolean }) => (
  <ArtworkFrame compact={compact}>
    <motion.div animate={{ rotate: [-8, 8, -8] }} transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }} className="absolute left-[37%] top-[8%] h-[60%] w-[30%] rounded-full border-4 border-white bg-cyan-300 shadow-[0_15px_35px_rgba(103,232,249,0.2)]">
      <div className="absolute -bottom-[56%] left-[40%] h-[62%] w-4 rounded-full bg-white" />
      <div className="absolute -bottom-[62%] left-[-48%] h-4 w-[200%] rounded-full bg-white" />
    </motion.div>
  </ArtworkFrame>
);

const StarlightArtwork = ({ compact }: { compact?: boolean }) => (
  <ArtworkFrame compact={compact}>
    <motion.div animate={{ scale: [0.85, 1.14, 0.85], rotate: [0, 12, 0] }} transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }} className="absolute inset-[12%] flex items-center justify-center text-[9rem] leading-none text-amber-200 drop-shadow-[0_0_28px_rgba(253,224,71,0.6)]">*</motion.div>
  </ArtworkFrame>
);

export const RankingArtwork = ({ visual, category, compact = false }: RankingArtworkProps) => {
  const resolvedVisual = visual ?? (category === 'food' ? 'pizza' : 'vinyl');
  const artworkProps = { compact };

  switch (resolvedVisual) {
    case 'sushi': return <SushiArtwork {...artworkProps} />;
    case 'burger': return <BurgerArtwork {...artworkProps} />;
    case 'coffee': return <CoffeeArtwork {...artworkProps} />;
    case 'pasta': return <PastaArtwork {...artworkProps} />;
    case 'cassette': return <CassetteArtwork {...artworkProps} />;
    case 'roadtrip': return <RoadtripArtwork {...artworkProps} />;
    case 'karaoke': return <KaraokeArtwork {...artworkProps} />;
    case 'starlight': return <StarlightArtwork {...artworkProps} />;
    case 'vinyl': return <VinylArtwork {...artworkProps} />;
    default: return <PizzaArtwork {...artworkProps} />;
  }
};