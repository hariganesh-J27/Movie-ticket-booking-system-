export type Movie = {
  movie_id: number;
  title: string;
  genre: string;
  duration: number;
  rating: number | null;
  language: string;
  description: string | null;
  poster_url: string | null;
  banner_url: string | null;
  release_date: string | null;
};

export type Theater = {
  theater_id: number;
  name: string;
  location: string;
  city: string;
};

export type Show = {
  showtime_id: number;
  show_date: string;
  show_time: string;
  price_classic: number;
  price_prime: number;
  price_recliner: number;
};

export type TheaterGroup = Theater & { shows: Show[] };

export type Seat = {
  seat_id: number;
  showtime_id: number;
  seat_number: string;
  seat_category: string;
  is_booked: number;
};

export type Booking = {
  booking_id: number;
  booking_ref: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  showtime_id: number;
  total_amount: number;
  seats_list: string;
  booking_date: string;
  show_date?: string;
  show_time?: string;
  price_classic?: number;
  movie_title?: string;
  poster_url?: string;
  theater_name?: string;
  theater_location?: string;
};

type ApiResult<T> = { success: boolean; data?: T; message?: string; error?: string };

export async function fetchMovies(): Promise<ApiResult<Movie[]>> {
  const res = await fetch("/api/movies");
  if (!res.ok) throw new Error("Failed to fetch movies");
  return res.json();
}

export async function fetchMovieById(id: number): Promise<ApiResult<Movie>> {
  const res = await fetch(`/api/movies/${id}`);
  if (!res.ok) throw new Error("Failed to fetch movie details");
  return res.json();
}

export async function createMovie(movieData: Partial<Movie>) {
  const res = await fetch("/api/movies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(movieData),
  });
  return res.json();
}

export async function deleteMovie(id: number) {
  const res = await fetch(`/api/movies/${id}`, { method: "DELETE" });
  return res.json();
}

export async function fetchTheaters(): Promise<ApiResult<Theater[]>> {
  const res = await fetch("/api/theaters");
  if (!res.ok) throw new Error("Failed to fetch theaters");
  return res.json();
}

export async function fetchShowtimes(movieId?: number, date?: string): Promise<ApiResult<TheaterGroup[]>> {
  const url = new URL("/api/showtimes", window.location.origin);
  if (movieId) url.searchParams.set("movieId", String(movieId));
  if (date) url.searchParams.set("date", date);

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch showtimes");
  return res.json();
}

export async function fetchSeats(
  showtimeId: number
): Promise<{ success: boolean; showtime?: unknown; seats?: Seat[] }> {
  const res = await fetch(`/api/showtimes/${showtimeId}/seats`);
  if (!res.ok) throw new Error("Failed to fetch seats");
  return res.json();
}

export async function createBooking(bookingData: {
  user_name: string;
  user_phone: string;
  showtime_id: number;
  seat_ids: number[];
  seat_numbers: string[];
  total_amount: number;
}): Promise<ApiResult<Booking>> {
  const res = await fetch("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookingData),
  });
  return res.json();
}

export async function fetchUserBookings(): Promise<ApiResult<Booking[]> & { status?: number }> {
  const res = await fetch("/api/bookings");
  const data = await res.json();
  return { ...data, status: res.status };
}

export async function cancelBooking(bookingId: number) {
  const res = await fetch(`/api/bookings/${bookingId}`, { method: "DELETE" });
  return res.json();
}
