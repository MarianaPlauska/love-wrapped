import { motion } from 'framer-motion';

type SkyChartProps = {
  constellation: string;
  moon: string;
  observation: string;
  image?: string;
};

const stars = [
  { left: '16%', top: '22%', size: 7 },
  { left: '39%', top: '34%', size: 5 },
  { left: '61%', top: '22%', size: 7 },
  { left: '81%', top: '43%', size: 5 },
  { left: '64%', top: '67%', size: 6 },
  { left: '32%', top: '72%', size: 5 },
];

const paths = [
  { left: '18%', top: '29%', width: '24%', rotate: 20 },
  { left: '42%', top: '31%', width: '23%', rotate: -25 },
  { left: '64%', top: '30%', width: '25%', rotate: 39 },
  { left: '68%', top: '51%', width: '20%', rotate: 108 },
  { left: '39%', top: '58%', width: '28%', rotate: -23 },
];

const dust = Array.from({ length: 18 }, (_, index) => ({
  left: `${(index * 37 + 11) % 100}%`,
  top: `${(index * 53 + 7) % 100}%`,
  size: 1 + (index % 3),
  delay: index * 0.18,
  duration: 2.5 + (index % 3) * 0.7,
}));

export const SkyChart = ({ constellation, moon, observation, image }: SkyChartProps) => (
  <div className="relative mt-5 min-h-48 overflow-hidden rounded-[1.75rem] border border-cyan-100/20 bg-[#071124]/80 px-5 py-5 shadow-[inset_0_0_70px_rgba(34,211,238,0.08)]">
    {image && <img src={image} alt="Céu no início da história" className="absolute inset-0 h-full w-full object-cover opacity-45" />}
    {image && <div className="absolute inset-0 bg-gradient-to-r from-[#071124] via-[#071124]/70 to-[#071124]/20" />}
    <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,rgba(186,230,253,0.6)_1px,transparent_0)] [background-size:18px_18px]" />
    {dust.map((particle, index) => (
      <motion.span
        key={`dust-${index}`}
        animate={{ opacity: [0.1, 0.7, 0.1], y: [0, -14, 0] }}
        transition={{ duration: particle.duration, delay: particle.delay, repeat: Infinity, ease: 'easeInOut' }}
        style={{ left: particle.left, top: particle.top, width: particle.size, height: particle.size }}
        className="absolute rounded-full bg-cyan-100/80 shadow-[0_0_8px_rgba(186,230,253,0.8)]"
      />
    ))}
    <motion.div animate={{ opacity: [0.35, 1, 0.35], scale: [0.96, 1.04, 0.96] }} transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }} className="absolute right-5 top-4 h-11 w-11 rounded-full bg-amber-100 shadow-[-10px_2px_0_0_#071124,0_0_28px_rgba(253,224,71,0.55)]" />
    {paths.map((path, index) => (
      <motion.span key={index} initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 0.65 }} transition={{ duration: 0.55, delay: 0.12 + index * 0.1 }} style={{ left: path.left, top: path.top, width: path.width, rotate: `${path.rotate}deg`, transformOrigin: 'left' }} className="absolute h-px bg-cyan-100/80" />
    ))}
    {stars.map((star, index) => (
      <motion.span key={index} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: [0.45, 1, 0.45], scale: [0.8, 1.15, 0.8] }} transition={{ duration: 2.8, delay: index * 0.17, repeat: Infinity, ease: 'easeInOut' }} style={{ left: star.left, top: star.top, width: star.size, height: star.size }} className="absolute rounded-full bg-cyan-100 shadow-[0_0_14px_rgba(186,230,253,1)]" />
    ))}
    <div className="relative z-10 max-w-[14ch]">
      <p className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-cyan-100/65">Carta do céu</p>
      <p className="mt-2 font-display text-3xl leading-none text-white">{constellation}</p>
      <p className="mt-2 text-xs leading-5 text-cyan-50/70">{moon}</p>
      <p className="mt-3 text-[0.63rem] font-semibold uppercase tracking-[0.14em] text-cyan-100/55">{observation}</p>
    </div>
  </div>
);