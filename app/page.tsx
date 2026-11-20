import AnimeCard from "@/components/AnimeCard";
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
    synopsis: (m.description || "").replace(/<[^>]*>/g, "").slice(0, 300),
    year: m.startDate?.year || 0,
    rating: (m.averageScore || 0) / 10,
    genre: m.genres || [],
    image: m.coverImage.large,
    banner: m.bannerImage || m.coverImage.large,
    episodes: m.episodes || 0,
    status: m.status === "RELEASING" ? "Ongoing" : "Completed",
  };
}

async function getPopularAnime(): Promise<Anime[]> {
  try {
    const res = await fetch("http://localhost:3000/api/anime?page=1", {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data: AniListMedia[] = await res.json();
    return data.map(mapToAnime);
  } catch {
    return [];
  }
}

export default async function Home() {
  const animes = await getPopularAnime();

  return (
    <main className="min-h-screen">
      <section className="px-6 py-16 bg-gradient-to-l from-purple-900 via-gray-950 to-gray-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold mb-4">
            Welcome to <span className="text-purple-400">AnimeHub</span> 🎬
          </h2>
          <p className="text-lg text-gray-300 max-w-xl">
            Thousands of anime in one place. Discover, track, and enjoy.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Popular Now</h3>
        </div>

        {animes.length === 0 ? (
          <p className="text-center text-gray-400 py-10">
            Loading anime...
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {animes.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}