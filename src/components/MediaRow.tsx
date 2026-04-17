import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MediaCard } from "./MediaCard";
import type { MediaItem } from "@/lib/tmdb";

export function MediaRow({ title, items }: { title: string; items: MediaItem[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -el.clientWidth * 0.8 : el.clientWidth * 0.8, behavior: "smooth" });
  };

  if (!items.length) return null;

  return (
    <section className="group/row relative px-4 sm:px-8 py-4">
      <h2 className="mb-3 text-lg sm:text-xl font-bold text-foreground">{title}</h2>
      <div className="relative">
        <button
          onClick={() => scroll("left")}
          aria-label="Anterior"
          className="absolute left-0 top-1/2 z-20 hidden -translate-y-1/2 -translate-x-2 items-center justify-center rounded-full bg-background/80 p-2 backdrop-blur opacity-0 group-hover/row:opacity-100 transition-opacity sm:flex"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div
          ref={scrollerRef}
          className="flex gap-3 overflow-x-auto pb-4 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {items.map((item) => (
            <MediaCard key={`${item.media_type}-${item.id}`} item={item} />
          ))}
        </div>
        <button
          onClick={() => scroll("right")}
          aria-label="Próximo"
          className="absolute right-0 top-1/2 z-20 hidden -translate-y-1/2 translate-x-2 items-center justify-center rounded-full bg-background/80 p-2 backdrop-blur opacity-0 group-hover/row:opacity-100 transition-opacity sm:flex"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
