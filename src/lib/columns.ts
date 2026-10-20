// Column lists shared by the API routes (names already match the JSON the client expects).

export const MOVIE_COLS = `movie_id, title, genre, duration, rating, language, description,
  poster_url, banner_url, release_date, created_at`;

export const THEATER_COLS = `theater_id, name, location, city, total_screens, cancellation_status, created_at`;

export const SHOWTIME_COLS = `showtime_id, movie_id, theater_id, show_date, show_time,
  price_classic, price_prime, price_recliner`;

export const BOOKING_COLS = `booking_id, booking_ref, user_name, user_email, user_phone, showtime_id,
  total_amount, seats_list, booking_date, show_date, show_time, price_classic, movie_title,
  poster_url, theater_name, theater_location`;
