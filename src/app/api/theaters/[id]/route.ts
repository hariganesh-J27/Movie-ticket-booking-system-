import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeTheater } from "@/lib/serializers";
import { requireAdmin } from "@/lib/requireAdmin";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await req.json();
  const { name, location, city, total_screens, cancellation_status } = body;

  try {
    const theater = await prisma.theater.update({
      where: { theaterId: Number(id) },
      data: {
        ...(name !== undefined && { name }),
        ...(location !== undefined && { location }),
        ...(city !== undefined && { city }),
        ...(total_screens !== undefined && { totalScreens: Number(total_screens) }),
        ...(cancellation_status !== undefined && { cancellationStatus: cancellation_status }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Theater updated successfully",
      data: serializeTheater(theater),
    });
  } catch {
    return NextResponse.json({ success: false, message: "Theater not found" }, { status: 404 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  try {
    await prisma.theater.delete({ where: { theaterId: Number(id) } });
    return NextResponse.json({ success: true, message: `Theater ID ${id} deleted successfully` });
  } catch {
    return NextResponse.json({ success: false, message: "Theater not found" }, { status: 404 });
  }
}
