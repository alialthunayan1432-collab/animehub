import Link from "next/link";
import { notFound } from "next/navigation";
import { getAnimeById } from "@/data/animes";

export const instant = false;

const SAMPLE_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export default async function WatchPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ep?: string }>;
}) {
  const { id } = await params;
  const { ep } = await searchParams;
  const anime = getAnimeById(id);
  if (!anime) notFound();

  const currentEp = Number(ep) || 1;
  const totalEp = Math.min(anime.episodes, 12);
  const nextEp = currentEp < totalEp ? currentEp + 1 : null;
  const prevEp = currentEp > 1 ? currentEp - 1 : null;

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <header className="px-6 py-4 flex items-center justify-between border-b border-gray-800">
        <Link
          href={`/anime/${anime.id}`}
          className="text-purple-400 hover:text-purple-300"
        >
          ← {anime.title}
        </Link>
        <h1 className="text-sm text-gray-400">الحلقة {currentEp}</h1>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-6">
        {/* Player */}
        <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
          <video
            key={currentEp}
            controls
            autoPlay
            className="w-full h-full"
            poster={anime.banner}
          >
            <source src={SAMPLE_VIDEO} type="video/mp4" />
            متصفحك لا يدعم تشغيل الفيديو.
          </video>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-4">
          {prevEp ? (
            <Link
              href={`/watch/${anime.id}?ep=${prevEp}`}
              className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded"
            >
              ← السابق
            </Link>
          ) : (
            <span />
          )}

          <span className="text-gray-400 text-sm">
            حلقة {currentEp} من {totalEp}
          </span>

          {nextEp ? (
            <Link
              href={`/watch/${anime.id}?ep=${nextEp}`}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
            >
              التالي →
            </Link>
          ) : (
            <span />
          )}
        </div>

        {/* Episode List */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">الحلقات</h2>
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