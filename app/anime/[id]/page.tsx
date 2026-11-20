import Link from "next/link";
import { notFound } from "next/navigation";
import AnimeCard from "@/components/AnimeCard";
import WatchlistButton from "@/components/WatchlistButton";
import type { Anime } from "@/data/animes";

export const instant = false;

type AniListMedia = {
  id: number;
  title: { romaji?: string; english?: string; native?: string };
  coverImage: { large: string };
  bannerImage?: string;
  averageScore?: number;
  episodes?: number;
  status: string;
  genres: string[];
  description?: string;
  startDate?: { year?: number };
};

function mapToAnime(m: AniListMedia): Anime {
  return {
    id: m.id.toString(),
    title: m.title.english || m.title.romaji || "Unknown",
    titleAr: m.title.native || m.title.romaji || "",
    synopsis: (m.description || "No description available").replace(/<[^>]*>/g, ""),
    year: m.startDate?.year || 0,
    rating: (m.averageScore || 0) / 10,
    genre: m.genres || [],
    image: m.coverImage.large,
    banner: m.bannerImage || m.coverImage.large,
    episodes: m.episodes || 0,
    status: m.status === "RELEASING" ? "Ongoing" : "Completed",
  };
}

async function getAnime(id: string): Promise<Anime | null> {
  try {
    const res = await fetch(
      `http://localhost:3000/api/anime?id=${id}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    const data: AniListMedia = await res.json();
    if (!data || !data.id) return null;
    return mapToAnime(data);
  } catch {
    return null;
  }
}

async function getRecommendations(id: string): Promise<Anime[]> {
  try {
    const res = await fetch(
      `http://localhost:3000/api/anime?id=${id}&recommendations=true`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data: AniListMedia[] = await res.json();
    return data.map(mapToAnime);
  } catch {
    return [];
  }
}

export default async function AnimeDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const anime = await getAnime(id);
  const recommendations = await getRecommendations(id);

  if (!anime) notFound();

  const episodeList = Array.from(
    { length: Math.min(anime.episodes || 12, 12) },
    (_, i) => i + 1
  );

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="relative h-72 w-full overflow-hidden">
        <img
          src={anime.banner}
          alt={anime.title}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
        <Link
          href="/"
          className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded text-sm hover:bg-black z-10"
        >
          ← Back
        </Link>
      </div>

      <section className="px-6 -mt-32 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
          <img
            src={anime.image}
            alt={anime.title}
            className="w-48 h-72 object-cover rounded-lg shadow-2xl border border-gray-700"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{anime.title}</h1>
            <p className="text-gray-400 mb-2">{anime.titleAr}</p>

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300 mb-4">
              <span className="bg-yellow-500 text-black px-2 py-0.5 rounded font-semibold">
                ⭐ {anime.rating.toFixed(1)}
              </span>
              <span>{anime.year}</span>
              <span>•</span>
              <span>{anime.episodes} episodes</span>
              <span>•</span>
              <span
                className={
                  anime.status === "Ongoing" ? "text-green-400" : "text-blue-400"
                }
              >
                {anime.status}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {anime.genre.map((g) => (
                <span
                  key={g}
                  className="bg-purple-600/30 border border-purple-500 px-3 py-1 rounded-full text-xs"
                >
                  {g}
                </span>
              ))}
            </div>

            <p className="text-gray-300 max-w-2xl leading-relaxed whitespace-pre-line">
              {anime.synopsis}
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <Link
                href={`/watch/${anime.id}?ep=1`}
                className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg font-semibold transition"
              >
                ▶ Watch Now
              </Link>
              <WatchlistButton anime={anime} />
            </div>
          </div>
        </div>
      </section>

      {anime.episodes > 0 && (
        <section className="px-6 py-10 max-w-7xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Episodes</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {episodeList.map((ep) => (
              <Link
                key={ep}
                href={`/watch/${anime.id}?ep=${ep}`}
                className="bg-gray-900 hover:bg-purple-600 border border-gray-800 text-center py-3 rounded transition text-sm"
              >
                {ep}
              </Link>
            ))}
          </div>
        </section>
      )}

      {recommendations.length > 0 && (
        <section className="px-6 py-10 max-w-7xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">You might also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recommendations.map((rec) => (
              <AnimeCard key={rec.id} anime={rec} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}