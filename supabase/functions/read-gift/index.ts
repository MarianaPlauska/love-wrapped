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

  const { token } = await request.json().catch(() => ({ token: "" }));
  if (typeof token !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(token)) {
    return response({ error: "Invalid gift link" }, 400);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) return response({ error: "Server is not configured" }, 500);

  const admin = createClient(supabaseUrl, serviceRoleKey);
  const { data: gift, error } = await admin
    .from("gifts")
    .select("id, title, payload, asset_paths, spotify_uris")
    .eq("share_token", token)
    .eq("is_published", true)
    .maybeSingle();

  if (error) return response({ error: "Could not load this gift" }, 500);
  if (!gift) return response({ error: "Gift not found" }, 404);

  const assetPaths = Array.isArray(gift.asset_paths)
    ? gift.asset_paths.filter((path): path is string => typeof path === "string")
    : [];
  const { data: signedAssets, error: signingError } = assetPaths.length > 0
    ? await admin.storage.from("gift-media").createSignedUrls(assetPaths, 60 * 60)
    : { data: [], error: null };

  if (signingError) return response({ error: "Could not prepare gift media" }, 500);

  return response({
    id: gift.id,
    title: gift.title,
    payload: gift.payload,
    spotifyUris: gift.spotify_uris,
    assets: (signedAssets ?? []).map(({ path, signedUrl }) => ({ path, signedUrl })),
  });
});