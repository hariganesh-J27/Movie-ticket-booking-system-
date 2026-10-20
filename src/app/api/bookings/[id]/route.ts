import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { parseId, query } from "@/lib/db";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: "Sign in to manage your bookings" }, { status: 401 });
  }

  const { id } = await params;
  const bookingId = parseId(id);
  if (bookingId === null) {
    return NextResponse.json({ success: false, error: "Booking not found" }, { status: 500 });
  }

  try {
    // fn_cancel_booking deletes the booking if it belongs to the user; trg_release_seat
    // frees the seats and trg_audit_booking records the cancellation.
    await query(`SELECT fn_cancel_booking($1, $2)`, [bookingId, session.user.id]);

    return NextResponse.json({
      success: true,
      message: `Booking ID ${id} cancelled successfully and seats released.`,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
