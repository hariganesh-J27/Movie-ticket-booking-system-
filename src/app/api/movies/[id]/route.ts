import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeMovie } from "@/lib/serializers";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const movie = await prisma.movie.findUnique({ where: { movieId: Number(id) } });
    if (!movie) {
      return NextResponse.json({ success: false, message: "Movie not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: serializeMovie(movie) });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await prisma.movie.delete({ where: { movieId: Number(id) } });
    return NextResponse.json({ success: true, message: `Movie with ID ${id} deleted successfully` });
  } catch {
    return NextResponse.json({ success: false, message: "Movie not found" }, { status: 404 });
  }
}
