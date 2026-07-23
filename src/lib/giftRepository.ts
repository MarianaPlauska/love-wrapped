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

type SavedGiftRow = StoredGiftRow & {
  updated_at: string;
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

const canonicalize = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (!value || typeof value !== 'object') return value;

  return Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => [key, canonicalize(item)]),
  );
};

const hasSameJsonValue = (left: unknown, right: unknown): boolean => (
  JSON.stringify(canonicalize(left)) === JSON.stringify(canonicalize(right))
);

const getPathFromSignedUrl = (value: string): string | undefined => {
  try {
    const url = new URL(value);
    const prefixes = [
      `/storage/v1/object/sign/${mediaBucket}/`,
      `/storage/v1/object/public/${mediaBucket}/`,
    ];
    const prefix = prefixes.find((candidate) => url.pathname.startsWith(candidate));
    return prefix ? decodeURIComponent(url.pathname.slice(prefix.length)) : undefined;
  } catch {
    return undefined;
  }
};

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
    // 1) Já é um marker conhecido ou um marker direto no payload.
    const markerPath = getMarkerPath(value);
    if (markerPath) {
      assetPaths.add(markerPath);
      return value;
    }

    // 2) URL assinada antiga do Supabase Storage (aparece quando o usuário recarrega a página).
    const signedPath = getPathFromSignedUrl(value);
    if (signedPath) {
      assetPaths.add(signedPath);
      return `${mediaMarkerPrefix}${signedPath}`;
    }

    // 3) Imagem nova em base64: faz upload.
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

  const existingGiftQuery = supabase
    .from('gifts')
    .select('id, asset_paths')
    .eq('owner_id', owner.id)
    .order('updated_at', { ascending: false })
    .limit(1);
  if (giftId) existingGiftQuery.eq('id', giftId);

  const { data: existingGift, error: existingGiftError } = await existingGiftQuery.maybeSingle();
  if (existingGiftError) throw existingGiftError;

  const { storedPayload, assetPaths, uploadedPaths } = await preparePayload(wrappedData, owner.id);

  const values = {
    owner_id: owner.id,
    title: wrappedData.title,
    payload: storedPayload,
    asset_paths: assetPaths,
    spotify_uris: [wrappedData.spotify.featuredUri, wrappedData.spotify.playlistUri].filter(Boolean),
    is_published: true,
  };

  const query = existingGift?.id
    ? supabase.from('gifts').update(values).eq('id', existingGift.id).eq('owner_id', owner.id).select('id, payload, share_token, asset_paths, updated_at').single()
    : supabase.from('gifts').insert(values).select('id, payload, share_token, asset_paths, updated_at').single();
  const { data: savedGift, error } = await query;

  if (error) {
    if (uploadedPaths.length > 0) await supabase.storage.from(mediaBucket).remove(uploadedPaths);
    throw error;
  }

  const { data: verifiedGift, error: verificationError } = await supabase
    .from('gifts')
    .select('id, payload, share_token, asset_paths, updated_at')
    .eq('id', (savedGift as SavedGiftRow).id)
    .eq('owner_id', owner.id)
    .single();

  if (verificationError || !verifiedGift) {
    throw verificationError ?? new Error('Saved gift could not be verified');
  }

  const verified = verifiedGift as SavedGiftRow;
  if (!hasSameJsonValue(verified.payload, storedPayload) || !hasSameJsonValue(verified.asset_paths, assetPaths)) {
    throw new Error('Supabase returned different gift data after saving');
  }

  const staleAssetPaths = getAssetPaths(existingGift?.asset_paths)
    .filter((path) => !assetPaths.includes(path));
  if (staleAssetPaths.length > 0) await supabase.storage.from(mediaBucket).remove(staleAssetPaths);

  const payload = await hydratePayload(verified.payload, await signOwnerAssets(getAssetPaths(verified.asset_paths)));
  return { id: verified.id, share_token: verified.share_token, payload };
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