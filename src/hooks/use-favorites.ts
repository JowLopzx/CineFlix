import { useEffect, useState, useCallback } from "react";
import type { MediaItem } from "@/lib/tmdb";

const KEY = "cineflix:favorites";

function read(): MediaItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<MediaItem[]>([]);

  useEffect(() => {
    setFavorites(read());
    const onStorage = () => setFavorites(read());
    window.addEventListener("storage", onStorage);
    window.addEventListener("favorites-updated", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("favorites-updated", onStorage);
    };
  }, []);

  const isFavorite = useCallback(
    (id: number, type: string) => favorites.some((f) => f.id === id && f.media_type === type),
    [favorites]
  );

  const toggle = useCallback((item: MediaItem) => {
    const current = read();
    const exists = current.some((f) => f.id === item.id && f.media_type === item.media_type);
    const next = exists
      ? current.filter((f) => !(f.id === item.id && f.media_type === item.media_type))
      : [...current, item];
    localStorage.setItem(KEY, JSON.stringify(next));
    setFavorites(next);
    window.dispatchEvent(new Event("favorites-updated"));
  }, []);

  return { favorites, isFavorite, toggle };
}
