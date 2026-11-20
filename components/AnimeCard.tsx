import Link from "next/link";
import type { Anime } from "@/data/animes";

export default function AnimeCard({ anime }: { anime: Anime }) {
  return (
    <Link
      href={`/anime/${anime.id}`}
      className="group bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition-transform block"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={anime.image}
          alt={anime.title}
          className="w-full h-full object-cover group-hover:brightness-110 transition"
        />
        <span className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded">
          ⭐ {anime.rating}
        </span>
      </div>
      <div className="p-3">
        <h4 className="font-semibold text-sm truncate">{anime.title}</h4>
        <p className="text-xs text-gray-400 mt-0.5 truncate">{anime.titleAr}</p>
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
          <span>{anime.year}</span>
          <span>•</span>
          <span className="text-purple-400">{anime.genre[0]}</span>
        </div>
      </div>
    </Link>
  );
}