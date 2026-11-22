import Link from "next/link";
import { notFound } from "next/navigation";
import type { Anime } from "@/data/animes";

export const instant = false;

// 🔴 هنا تحط معرف الفيديو (الجزء اللي بعد /embed/ وقبل ?)
const YOUTUBE_VIDEO_ID = "5ILlar1UJ88";

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
    synopsis: (m.description || "").replace(/<[^>]*>/g, ""),
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

export default async function WatchPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ep?: string }>;
}) {
  const { id } = await params;
  const { ep } = await searchParams;
  const anime = await getAnime(id);
  if (!anime) notFound();

  const currentEp = Number(ep) || 1;
  const totalEp = Math.min(anime.episodes || 12, 12);
  const nextEp = currentEp < totalEp ? currentEp + 1 : null;
  const prevEp = currentEp > 1 ? currentEp - 1 : null;

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="px-6 py-3 border-b border-gray-800">
        <Link
          href={`/anime/${anime.id}`}
          className="text-purple-400 hover:text-purple-300 text-sm"
        >
          ← {anime.title}
        </Link>
      </div>

      <section className="max-w-6xl mx-auto px-4 py-6">
        {/* 🎬 YouTube Player */}
        <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
          <iframe
            key={currentEp}
            src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0`}
            className="w-full h-full"
            title={`${anime.title} - Episode ${currentEp}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-4">
          {prevEp ? (
            <Link
              href={`/watch/${anime.id}?ep=${prevEp}`}
              className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded"
            >
              ← Previous
            </Link>
          ) : (
            <span />
          )}

          <span className="text-gray-400 text-sm">
            Episode {currentEp} of {totalEp}
          </span>

          {nextEp ? (
            <Link
              href={`/watch/${anime.id}?ep=${nextEp}`}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
            >
              Next →
            </Link>
          ) : (
            <span />
          )}
        </div>

        {/* Episode List */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Episodes</h2>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
            {Array.from({ length: totalEp }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                href={`/watch/${anime.id}?ep=${n}`}
                className={`text-center py-2 rounded border text-sm transition ${
                  n === currentEp
                    ? "bg-purple-600 border-purple-500"
                    : "bg-gray-900 border-gray-800 hover:bg-gray-800"
                }`}
              >
                {n}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}