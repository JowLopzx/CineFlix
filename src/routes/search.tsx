import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useEffect, useState } from "react";
import { searchMedia, type MediaItem } from "@/lib/tmdb";
import { MediaCard } from "@/components/MediaCard";

const searchSchema = z.object({ q: z.string().optional().default("") });

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(searchSchema),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  const [input, setInput] = useState(q);
  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setInput(q), [q]);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    searchMedia(q)
      .then((res) => { if (!cancelled) setResults(res.results); })
      .catch((e) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [q]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-8 pt-24 pb-16">
      <form
        onSubmit={(e) => { e.preventDefault(); navigate({ to: "/search", search: { q: input.trim() } }); }}
        className="mx-auto mb-10 max-w-2xl"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pesquise por filmes ou séries..."
          autoFocus
          className="h-12 w-full rounded-lg border border-border bg-card px-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </form>

      {q && (
        <h1 className="mb-6 text-2xl font-bold">
          Resultados para <span className="text-primary">"{q}"</span>
        </h1>
      )}

      {loading && (
        <div className="flex justify-center py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      )}
      {error && <p className="text-destructive">{error}</p>}

      {!loading && !error && q && results.length === 0 && (
        <p className="text-center text-muted-foreground py-16">Nenhum resultado encontrado.</p>
      )}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 justify-items-center">
          {results.map((item) => (
            <MediaCard key={`${item.media_type}-${item.id}`} item={item} />
          ))}
        </div>
      )}

      {!q && (
        <p className="text-center text-muted-foreground py-16">
          Comece digitando o nome de um filme ou série.
        </p>
      )}
    </div>
  );
}
