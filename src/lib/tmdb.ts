import { supabase } from "@/integrations/supabase/client";

export const IMG_BASE = "https://image.tmdb.org/t/p";
export const posterUrl = (path: string | null, size: "w300" | "w500" | "w780" = "w500") =>
  path ? `${IMG_BASE}/${size}${path}` : null;
export const backdropUrl = (path: string | null, size: "w780" | "w1280" | "original" = "w1280") =>
  path ? `${IMG_BASE}/${size}${path}` : null;

export type MediaItem = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type: "movie" | "tv";
};

export type MediaDetails = MediaItem & {
  tagline?: string;
  runtime?: number;
  number_of_seasons?: number;
  genres: { id: number; name: string }[];
  videos?: { results: { key: string; site: string; type: string }[] };
  credits?: { cast: { id: number; name: string; character: string; profile_path: string | null }[] };
};

async function tmdb(path: string, params: Record<string, string> = {}) {
  const { data, error } = await supabase.functions.invoke("tmdb", {
    body: { path, params },
  });
  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
  return data;
}

function normalize(item: any, fallbackType?: "movie" | "tv"): MediaItem {
  const media_type = (item.media_type ?? fallbackType ?? (item.title ? "movie" : "tv")) as "movie" | "tv";
  return {
    id: item.id,
    title: item.title ?? item.name ?? "Sem título",
    overview: item.overview ?? "",
    poster_path: item.poster_path ?? null,
    backdrop_path: item.backdrop_path ?? null,
    vote_average: item.vote_average ?? 0,
    release_date: item.release_date,
    first_air_date: item.first_air_date,
    media_type,
  };
}

export async function getHomeData() {
  const [trending, popularMovies, topRatedMovies, popularTv, upcoming] = await Promise.all([
    tmdb("/trending/all/week"),
    tmdb("/movie/popular"),
    tmdb("/movie/top_rated"),
    tmdb("/tv/popular"),
    tmdb("/movie/upcoming"),
  ]);

  return {
    trending: (trending.results as any[]).map((i) => normalize(i)).filter((i) => i.backdrop_path),
    popularMovies: (popularMovies.results as any[]).map((i) => normalize(i, "movie")),
    topRatedMovies: (topRatedMovies.results as any[]).map((i) => normalize(i, "movie")),
    popularTv: (popularTv.results as any[]).map((i) => normalize(i, "tv")),
    upcoming: (upcoming.results as any[]).map((i) => normalize(i, "movie")),
  };
}

export async function searchMedia(query: string): Promise<{ results: MediaItem[] }> {
  if (!query.trim()) return { results: [] };
  const json = await tmdb("/search/multi", { query, include_adult: "false" });
  const results = (json.results as any[])
    .filter((i) => i.media_type === "movie" || i.media_type === "tv")
    .map((i) => normalize(i));
  return { results };
}

export async function getDetails(id: number, type: "movie" | "tv"): Promise<MediaDetails> {
  const json = await tmdb(`/${type}/${id}`, { append_to_response: "videos,credits" });
  const normalized = normalize(json, type);
  return {
    ...normalized,
    tagline: json.tagline,
    runtime: json.runtime,
    number_of_seasons: json.number_of_seasons,
    genres: json.genres ?? [],
    videos: json.videos,
    credits: json.credits,
  };
}
