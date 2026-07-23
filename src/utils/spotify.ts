const spotifyUriPattern = /^spotify:(track|album|playlist):([A-Za-z0-9]+)$/;
const spotifyUrlPattern = /^https:\/\/open\.spotify\.com\/(track|album|playlist)\/([A-Za-z0-9]+)/;

export const getSpotifyEmbedUrl = (value: string): string | null => {
  const uriMatch = value.match(spotifyUriPattern);
  const urlMatch = value.match(spotifyUrlPattern);
  const match = uriMatch ?? urlMatch;

  if (!match) return null;

  return `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator&theme=0`;
};