// Edge function that proxies TMDB requests using TMDB_API_KEY secret
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const TMDB_BASE = "https://api.themoviedb.org/3";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("TMDB_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "TMDB_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { path, params } = await req.json();
    if (!path || typeof path !== "string" || !path.startsWith("/")) {
      return new Response(JSON.stringify({ error: "Invalid path" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(`${TMDB_BASE}${path}`);
    url.searchParams.set("language", "pt-BR");
    if (params && typeof params === "object") {
      for (const [k, v] of Object.entries(params)) {
        if (typeof v === "string") url.searchParams.set(k, v);
      }
    }

    const isJwt = apiKey.startsWith("eyJ");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (isJwt) {
      headers["Authorization"] = `Bearer ${apiKey}`;
    } else {
      url.searchParams.set("api_key", apiKey);
    }

    const tmdbRes = await fetch(url.toString(), { headers });
    const body = await tmdbRes.text();

    return new Response(body, {
      status: tmdbRes.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
