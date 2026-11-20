"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export type HeroAnime = {
  id: string;
  title: string;
  titleAr: string;
  synopsis: string;
  banner: string;
  image: string;
  rating: number;
  year: number;
  episodes: number;
  status: string;
  genre: string[];
};

export default function HeroSlider({ animes }: { animes: HeroAnime[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (animes.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % animes.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [animes.length]);

  if (animes.length === 0) return null;

  const anime = animes[current];

  return (
    <section className="relative h-[500px] w-full overflow-hidden">
      {/* Background */}
      <img
        key={anime.id}
        src={anime.banner}
        alt={anime.title}
        className="w-full h-full object-cover transition-opacity duration-1000"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-yellow-500 text-black px-2 py-0.5 rounded font-semibold text-sm">
                ⭐ {anime.rating.toFixed(1)}
              </span>
              <span className="text-gray-300 text-sm">{anime.year}</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-300 text-sm">{anime.episodes} episodes</span>
              <span className="text-gray-500">•</span>
              <span
                className={
                  anime.status === "Ongoing" ? "text-green-400 text-sm" : "text-blue-400 text-sm"
                }
              >
                {anime.status}
              </span>
            </div>

            <h1 className="text-5xl font-bold mb-3 drop-shadow-2xl">
              {anime.title}
            </h1>
            <p className="text-gray-400 mb-2">{anime.titleAr}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {anime.genre.slice(0, 4).map((g) => (
                <span
                  key={g}
                  className="bg-purple-600/30 border border-purple-500 px-3 py-1 rounded-full text-xs"
                >
                  {g}
                </span>
              ))}
            </div>

            <p className="text-gray-300 mb-6 line-clamp-3 leading-relaxed">
              {anime.synopsis}
            </p>

            <div className="flex gap-3">
              <Link
                href={`/watch/${anime.id}?ep=1`}
                className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg font-semibold transition"
              >
                ▶ Watch Now
              </Link>
              <Link
                href={`/anime/${anime.id}`}
                className="bg-gray-800/80 hover:bg-gray-700 backdrop-blur px-8 py-3 rounded-lg font-semibold transition"
              >
                More Info
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {animes.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${
              i === current ? "bg-purple-500 w-8" : "bg-gray-600 w-2"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}