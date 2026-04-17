import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { Star, Calendar, Clock, ArrowLeft } from "lucide-react";
import { backdropUrl, posterUrl, getDetails } from "@/lib/tmdb";
import { FavoriteButton } from "@/components/FavoriteButton";

export const Route = createFileRoute("/title/$type/$id")({
  loader: ({ params }) => {
    const type = params.type === "tv" ? "tv" : "movie";
    return getDetails(Number(params.id), type);
  },
  component: TitlePage,
  errorComponent: ({ error }) => {
    const router = useRouter();
    return (
      <div className="flex min-h-screen items-center justify-center px-4 pt-24">
        <div className="text-center">
          <h1 className="text-xl font-bold">Não foi possível carregar o título</h1>
          <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
          <button onClick={() => router.invalidate()} className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            Tentar novamente
          </button>
        </div>
      </div>
    );
  },
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center pt-24">
      <Link to="/" className="text-primary hover:underline">Voltar ao início</Link>
    </div>
  ),
  pendingComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  ),
});

function TitlePage() {
  const item = Route.useLoaderData() as import("@/lib/tmdb").MediaDetails;
  const bg = backdropUrl(item.backdrop_path, "original");
  const poster = posterUrl(item.poster_path, "w500");
  const trailer =
    item.videos?.results.find((v) => v.site === "YouTube" && v.type === "Trailer") ??
    item.videos?.results.find((v) => v.site === "YouTube");
  const year = (item.release_date ?? item.first_air_date ?? "").slice(0, 4);

  return (
    <article>
      <div className="relative h-[60vh] min-h-[380px] w-full overflow-hidden">
        {bg && <img src={bg} alt={item.title} className="absolute inset-0 h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent" />
        <Link to="/" className="absolute top-20 left-4 sm:left-8 z-10 inline-flex items-center gap-2 rounded-full bg-background/60 px-3 py-1.5 text-sm backdrop-blur hover:bg-background/80">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
      </div>

      <div className="relative z-10 mx-auto -mt-48 max-w-6xl px-4 sm:px-8 pb-16">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
          {poster && (
            <img
              src={poster}
              alt={item.title}
              className="w-44 sm:w-60 self-center sm:self-start rounded-lg shadow-2xl"
              style={{ boxShadow: "var(--shadow-card)" }}
            />
          )}
          <div className="flex-1">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">{item.title}</h1>
            {item.tagline && <p className="mt-2 text-base italic text-muted-foreground">{item.tagline}</p>}

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {item.vote_average > 0 && (
                <span className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-primary text-primary" />{item.vote_average.toFixed(1)}</span>
              )}
              {year && <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{year}</span>}
              {item.runtime ? <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{item.runtime} min</span> : null}
              {item.number_of_seasons ? <span>{item.number_of_seasons} temporada{item.number_of_seasons > 1 ? "s" : ""}</span> : null}
            </div>

            {item.genres.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {item.genres.map((g) => (
                  <span key={g.id} className="rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs text-foreground">{g.name}</span>
                ))}
              </div>
            )}

            <p className="mt-5 max-w-3xl text-base leading-relaxed text-foreground/90">
              {item.overview || "Sinopse não disponível."}
            </p>

            <div className="mt-6">
              <FavoriteButton item={item} />
            </div>
          </div>
        </div>

        {trailer && (
          <section className="mt-12">
            <h2 className="mb-4 text-2xl font-bold">Trailer</h2>
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-card shadow-2xl">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title="Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </section>
        )}

        {item.credits && item.credits.cast.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 text-2xl font-bold">Elenco</h2>
            <div className="flex gap-4 overflow-x-auto pb-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {item.credits.cast.slice(0, 15).map((c) => (
                <div key={c.id} className="w-28 shrink-0 text-center">
                  <div className="aspect-square overflow-hidden rounded-full bg-muted">
                    {c.profile_path ? (
                      <img src={posterUrl(c.profile_path, "w300")!} alt={c.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">?</div>
                    )}
                  </div>
                  <div className="mt-2 text-xs font-semibold text-foreground line-clamp-2">{c.name}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2">{c.character}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
