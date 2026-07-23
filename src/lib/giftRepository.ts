import type { WrappedData } from '../data/wrappedData';
import { supabase } from './supabase';

type GiftRow = {
  id: string;
  payload: WrappedData;
  share_token: string;
};

type StoredGiftRow = GiftRow & {
  asset_paths: unknown;
};

type SignedAsset = {
  path: string;
  signedUrl: string;
};

const mediaBucket = 'gift-media';
const mediaMarkerPrefix = 'gift-media://';
const signedUrlMarkers = new Map<string, string>();

const getAssetPaths = (value: unknown): string[] => (
  Array.isArray(value) ? value.filter((path): path is string => typeof path === 'string') : []
);

const getMarkerPath = (value: string): string | undefined => (
  value.startsWith(mediaMarkerPrefix) ? value.slice(mediaMarkerPrefix.length) : undefined
);

const replaceAssetStrings = async (
  value: unknown,
  replace: (value: string) => Promise<string> | string,
): Promise<unknown> => {
  if (typeof value === 'string') return replace(value);
  if (Array.isArray(value)) return Promise.all(value.map((item) => replaceAssetStrings(item, replace)));
  if (!value || typeof value !== 'object') return value;

  const entries = await Promise.all(Object.entries(value).map(async ([key, item]) => (
    [key, await replaceAssetStrings(item, replace)] as const
  )));
  return Object.fromEntries(entries);
};

const hydratePayload = async (payload: WrappedData, assets: SignedAsset[]): Promise<WrappedData> => {
  const signedUrlsByMarker = new Map<string, string>();

  assets.forEach(({ path, signedUrl }) => {
    const marker = `${mediaMarkerPrefix}${path}`;
    signedUrlsByMarker.set(marker, signedUrl);
    signedUrlMarkers.set(signedUrl, marker);
  });

  return replaceAssetStrings(payload, (value) => signedUrlsByMarker.get(value) ?? value) as Promise<WrappedData>;
};

const uploadDataUrl = async (source: string, ownerId: string): Promise<{ marker: string; path: string }> => {
  if (!supabase) throw new Error('Supabase is not configured');

  const image = await fetch(source).then((response) => response.blob());
  const extension = image.type === 'image/png' ? 'png' : image.type === 'image/webp' ? 'webp' : 'jpg';
  const path = `${ownerId}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from(mediaBucket).upload(path, image, {
    cacheControl: '3600',
    contentType: image.type,
    upsert: false,
  });

  if (error) throw error;
  return { marker: `${mediaMarkerPrefix}${path}`, path };
};

const preparePayload = async (payload: WrappedData, ownerId: string) => {
  const assetPaths = new Set<string>();
  const uploadedPaths: string[] = [];
  const pendingUploads = new Map<string, Promise<{ marker: string; path: string }>>();

  const storedPayload = await replaceAssetStrings(payload, async (value) => {
    const existingMarker = signedUrlMarkers.get(value) ?? value;
    const existingPath = getMarkerPath(existingMarker);
    if (existingPath) {
      assetPaths.add(existingPath);
      return existingMarker;
    }

    if (!value.startsWith('data:image/')) return value;

    const upload = pendingUploads.get(value) ?? uploadDataUrl(value, ownerId);
    pendingUploads.set(value, upload);
    const uploaded = await upload;
    assetPaths.add(uploaded.path);
    uploadedPaths.push(uploaded.path);
    return uploaded.marker;
  }) as WrappedData;

  return { storedPayload, assetPaths: [...assetPaths], uploadedPaths };
};

const signOwnerAssets = async (assetPaths: string[]): Promise<SignedAsset[]> => {
  if (!supabase || assetPaths.length === 0) return [];

  const { data, error } = await supabase.storage.from(mediaBucket).createSignedUrls(assetPaths, 60 * 60);
  if (error) throw error;
  return (data ?? []).flatMap((asset) => (
    asset.path && asset.signedUrl ? [{ path: asset.path, signedUrl: asset.signedUrl }] : []
  ));
};

const getCurrentOwner = async () => {
  if (!supabase) throw new Error('Supabase is not configured');

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error('You must be signed in as the gift owner');
  return data.user;
};

export const canManageGifts = async (): Promise<boolean> => {
  if (!supabase) return false;

  const { data, error } = await supabase.rpc('is_gift_owner');
  return !error && data === true;
};

export const loadOwnerGift = async (): Promise<GiftRow | null> => {
  const owner = await getCurrentOwner();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('gifts')
    .select('id, payload, share_token, asset_paths')
    .eq('owner_id', owner.id)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  const gift = data as StoredGiftRow;
  const payload = await hydratePayload(gift.payload, await signOwnerAssets(getAssetPaths(gift.asset_paths)));
  return { id: gift.id, share_token: gift.share_token, payload };
};

export const saveOwnerGift = async (wrappedData: WrappedData, giftId?: string): Promise<GiftRow> => {
  const owner = await getCurrentOwner();
  if (!supabase) throw new Error('Supabase is not configured');

  const existingAssetPaths = giftId
    ? await supabase.from('gifts').select('asset_paths').eq('id', giftId).single()
    : { data: null, error: null };
  if (existingAssetPaths.error) throw existingAssetPaths.error;

  const { storedPayload, assetPaths, uploadedPaths } = await preparePayload(wrappedData, owner.id);

  const values = {
    owner_id: owner.id,
    title: wrappedData.title,
    payload: storedPayload,
    asset_paths: assetPaths,
    spotify_uris: [wrappedData.spotify.featuredUri, wrappedData.spotify.playlistUri].filter(Boolean),
    is_published: true,
  };

  const query = giftId
    ? supabase.from('gifts').update(values).eq('id', giftId).select('id, payload, share_token').single()
    : supabase.from('gifts').insert(values).select('id, payload, share_token').single();
  const { data, error } = await query;

  if (error) {
    if (uploadedPaths.length > 0) await supabase.storage.from(mediaBucket).remove(uploadedPaths);
    throw error;
  }

  const staleAssetPaths = getAssetPaths(existingAssetPaths.data?.asset_paths)
    .filter((path) => !assetPaths.includes(path));
  if (staleAssetPaths.length > 0) await supabase.storage.from(mediaBucket).remove(staleAssetPaths);

  return { ...(data as GiftRow), payload: wrappedData };
};

export const loadSharedGift = async (shareToken: string): Promise<WrappedData> => {
  if (!supabase) throw new Error('Supabase is not configured');

  const { data, error } = await supabase.functions.invoke('read-gift', {
    body: { token: shareToken },
  });

  if (error || !data?.payload) throw new Error('Could not load the shared gift');
  const assets = Array.isArray(data.assets)
    ? data.assets.filter((asset: unknown): asset is SignedAsset => (
      Boolean(asset && typeof asset === 'object' && 'path' in asset && 'signedUrl' in asset)
    ))
    : [];
  return hydratePayload(data.payload as WrappedData, assets);
};