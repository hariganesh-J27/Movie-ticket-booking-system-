import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { buildSeatLayout } from "@/lib/seatLayout";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const movieId = searchParams.get("movieId");
  const date = searchParams.get("date");
  const flat = searchParams.get("flat") === "true";

  try {
    const showtimes = await prisma.showtime.findMany({
      where: {
        ...(movieId ? { movieId: Number(movieId) } : {}),
        ...(date ? { showDate: date } : {}),
      },
      include: { movie: true, theater: true },
      orderBy: flat ? [{ showDate: "asc" }, { showTime: "asc" }] : [{ theater: { name: "asc" } }, { showTime: "asc" }],
    });

    if (flat) {
      return NextResponse.json({
        success: true,
        data: showtimes.map((st) => ({
          showtime_id: st.showtimeId,
          movie_id: st.movieId,
          theater_id: st.theaterId,
          movie_title: st.movie.title,
          theater_name: st.theater.name,
          show_date: st.showDate,
          show_time: st.showTime,
          price_classic: st.priceClassic,
          price_prime: st.pricePrime,
          price_recliner: st.priceRecliner,
        })),
      });
    }

    type TheaterGroup = {
      theater_id: number;
      name: string;
      location: string;
      city: string;
      shows: {
        showtime_id: number;
        show_date: string;
        show_time: string;
        price_classic: number;
        price_prime: number;
        price_recliner: number;
      }[];
    };

    const grouped = new Map<number, TheaterGroup>();
    for (const st of showtimes) {
      if (!grouped.has(st.theaterId)) {
        grouped.set(st.theaterId, {
          theater_id: st.theaterId,
          name: st.theater.name,
          location: st.theater.location,
          city: st.theater.city,
          shows: [],
        });
      }
      grouped.get(st.theaterId)!.shows.push({
        showtime_id: st.showtimeId,
        show_date: st.showDate,
        show_time: st.showTime,
        price_classic: st.priceClassic,
        price_prime: st.pricePrime,
        price_recliner: st.priceRecliner,
      });
    }

    return NextResponse.json({ success: true, data: Array.from(grouped.values()) });
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
    const showtime = await prisma.showtime.create({
      data: {
        movieId: Number(movie_id),
        theaterId: Number(theater_id),
        showDate: show_date,
        showTime: show_time,
        priceClassic: price_classic !== undefined ? Number(price_classic) : 59.0,
        pricePrime: price_prime !== undefined ? Number(price_prime) : 200.0,
        priceRecliner: price_recliner !== undefined ? Number(price_recliner) : 350.0,
      },
    });

    const seatLayout = buildSeatLayout();
    await prisma.seat.createMany({
      data: seatLayout.map((seat) => ({
        showtimeId: showtime.showtimeId,
        seatNumber: seat.seatNumber,
        seatCategory: seat.seatCategory,
        isBooked: 0,
      })),
    });

    return NextResponse.json(
      { success: true, message: "Showtime created successfully", showtime_id: showtime.showtimeId },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
