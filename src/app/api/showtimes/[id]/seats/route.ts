import { NextRequest, NextResponse } from "next/server";
import { parseId, query } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const showtimeId = parseId(id);
  if (showtimeId === null) {
    return NextResponse.json({ success: false, message: "Showtime not found" }, { status: 404 });
  }

  try {
    const showtimes = await query(
      `SELECT s.showtime_id, s.movie_id, s.theater_id, s.show_date, s.show_time,
              s.price_classic, s.price_prime, s.price_recliner,
              m.title AS movie_title, m.poster_url, t.name AS theater_name
       FROM showtimes s
       JOIN movies   m ON m.movie_id   = s.movie_id
       JOIN theaters t ON t.theater_id = s.theater_id
       WHERE s.showtime_id = $1`,
      [showtimeId]
    );

    if (showtimes.length === 0) {
      return NextResponse.json({ success: false, message: "Showtime not found" }, { status: 404 });
    }

    const seats = await query(
      `SELECT seat_id, showtime_id, seat_number, seat_category, is_booked
       FROM seats
       WHERE showtime_id = $1
       ORDER BY seat_number ASC`,
      [showtimeId]
    );

    return NextResponse.json({ success: true, showtime: showtimes[0], seats });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
