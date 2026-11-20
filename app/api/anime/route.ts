import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const id = searchParams.get("id");
  const page = searchParams.get("page") || "1";

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

  // لو مفيش id → نجيب قائمة (بحث أو الأكثر شعبية)
  const listQuery = `
    query ($search: String, $page: Int) {
      Page(page: $page, perPage: 24) {
        media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
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
      variables: { search: query || null, page: parseInt(page) },
    }),
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    return NextResponse.json({ error: "AniList failed" }, { status: 502 });
  }

  const data = await response.json();
  return NextResponse.json(data.data.Page.media);
}