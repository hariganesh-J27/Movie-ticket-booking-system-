import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeTheater } from "@/lib/serializers";

export async function GET() {
  try {
    const theaters = await prisma.theater.findMany({ orderBy: { theaterId: "asc" } });
    return NextResponse.json({
      success: true,
      count: theaters.length,
      data: theaters.map(serializeTheater),
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, location, city, total_screens } = body;

  if (!name || !location) {
    return NextResponse.json(
      { success: false, message: "Theater name and location required" },
      { status: 400 }
    );
  }

  try {
    const theater = await prisma.theater.create({
      data: {
        name,
        location,
        city: city || "Mumbai",
        totalScreens: Number(total_screens) || 4,
      },
    });
    return NextResponse.json(
      { success: true, message: "Theater added successfully", theater_id: theater.theaterId },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
