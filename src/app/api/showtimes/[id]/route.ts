import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const showtime = await prisma.showtime.findUnique({ where: { showtimeId: Number(id) } });
    if (!showtime) {
      return NextResponse.json({ success: false, message: "Showtime not found" }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      data: {
        showtime_id: showtime.showtimeId,
        movie_id: showtime.movieId,
        theater_id: showtime.theaterId,
        show_date: showtime.showDate,
        show_time: showtime.showTime,
        price_classic: showtime.priceClassic,
        price_prime: showtime.pricePrime,
        price_recliner: showtime.priceRecliner,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await req.json();
  const { show_date, show_time, price_classic, price_prime, price_recliner } = body;

  try {
    const showtime = await prisma.showtime.update({
      where: { showtimeId: Number(id) },
      data: {
        ...(show_date !== undefined && { showDate: show_date }),
        ...(show_time !== undefined && { showTime: show_time }),
        ...(price_classic !== undefined && { priceClassic: Number(price_classic) }),
        ...(price_prime !== undefined && { pricePrime: Number(price_prime) }),
        ...(price_recliner !== undefined && { priceRecliner: Number(price_recliner) }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Showtime updated successfully",
      data: {
        showtime_id: showtime.showtimeId,
        show_date: showtime.showDate,
        show_time: showtime.showTime,
        price_classic: showtime.priceClassic,
        price_prime: showtime.pricePrime,
        price_recliner: showtime.priceRecliner,
      },
    });
  } catch {
    return NextResponse.json({ success: false, message: "Showtime not found" }, { status: 404 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  try {
    await prisma.showtime.delete({ where: { showtimeId: Number(id) } });
    return NextResponse.json({ success: true, message: `Showtime ID ${id} deleted successfully` });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Could not delete showtime. It may have existing bookings — cancel those first.",
        error: (error as Error).message,
      },
      { status: 409 }
    );
  }
}
