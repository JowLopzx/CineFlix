import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { posterUrl, type MediaItem } from "@/lib/tmdb";

export function MediaCard({ item }: { item: MediaItem }) {
  const poster = posterUrl(item.poster_path, "w300");
  const year = (item.release_date ?? item.first_air_date ?? "").slice(0, 4);

  return (
    <Link
      to="/title/$type/$id"
      params={{ type: item.media_type, id: String(item.id) }}
      className="group relative block w-[150px] sm:w-[170px] shrink-0 overflow-hidden rounded-md bg-card transition-transform duration-300 hover:scale-105 hover:z-10"
    >
      <div className="aspect-[2/3] overflow-hidden bg-muted">
        {poster ? (
          <img
            src={poster}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground p-2 text-center">
            {item.title}
          </div>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/95 to-transparent p-3 transition-transform duration-300 group-hover:translate-y-0">
        <h3 className="text-sm font-semibold text-foreground line-clamp-2">{item.title}</h3>
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          {year && <span>{year}</span>}
          {item.vote_average > 0 && (
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-primary text-primary" />
              {item.vote_average.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
