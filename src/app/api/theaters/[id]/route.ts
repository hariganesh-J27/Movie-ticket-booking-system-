import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await prisma.theater.delete({ where: { theaterId: Number(id) } });
    return NextResponse.json({ success: true, message: `Theater ID ${id} deleted successfully` });
  } catch {
    return NextResponse.json({ success: false, message: "Theater not found" }, { status: 404 });
  }
}
