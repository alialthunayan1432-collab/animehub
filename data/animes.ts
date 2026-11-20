export type Anime = {
  id: string;
  title: string;
  titleAr: string;
  synopsis: string;
  year: number;
  rating: number;
  genre: string[];
  image: string;
  banner: string;
  episodes: number;
  status: "Ongoing" | "Completed";
};

export const animes: Anime[] = [
  {
    id: "attack-on-titan",
    title: "Attack on Titan",
    titleAr: "هجوم العمالقة",
    synopsis: "بعد تدمير مدينته على يد العمالقة، يقسم إرين ييغر على الانتقام.",
    year: 2013,
    rating: 9.0,
    genre: ["Action", "Drama", "Fantasy"],
    image: "https://cdn.myanimelist.net/images/anime/10/47347.jpg",
    banner: "https://cdn.myanimelist.net/images/anime/10/47347l.jpg",
    episodes: 87,
    status: "Completed",
  },
  {
    id: "death-note",
    title: "Death Note",
    titleAr: "مذكرة الموت",
    synopsis: "طالب ثانوي يجد دفتراً سحرياً يمكنه قتل أي شخص بكتابة اسمه فيه.",
    year: 2006,
    rating: 8.6,
    genre: ["Thriller", "Mystery"],
    image: "https://cdn.myanimelist.net/images/anime/9/9453.jpg",
    banner: "https://cdn.myanimelist.net/images/anime/9/9453l.jpg",
    episodes: 37,
    status: "Completed",
  },
  {
    id: "jujutsu-kaisen",
    title: "Jujutsu Kaisen",
    titleAr: "ساحر الفنون القتالية",
    synopsis: "يوتا إيتادوري يبتلع إصبعاً ملعوناً ويصبح وعاءً لروح لعينة.",
    year: 2020,
    rating: 8.5,
    genre: ["Action", "Supernatural"],
    image: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg",
    banner: "https://cdn.myanimelist.net/images/anime/1171/109222l.jpg",
    episodes: 47,
    status: "Ongoing",
  },
  {
    id: "demon-slayer",
    title: "Demon Slayer",
    titleAr: "قاتل الشياطين",
    synopsis: "تانجيرو كامادو يصبح قاتل شياطين لإنقاذ أخته.",
    year: 2019,
    rating: 8.5,
    genre: ["Action", "Fantasy"],
    image: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg",
    banner: "https://cdn.myanimelist.net/images/anime/1286/99889l.jpg",
    episodes: 63,
    status: "Ongoing",
  },
  {
    id: "fullmetal-alchemist",
    title: "Fullmetal Alchemist: Brotherhood",
    titleAr: "الخيميائي المعدني الكامل",
    synopsis: "شقيقان يبحثان عن حجر الفيلسوف بعد محاولة فاشلة لإحياء أمهما.",
    year: 2009,
    rating: 9.1,
    genre: ["Adventure", "Drama", "Fantasy"],
    image: "https://cdn.myanimelist.net/images/anime/1223/96541.jpg",
    banner: "https://cdn.myanimelist.net/images/anime/1223/96541l.jpg",
    episodes: 64,
    status: "Completed",
  },
  {
    id: "one-piece",
    title: "One Piece",
    titleAr: "قطعة واحدة",
    synopsis: "لوفي وطاقمه يبحثون عن الكنز الأسطوري 'ون بيس'.",
    year: 1999,
    rating: 8.7,
    genre: ["Adventure", "Comedy", "Fantasy"],
    image: "https://cdn.myanimelist.net/images/anime/6/73245.jpg",
    banner: "https://cdn.myanimelist.net/images/anime/6/73245l.jpg",
    episodes: 1100,
    status: "Ongoing",
  },
];

export const getAnimeById = (id: string) => animes.find((a) => a.id === id);