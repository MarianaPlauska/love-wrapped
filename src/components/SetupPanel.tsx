import { type ChangeEvent, type FormEvent, useState } from 'react';

import type { WrappedData } from '../data/wrappedData';
import { rankingVisualOptions } from './Slides/RankingArtwork';
import { audioThemes } from '../utils/audio';
import { loadNasaSkyReference } from '../utils/nasa';
import { getWrappedImage, imageLabels, setWrappedImage, type ImageSlot } from '../utils/wrappedImages';

type SetupPanelProps = {
  data: WrappedData;
  shareUrl?: string;
  spotifyImportAvailable: boolean;
  onClose: () => void;
  onRestoreDefaults: () => void;
  onSave: (data: WrappedData) => Promise<string | undefined> | string | undefined;
  onSpotifyImport: () => Promise<void>;
};

const maximumImageBytes = 1_500_000;

const updateRanking = (data: WrappedData, ranking: 'foods' | 'songs', index: number, field: 'title' | 'subtitle' | 'visual', value: string): WrappedData => ({
  ...data,
  slides: {
    ...data.slides,
    [ranking]: {
      ...data.slides[ranking],
      entries: data.slides[ranking].entries.map((entry, entryIndex) => (
        entryIndex === index ? { ...entry, [field]: value } : entry
      )),
    },
  },
});

const defaultImage = '/images/couple/memory-1.svg';

const isUploadedImage = (source?: string): boolean => Boolean(
  source && source.startsWith('data:image/') || (source && source.startsWith('gift-media://')),
);

type ImageUploadButtonProps = {
  slot: ImageSlot;
  label: string;
  source?: string;
  onChange: (slot: ImageSlot, event: ChangeEvent<HTMLInputElement>) => void;
};

const ImageUploadButton = ({ slot, label, source, onChange }: ImageUploadButtonProps) => {
  const hasImage = Boolean(source && source !== defaultImage && !source.startsWith('/images/'));
  const isBase64 = source?.startsWith('data:image/');

  return (
    <label className="relative flex min-h-[7.5rem] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-white/25 bg-white/5 p-3 text-center transition active:scale-[0.98] active:border-lime-300 has-[:focus-visible]:border-lime-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-lime-300/40">
      <input type="file" accept="image/*" onChange={(event) => onChange(slot, event)} className="sr-only" />
      {hasImage && source ? (
        <>
          <img
            src={source}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover ${isBase64 ? 'opacity-60' : 'opacity-40'}`}
          />
          <span className="relative z-10 max-w-full truncate px-1 text-xs font-semibold text-white drop-shadow">
            {label}
          </span>
          <span className="relative z-10 mt-1 inline-flex items-center gap-1 rounded-full bg-lime-300 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-950">
            Trocar
          </span>
        </>
      ) : (
        <>
          <span className="text-2xl leading-none text-white/50">+</span>
          <span className="mt-1 text-xs font-semibold leading-tight text-white/80">{label}</span>
          <span className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/45">Toque para enviar</span>
        </>
      )}
    </label>
  );
};


export const SetupPanel = ({ data, shareUrl, spotifyImportAvailable, onClose, onRestoreDefaults, onSave, onSpotifyImport }: SetupPanelProps) => {
  const [draft, setDraft] = useState<WrappedData>(data);
  const [imageError, setImageError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [savedShareUrl, setSavedShareUrl] = useState(shareUrl ?? '');
  const [copied, setCopied] = useState(false);
  const [isLoadingNasaImage, setIsLoadingNasaImage] = useState(false);
  const [nasaImageError, setNasaImageError] = useState('');

  const updateIntro = (field: keyof WrappedData['slides']['intro'], value: string) => {
    setDraft((current) => ({
      ...current,
      slides: {
        ...current.slides,
        intro: { ...current.slides.intro, [field]: value },
      },
    }));
  };

  const handleImage = (slot: ImageSlot, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setImageError('');

    // Permite selecionar o mesmo arquivo novamente depois.
    const input = event.target;
    if (input) input.value = '';

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/') || file.size > maximumImageBytes) {
      setImageError('Use uma imagem de até 1,5 MB. Arquivos menores mantêm o presente rápido.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const imageSource = reader.result;

      if (typeof imageSource === 'string') {
        setDraft((current) => setWrappedImage(current, slot, imageSource));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleNasaImage = async () => {
    setIsLoadingNasaImage(true);
    setNasaImageError('');

    try {
      const reference = await loadNasaSkyReference(draft.startDate.slice(0, 10));
      setDraft((current) => ({
        ...current,
        slides: {
          ...current.slides,
          origin: {
            ...current.slides.origin,
            skyImage: reference.image,
            skyImageTitle: reference.title,
            skyImageCredit: reference.credit,
            skyImageKind: reference.kind,
            nasaUrl: reference.sourceUrl,
          },
        },
      }));
    } catch {
      setNasaImageError('A NASA não retornou uma imagem agora. Tente novamente mais tarde ou envie uma foto própria.');
    } finally {
      setIsLoadingNasaImage(false);
    }
  };

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setSaveError('');
    setSaveSuccess(false);

    try {
      const nextShareUrl = await onSave(draft);
      if (nextShareUrl) setSavedShareUrl(nextShareUrl);
      setSaveSuccess(true);
      // Fecha o editor e volta ao carrossel para que "Salvar e ver" realmente mostre o resultado.
      window.setTimeout(() => {
        setIsSaving(false);
        onClose();
      }, 450);
    } catch {
      setSaveError('Não foi possível salvar. Revise a conexão com o sistema e tente novamente.');
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-zinc-950 text-white">
      <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-lime-300">Wrapped das Mariannnas</p>
          <h1 className="mt-1 font-display text-2xl leading-none">Editar presente</h1>
        </div>
        <button type="button" onClick={onClose} className="text-sm font-semibold text-white/70 hover:text-white">Voltar</button>
      </header>

      <form onSubmit={handleSubmit} className="flex-1 space-y-7 overflow-y-auto px-5 py-6 pb-32">
        <section className="space-y-3">
          <h2 className="font-display text-xl">Vocês duas</h2>
          <label className="block text-sm text-white/70">
            Nomes do casal
            <input value={draft.coupleNames} onChange={(event) => setDraft((current) => ({ ...current, coupleNames: event.target.value }))} className="mt-2 w-full rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm text-white/70">
              Ano do Wrapped
              <input type="number" min="2020" max="2100" value={draft.year} onChange={(event) => setDraft((current) => ({ ...current, year: Number(event.target.value) }))} className="mt-2 w-full rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300" />
            </label>
            <label className="block text-sm text-white/70">
              Início do namoro
              <input type="date" value={draft.startDate.slice(0, 10)} onChange={(event) => setDraft((current) => ({ ...current, startDate: `${event.target.value}T00:00:00.000` }))} className="mt-2 w-full rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300" />
            </label>
          </div>
        </section>

        <section className="space-y-3 border-t border-white/10 pt-6">
          <h2 className="font-display text-xl">Abertura</h2>
          <label className="block text-sm text-white/70">
            Frase principal
            <textarea value={draft.slides.intro.headline} onChange={(event) => updateIntro('headline', event.target.value)} rows={3} className="mt-2 w-full resize-none rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300" />
          </label>
          <label className="block text-sm text-white/70">
            Texto de apoio
            <textarea value={draft.slides.intro.body} onChange={(event) => updateIntro('body', event.target.value)} rows={2} className="mt-2 w-full resize-none rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300" />
          </label>
        </section>

        <section className="space-y-3 border-t border-white/10 pt-6">
          <h2 className="font-display text-xl">Onde tudo começou</h2>
          <label className="block text-sm text-white/70">
            Data por extenso
            <input value={draft.slides.origin.date} onChange={(event) => setDraft((current) => ({ ...current, slides: { ...current.slides, origin: { ...current.slides.origin, date: event.target.value } } }))} className="mt-2 w-full rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300" />
          </label>
          <label className="block text-sm text-white/70">
            Local
            <input value={draft.slides.origin.location} onChange={(event) => setDraft((current) => ({ ...current, slides: { ...current.slides, origin: { ...current.slides.origin, location: event.target.value } } }))} className="mt-2 w-full rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300" />
          </label>
          <label className="block text-sm text-white/70">
            Lua naquela tarde
            <input value={draft.slides.origin.moon} onChange={(event) => setDraft((current) => ({ ...current, slides: { ...current.slides, origin: { ...current.slides.origin, moon: event.target.value } } }))} className="mt-2 w-full rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300" />
          </label>
          <label className="block text-sm text-white/70">
            Constelação observada (opcional)
            <input value={draft.slides.origin.constellation} onChange={(event) => setDraft((current) => ({ ...current, slides: { ...current.slides, origin: { ...current.slides.origin, constellation: event.target.value } } }))} className="mt-2 w-full rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300" />
          </label>
          <label className="block text-sm text-white/70">
            Janela de observação
            <input value={draft.slides.origin.observation} onChange={(event) => setDraft((current) => ({ ...current, slides: { ...current.slides, origin: { ...current.slides.origin, observation: event.target.value } } }))} className="mt-2 w-full rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300" />
          </label>
          <label className="block text-sm text-white/70">
            Fonte NASA para a Lua
            <input type="url" value={draft.slides.origin.nasaUrl} onChange={(event) => setDraft((current) => ({ ...current, slides: { ...current.slides, origin: { ...current.slides.origin, nasaUrl: event.target.value } } }))} className="mt-2 w-full rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300" />
          </label>
          <button type="button" onClick={() => { void handleNasaImage(); }} disabled={isLoadingNasaImage} className="w-full rounded-xl border border-cyan-200/35 px-4 py-3 text-sm font-bold text-cyan-100 hover:border-cyan-100 hover:bg-cyan-100/10 disabled:cursor-wait disabled:opacity-60">{isLoadingNasaImage ? 'Buscando na NASA...' : 'Usar imagem da NASA para esta data'}</button>
          <p className="text-xs leading-5 text-white/50">Envie a imagem do céu na seção Fotos abaixo. Ela aparece sob a carta celeste, com o traçado da constelação por cima.</p>
          <p className="text-xs leading-5 text-white/50">A busca consulta o APOD pela data. Quando a publicação for um vídeo, usa uma imagem lunar da NASA e mostra o crédito no cartão.</p>
          {nasaImageError && <p role="alert" className="text-sm leading-6 text-amber-200">{nasaImageError}</p>}
          <a href="https://science.nasa.gov/resource/moon-phase-and-libration-2024/" target="_blank" rel="noreferrer" className="inline-flex text-sm font-semibold text-lime-200 underline decoration-lime-300/40 underline-offset-4 hover:text-lime-100">Abrir visualização lunar da NASA</a>
          <label className="block text-sm text-white/70">
            Memória daquele dia
            <textarea value={draft.slides.origin.note} onChange={(event) => setDraft((current) => ({ ...current, slides: { ...current.slides, origin: { ...current.slides.origin, note: event.target.value } } }))} rows={3} className="mt-2 w-full resize-none rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300" />
          </label>
        </section>

        {(['foods', 'songs'] as const).map((ranking) => (
          <section key={ranking} className="space-y-3 border-t border-white/10 pt-6">
            <h2 className="font-display text-xl">{ranking === 'foods' ? 'Comida do casal' : 'Música do casal'}</h2>
            <p className="text-sm leading-6 text-white/60">Esta resposta aparece somente depois do toque.</p>
            {draft.slides[ranking].entries.map((entry, index) => (
              <div key={entry.rank} className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-lime-300">Resposta</p>
                <input value={entry.title} onChange={(event) => setDraft((current) => updateRanking(current, ranking, index, 'title', event.target.value))} aria-label={`Título ${ranking} ${index + 1}`} className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-lime-300" />
                <input value={entry.subtitle} onChange={(event) => setDraft((current) => updateRanking(current, ranking, index, 'subtitle', event.target.value))} aria-label={`Subtítulo ${ranking} ${index + 1}`} className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-lime-300" />
                <textarea
                  value={entry.detail}
                  onChange={(event) => setDraft((current) => ({
                    ...current,
                    slides: {
                      ...current.slides,
                      [ranking]: {
                        ...current.slides[ranking],
                        entries: current.slides[ranking].entries.map((item, itemIndex) => itemIndex === index ? { ...item, detail: event.target.value } : item),
                      },
                    },
                  }))}
                  placeholder="Por que essa resposta representa vocês duas?"
                  rows={2}
                  aria-label={`Sobre ${ranking} ${index + 1}`}
                  className="w-full resize-none rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-lime-300"
                />
                <select value={entry.visual ?? rankingVisualOptions[ranking === 'foods' ? 'food' : 'music'][0].value} onChange={(event) => setDraft((current) => updateRanking(current, ranking, index, 'visual', event.target.value))} aria-label={`Tema visual ${ranking} ${index + 1}`} className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-lime-300">
                  {rankingVisualOptions[ranking === 'foods' ? 'food' : 'music'].map((option) => <option key={option.value} value={option.value} className="bg-zinc-950">{option.label}</option>)}
                </select>
              </div>
            ))}
          </section>
        ))}

        <section className="space-y-3 border-t border-white/10 pt-6">
          <h2 className="font-display text-xl">Story: horas juntas</h2>
          <p className="text-sm leading-6 text-white/60">Aparece logo depois de &quot;Onde tudo começou&quot;, antes da pizza.</p>
          <label className="block text-sm text-white/70">
            Título
            <input value={draft.slides.hoursStory.headline} onChange={(event) => setDraft((current) => ({ ...current, slides: { ...current.slides, hoursStory: { ...current.slides.hoursStory, headline: event.target.value } } }))} className="mt-2 w-full rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300" />
          </label>
          <label className="block text-sm text-white/70">
            Subtítulo
            <input value={draft.slides.hoursStory.subcopy} onChange={(event) => setDraft((current) => ({ ...current, slides: { ...current.slides, hoursStory: { ...current.slides.hoursStory, subcopy: event.target.value } } }))} className="mt-2 w-full rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300" />
          </label>
          <label className="block text-sm text-white/70">
            Fato curioso engraçado
            <textarea value={draft.slides.hoursStory.funFact} onChange={(event) => setDraft((current) => ({ ...current, slides: { ...current.slides, hoursStory: { ...current.slides.hoursStory, funFact: event.target.value } } }))} rows={2} className="mt-2 w-full resize-none rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300" />
          </label>
        </section>

        <section className="space-y-3 border-t border-white/10 pt-6">
          <h2 className="font-display text-xl">Story: nossa música</h2>
          <p className="text-sm leading-6 text-white/60">Aparece depois do player, com foto do casal e texto editável.</p>
          <label className="block text-sm text-white/70">
            Título
            <input value={draft.slides.spotifyStory.headline} onChange={(event) => setDraft((current) => ({ ...current, slides: { ...current.slides, spotifyStory: { ...current.slides.spotifyStory, headline: event.target.value } } }))} className="mt-2 w-full rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300" />
          </label>
          <label className="block text-sm text-white/70">
            Subtítulo
            <input value={draft.slides.spotifyStory.subcopy} onChange={(event) => setDraft((current) => ({ ...current, slides: { ...current.slides, spotifyStory: { ...current.slides.spotifyStory, subcopy: event.target.value } } }))} className="mt-2 w-full rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300" />
          </label>
          <label className="block text-sm text-white/70">
            Foto de capa
            <select value={draft.slides.spotifyStory.coverSlot} onChange={(event) => setDraft((current) => ({ ...current, slides: { ...current.slides, spotifyStory: { ...current.slides.spotifyStory, coverSlot: event.target.value as 'intro' | 'introSecondary' } } }))} className="mt-2 w-full rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300">
              <option value="intro" className="bg-zinc-950">Círculo da Mariana</option>
              <option value="introSecondary" className="bg-zinc-950">Círculo da Marianna</option>
            </select>
          </label>
        </section>

        <section className="space-y-3 border-t border-white/10 pt-6">
          <h2 className="font-display text-xl">Momento favorito</h2>
          <ImageUploadButton
            slot="favorite-moment"
            label="Foto do jogo do Fluminense"
            source={getWrappedImage(draft, 'favorite-moment')}
            onChange={handleImage}
          />
          <label className="block text-sm text-white/70">
            Momento
            <input value={draft.slides.favoriteMoment.title} onChange={(event) => setDraft((current) => ({ ...current, slides: { ...current.slides, favoriteMoment: { ...current.slides.favoriteMoment, title: event.target.value } } }))} className="mt-2 w-full rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300" />
          </label>
          <label className="block text-sm text-white/70">
            Data
            <input type="date" value={draft.slides.favoriteMoment.date} onChange={(event) => setDraft((current) => ({ ...current, slides: { ...current.slides, favoriteMoment: { ...current.slides.favoriteMoment, date: event.target.value } } }))} className="mt-2 w-full rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300" />
          </label>
          <label className="block text-sm text-white/70">
            Legenda
            <textarea value={draft.slides.favoriteMoment.detail} onChange={(event) => setDraft((current) => ({ ...current, slides: { ...current.slides, favoriteMoment: { ...current.slides.favoriteMoment, detail: event.target.value } } }))} rows={2} className="mt-2 w-full resize-none rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300" />
          </label>
        </section>

        <section className="space-y-3 border-t border-white/10 pt-6">
          <h2 className="font-display text-xl">Série do relacionamento</h2>
          <label className="block text-sm text-white/70">
            Série
            <input value={draft.slides.relationshipSeries.title} onChange={(event) => setDraft((current) => ({ ...current, slides: { ...current.slides, relationshipSeries: { ...current.slides.relationshipSeries, title: event.target.value } } }))} className="mt-2 w-full rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300" />
          </label>
          <label className="block text-sm text-white/70">
            Por que ela representa vocês duas
            <textarea value={draft.slides.relationshipSeries.subtitle} onChange={(event) => setDraft((current) => ({ ...current, slides: { ...current.slides, relationshipSeries: { ...current.slides.relationshipSeries, subtitle: event.target.value } } }))} rows={2} className="mt-2 w-full resize-none rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300" />
          </label>
        </section>

        {savedShareUrl && (
          <section className="space-y-3 border-t border-white/10 pt-6">
            <h2 className="font-display text-xl">Link do presente</h2>
            <p className="text-sm leading-6 text-white/60">Este link abre apenas o presente publicado. Não oferece acesso à edição.</p>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs leading-5 text-white/70 break-all">{savedShareUrl}</div>
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard.writeText(savedShareUrl);
                setCopied(true);
              }}
              className="w-full rounded-xl border border-lime-300/50 px-4 py-3 text-sm font-bold text-lime-200 hover:bg-lime-300 hover:text-zinc-950"
            >
              {copied ? 'Link copiado' : 'Copiar link do presente'}
            </button>
          </section>
        )}

        <section className="space-y-3 border-t border-white/10 pt-6">
          <h2 className="font-display text-xl">Memórias em Polaroid</h2>
          <p className="text-sm leading-6 text-white/60">As fotos são enviadas na seção Fotos. Edite abaixo o texto manuscrito de cada cartão.</p>
          <label className="block text-sm text-white/70">
            Título
            <input value={draft.slides.memories.headline} onChange={(event) => setDraft((current) => ({ ...current, slides: { ...current.slides, memories: { ...current.slides.memories, headline: event.target.value } } }))} className="mt-2 w-full rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300" />
          </label>
          <label className="block text-sm text-white/70">
            Subtítulo
            <input value={draft.slides.memories.subtitle} onChange={(event) => setDraft((current) => ({ ...current, slides: { ...current.slides, memories: { ...current.slides.memories, subtitle: event.target.value } } }))} className="mt-2 w-full rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300" />
          </label>
          {draft.memoryPhotos.map((photo, index) => (
            <div key={photo.id} className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-lime-300">Texto da Polaroid 0{index + 1}</p>
              <input value={photo.caption} onChange={(event) => setDraft((current) => ({ ...current, memoryPhotos: current.memoryPhotos.map((p, i) => i === index ? { ...p, caption: event.target.value } : p) }))} aria-label={`Legenda polaroid ${index + 1}`} className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-lime-300" />
            </div>
          ))}
        </section>

        <section className="space-y-3 border-t border-white/10 pt-6">
          <h2 className="font-display text-xl">Quem é mais?</h2>
          <p className="text-sm leading-6 text-white/60">Edite as dez perguntas e escolha quem vence. No presente, cada resposta aparece depois da pergunta.</p>
          <label className="block text-sm text-white/70">
            Título
            <input value={draft.slides.versus.headline} onChange={(event) => setDraft((current) => ({ ...current, slides: { ...current.slides, versus: { ...current.slides.versus, headline: event.target.value } } }))} className="mt-2 w-full rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300" />
          </label>
          {draft.slides.versus.items.map((item, index) => (
            <div key={index} className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-lime-300">Comparação {String(index + 1).padStart(2, '0')}</p>
              <input value={item.topic} onChange={(event) => setDraft((current) => ({ ...current, slides: { ...current.slides, versus: { ...current.slides.versus, items: current.slides.versus.items.map((it, i) => i === index ? { ...it, topic: event.target.value } : it) } } }))} className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-lime-300" />
              <div className="grid grid-cols-3 gap-2">
                <input value={item.leftLabel} onChange={(event) => setDraft((current) => ({ ...current, slides: { ...current.slides, versus: { ...current.slides.versus, items: current.slides.versus.items.map((it, i) => i === index ? { ...it, leftLabel: event.target.value } : it) } } }))} className="w-full rounded-lg border border-white/10 bg-black/20 px-2 py-2 text-center text-sm text-white outline-none focus:border-lime-300" />
                <select value={item.winner} onChange={(event) => setDraft((current) => ({ ...current, slides: { ...current.slides, versus: { ...current.slides.versus, items: current.slides.versus.items.map((it, i) => i === index ? { ...it, winner: event.target.value as 'left' | 'right' | 'tie' } : it) } } }))} className="w-full rounded-lg border border-white/10 bg-black/20 px-2 py-2 text-center text-sm text-white outline-none focus:border-lime-300">
                  <option value="left" className="bg-zinc-950">{item.leftLabel}</option>
                  <option value="right" className="bg-zinc-950">{item.rightLabel}</option>
                  <option value="tie" className="bg-zinc-950">Empate</option>
                </select>
                <input value={item.rightLabel} onChange={(event) => setDraft((current) => ({ ...current, slides: { ...current.slides, versus: { ...current.slides.versus, items: current.slides.versus.items.map((it, i) => i === index ? { ...it, rightLabel: event.target.value } : it) } } }))} className="w-full rounded-lg border border-white/10 bg-black/20 px-2 py-2 text-center text-sm text-white outline-none focus:border-lime-300" />
              </div>
            </div>
          ))}
        </section>

        <section className="space-y-3 border-t border-white/10 pt-6">
          <h2 className="font-display text-xl">Declaração final</h2>
          <p className="text-sm leading-6 text-white/60">A frase principal “Eu te amo eternamente, gatinha” permanece fixa. Você pode editar apenas o texto de apoio.</p>
          <label className="block text-sm text-white/70">
            Texto de apoio
            <textarea value={draft.slides.yearPoster.quote} onChange={(event) => setDraft((current) => ({ ...current, slides: { ...current.slides, yearPoster: { ...current.slides.yearPoster, quote: event.target.value } } }))} rows={2} className="mt-2 w-full resize-none rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300" />
          </label>
        </section>

        <section className="space-y-3 border-t border-white/10 pt-6">
          <h2 className="font-display text-xl">Roleta da sorte</h2>
          <p className="text-sm leading-6 text-white/60">Gire no carrossel e descubra declarações, desafios e vales. Adicione até 6 itens.</p>
          <label className="block text-sm text-white/70">
            Título
            <input value={draft.slides.wheel.headline} onChange={(event) => setDraft((current) => ({ ...current, slides: { ...current.slides, wheel: { ...current.slides.wheel, headline: event.target.value } } }))} className="mt-2 w-full rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300" />
          </label>
          <label className="block text-sm text-white/70">
            Subtítulo
            <input value={draft.slides.wheel.subcopy} onChange={(event) => setDraft((current) => ({ ...current, slides: { ...current.slides, wheel: { ...current.slides.wheel, subcopy: event.target.value } } }))} className="mt-2 w-full rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300" />
          </label>
          {draft.slides.wheel.items.map((item, index) => (
            <div key={index} className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-lime-300">Item {String(index + 1).padStart(2, '0')}</p>
              <input value={item.label} onChange={(event) => setDraft((current) => ({ ...current, slides: { ...current.slides, wheel: { ...current.slides.wheel, items: current.slides.wheel.items.map((it, i) => i === index ? { ...it, label: event.target.value } : it) } } }))} placeholder="Declaração, Desafio, Vale..." className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-lime-300" />
              <textarea value={item.content} onChange={(event) => setDraft((current) => ({ ...current, slides: { ...current.slides, wheel: { ...current.slides.wheel, items: current.slides.wheel.items.map((it, i) => i === index ? { ...it, content: event.target.value } : it) } } }))} placeholder="Texto que aparece quando a roleta parar" rows={2} className="w-full resize-none rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-lime-300" />
            </div>
          ))}
        </section>

        <section className="space-y-3 border-t border-white/10 pt-6">
          <h2 className="font-display text-xl">Mapa da gente</h2>
          <p className="text-sm leading-6 text-white/60">Os lugares que contam a história de vocês. Edite o nome e a descrição de cada pin.</p>
          <label className="block text-sm text-white/70">
            Título
            <input value={draft.slides.placesMap.headline} onChange={(event) => setDraft((current) => ({ ...current, slides: { ...current.slides, placesMap: { ...current.slides.placesMap, headline: event.target.value } } }))} className="mt-2 w-full rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300" />
          </label>
          <label className="block text-sm text-white/70">
            Subtítulo
            <input value={draft.slides.placesMap.subcopy} onChange={(event) => setDraft((current) => ({ ...current, slides: { ...current.slides, placesMap: { ...current.slides.placesMap, subcopy: event.target.value } } }))} className="mt-2 w-full rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300" />
          </label>
          {draft.slides.placesMap.places.map((place, index) => (
            <div key={index} className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-lime-300">Lugar {String(index + 1).padStart(2, '0')}</p>
              <input value={place.name} onChange={(event) => setDraft((current) => ({ ...current, slides: { ...current.slides, placesMap: { ...current.slides.placesMap, places: current.slides.placesMap.places.map((p, i) => i === index ? { ...p, name: event.target.value } : p) } } }))} placeholder="Nome do lugar" className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-lime-300" />
              <textarea value={place.description} onChange={(event) => setDraft((current) => ({ ...current, slides: { ...current.slides, placesMap: { ...current.slides.placesMap, places: current.slides.placesMap.places.map((p, i) => i === index ? { ...p, description: event.target.value } : p) } } }))} placeholder="Por que esse lugar é especial?" rows={2} className="w-full resize-none rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-lime-300" />
            </div>
          ))}
        </section>

        <section className="space-y-3 border-t border-white/10 pt-6">
          <h2 className="font-display text-xl">Por que eu te amo</h2>
          <p className="text-sm leading-6 text-white/60">Pequenos motivos que aparecem um a um antes do resumo final. Use frases curtas e verdadeiras.</p>
          <label className="block text-sm text-white/70">
            Título
            <textarea value={draft.slides.loveReasons?.headline ?? ''} onChange={(event) => setDraft((current) => ({ ...current, slides: { ...current.slides, loveReasons: { ...(current.slides.loveReasons ?? {}), headline: event.target.value } } }))} rows={2} className="mt-2 w-full resize-none rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300" />
          </label>
          {(draft.slides.loveReasons?.reasons ?? []).map((reason, index) => (
            <label key={index} className="block text-sm text-white/70">
              Motivo {String(index + 1).padStart(2, '0')}
              <input
                value={reason}
                onChange={(event) => setDraft((current) => ({
                  ...current,
                  slides: {
                    ...current.slides,
                    loveReasons: {
                      ...(current.slides.loveReasons ?? { label: '', headline: '', reasons: [] }),
                      reasons: (current.slides.loveReasons?.reasons ?? []).map((item, itemIndex) => itemIndex === index ? event.target.value : item),
                    },
                  },
                }))}
                className="mt-2 w-full rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300"
              />
            </label>
          ))}
        </section>

        <section className="space-y-3 border-t border-white/10 pt-6">
          <h2 className="font-display text-xl">Carta de amor</h2>
          <p className="text-sm leading-6 text-white/60">Um texto em formato de carta, exibido como se estivesse sendo aberta. Use quebras de linha para separar parágrafos.</p>
          <label className="block text-sm text-white/70">
            Saudação
            <input value={draft.slides.loveLetter?.greeting ?? ''} onChange={(event) => setDraft((current) => ({ ...current, slides: { ...current.slides, loveLetter: { ...(current.slides.loveLetter ?? {}), greeting: event.target.value } } }))} className="mt-2 w-full rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300" />
          </label>
          <label className="block text-sm text-white/70">
            Texto da carta
            <textarea value={draft.slides.loveLetter?.body ?? ''} onChange={(event) => setDraft((current) => ({ ...current, slides: { ...current.slides, loveLetter: { ...(current.slides.loveLetter ?? {}), body: event.target.value } } }))} rows={6} className="mt-2 w-full resize-none rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300" />
          </label>
          <label className="block text-sm text-white/70">
            Assinatura
            <input value={draft.slides.loveLetter?.signature ?? ''} onChange={(event) => setDraft((current) => ({ ...current, slides: { ...current.slides, loveLetter: { ...(current.slides.loveLetter ?? {}), signature: event.target.value } } }))} className="mt-2 w-full rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300" />
          </label>
        </section>

        <section className="space-y-3 border-t border-white/10 pt-6">
          <h2 className="font-display text-xl">Linha do tempo</h2>
          <p className="text-sm leading-6 text-white/60">Marcos do relacionamento em ordem cronológica. Use fotos enviadas na seção Fotos como imagem de cada ponto.</p>
          <label className="block text-sm text-white/70">
            Título
            <input value={draft.slides.timeline?.headline ?? ''} onChange={(event) => setDraft((current) => ({ ...current, slides: { ...current.slides, timeline: { ...(current.slides.timeline ?? {}), headline: event.target.value } } }))} className="mt-2 w-full rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300" />
          </label>
          <label className="block text-sm text-white/70">
            Subtítulo
            <input value={draft.slides.timeline?.subcopy ?? ''} onChange={(event) => setDraft((current) => ({ ...current, slides: { ...current.slides, timeline: { ...(current.slides.timeline ?? {}), subcopy: event.target.value } } }))} className="mt-2 w-full rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300" />
          </label>
          {(draft.slides.timeline?.events ?? []).map((event, index) => (
            <div key={index} className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-lime-300">Evento {String(index + 1).padStart(2, '0')}</p>
              <label className="block text-sm text-white/70">
                Data
                <input value={event.date} onChange={(eventInput) => setDraft((current) => ({ ...current, slides: { ...current.slides, timeline: { ...(current.slides.timeline ?? {}), events: (current.slides.timeline?.events ?? []).map((item, itemIndex) => itemIndex === index ? { ...item, date: eventInput.target.value } : item) } } }))} className="mt-2 w-full rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300" />
              </label>
              <label className="block text-sm text-white/70">
                Título
                <input value={event.title} onChange={(eventInput) => setDraft((current) => ({ ...current, slides: { ...current.slides, timeline: { ...(current.slides.timeline ?? {}), events: (current.slides.timeline?.events ?? []).map((item, itemIndex) => itemIndex === index ? { ...item, title: eventInput.target.value } : item) } } }))} className="mt-2 w-full rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300" />
              </label>
              <label className="block text-sm text-white/70">
                Descrição
                <textarea value={event.description} onChange={(eventInput) => setDraft((current) => ({ ...current, slides: { ...current.slides, timeline: { ...(current.slides.timeline ?? {}), events: (current.slides.timeline?.events ?? []).map((item, itemIndex) => itemIndex === index ? { ...item, description: eventInput.target.value } : item) } } }))} rows={2} className="mt-2 w-full resize-none rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300" />
              </label>
              <ImageUploadButton
                slot={`timeline-${index}` as ImageSlot}
                label={`Foto do evento ${String(index + 1).padStart(2, '0')}`}
                source={event.image}
                onChange={handleImage}
              />
            </div>
          ))}
        </section>

        <section className="space-y-4 border-t border-white/10 pt-6">
          <div>
            <h2 className="font-display text-xl">Fotos</h2>
            <p className="mt-1 text-sm leading-6 text-white/60">Toque em cada quadrado para enviar. Máximo de 1,5 MB por foto.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {imageLabels.map(({ slot, label }) => (
              <ImageUploadButton
                key={`${slot}`}
                slot={slot}
                label={label}
                source={getWrappedImage(draft, slot)}
                onChange={handleImage}
              />
            ))}
          </div>
          {imageError && <p role="alert" className="text-sm leading-6 text-amber-200">{imageError}</p>}
        </section>

        <section className="space-y-3 border-t border-white/10 pt-6">
          <h2 className="font-display text-xl">Trilha sonora</h2>
          <p className="text-sm leading-6 text-white/60">Escolha o tema que vai tocar de fundo enquanto ela rola o presente.</p>
          <div className="grid grid-cols-3 gap-2">
            {audioThemes.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => setDraft((current) => ({ ...current, audioTheme: theme.id, audio: { label: theme.label, source: theme.source } }))}
                className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                  draft.audioTheme === theme.id
                    ? 'border-lime-300 bg-lime-300 text-zinc-950'
                    : 'border-white/15 bg-white/8 text-white/80 hover:border-lime-300 hover:text-lime-200'
                }`}
              >
                {theme.label}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3 border-t border-white/10 pt-6">
          <h2 className="font-display text-xl">Spotify</h2>
          <p className="text-sm leading-6 text-white/60">Cole a URI ou o link de uma faixa, álbum ou playlist. O presente usa o player oficial do Spotify.</p>
          <label className="block text-sm text-white/70">
            Faixa ou playlist especial
            <input
              value={draft.spotify.featuredUri}
              onChange={(event) => setDraft((current) => ({ ...current, spotify: { ...current.spotify, featuredUri: event.target.value } }))}
              placeholder="spotify:track:..."
              className="mt-2 w-full rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none placeholder:text-white/35 focus:border-lime-300"
            />
          </label>
          {spotifyImportAvailable && (
            <button type="button" onClick={() => { void onSpotifyImport(); }} className="w-full rounded-xl border border-white/20 px-4 py-3 text-sm font-bold text-white/80 hover:border-lime-300 hover:text-lime-200">Importar meu Top 5 do Spotify</button>
          )}
        </section>

        <div className="sticky bottom-0 z-10 -mx-5 mt-2 flex flex-col gap-3 border-t border-white/10 bg-zinc-950/95 px-5 py-4 backdrop-blur-sm">
          {saveError && <p role="alert" className="text-center text-sm leading-6 text-rose-200">{saveError}</p>}
          {saveSuccess && (
            <p role="status" className="text-center text-sm font-semibold text-lime-300">
              Presente confirmado na Supabase. Abrindo o carrossel...
            </p>
          )}
          <div className="flex gap-3">
            <button type="button" onClick={onRestoreDefaults} className="flex-1 rounded-xl border border-white/20 px-4 py-4 text-sm font-semibold text-white/75 active:border-white/40 active:text-white">Restaurar</button>
            <button type="submit" disabled={isSaving} className="flex-[1.5] rounded-xl bg-lime-300 px-4 py-4 text-sm font-bold text-zinc-950 active:bg-lime-200 disabled:cursor-wait disabled:opacity-60">{isSaving ? 'Salvando...' : 'Salvar e ver'}</button>
          </div>
        </div>
      </form>
    </div>
  );
};