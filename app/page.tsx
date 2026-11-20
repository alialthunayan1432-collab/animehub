import Link from "next/link";
import { animes } from "@/data/animes";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-purple-500">
          AnimeHub
        </Link>
        <nav className="flex gap-6 text-sm text-gray-300">
          <Link href="/" className="hover:text-white">Home</Link>
          <a href="#" className="hover:text-white">Popular</a>
          <a href="#" className="hover:text-white">Genres</a>
        </nav>
      </header>

      <section className="px-6 py-10 bg-gradient-to-r from-purple-900 to-gray-950">
        <h2 className="text-4xl font-bold mb-2">أهلاً بك في AnimeHub 🎬</h2>
        <p className="text-gray-300">شاهد أفضل الأنميات مترجمة بجودة عالية</p>
      </section>

      <section className="px-6 py-8">
        <h3 className="text-xl font-semibold mb-4">Popular Now</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {animes.map((anime) => (
            <Link
              key={anime.id}
              href={`/anime/${anime.id}`}
              className="bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer block"
            >
              <img
                src={anime.image}
                alt={anime.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-3">
                <h4 className="font-semibold text-sm truncate">{anime.title}</h4>
                <p className="text-xs text-gray-400">
                  {anime.year} • ⭐ {anime.rating}
                </p>
                <span className="inline-block mt-2 text-xs bg-purple-600 px-2 py-0.5 rounded">
                  {anime.genre[0]}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}