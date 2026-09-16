import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeMovie } from "@/lib/serializers";
import { requireAdmin } from "@/lib/requireAdmin";

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

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await req.json();
  const { title, genre, duration, rating, language, description, poster_url, banner_url, release_date } = body;

  try {
    const movie = await prisma.movie.update({
      where: { movieId: Number(id) },
      data: {
        ...(title !== undefined && { title }),
        ...(genre !== undefined && { genre }),
        ...(duration !== undefined && { duration: Number(duration) }),
        ...(rating !== undefined && { rating: Number(rating) }),
        ...(language !== undefined && { language }),
        ...(description !== undefined && { description }),
        ...(poster_url !== undefined && { posterUrl: poster_url }),
        ...(banner_url !== undefined && { bannerUrl: banner_url }),
        ...(release_date !== undefined && { releaseDate: release_date }),
      },
    });

    return NextResponse.json({ success: true, message: "Movie updated successfully", data: serializeMovie(movie) });
  } catch {
    return NextResponse.json({ success: false, message: "Movie not found" }, { status: 404 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  try {
    await prisma.movie.delete({ where: { movieId: Number(id) } });
    return NextResponse.json({ success: true, message: `Movie with ID ${id} deleted successfully` });
  } catch {
    return NextResponse.json({ success: false, message: "Movie not found" }, { status: 404 });
  }
}
