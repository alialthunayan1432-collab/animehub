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

async function getTopRated(page: number): Promise<ApiResponse | null> {
  try {
    const res = await fetch(
      `http://localhost:3000/api/anime?sort=SCORE_DESC&page=${page}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function TopPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1"));
  const data = await getTopRated(currentPage);
  const animes = data?.media?.map(mapToAnime) || [];
  const pageInfo = data?.pageInfo;

  return (
    <main className="min-h-screen">
      <section className="px-6 py-14 bg-gradient-to-l from-yellow-900 via-gray-950 to-gray-950 border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold">
            🏆 Top Rated <span className="text-yellow-400">Anime</span>
          </h1>
          <p className="text-gray-400 mt-2">
            The highest-rated anime of all time
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-10">
        {animes.length === 0 ? (
          <p className="text-center text-gray-400 py-10">Loading...</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {animes.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>

            <div className="flex items-center justify-center gap-3 mt-10">
              {currentPage > 1 && (
                <Link
                  href={`/top?page=${currentPage - 1}`}
                  prefetch={false}
                  className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm"
                >
                  ← Previous
                </Link>
              )}
              <span className="text-gray-400 text-sm px-4">
                Page {pageInfo?.currentPage} of {pageInfo?.lastPage}
              </span>
              {pageInfo?.hasNextPage && (
                <Link
                  href={`/top?page=${currentPage + 1}`}
                  prefetch={false}
                  className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg text-sm font-semibold"
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