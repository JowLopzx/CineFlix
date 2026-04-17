import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { Search, Heart, Film } from "lucide-react";
import { useEffect, useState } from "react";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) navigate({ to: "/search", search: { q: q.trim() } });
  };

  const linkCls = (active: boolean) =>
    `text-sm font-medium transition-colors ${active ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur shadow-lg" : "bg-gradient-to-b from-background to-transparent"
      }`}
    >
      <div className="flex h-16 items-center gap-4 sm:gap-8 px-4 sm:px-8">
        <Link to="/" className="flex items-center gap-2 text-primary">
          <Film className="h-6 w-6" />
          <span className="text-xl font-extrabold tracking-tight">CINEFLIX</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className={linkCls(location.pathname === "/")}>Início</Link>
          <Link to="/favorites" className={linkCls(location.pathname === "/favorites")}>Minha Lista</Link>
        </nav>

        <form onSubmit={onSubmit} className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar filmes, séries..."
              className="h-9 w-44 sm:w-64 rounded-md border border-border bg-background/60 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Link
            to="/favorites"
            aria-label="Favoritos"
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-md text-foreground hover:bg-secondary"
          >
            <Heart className="h-5 w-5" />
          </Link>
        </form>
      </div>
    </header>
  );
}
