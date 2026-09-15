import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { serializeBooking } from "@/lib/serializers";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: "Sign in to book tickets" }, { status: 401 });
  }

  const body = await req.json();
  const { user_name, user_phone, showtime_id, seat_ids, seat_numbers, total_amount } = body;
  const userName = user_name || session.user.name || "Guest";
  const userEmail = session.user.email;

  if (!userEmail || !user_phone || !showtime_id || !seat_ids || seat_ids.length === 0) {
    return NextResponse.json(
      { success: false, message: "Invalid booking data. Please select seats and provide user info." },
      { status: 400 }
    );
  }

  try {
    const bookingRef = "BMS-" + Math.floor(100000 + Math.random() * 900000);
    const seatsStr = seat_numbers ? seat_numbers.join(", ") : seat_ids.join(", ");

    const bookingId = await prisma.$transaction(async (tx) => {
      const seatIdsAsNumbers = seat_ids.map((id: string | number) => Number(id));
      const checkSeats = await tx.seat.findMany({
        where: { seatId: { in: seatIdsAsNumbers } },
      });

      const alreadyBooked = checkSeats.filter((s) => s.isBooked === 1);
      if (alreadyBooked.length > 0) {
        throw new Error(`Seats already booked: ${alreadyBooked.map((s) => s.seatNumber).join(", ")}`);
      }

      const booking = await tx.booking.create({
        data: {
          bookingRef,
          userId: session.user!.id,
          userName,
          userEmail,
          userPhone: user_phone,
          showtimeId: Number(showtime_id),
          totalAmount: total_amount,
          seatsList: seatsStr,
        },
      });

      await tx.seat.updateMany({
        where: { seatId: { in: seatIdsAsNumbers } },
        data: { isBooked: 1 },
      });

      await tx.bookingSeat.createMany({
        data: seatIdsAsNumbers.map((seatId: number) => ({ bookingId: booking.bookingId, seatId })),
      });

      return booking.bookingId;
    });

    const bookingDetails = await prisma.booking.findUnique({
      where: { bookingId },
      include: { showtime: { include: { movie: true, theater: true } } },
    });

    return NextResponse.json(
      { success: true, message: "Ticket booked successfully!", data: serializeBooking(bookingDetails!) },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: "Sign in to view your bookings" }, { status: 401 });
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: session.user.id },
      include: { showtime: { include: { movie: true, theater: true } } },
      orderBy: { bookingDate: "desc" },
    });

    return NextResponse.json({ success: true, data: bookings.map(serializeBooking) });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
