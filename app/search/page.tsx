import { animes } from "@/data/animes";
import AnimeCard from "@/components/AnimeCard";

export const instant = false;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q || "").trim().toLowerCase();

  const results = query
    ? animes.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.titleAr.includes(query) ||
          a.genre.some((g) => g.toLowerCase().includes(query))
      )
    : animes;

  return (
    <main className="min-h-screen">
      <section className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-2">البحث</h1>
        <p className="text-gray-400 mb-8">
          {query
            ? `نتائج البحث عن: "${query}" — ${results.length} نتيجة`
            : `كل الأنميات — ${results.length} نتيجة`}
        </p>

        {results.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🔍</p>
            <p className="text-xl text-gray-400 mb-2">لا توجد نتائج</p>
            <p className="text-sm text-gray-500">
              جرب كلمة بحث أخرى مثل "Action" أو "Attack"
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