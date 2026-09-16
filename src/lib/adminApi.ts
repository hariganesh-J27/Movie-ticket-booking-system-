import type { Movie } from "@/lib/api";

export type AdminTheater = {
  theater_id: number;
  name: string;
  location: string;
  city: string;
  total_screens: number;
  cancellation_status: string;
};

export type AdminShowtime = {
  showtime_id: number;
  movie_id: number;
  theater_id: number;
  movie_title: string;
  theater_name: string;
  show_date: string;
  show_time: string;
  price_classic: number;
  price_prime: number;
  price_recliner: number;
};

type ApiResult<T> = { success: boolean; data?: T; message?: string; error?: string };

async function asJson<T>(res: Response): Promise<ApiResult<T>> {
  const data = await res.json();
  return data;
}

// Movies

export async function updateMovie(id: number, movieData: Partial<Movie>) {
  const res = await fetch(`/api/movies/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(movieData),
  });
  return asJson<Movie>(res);
}

// Theaters

export async function fetchAdminTheaters() {
  const res = await fetch("/api/theaters");
  return asJson<AdminTheater[]>(res);
}

export async function createTheater(data: Partial<AdminTheater>) {
  const res = await fetch("/api/theaters", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateTheater(id: number, data: Partial<AdminTheater>) {
  const res = await fetch(`/api/theaters/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return asJson<AdminTheater>(res);
}

export async function deleteTheater(id: number) {
  const res = await fetch(`/api/theaters/${id}`, { method: "DELETE" });
  return res.json();
}

// Showtimes

export async function fetchAdminShowtimes() {
  const res = await fetch("/api/showtimes?flat=true");
  return asJson<AdminShowtime[]>(res);
}

export async function createShowtime(data: {
  movie_id: number;
  theater_id: number;
  show_date: string;
  show_time: string;
  price_classic?: number;
  price_prime?: number;
  price_recliner?: number;
}) {
  const res = await fetch("/api/showtimes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateShowtime(id: number, data: Partial<AdminShowtime>) {
  const res = await fetch(`/api/showtimes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return asJson<AdminShowtime>(res);
}

export async function deleteShowtime(id: number) {
  const res = await fetch(`/api/showtimes/${id}`, { method: "DELETE" });
  return res.json();
}
