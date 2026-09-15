import type { Booking, Movie, Seat, Showtime, Theater } from "@prisma/client";

export function serializeMovie(m: Movie) {
  return {
    movie_id: m.movieId,
    title: m.title,
    genre: m.genre,
    duration: m.duration,
    rating: m.rating,
    language: m.language,
    description: m.description,
    poster_url: m.posterUrl,
    banner_url: m.bannerUrl,
    release_date: m.releaseDate,
    created_at: m.createdAt,
  };
}

export function serializeTheater(t: Theater) {
  return {
    theater_id: t.theaterId,
    name: t.name,
    location: t.location,
    city: t.city,
    total_screens: t.totalScreens,
    cancellation_status: t.cancellationStatus,
    created_at: t.createdAt,
  };
}

export function serializeShowtime(s: Showtime) {
  return {
    showtime_id: s.showtimeId,
    movie_id: s.movieId,
    theater_id: s.theaterId,
    show_date: s.showDate,
    show_time: s.showTime,
    price_classic: s.priceClassic,
    price_prime: s.pricePrime,
    price_recliner: s.priceRecliner,
  };
}

export function serializeSeat(s: Seat) {
  return {
    seat_id: s.seatId,
    showtime_id: s.showtimeId,
    seat_number: s.seatNumber,
    seat_category: s.seatCategory,
    is_booked: s.isBooked,
  };
}

export function serializeBooking(
  b: Booking & {
    showtime?: Showtime & { movie?: Movie; theater?: Theater };
  }
) {
  return {
    booking_id: b.bookingId,
    booking_ref: b.bookingRef,
    user_name: b.userName,
    user_email: b.userEmail,
    user_phone: b.userPhone,
    showtime_id: b.showtimeId,
    total_amount: b.totalAmount,
    seats_list: b.seatsList,
    booking_date: b.bookingDate,
    show_date: b.showtime?.showDate,
    show_time: b.showtime?.showTime,
    price_classic: b.showtime?.priceClassic,
    movie_title: b.showtime?.movie?.title,
    poster_url: b.showtime?.movie?.posterUrl,
    theater_name: b.showtime?.theater?.name,
    theater_location: b.showtime?.theater?.location,
  };
}
