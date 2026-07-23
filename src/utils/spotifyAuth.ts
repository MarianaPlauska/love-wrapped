import { supabase } from '../lib/supabase';

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const verifierStorageKey = 'love-wrapped-spotify-verifier';
const stateStorageKey = 'love-wrapped-spotify-state';
const scopes = 'user-top-read user-read-recently-played';

type SpotifyTrack = {
  uri: string;
  name: string;
  artist: string;
};

const base64UrlEncode = (buffer: ArrayBuffer): string => btoa(String.fromCharCode(...new Uint8Array(buffer)))
  .replace(/=/g, '')
  .replace(/\+/g, '-')
  .replace(/\//g, '_');

const randomString = (length: number): string => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values, (value) => alphabet[value % alphabet.length]).join('');
};

const redirectUri = (): string => `${window.location.origin}${window.location.pathname}`;

export const isSpotifyImportConfigured = Boolean(clientId);

export const beginSpotifyImport = async (): Promise<void> => {
  if (!clientId) throw new Error('Spotify client ID is not configured');

  const verifier = randomString(96);
  const state = randomString(32);
  const challenge = base64UrlEncode(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)));
  sessionStorage.setItem(verifierStorageKey, verifier);
  sessionStorage.setItem(stateStorageKey, state);

  const authorizationUrl = new URL('https://accounts.spotify.com/authorize');
  authorizationUrl.search = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri(),
    code_challenge_method: 'S256',
    code_challenge: challenge,
    scope: scopes,
    state,
  }).toString();

  window.location.assign(authorizationUrl.toString());
};

export const consumeSpotifyImport = async (): Promise<SpotifyTrack[] | null> => {
  const parameters = new URLSearchParams(window.location.search);
  const code = parameters.get('code');
  const state = parameters.get('state');
  const expectedState = sessionStorage.getItem(stateStorageKey);
  const verifier = sessionStorage.getItem(verifierStorageKey);
  if (!code || !state || !expectedState || state !== expectedState || !verifier || !clientId || !supabase) return null;

  const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri(),
      code_verifier: verifier,
    }),
  });
  if (!tokenResponse.ok) throw new Error('Spotify token exchange failed');

  const { access_token: accessToken } = await tokenResponse.json() as { access_token?: string };
  if (!accessToken) throw new Error('Spotify access token was not returned');

  const { data, error } = await supabase.functions.invoke('spotify-import', { body: { accessToken } });
  if (error || !Array.isArray(data?.tracks)) throw new Error('Spotify import failed');

  sessionStorage.removeItem(verifierStorageKey);
  sessionStorage.removeItem(stateStorageKey);
  window.history.replaceState({}, '', `${window.location.pathname}#admin`);
  return data.tracks as SpotifyTrack[];
};