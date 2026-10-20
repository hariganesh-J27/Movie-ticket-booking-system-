import { NextRequest, NextResponse } from "next/server";
import { parseId, pgErrorCode, query, updateById } from "@/lib/db";
import { SHOWTIME_COLS } from "@/lib/columns";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const showtimeId = parseId(id);
  if (showtimeId === null) {
    return NextResponse.json({ success: false, message: "Showtime not found" }, { status: 404 });
  }

  try {
    const rows = await query(`SELECT ${SHOWTIME_COLS} FROM showtimes WHERE showtime_id = $1`, [showtimeId]);
    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Showtime not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const showtimeId = parseId(id);
  const body = await req.json();
  const { show_date, show_time, price_classic, price_prime, price_recliner } = body;

  if (showtimeId === null) {
    return NextResponse.json({ success: false, message: "Showtime not found" }, { status: 404 });
  }

  try {
    const showtime = await updateById("showtimes", "showtime_id", showtimeId, {
      show_date,
      show_time,
      price_classic: price_classic !== undefined ? Number(price_classic) : undefined,
      price_prime: price_prime !== undefined ? Number(price_prime) : undefined,
      price_recliner: price_recliner !== undefined ? Number(price_recliner) : undefined,
    }, "showtime_id, show_date, show_time, price_classic, price_prime, price_recliner");

    if (!showtime) {
      return NextResponse.json({ success: false, message: "Showtime not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Showtime updated successfully", data: showtime });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const showtimeId = parseId(id);
  if (showtimeId === null) {
    return NextResponse.json({ success: false, message: "Showtime not found" }, { status: 404 });
  }

  try {
    const rows = await query(`DELETE FROM showtimes WHERE showtime_id = $1 RETURNING showtime_id`, [showtimeId]);
    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Showtime not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: `Showtime ID ${id} deleted successfully` });
  } catch (error) {
    // 23503 = foreign_key_violation: bookings still reference this showtime.
    const status = pgErrorCode(error) === "23503" ? 409 : 500;
    return NextResponse.json(
      {
        success: false,
        message: "Could not delete showtime. It may have existing bookings — cancel those first.",
        error: (error as Error).message,
      },
      { status }
    );
  }
}
