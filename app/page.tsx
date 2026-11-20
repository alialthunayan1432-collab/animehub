import { animes } from "@/data/animes";
import AnimeCard from "@/components/AnimeCard";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="px-6 py-16 bg-gradient-to-l from-purple-900 via-gray-950 to-gray-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold mb-4">
            أهلاً بك في <span className="text-purple-400">AnimeHub</span> 🎬
          </h2>
          <p className="text-lg text-gray-300 max-w-xl">
            شاهد أفضل الأنميات مترجمة بجودة عالية. اكتشف، تابع، واستمتع.
          </p>
        </div>
      </section>

      {/* Popular Grid */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">الأكثر شعبية الآن</h3>
          <a href="#" className="text-purple-400 text-sm hover:underline">
            عرض الكل →
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {animes.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      </section>

      {/* New */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">أضيف حديثاً</h3>
          <a href="#" className="text-purple-400 text-sm hover:underline">
            عرض الكل →
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {animes.slice(0, 3).map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      </section>
    </main>
  );
}