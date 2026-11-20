import AnimeCard from "@/components/AnimeCard";
import SearchFilters from "@/components/SearchFilters";
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

type ApiResponse = {
  media: AniListMedia[];
  pageInfo: { currentPage: number; lastPage: number; hasNextPage: boolean };
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

async function searchAnime(
  q: string,
  year: string,
  sort: string
): Promise<Anime[]> {
  if (!q) return [];
  try {
    const params = new URLSearchParams({ q });
    if (year) params.set("year", year);
    if (sort) params.set("sort", sort);

    const res = await fetch(
      `http://localhost:3000/api/anime?${params.toString()}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data: ApiResponse = await res.json();
    return data.media.map(mapToAnime);
  } catch {
    return [];
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; year?: string; sort?: string }>;
}) {
  const { q, year, sort } = await searchParams;
  const query = (q || "").trim();
  const currentYear = year || "";
  const currentSort = sort || "POPULARITY_DESC";

  const results = await searchAnime(query, currentYear, currentSort);

  return (
    <main className="min-h-screen">
      <section className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-2">Search</h1>
        <p className="text-gray-400 mb-6">
          {query
            ? `Results for "${query}" — ${results.length} found`
            : "Type in the search bar above to start"}
        </p>

        {query && (
          <SearchFilters currentYear={currentYear} currentSort={currentSort} />
        )}

        {results.length === 0 && query ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🔍</p>
            <p className="text-xl text-gray-400 mb-2">No results found</p>
            <p className="text-sm text-gray-500">
              Try another keyword or clear the filters
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