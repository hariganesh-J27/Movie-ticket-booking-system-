import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeMovie } from "@/lib/serializers";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  try {
    const movies = await prisma.movie.findMany({ orderBy: { rating: "desc" } });
    return NextResponse.json({ success: true, data: movies.map(serializeMovie) });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json();
  const { title, genre, duration, rating, language, description, poster_url, banner_url, release_date } = body;

  if (!title || !genre || !duration) {
    return NextResponse.json(
      { success: false, message: "Title, genre, and duration are required" },
      { status: 400 }
    );
  }

  try {
    const movie = await prisma.movie.create({
      data: {
        title,
        genre,
        duration: Number(duration),
        rating: Number(rating) || 8.0,
        language: language || "English",
        description: description || "",
        posterUrl:
          poster_url ||
          "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
        bannerUrl:
          banner_url ||
          "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80",
        releaseDate: release_date || new Date().toISOString().split("T")[0],
      },
    });

    return NextResponse.json(
      { success: true, message: "Movie created successfully", movie_id: movie.movieId },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
