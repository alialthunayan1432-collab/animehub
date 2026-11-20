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

async function searchAnime(q: string): Promise<Anime[]> {
  if (!q) return [];
  try {
    const res = await fetch(
      `http://localhost:3000/api/anime?q=${encodeURIComponent(q)}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data: AniListMedia[] = await res.json();
    return data.map(mapToAnime);
  } catch {
    return [];
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q || "").trim();
  const results = await searchAnime(query);

  return (
    <main className="min-h-screen">
      <section className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-2">Search</h1>
        <p className="text-gray-400 mb-8">
          {query
            ? `Results for "${query}" — ${results.length} found`
            : "Type in the search bar above to start"}
        </p>

        {results.length === 0 && query ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🔍</p>
            <p className="text-xl text-gray-400 mb-2">No results found</p>
            <p className="text-sm text-gray-500">
              Try another keyword like "Naruto" or "Attack"
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {results.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}