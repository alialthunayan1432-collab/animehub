import Link from "next/link";
import AnimeCard from "@/components/AnimeCard";
import ContinueWatching from "@/components/ContinueWatching";
import HeroSlider, { HeroAnime } from "@/components/HeroSlider";
import { AnimeGridSkeleton } from "@/components/Skeleton";
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

function mapToHero(m: AniListMedia): HeroAnime {
  return {
    id: m.id.toString(),
    title: m.title.english || m.title.romaji || "Unknown",
    titleAr: m.title.native || m.title.romaji || "",
    synopsis: (m.description || "").replace(/<[^>]*>/g, "").slice(0, 400),
    banner: m.bannerImage || m.coverImage.large,
    image: m.coverImage.large,
    rating: (m.averageScore || 0) / 10,
    year: m.startDate?.year || 0,
    episodes: m.episodes || 0,
    status: m.status === "RELEASING" ? "Ongoing" : "Completed",
    genre: m.genres || [],
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

async function getHeroAnime(): Promise<HeroAnime[]> {
  try {
    const res = await fetch(
      `http://localhost:3000/api/anime?sort=SCORE_DESC&page=1`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data: ApiResponse = await res.json();
    return data.media.slice(0, 5).map(mapToHero);
  } catch {
    return [];
  }
}

async function getTrending(): Promise<Anime[]> {
  try {
    const res = await fetch(
      `http://localhost:3000/api/anime?sort=TRENDING_DESC&page=1`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data: ApiResponse = await res.json();
    return data.media.slice(0, 6).map(mapToAnime);
  } catch {
    return [];
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1"));

  const [data, heroAnimes, trendingAnimes] = await Promise.all([
    getPopularAnime(currentPage),
    getHeroAnime(),
    getTrending(),
  ]);

  const animes = data?.media?.map(mapToAnime) || [];
  const pageInfo = data?.pageInfo;

  return (
    <main className="min-h-screen">
      <HeroSlider animes={heroAnimes} />

      <ContinueWatching />

      {/* Trending Section */}
      {trendingAnimes.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">🔥 Trending Now</h3>
            <Link
              href="/trending"
              className="text-purple-400 text-sm hover:underline"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {trendingAnimes.map((anime) => (
              <AnimeCard key={`trend-${anime.id}`} anime={anime} />
            ))}
          </div>
        </section>
      )}

      {/* Popular Section */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">
            Popular Now {pageInfo && `— Page ${pageInfo.currentPage}`}
          </h3>
        </div>

        {animes.length === 0 ? (
          <AnimeGridSkeleton />
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