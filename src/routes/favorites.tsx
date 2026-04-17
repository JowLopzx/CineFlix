import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import { MediaCard } from "@/components/MediaCard";

export const Route = createFileRoute("/favorites")({
  component: FavoritesPage,
  head: () => ({
    meta: [
      { title: "Minha Lista — Cineflix" },
      { name: "description", content: "Seus filmes e séries favoritos salvos." },
    ],
  }),
});

function FavoritesPage() {
  const { favorites } = useFavorites();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-8 pt-24 pb-16">
      <div className="mb-8 flex items-center gap-3">
        <Heart className="h-7 w-7 fill-primary text-primary" />
        <h1 className="text-3xl sm:text-4xl font-extrabold">Minha Lista</h1>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Heart className="h-16 w-16 text-muted-foreground/40" />
          <p className="mt-4 text-lg text-muted-foreground">Sua lista está vazia.</p>
          <Link to="/" className="mt-6 rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90">
            Explorar catálogo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 justify-items-center">
          {favorites.map((item) => (
            <MediaCard key={`${item.media_type}-${item.id}`} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
