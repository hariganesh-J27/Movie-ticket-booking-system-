export type MovieLike = {
  movie_id: number;
  title: string;
  genre: string;
  duration: number;
  rating: number | null;
  language: string;
  description?: string | null;
  poster_url?: string | null;
  banner_url?: string | null;
  release_date?: string | null;
};

export type TheaterLike = {
  theater_id: number;
  name: string;
  location?: string;
  city?: string;
};

export type ShowLike = {
  showtime_id: number;
  show_date?: string;
  show_time: string;
  price_classic: number;
  price_prime: number;
  price_recliner: number;
};

export type SeatLike = {
  seat_id: number;
  showtime_id: number;
  seat_number: string;
  seat_category: string;
  is_booked: number;
};

export type SeatSelection = {
  selectedSeats: SeatLike[];
  totalPrice: number;
};

export type BookingLike = {
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
  movie_title?: string;
  poster_url?: string;
  theater_name?: string;
  theater_location?: string;
};
