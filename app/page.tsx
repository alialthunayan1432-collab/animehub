import Link from "next/link";
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

type ApiResponse = {
  media: AniListMedia[];
  pageInfo: {
    currentPage: number;
    lastPage: number;
    hasNextPage: boolean;
  };
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

async function getPopularAnime(page: number): Promise<ApiResponse | null> {
  try {
    const res = await fetch(
      `http://localhost:3000/api/anime?page=${page}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1"));
  const data = await getPopularAnime(currentPage);

  const animes = data?.media?.map(mapToAnime) || [];
  const pageInfo = data?.pageInfo;

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
          <h3 className="text-2xl font-bold">
            Popular Now {pageInfo && `— Page ${pageInfo.currentPage}`}
          </h3>
        </div>

        {animes.length === 0 ? (
          <p className="text-center text-gray-400 py-10">
            Loading anime...
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {animes.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-3 mt-10">
              {currentPage > 1 && (
                <Link
                  href={`/?page=${currentPage - 1}`}
                  prefetch={false}
                  className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm transition"
                >
                  ← Previous
                </Link>
              )}

              <span className="text-gray-400 text-sm px-4">
                Page {pageInfo?.currentPage} of {pageInfo?.lastPage}
              </span>

              {pageInfo?.hasNextPage && (
                <Link
                  href={`/?page=${currentPage + 1}`}
                  prefetch={false}
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                  Next →
                </Link>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}