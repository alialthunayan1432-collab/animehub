import Link from "next/link";

const genres = [
  {
    name: "Action",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx16498-buvcRTBx4NSm.jpg",
  },
  {
    name: "Adventure",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21-ELSYx3yMPcKM.jpg",
  },
  {
    name: "Comedy",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21087-B5DHjqZ3kW4b.jpg",
  },
  {
    name: "Drama",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20665-TLgkL8T8IRFd.png",
  },
  {
    name: "Fantasy",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx101922-WBsBl0ClmgYL.jpg",
  },
  {
    name: "Horror",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/b20605-k665mVkSug8D.jpg",
  },
  {
    name: "Mystery",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx1535-kUgkcrfOrkUM.jpg",
  },
  {
    name: "Romance",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21519-SUo3ZQuCbYhJ.png",
  },
  {
    name: "Sci-Fi",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx11757-SxYDUzdr9rh2.jpg",
  },
  {
    name: "Slice of Life",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21507-6YUSbh2m0N1p.jpg",
  },
  {
    name: "Sports",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20958-HuFJyr54Mmir.jpg",
  },
  {
    name: "Supernatural",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx113415-LHBAeoZDIsnF.jpg",
  },
  {
    name: "Thriller",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx101759-8UR7r9MNVpz2.jpg",
  },
  {
    name: "Mecha",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx11757-SxYDUzdr9rh2.jpg",
  },
  {
    name: "Music",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20665-TLgkL8T8IRFd.png",
  },
  {
    name: "Psychological",
    image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx1535-kUgkcrfOrkUM.jpg",
  },
];

export default function GenresPage() {
  return (
    <main className="min-h-screen">
      <section className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold mb-2">Browse by Genre</h1>
        <p className="text-gray-400 mb-10">
          Explore anime by your favorite genre
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-5">
          {genres.map((g) => (
            <Link
              key={g.name}
              href={`/genres/${encodeURIComponent(g.name)}`}
              prefetch={false}
              className="relative group rounded-xl overflow-hidden aspect-[2/3] shadow-xl"
            >
              <img
                src={g.image}
                alt={g.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute inset-0 bg-purple-600/0 group-hover:bg-purple-600/20 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-xl font-bold text-white drop-shadow-lg">
                  {g.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}