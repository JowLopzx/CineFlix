import { Link } from "@tanstack/react-router";
import { Play, Info } from "lucide-react";
import { backdropUrl, type MediaItem } from "@/lib/tmdb";

export function Hero({ item }: { item: MediaItem }) {
  const bg = backdropUrl(item.backdrop_path, "original");

  return (
    <div className="relative h-[70vh] min-h-[420px] w-full overflow-hidden">
      {bg && (
        <img
          src={bg}
          alt={item.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />

      <div className="relative z-10 flex h-full items-end sm:items-center px-4 sm:px-12 pb-12 sm:pb-0">
        <div className="max-w-2xl">
          <span className="inline-block rounded bg-primary/20 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-primary backdrop-blur">
            {item.media_type === "movie" ? "Filme em destaque" : "Série em destaque"}
          </span>
          <h1 className="mt-4 text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground drop-shadow-lg">
            {item.title}
          </h1>
          <p className="mt-4 line-clamp-3 text-sm sm:text-base text-foreground/90 max-w-xl">
            {item.overview || "Descubra essa história agora."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/title/$type/$id"
              params={{ type: item.media_type, id: String(item.id) }}
              className="inline-flex items-center gap-2 rounded-md bg-foreground px-6 py-2.5 text-sm font-bold text-background transition-transform hover:scale-105"
            >
              <Play className="h-5 w-5 fill-current" /> Assistir
            </Link>
            <Link
              to="/title/$type/$id"
              params={{ type: item.media_type, id: String(item.id) }}
              className="inline-flex items-center gap-2 rounded-md bg-secondary/70 px-6 py-2.5 text-sm font-bold text-foreground backdrop-blur transition-colors hover:bg-secondary"
            >
              <Info className="h-5 w-5" /> Mais informações
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
