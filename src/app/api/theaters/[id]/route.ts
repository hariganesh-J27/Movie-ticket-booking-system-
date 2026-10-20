import { NextRequest, NextResponse } from "next/server";
import { parseId, pgErrorCode, query, updateById } from "@/lib/db";
import { THEATER_COLS } from "@/lib/columns";
import { requireAdmin } from "@/lib/requireAdmin";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const theaterId = parseId(id);
  const body = await req.json();
  const { name, location, city, total_screens, cancellation_status } = body;

  if (theaterId === null) {
    return NextResponse.json({ success: false, message: "Theater not found" }, { status: 404 });
  }

  try {
    const theater = await updateById("theaters", "theater_id", theaterId, {
      name,
      location,
      city,
      total_screens: total_screens !== undefined ? Number(total_screens) : undefined,
      cancellation_status,
    }, THEATER_COLS);

    if (!theater) {
      return NextResponse.json({ success: false, message: "Theater not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Theater updated successfully", data: theater });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const theaterId = parseId(id);
  if (theaterId === null) {
    return NextResponse.json({ success: false, message: "Theater not found" }, { status: 404 });
  }

  try {
    const rows = await query(`DELETE FROM theaters WHERE theater_id = $1 RETURNING theater_id`, [theaterId]);
    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Theater not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: `Theater ID ${id} deleted successfully` });
  } catch (error) {
    // 23503 = foreign_key_violation: bookings still reference this theater's showtimes.
    const status = pgErrorCode(error) === "23503" ? 409 : 500;
    return NextResponse.json({ success: false, error: (error as Error).message }, { status });
  }
}
