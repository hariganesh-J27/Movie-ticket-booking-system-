import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bookingId = Number(id);

  try {
    await prisma.$transaction(async (tx) => {
      const bookingSeats = await tx.bookingSeat.findMany({ where: { bookingId } });

      await tx.seat.updateMany({
        where: { seatId: { in: bookingSeats.map((bs) => bs.seatId) } },
        data: { isBooked: 0 },
      });

      await tx.bookingSeat.deleteMany({ where: { bookingId } });

      const result = await tx.booking.deleteMany({ where: { bookingId } });
      if (result.count === 0) {
        throw new Error("Booking not found");
      }
    });

    return NextResponse.json({
      success: true,
      message: `Booking ID ${id} cancelled successfully and seats released.`,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
