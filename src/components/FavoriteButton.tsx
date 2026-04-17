import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import type { MediaItem } from "@/lib/tmdb";

export function FavoriteButton({ item }: { item: MediaItem }) {
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(item.id, item.media_type);

  return (
    <button
      onClick={() => toggle(item)}
      className={`inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-bold transition-colors ${
        fav ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-secondary/80"
      }`}
    >
      <Heart className={`h-5 w-5 ${fav ? "fill-current" : ""}`} />
      {fav ? "Na minha lista" : "Adicionar à lista"}
    </button>
  );
}
