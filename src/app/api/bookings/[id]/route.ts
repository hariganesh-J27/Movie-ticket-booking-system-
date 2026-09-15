import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: "Sign in to manage your bookings" }, { status: 401 });
  }

  const { id } = await params;
  const bookingId = Number(id);

  try {
    await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({ where: { bookingId } });
      if (!booking || booking.userId !== session.user!.id) {
        throw new Error("Booking not found");
      }

      const bookingSeats = await tx.bookingSeat.findMany({ where: { bookingId } });

      await tx.seat.updateMany({
        where: { seatId: { in: bookingSeats.map((bs) => bs.seatId) } },
        data: { isBooked: 0 },
      });

      await tx.bookingSeat.deleteMany({ where: { bookingId } });
      await tx.booking.delete({ where: { bookingId } });
    });

    return NextResponse.json({
      success: true,
      message: `Booking ID ${id} cancelled successfully and seats released.`,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
