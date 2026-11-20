import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-6">About AnimeHub</h1>
      <p className="text-gray-300 leading-relaxed mb-4">
        AnimeHub is your destination for discovering and tracking the best anime.
        Built with Next.js, Tailwind CSS, and Supabase, this platform lets you
        browse thousands of anime, save your watchlist, and continue watching
        right where you left off.
      </p>
      <p className="text-gray-300 leading-relaxed mb-8">
        All anime data is powered by the AniList API. This is a personal project
        built for learning and portfolio purposes.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold transition"
        >
          Browse Anime
        </Link>
        <Link
          href="/trending"
          className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition"
        >
          Trending Now
        </Link>
      </div>
    </main>
  );
}