import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <h3 className="text-xl font-bold text-purple-500 mb-3">AnimeHub</h3>
          <p className="text-gray-400 leading-relaxed">
            Your destination for watching the best anime in high quality with professional subtitles.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link href="/" className="hover:text-purple-400">Home</Link></li>
            <li><Link href="/trending" className="hover:text-purple-400">Trending</Link></li>
            <li><Link href="/top" className="hover:text-purple-400">Top Rated</Link></li>
            <li><Link href="/genres" className="hover:text-purple-400">Genres</Link></li>
            <li><Link href="/watchlist" className="hover:text-purple-400">My List</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Categories</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link href="/genres/Action" className="hover:text-purple-400">Action</Link></li>
            <li><Link href="/genres/Adventure" className="hover:text-purple-400">Adventure</Link></li>
            <li><Link href="/genres/Fantasy" className="hover:text-purple-400">Fantasy</Link></li>
            <li><Link href="/genres/Romance" className="hover:text-purple-400">Romance</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-gray-400">
            <li>📧 contact@animehub.dev</li>
            <li>🐦 Twitter</li>
            <li>💬 Discord</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © 2026 AnimeHub — All rights reserved
      </div>
    </footer>
  );
}