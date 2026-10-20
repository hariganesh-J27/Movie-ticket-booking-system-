import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { MOVIE_COLS } from "@/lib/columns";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  try {
    const movies = await query(`SELECT ${MOVIE_COLS} FROM movies ORDER BY rating DESC`);
    return NextResponse.json({ success: true, data: movies });
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
    const rows = await query<{ movie_id: number }>(
      `INSERT INTO movies (title, genre, duration, rating, language, description, poster_url, banner_url, release_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING movie_id`,
      [
        title,
        genre,
        Number(duration),
        Number(rating) || 8.0,
        language || "English",
        description || "",
        poster_url ||
          "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
        banner_url ||
          "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80",
        release_date || new Date().toISOString().split("T")[0],
      ]
    );

    return NextResponse.json(
      { success: true, message: "Movie created successfully", movie_id: rows[0].movie_id },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
