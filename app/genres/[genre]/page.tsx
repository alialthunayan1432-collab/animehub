
import Link from "next/link";
import AnimeCard from "@/components/AnimeCard";
import type { Anime } from "@/data/animes";

export const instant = false;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

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

async function getByGenre(
  genre: string,
  page: number
): Promise<ApiResponse | null> {
  try {
    const params = new URLSearchParams({
      genre,
      page: page.toString(),
    });

    const res = await fetch(
      `${SITE_URL}/api/anime?${params.toString()}`,
      { next: { revalidate: 300 } }
    );

    if (!res.ok) {
      console.error("Genre API error:", res.status);
      return null;
    }

    return (await res.json()) as ApiResponse;
  } catch (error) {
    console.error("Genre fetch failed:", error);
    return null;
  }
}

export default async function GenrePage({
  params,
  searchParams,
}: {
  params: Promise<{ genre: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { genre } = await params;
  const { page } = await searchParams;

  const parsedPage = Number.parseInt(page || "1", 10);
  const currentPage = Number.isNaN(parsedPage)
    ? 1
    : Math.max(1, parsedPage);

  const genreName = decodeURIComponent(genre);

  const data = await getByGenre(genreName, currentPage);
  const animes = data?.media?.map(mapToAnime) || [];
  const pageInfo = data?.pageInfo;

  return (
    <main className="min-h-screen">
      {/* Header */}
      <section className="px-6 py-14 bg-gradient-to-l from-purple-900 via-gray-950 to-gray-950 border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/genres"
            className="text-purple-400 text-sm hover:text-purple-300"
          >
            ← All Genres
          </Link>

          <h1 className="text-5xl font-bold mt-3">{genreName}</h1>

          <p className="text-gray-400 mt-2">
            {pageInfo &&
              `Page ${pageInfo.currentPage} of ${pageInfo.lastPage}`}
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        {animes.length === 0 ? (
          <p className="text-center text-gray-400 py-10">
            Loading...
          </p>
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
                  href={`/genres/${encodeURIComponent(genreName)}?page=${currentPage - 1}`}
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
                  href={`/genres/${encodeURIComponent(genreName)}?page=${currentPage + 1}`}
                  prefetch={false}
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-semibold"
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
