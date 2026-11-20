import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const id = searchParams.get("id");
  const genre = searchParams.get("genre");
  const year = searchParams.get("year");
  const sort = searchParams.get("sort") || "POPULARITY_DESC";
  const page = searchParams.get("page") || "1";
  const recommendations = searchParams.get("recommendations");

  // لو طلب recommendations
  if (recommendations === "true" && id) {
    const recQuery = `
      query ($id: Int) {
        Media(id: $id, type: ANIME) {
          recommendations(sort: RATING_DESC, perPage: 12) {
            nodes {
              mediaRecommendation {
                id
                title { romaji english native }
                coverImage { large }
                bannerImage
                averageScore
                episodes
                status
                genres
                description
                startDate { year }
              }
            }
          }
        }
      }
    `;

    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: recQuery,
        variables: { id: parseInt(id) },
      }),
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "AniList failed" }, { status: 502 });
    }

    const data = await response.json();
    const recs = data.data.Media.recommendations.nodes
      .map((n: any) => n.mediaRecommendation)
      .filter((m: any) => m !== null);

    return NextResponse.json(recs);
  }

  // لو فيه id → نجيب أنمي واحد
  if (id) {
    const singleQuery = `
      query ($id: Int) {
        Media(id: $id, type: ANIME) {
          id
          title { romaji english native }
          coverImage { large }
          bannerImage
          averageScore
          episodes
          status
          genres
          description
          startDate { year }
        }
      }
    `;

    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: singleQuery,
        variables: { id: parseInt(id) },
      }),
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "AniList failed" }, { status: 502 });
    }

    const data = await response.json();
    return NextResponse.json(data.data.Media);
  }

  // قائمة (بحث / تصنيف / سنة / ترتيب)
  const listQuery = `
    query ($search: String, $genre: String, $seasonYear: Int, $sort: [MediaSort], $page: Int) {
      Page(page: $page, perPage: 24) {
        pageInfo {
          currentPage
          lastPage
          hasNextPage
        }
        media(search: $search, genre: $genre, seasonYear: $seasonYear, type: ANIME, sort: $sort) {
          id
          title { romaji english native }
          coverImage { large }
          bannerImage
          averageScore
          episodes
          status
          genres
          description
          startDate { year }
        }
      }
    }
  `;

  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: listQuery,
      variables: {
        search: query || null,
        genre: genre || null,
        seasonYear: year ? parseInt(year) : null,
        sort: [sort],
        page: parseInt(page),
      },
    }),
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    return NextResponse.json({ error: "AniList failed" }, { status: 502 });
  }

  const data = await response.json();
  return NextResponse.json({
    media: data.data.Page.media,
    pageInfo: data.data.Page.pageInfo,
  });
}