import { NextRequest, NextResponse } from "next/server";
import { parseId, pgErrorCode, query, updateById } from "@/lib/db";
import { MOVIE_COLS } from "@/lib/columns";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movieId = parseId(id);
  if (movieId === null) {
    return NextResponse.json({ success: false, message: "Movie not found" }, { status: 404 });
  }

  try {
    const rows = await query(`SELECT ${MOVIE_COLS} FROM movies WHERE movie_id = $1`, [movieId]);
    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Movie not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const movieId = parseId(id);
  const body = await req.json();
  const { title, genre, duration, rating, language, description, poster_url, banner_url, release_date } = body;

  if (movieId === null) {
    return NextResponse.json({ success: false, message: "Movie not found" }, { status: 404 });
  }

  try {
    const movie = await updateById("movies", "movie_id", movieId, {
      title,
      genre,
      duration: duration !== undefined ? Number(duration) : undefined,
      rating: rating !== undefined ? Number(rating) : undefined,
      language,
      description,
      poster_url,
      banner_url,
      release_date,
    }, MOVIE_COLS);

    if (!movie) {
      return NextResponse.json({ success: false, message: "Movie not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Movie updated successfully", data: movie });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const movieId = parseId(id);
  if (movieId === null) {
    return NextResponse.json({ success: false, message: "Movie not found" }, { status: 404 });
  }

  try {
    const rows = await query(`DELETE FROM movies WHERE movie_id = $1 RETURNING movie_id`, [movieId]);
    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Movie not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: `Movie with ID ${id} deleted successfully` });
  } catch (error) {
    // 23503 = foreign_key_violation: bookings still reference this movie's showtimes.
    const status = pgErrorCode(error) === "23503" ? 409 : 500;
    return NextResponse.json({ success: false, error: (error as Error).message }, { status });
  }
}
