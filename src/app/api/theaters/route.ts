import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { THEATER_COLS } from "@/lib/columns";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  try {
    const theaters = await query(`SELECT ${THEATER_COLS} FROM theaters ORDER BY theater_id ASC`);
    return NextResponse.json({ success: true, count: theaters.length, data: theaters });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json();
  const { name, location, city, total_screens, cancellation_status } = body;

  if (!name || !location) {
    return NextResponse.json(
      { success: false, message: "Theater name and location required" },
      { status: 400 }
    );
  }

  try {
    const rows = await query<{ theater_id: number }>(
      `INSERT INTO theaters (name, location, city, total_screens, cancellation_status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING theater_id`,
      [name, location, city || "Mumbai", Number(total_screens) || 4, cancellation_status || "Non-cancellable"]
    );
    return NextResponse.json(
      { success: true, message: "Theater added successfully", theater_id: rows[0].theater_id },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
