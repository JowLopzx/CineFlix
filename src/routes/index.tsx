import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { MediaRow } from "@/components/MediaRow";
import { getHomeData } from "@/lib/tmdb";

export const Route = createFileRoute("/")({
  loader: () => getHomeData(),
  component: Index,
  errorComponent: ({ error }) => {
    const router = useRouter();
    return (
      <div className="flex min-h-screen items-center justify-center px-4 pt-24">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-foreground">Não foi possível carregar o catálogo</h1>
          <p className="mt-3 text-sm text-muted-foreground">{error.message}</p>
          <button
            onClick={() => router.invalidate()}
            className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  },
  pendingComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  ),
});

function Index() {
  const data = Route.useLoaderData();
  const featured = data.trending[0];

  return (
    <>
      {featured && <Hero item={featured} />}
      <div className="relative z-10 -mt-12 sm:-mt-24 space-y-2 pb-16">
        <MediaRow title="🔥 Em alta esta semana" items={data.trending} />
        <MediaRow title="Filmes populares" items={data.popularMovies} />
        <MediaRow title="Séries populares" items={data.popularTv} />
        <MediaRow title="Mais bem avaliados" items={data.topRatedMovies} />
        <MediaRow title="Em breve nos cinemas" items={data.upcoming} />
      </div>
    </>
  );
}
