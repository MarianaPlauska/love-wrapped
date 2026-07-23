type NasaApodResponse = {
  media_type?: string;
  title?: string;
  url?: string;
  copyright?: string;
};

type NasaImageLibraryResponse = {
  collection?: {
    items?: Array<{
      data?: Array<{
        nasa_id?: string;
        title?: string;
        center?: string;
        photographer?: string;
        secondary_creator?: string;
      }>;
      links?: Array<{ href?: string; render?: string }>;
    }>;
  };
};

export type NasaSkyReference = {
  image: string;
  title: string;
  credit: string;
  sourceUrl: string;
  kind: 'apod' | 'archive';
};

const nasaApiKey = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';

export const loadNasaSkyReference = async (date: string): Promise<NasaSkyReference> => {
  const apodResponse = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${encodeURIComponent(nasaApiKey)}&date=${encodeURIComponent(date)}`);
  if (apodResponse.ok) {
    const apod = await apodResponse.json() as NasaApodResponse;
    if (apod.media_type === 'image' && apod.url) {
      return {
        image: apod.url,
        title: apod.title || 'Astronomy Picture of the Day',
        credit: apod.copyright || 'NASA APOD',
        sourceUrl: `https://apod.nasa.gov/apod/ap${date.slice(2).replace(/-/g, '')}.html`,
        kind: 'apod',
      };
    }
  }

  const archiveResponse = await fetch('https://images-api.nasa.gov/search?q=moon&media_type=image');
  if (!archiveResponse.ok) throw new Error('NASA image archive is unavailable');

  const archive = await archiveResponse.json() as NasaImageLibraryResponse;
  const item = archive.collection?.items?.[0];
  const metadata = item?.data?.[0];
  const image = item?.links?.find((link) => link.render === 'image' && link.href)?.href;
  if (!image || !metadata?.nasa_id) throw new Error('NASA did not return an image reference');

  return {
    image,
    title: metadata.title || 'Referência lunar',
    credit: metadata.photographer || metadata.secondary_creator || metadata.center || 'NASA',
    sourceUrl: `https://images.nasa.gov/details-${encodeURIComponent(metadata.nasa_id)}`,
    kind: 'archive',
  };
};