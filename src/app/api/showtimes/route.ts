import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const movieIdParam = searchParams.get("movieId");
  const date = searchParams.get("date");
  const flat = searchParams.get("flat") === "true";

  const movieId = movieIdParam ? Number(movieIdParam) : null;
  if (movieId !== null && !Number.isInteger(movieId)) {
    return NextResponse.json({ success: false, message: "movieId must be a number" }, { status: 400 });
  }

  try {
    if (flat) {
      const rows = await query(
        `SELECT s.showtime_id, s.movie_id, s.theater_id,
                m.title AS movie_title, t.name AS theater_name,
                s.show_date, s.show_time, s.price_classic, s.price_prime, s.price_recliner
         FROM showtimes s
         JOIN movies   m ON m.movie_id   = s.movie_id
         JOIN theaters t ON t.theater_id = s.theater_id
         WHERE ($1::int IS NULL OR s.movie_id = $1)
           AND ($2::text IS NULL OR s.show_date = $2)
         ORDER BY s.show_date ASC, s.show_time ASC`,
        [movieId, date]
      );
      return NextResponse.json({ success: true, data: rows });
    }

    // One row per theater, with its shows aggregated into a JSON array.
    const grouped = await query(
      `SELECT t.theater_id, t.name, t.location, t.city,
              json_agg(
                json_build_object(
                  'showtime_id',    s.showtime_id,
                  'show_date',      s.show_date,
                  'show_time',      s.show_time,
                  'price_classic',  s.price_classic,
                  'price_prime',    s.price_prime,
                  'price_recliner', s.price_recliner
                ) ORDER BY s.show_time ASC
              ) AS shows
       FROM showtimes s
       JOIN theaters t ON t.theater_id = s.theater_id
       WHERE ($1::int IS NULL OR s.movie_id = $1)
         AND ($2::text IS NULL OR s.show_date = $2)
       GROUP BY t.theater_id, t.name, t.location, t.city
       ORDER BY t.name ASC`,
      [movieId, date]
    );
    return NextResponse.json({ success: true, data: grouped });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json();
  const { movie_id, theater_id, show_date, show_time, price_classic, price_prime, price_recliner } = body;

  if (!movie_id || !theater_id || !show_date || !show_time) {
    return NextResponse.json(
      { success: false, message: "movie_id, theater_id, show_date, and show_time are required" },
      { status: 400 }
    );
  }

  try {
    // fn_create_showtime inserts the showtime and generates its seat layout atomically.
    const rows = await query<{ showtime_id: number }>(
      `SELECT fn_create_showtime($1, $2, $3, $4, $5, $6, $7) AS showtime_id`,
      [
        Number(movie_id),
        Number(theater_id),
        show_date,
        show_time,
        price_classic !== undefined ? Number(price_classic) : null,
        price_prime !== undefined ? Number(price_prime) : null,
        price_recliner !== undefined ? Number(price_recliner) : null,
      ]
    );

    return NextResponse.json(
      { success: true, message: "Showtime created successfully", showtime_id: rows[0].showtime_id },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
