import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeSeat } from "@/lib/serializers";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const showtime = await prisma.showtime.findUnique({
      where: { showtimeId: Number(id) },
      include: { movie: true, theater: true },
    });

    if (!showtime) {
      return NextResponse.json({ success: false, message: "Showtime not found" }, { status: 404 });
    }

    const seats = await prisma.seat.findMany({
      where: { showtimeId: Number(id) },
      orderBy: { seatNumber: "asc" },
    });

    return NextResponse.json({
      success: true,
      showtime: {
        showtime_id: showtime.showtimeId,
        movie_id: showtime.movieId,
        theater_id: showtime.theaterId,
        show_date: showtime.showDate,
        show_time: showtime.showTime,
        price_classic: showtime.priceClassic,
        price_prime: showtime.pricePrime,
        price_recliner: showtime.priceRecliner,
        movie_title: showtime.movie.title,
        poster_url: showtime.movie.posterUrl,
        theater_name: showtime.theater.name,
      },
      seats: seats.map(serializeSeat),
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
