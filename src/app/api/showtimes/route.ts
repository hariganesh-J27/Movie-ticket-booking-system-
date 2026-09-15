import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const movieId = searchParams.get("movieId");
  const date = searchParams.get("date");

  try {
    const showtimes = await prisma.showtime.findMany({
      where: {
        ...(movieId ? { movieId: Number(movieId) } : {}),
        ...(date ? { showDate: date } : {}),
      },
      include: { movie: true, theater: true },
      orderBy: [{ theater: { name: "asc" } }, { showTime: "asc" }],
    });

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
