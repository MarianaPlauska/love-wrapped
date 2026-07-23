import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.110.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const response = (body: unknown, status = 200) => Response.json(body, {
  status,
  headers: corsHeaders,
});

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (request.method !== "POST") return response({ error: "Method not allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const publishableKey = Deno.env.get("SUPABASE_ANON_KEY");
  const authorization = request.headers.get("Authorization") ?? "";
  if (!supabaseUrl || !publishableKey || !authorization) return response({ error: "Unauthorized" }, 401);

  const client = createClient(supabaseUrl, publishableKey, {
    global: { headers: { Authorization: authorization } },
  });
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError || !userData.user) return response({ error: "Unauthorized" }, 401);

  const { accessToken } = await request.json().catch(() => ({ accessToken: "" }));
  if (typeof accessToken !== "string" || accessToken.length < 20) {
    return response({ error: "Spotify access token is required" }, 400);
  }

  const spotifyResponse = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=5", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!spotifyResponse.ok) return response({ error: "Spotify authorization failed" }, spotifyResponse.status);

  const spotifyData = await spotifyResponse.json();
  const tracks = Array.isArray(spotifyData.items)
    ? spotifyData.items.map((track: { uri?: string; name?: string; artists?: Array<{ name?: string }> }) => ({
      uri: track.uri ?? "",
      name: track.name ?? "",
      artist: track.artists?.map((artist) => artist.name).filter(Boolean).join(", ") ?? "",
    }))
    : [];

  return response({ tracks });
});