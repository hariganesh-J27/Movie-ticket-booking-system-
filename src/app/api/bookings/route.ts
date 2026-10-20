import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { query } from "@/lib/db";
import { BOOKING_COLS } from "@/lib/columns";

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
    const seatIds: number[] = seat_ids.map((id: string | number) => Number(id));
    const seatsStr = seat_numbers ? seat_numbers.join(", ") : seat_ids.join(", ");

    // fn_book_seats (PL/pgSQL) locks the seats, checks availability and creates the
    // booking in one transaction; triggers mark the seats booked and write the audit row.
    const created = await query<{ booking_id: number }>(
      `SELECT fn_book_seats($1, $2, $3, $4, $5, $6::int[], $7, $8) AS booking_id`,
      [session.user.id, userName, userEmail, user_phone, Number(showtime_id), seatIds, seatsStr, total_amount]
    );

    const details = await query(`SELECT ${BOOKING_COLS} FROM v_booking_details WHERE booking_id = $1`, [
      created[0].booking_id,
    ]);

    return NextResponse.json(
      { success: true, message: "Ticket booked successfully!", data: details[0] },
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
    const bookings = await query(
      `SELECT ${BOOKING_COLS}
       FROM v_booking_details
       WHERE user_id = $1
       ORDER BY booking_date DESC`,
      [session.user.id]
    );

    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
