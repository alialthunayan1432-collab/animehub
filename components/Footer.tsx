import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <h3 className="text-xl font-bold text-purple-500 mb-3">AnimeHub</h3>
          <p className="text-gray-400 leading-relaxed">
            وجهتك الأولى لمشاهدة أفضل الأنميات بجودة عالية وترجمة احترافية.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">روابط سريعة</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link href="/" className="hover:text-purple-400">الرئيسية</Link></li>
            <li><Link href="/popular" className="hover:text-purple-400">الأكثر شعبية</Link></li>
            <li><Link href="/genres" className="hover:text-purple-400">التصنيفات</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">التصنيفات</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link href="/genres/action" className="hover:text-purple-400">أكشن</Link></li>
            <li><Link href="/genres/adventure" className="hover:text-purple-400">مغامرة</Link></li>
            <li><Link href="/genres/fantasy" className="hover:text-purple-400">فانتازيا</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">تواصل معنا</h4>
          <ul className="space-y-2 text-gray-400">
            <li>📧 contact@animehub.dev</li>
            <li>🐦 Twitter</li>
            <li>💬 Discord</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © 2026 AnimeHub — جميع الحقوق محفوظة
      </div>
    </footer>
  );
}