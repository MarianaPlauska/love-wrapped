import { buildWrappedAudioDataUri } from '../utils/audio';

export type WrappedPalette = {
  background: string;
  backgroundAlt: string;
  accent: string;
  accentAlt: string;
  accentSoft: string;
  text: string;
  muted: string;
};

export type WrappedMoment = {
  rank: number;
  title: string;
  subtitle: string;
  detail: string;
  accent: string;
  visual?: string;
};

export type WrappedSummaryCell = {
  label: string;
  value: string;
  detail: string;
  image: string;
};

export type WrappedMemoryPhoto = {
  id: string;
  image: string;
  caption: string;
  rotation: number;
  tapeColor: string;
};

export type WrappedVersusItem = {
  topic: string;
  leftLabel: string;
  rightLabel: string;
  winner: 'left' | 'right' | 'tie';
};

export type WrappedSpotlight = {
  label: string;
  title: string;
  subtitle: string;
  detail: string;
  backgroundImage: string;
};

export type WrappedYearPoster = {
  headline: string;
  bestDay: string;
  songOfTheYear: string;
  mood: string;
  quote: string;
  decorations: string[];
};

export type WrappedLoveReasons = {
  label: string;
  headline: string;
  reasons: string[];
};

export type WrappedLoveLetter = {
  greeting: string;
  body: string;
  signature: string;
};

export type WrappedTimelineEvent = {
  date: string;
  title: string;
  description: string;
  image: string;
};

export type WrappedTimeline = {
  label: string;
  headline: string;
  subcopy: string;
  events: WrappedTimelineEvent[];
};

export type WrappedRanking = {
  label: string;
  headline: string;
  subtitle: string;
  backgroundImage: string;
  entries: WrappedMoment[];
};

export type WrappedAudioTheme = 'love' | 'chill' | 'neon';

export type WrappedData = {
  schemaVersion: number;
  title: string;
  coupleNames: string;
  year: number;
  startDate: string;
  slideDurationMs: number;
  audioTheme: WrappedAudioTheme;
  audio: {
    label: string;
    source: string;
  };
  spotify: {
    featuredUri: string;
    playlistUri: string;
  };
  heroImages: {
    intro: string;
    introSecondary: string;
    summary: string;
  };
  memoryPhotos: WrappedMemoryPhoto[];
  palettes: {
    intro: WrappedPalette;
    metrics: WrappedPalette;
    genre: WrappedPalette;
    tracks: WrappedPalette;
    summary: WrappedPalette;
  };
  slides: {
    intro: {
      eyebrow: string;
      headline: string;
      body: string;
      kicker: string;
    };
    origin: {
      label: string;
      date: string;
      location: string;
      constellation: string;
      moon: string;
      observation: string;
      backgroundImage: string;
      skyImage: string;
      skyImageTitle?: string;
      skyImageCredit?: string;
      skyImageKind?: 'apod' | 'archive';
      nasaUrl: string;
      note: string;
    };
    foods: WrappedRanking;
    songs: WrappedRanking;
    favoriteMoment: WrappedSpotlight & {
      date: string;
    };
    relationshipSeries: WrappedSpotlight;
    metrics: {
      label: string;
      suffix: string;
      subcopy: string;
    };
    genre: {
      label: string;
      genre: string;
      percentage: number;
      descriptor: string;
      subcopy: string;
      bars: Array<{
        label: string;
        value: number;
        tone: string;
      }>;
    };
    moments: {
      label: string;
      headline: string;
      subtitle: string;
      moments: WrappedMoment[];
    };
    memories: {
      label: string;
      headline: string;
      subtitle: string;
    };
    versus: {
      label: string;
      headline: string;
      subtitle: string;
      items: WrappedVersusItem[];
    };
    yearPoster: WrappedYearPoster;
    loveReasons: WrappedLoveReasons;
    loveLetter: WrappedLoveLetter;
    timeline: WrappedTimeline;
    summary: {
      label: string;
      title: string;
      subtitle: string;
      cells: WrappedSummaryCell[];
      footer: string;
    };
  };
};

const wrappedData: WrappedData = {
  schemaVersion: 3,
  title: 'Wrapped das Mariannnas',
  coupleNames: 'Mariana & Marianna',
  year: 2026,
  startDate: '2024-04-14T00:00:00.000-03:00',
  slideDurationMs: 12000,
  audioTheme: 'love',
  audio: {
    label: 'Love Wrapped Theme',
    source: buildWrappedAudioDataUri(),
  },
  spotify: {
    featuredUri: '',
    playlistUri: '',
  },
  heroImages: {
    intro: '/images/couple/memory-1.svg',
    introSecondary: '/images/couple/memory-2.svg',
    summary: '/images/summary-poster.svg',
  },
  memoryPhotos: [
    { id: 'a', image: '/images/couple/memory-1.svg', caption: 'O primeiro encontro', rotation: -6, tapeColor: 'bg-lime-300/70' },
    { id: 'b', image: '/images/couple/memory-2.svg', caption: 'Domingo de chuva', rotation: 4, tapeColor: 'bg-fuchsia-300/70' },
    { id: 'c', image: '/images/couple/memory-3.svg', caption: 'Aquela viagem', rotation: -3, tapeColor: 'bg-cyan-300/70' },
    { id: 'd', image: '/images/couple/memory-4.svg', caption: 'Risada sem motivo', rotation: 7, tapeColor: 'bg-amber-300/70' },
  ],
  palettes: {
    intro: {
      background: 'from-zinc-950 via-zinc-900 to-black',
      backgroundAlt: 'from-lime-400/25 via-transparent to-cyan-400/15',
      accent: 'text-lime-300',
      accentAlt: 'text-cyan-200',
      accentSoft: 'bg-lime-400/10',
      text: 'text-white',
      muted: 'text-white/70',
    },
    metrics: {
      background: 'from-zinc-950 via-zinc-900 to-black',
      backgroundAlt: 'from-lime-400/20 via-transparent to-emerald-400/10',
      accent: 'text-lime-400',
      accentAlt: 'text-white',
      accentSoft: 'bg-lime-400/10',
      text: 'text-white',
      muted: 'text-white/75',
    },
    genre: {
      background: 'from-zinc-950 via-zinc-900 to-black',
      backgroundAlt: 'from-rose-500/15 via-transparent to-lime-400/10',
      accent: 'text-rose-200',
      accentAlt: 'text-lime-300',
      accentSoft: 'bg-rose-500/10',
      text: 'text-white',
      muted: 'text-white/70',
    },
    tracks: {
      background: 'from-zinc-950 via-zinc-900 to-black',
      backgroundAlt: 'from-rose-500/15 via-transparent to-amber-400/10',
      accent: 'text-rose-200',
      accentAlt: 'text-lime-300',
      accentSoft: 'bg-rose-500/10',
      text: 'text-white',
      muted: 'text-white/70',
    },
    summary: {
      background: 'from-zinc-950 via-zinc-900 to-black',
      backgroundAlt: 'from-lime-400/20 via-transparent to-rose-500/10',
      accent: 'text-lime-300',
      accentAlt: 'text-white',
      accentSoft: 'bg-white/10',
      text: 'text-white',
      muted: 'text-white/72',
    },
  },
  slides: {
    intro: {
      eyebrow: 'A nossa retrospectiva',
      headline: 'Nós duas, em replay.',
      body: 'Uma história feita de nós duas, dos nossos lugares e de tudo o que virou memória.',
      kicker: 'Wrapped das Mariannnas · 2026',
    },
    origin: {
      label: 'Onde tudo começou',
      date: '14 de abril de 2024',
      location: 'Rio de Janeiro, Brasil',
      constellation: 'Gêmeos',
      moon: 'Lua crescente, cerca de 38° acima do horizonte',
      observation: 'Rio de Janeiro · 14/04/2024 · aproximadamente 17h BRT',
      backgroundImage: '/images/couple/memory-1.svg',
      skyImage: '',
      nasaUrl: 'https://science.nasa.gov/resource/moon-phase-and-libration-2024/',
      note: 'No fim da tarde, a Lua crescente aparecia no céu do Rio. A primeira coordenada de uma história que acabava de começar.',
    },
    foods: {
      label: 'Comida do casal',
      headline: 'Qual é a escolha que sempre vence?',
      subtitle: 'Uma resposta óbvia para quem conhece a gente.',
      backgroundImage: '',
      entries: [
        { rank: 1, title: 'Pizza', subtitle: 'A escolha oficial', detail: 'Não importa a ocasião: pizza sempre entra na conversa.', accent: 'text-amber-200', visual: 'pizza' },
      ],
    },
    songs: {
      label: 'Música do casal',
      headline: 'Qual faixa conta a nossa história?',
      subtitle: 'Toque para descobrir a música que representa a gente.',
      backgroundImage: '',
      entries: [
        { rank: 1, title: 'Nossa música', subtitle: 'A trilha da nossa história', detail: 'Edite este título no painel e coloque a música de vocês duas.', accent: 'text-lime-300', visual: 'vinyl' },
      ],
    },
    favoriteMoment: {
      label: 'Momento favorito',
      title: 'Jogo do Fluminense',
      subtitle: 'Uma memória para ficar em replay',
      detail: 'Um dia de arquibancada, torcida e companhia certa.',
      date: '2024-09-01',
      backgroundImage: '/images/couple/memory-1.svg',
    },
    relationshipSeries: {
      label: 'A série do relacionamento',
      title: 'Brooklyn Nine-Nine',
      subtitle: 'Comédia, parceria e caos muito bem organizado.',
      detail: 'A gente se entende até quando o plano sai completamente do controle.',
      backgroundImage: '',
    },
    metrics: {
      label: 'Dias juntos',
      suffix: 'dias',
      subcopy: 'Contagem calculada em tempo real a partir da data de início.',
    },
    genre: {
      label: 'Gênero do relacionamento',
      genre: 'Comédia Romântica com 85% de Caos Diário',
      percentage: 85,
      descriptor: 'Predominantemente leve, sarcástico e absurdamente afetuoso.',
      subcopy: 'Uma leitura visual da vibe que mais apareceu no ano.',
      bars: [
        { label: 'Deboche carinhoso', value: 96, tone: 'bg-white' },
        { label: 'Rotina compartilhada', value: 82, tone: 'bg-white' },
        { label: 'Ciúme bobo', value: 44, tone: 'bg-white' },
        { label: 'Planos espontâneos', value: 71, tone: 'bg-white' },
      ],
    },
    moments: {
      label: 'Top 5 momentos',
      headline: 'As memórias que mais tocaram em looping',
      subtitle: 'Como um tracklist, mas com histórias que vocês realmente contariam no replay.',
      moments: [
        { rank: 1, title: 'Aquela viagem improvisada', subtitle: 'Memória com brilho máximo', detail: 'Dois mapas, um celular sem bateria e uma história boa.', accent: 'text-lime-300' },
        { rank: 2, title: 'A piada interna eterna', subtitle: 'Repetida demais para morrer', detail: 'Uma frase curta que ainda derruba vocês no meio da rua.', accent: 'text-fuchsia-200' },
        { rank: 3, title: 'O jantar que virou caos feliz', subtitle: 'Menos gourmet, mais épico', detail: 'Comida caiu, risada subiu e virou referência do casal.', accent: 'text-cyan-200' },
        { rank: 4, title: 'A conversa de madrugada', subtitle: 'Longa, honesta e leve', detail: 'Quando o silêncio virou conforto e o relógio perdeu o sentido.', accent: 'text-amber-200' },
        { rank: 5, title: 'O “vamos só passar lá”', subtitle: 'Resultado: plano novo', detail: 'Uma saída simples que acabou renderando a melhor foto do ano.', accent: 'text-rose-200' },
      ],
    },
    memories: {
      label: 'Memórias em Polaroid',
      headline: 'Algumas fotos do nosso rolo',
      subtitle: 'Tiradas sem pose, mas com sentimento.',
    },
    versus: {
      label: 'Quem é mais?',
      headline: 'Dez vereditos sobre a gente',
      subtitle: 'Primeiro a pergunta. Depois, o veredito que pode render discussão.',
      items: [
        { topic: 'Pede pizza mesmo com outras opções', leftLabel: 'Eu', rightLabel: 'Ela', winner: 'right' },
        { topic: 'Manda mensagem primeiro depois de uma discussão', leftLabel: 'Eu', rightLabel: 'Ela', winner: 'left' },
        { topic: 'Demora mais para se arrumar', leftLabel: 'Eu', rightLabel: 'Ela', winner: 'right' },
        { topic: 'Faz a outra rir na hora errada', leftLabel: 'Eu', rightLabel: 'Ela', winner: 'left' },
        { topic: 'Planeja o próximo encontro', leftLabel: 'Eu', rightLabel: 'Ela', winner: 'right' },
        { topic: 'Rouba mais espaço na cama', leftLabel: 'Eu', rightLabel: 'Ela', winner: 'left' },
        { topic: 'Chora primeiro vendo uma série', leftLabel: 'Eu', rightLabel: 'Ela', winner: 'right' },
        { topic: 'Envia mais memes durante o dia', leftLabel: 'Eu', rightLabel: 'Ela', winner: 'left' },
        { topic: 'Transforma qualquer saída em foto', leftLabel: 'Eu', rightLabel: 'Ela', winner: 'right' },
        { topic: 'Diz eu te amo do nada', leftLabel: 'Eu', rightLabel: 'Ela', winner: 'tie' },
      ],
    },
    yearPoster: {
      headline: 'O nosso 2024 em uma imagem',
      bestDay: '14 de abril',
      songOfTheYear: 'Aquela que tocou no primeiro beijo',
      mood: 'Caos + carinho',
      quote: 'Em todas as versões da nossa história, eu escolheria você de novo.',
      decorations: ['—', '+', '×', '·'],
    },
    loveReasons: {
      label: 'Por que eu te amo',
      headline: 'Algumas das razões que me fazem escolher você todos os dias',
      reasons: [
        'Do seu jeito de rir das minhas piadas ruins.',
        'Da paciência que você tem nos dias difíceis.',
        'De como qualquer lugar fica bom com você do lado.',
        'Das suas mãos que parecem ter sido feitas para as minhas.',
        'Do seu amor que me faz querer ser melhor.',
      ],
    },
    loveLetter: {
      greeting: 'Para você, meu amor',
      body: 'Se eu pudesse reunir em palavras tudo o que você significa para mim, precisaria de muito mais do que uma carta. Mas saiba que em cada risada, em cada silêncio, em cada plano espontâneo, eu te encontro. Você é minha pessoa favorita em todo o universo.',
      signature: 'Com todo o meu amor',
    },
    timeline: {
      label: 'Nossa linha do tempo',
      headline: 'Os momentos que construíram a gente',
      subcopy: 'Cada data é um capítulo da nossa história.',
      events: [
        { date: '14/04/2024', title: 'O primeiro encontro', description: 'Quando descobrimos que conversar com você era a melhor parte do dia.', image: '/images/couple/memory-1.svg' },
        { date: '14/04/2024', title: 'O primeiro beijo', description: 'O momento em que tudo deixou de ser só interessante e virou inesquecível.', image: '/images/couple/memory-2.svg' },
        { date: '01/09/2024', title: 'Jogo do Fluminense', description: 'Torcida, gritaria e a certeza de que qualquer lugar fica bom com você do lado.', image: '/images/couple/memory-3.svg' },
        { date: '10/12/2024', title: 'Viagem de fim de ano', description: 'Malas desarrumadas, mapas errados e memórias perfeitas.', image: '/images/couple/memory-4.svg' },
      ],
    },
    summary: {
      label: 'Nosso resumo',
      title: 'Wrapped das Mariannnas',
      subtitle: 'Tudo o que fez a nossa história ser só nossa.',
      cells: [
        { label: 'Dias juntos', value: '', detail: 'contados até hoje', image: '/images/summary-1.svg' },
        { label: 'Piadas internas', value: '27', detail: 'e aumentando', image: '/images/summary-2.svg' },
        { label: 'Fotos favoritas', value: '12', detail: 'selecionadas no rolo', image: '/images/summary-3.svg' },
        { label: 'Clima dominante', value: 'Caos + carinho', detail: 'sem filtro', image: '/images/summary-4.svg' },
      ],
      footer: 'Feito com amor, memória e um pouco do nosso caos.',
    },
  },
};

export default wrappedData;
