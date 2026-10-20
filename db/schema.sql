-- BookMySeat schema (plain PostgreSQL). Idempotent: safe to run repeatedly.

CREATE TABLE IF NOT EXISTS movies (
  movie_id     SERIAL PRIMARY KEY,
  title        TEXT NOT NULL,
  genre        TEXT NOT NULL,
  duration     INTEGER NOT NULL,
  rating       DOUBLE PRECISION,
  language     TEXT NOT NULL,
  description  TEXT,
  poster_url   TEXT,
  banner_url   TEXT,
  release_date TEXT,
  created_at   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS theaters (
  theater_id          SERIAL PRIMARY KEY,
  name                TEXT NOT NULL,
  location            TEXT NOT NULL,
  city                TEXT NOT NULL DEFAULT 'Chennai',
  total_screens       INTEGER NOT NULL DEFAULT 6,
  cancellation_status TEXT NOT NULL DEFAULT 'Non-cancellable',
  created_at          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS showtimes (
  showtime_id    SERIAL PRIMARY KEY,
  movie_id       INTEGER NOT NULL REFERENCES movies(movie_id) ON DELETE CASCADE,
  theater_id     INTEGER NOT NULL REFERENCES theaters(theater_id) ON DELETE CASCADE,
  show_date      TEXT NOT NULL,
  show_time      TEXT NOT NULL,
  price_classic  DOUBLE PRECISION NOT NULL DEFAULT 59.00,
  price_prime    DOUBLE PRECISION NOT NULL DEFAULT 200.00,
  price_recliner DOUBLE PRECISION NOT NULL DEFAULT 350.00
);

CREATE TABLE IF NOT EXISTS seats (
  seat_id       SERIAL PRIMARY KEY,
  showtime_id   INTEGER NOT NULL REFERENCES showtimes(showtime_id) ON DELETE CASCADE,
  seat_number   TEXT NOT NULL,
  seat_category TEXT NOT NULL,
  is_booked     INTEGER NOT NULL DEFAULT 0
);

-- Auth tables (Auth.js)
CREATE TABLE IF NOT EXISTS users (
  id             TEXT PRIMARY KEY,
  name           TEXT,
  email          TEXT,
  email_verified TIMESTAMP(3),
  image          TEXT
);

CREATE TABLE IF NOT EXISTS accounts (
  user_id             TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type                TEXT NOT NULL,
  provider            TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token       TEXT,
  access_token        TEXT,
  expires_at          INTEGER,
  token_type          TEXT,
  scope               TEXT,
  id_token            TEXT,
  session_state       TEXT,
  PRIMARY KEY (provider, provider_account_id)
);

CREATE TABLE IF NOT EXISTS sessions (
  session_token TEXT NOT NULL,
  user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires       TIMESTAMP(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier TEXT NOT NULL,
  token      TEXT NOT NULL,
  expires    TIMESTAMP(3) NOT NULL,
  PRIMARY KEY (identifier, token)
);

CREATE TABLE IF NOT EXISTS bookings (
  booking_id   SERIAL PRIMARY KEY,
  booking_ref  TEXT NOT NULL,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_name    TEXT NOT NULL,
  user_email   TEXT NOT NULL,
  user_phone   TEXT NOT NULL,
  showtime_id  INTEGER NOT NULL REFERENCES showtimes(showtime_id) ON DELETE RESTRICT,
  total_amount DOUBLE PRECISION NOT NULL,
  seats_list   TEXT NOT NULL,
  booking_date TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS booking_seats (
  booking_id INTEGER NOT NULL REFERENCES bookings(booking_id) ON DELETE CASCADE,
  seat_id    INTEGER NOT NULL REFERENCES seats(seat_id) ON DELETE CASCADE,
  PRIMARY KEY (booking_id, seat_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS seats_showtime_id_seat_number_key ON seats (showtime_id, seat_number);
CREATE UNIQUE INDEX IF NOT EXISTS bookings_booking_ref_key          ON bookings (booking_ref);
CREATE UNIQUE INDEX IF NOT EXISTS users_email_key                   ON users (email);
CREATE UNIQUE INDEX IF NOT EXISTS sessions_session_token_key        ON sessions (session_token);
CREATE UNIQUE INDEX IF NOT EXISTS verification_tokens_token_key     ON verification_tokens (token);

-- Lookup indexes for the showtime and "my bookings" queries
CREATE INDEX IF NOT EXISTS idx_showtimes_movie_date ON showtimes (movie_id, show_date);
CREATE INDEX IF NOT EXISTS idx_bookings_user        ON bookings (user_id);
