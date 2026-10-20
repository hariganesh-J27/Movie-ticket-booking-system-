-- PL/pgSQL functions, triggers and views used by the API. Idempotent.

-- ---------------------------------------------------------------------------
-- Audit log
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS booking_audit (
  audit_id    SERIAL PRIMARY KEY,
  action      TEXT NOT NULL,
  booking_ref TEXT,
  user_email  TEXT,
  amount      DOUBLE PRECISION,
  changed_at  TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

-- Reject non-positive amounts and normalise the e-mail address.
CREATE OR REPLACE FUNCTION fn_validate_booking() RETURNS trigger AS $$
BEGIN
  IF NEW.total_amount <= 0 THEN
    RAISE EXCEPTION 'Total amount must be positive (got %)', NEW.total_amount;
  END IF;
  NEW.user_email := lower(trim(NEW.user_email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_validate_booking ON bookings;
CREATE TRIGGER trg_validate_booking
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION fn_validate_booking();

-- Linking a seat to a booking marks it booked (and refuses double-booking).
CREATE OR REPLACE FUNCTION fn_book_seat() RETURNS trigger AS $$
DECLARE
  v_booked integer;
BEGIN
  SELECT is_booked INTO v_booked FROM seats WHERE seat_id = NEW.seat_id FOR UPDATE;

  IF v_booked IS NULL THEN
    RAISE EXCEPTION 'Seat % does not exist', NEW.seat_id;
  ELSIF v_booked = 1 THEN
    RAISE EXCEPTION 'Seat % is already booked', NEW.seat_id;
  END IF;

  UPDATE seats SET is_booked = 1 WHERE seat_id = NEW.seat_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_book_seat ON booking_seats;
CREATE TRIGGER trg_book_seat
  BEFORE INSERT ON booking_seats
  FOR EACH ROW EXECUTE FUNCTION fn_book_seat();

-- Removing the link (cancellation, cascade delete) frees the seat.
CREATE OR REPLACE FUNCTION fn_release_seat() RETURNS trigger AS $$
BEGIN
  UPDATE seats SET is_booked = 0 WHERE seat_id = OLD.seat_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_release_seat ON booking_seats;
CREATE TRIGGER trg_release_seat
  AFTER DELETE ON booking_seats
  FOR EACH ROW EXECUTE FUNCTION fn_release_seat();

-- Record every booking created / cancelled.
CREATE OR REPLACE FUNCTION fn_audit_booking() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO booking_audit (action, booking_ref, user_email, amount)
    VALUES ('CANCELLED', OLD.booking_ref, OLD.user_email, OLD.total_amount);
    RETURN OLD;
  END IF;

  INSERT INTO booking_audit (action, booking_ref, user_email, amount)
  VALUES ('CREATED', NEW.booking_ref, NEW.user_email, NEW.total_amount);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_audit_booking ON bookings;
CREATE TRIGGER trg_audit_booking
  AFTER INSERT OR DELETE ON bookings
  FOR EACH ROW EXECUTE FUNCTION fn_audit_booking();

-- ---------------------------------------------------------------------------
-- View: a booking with its movie, theater and showtime details
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_booking_details AS
SELECT b.booking_id,
       b.booking_ref,
       b.user_id,
       b.user_name,
       b.user_email,
       b.user_phone,
       b.showtime_id,
       b.total_amount,
       b.seats_list,
       b.booking_date,
       s.show_date,
       s.show_time,
       s.price_classic,
       m.title      AS movie_title,
       m.poster_url,
       t.name       AS theater_name,
       t.location   AS theater_location
FROM bookings b
JOIN showtimes s ON s.showtime_id = b.showtime_id
JOIN movies    m ON m.movie_id    = s.movie_id
JOIN theaters  t ON t.theater_id  = s.theater_id;

-- ---------------------------------------------------------------------------
-- Functions called by the API
-- ---------------------------------------------------------------------------

-- Create the standard seat layout for a showtime: rows A-E DIAMOND (12 seats),
-- rows M-N PEARL (10 seats). p_booked_ratio pre-books a random share (seeding).
CREATE OR REPLACE FUNCTION fn_generate_seats(
  p_showtime_id  integer,
  p_booked_ratio double precision DEFAULT 0
) RETURNS integer AS $$
DECLARE
  v_count integer;
BEGIN
  INSERT INTO seats (showtime_id, seat_number, seat_category, is_booked)
  SELECT p_showtime_id,
         r.prefix || lpad(n::text, 2, '0'),
         r.category,
         CASE WHEN random() < p_booked_ratio THEN 1 ELSE 0 END
  FROM (VALUES ('A', 'DIAMOND', 12), ('B', 'DIAMOND', 12), ('C', 'DIAMOND', 12),
               ('D', 'DIAMOND', 12), ('E', 'DIAMOND', 12),
               ('M', 'PEARL',   10), ('N', 'PEARL',   10)) AS r(prefix, category, cnt),
       generate_series(1, r.cnt) AS n;

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- Create a showtime together with its seats, atomically. Returns the new id.
CREATE OR REPLACE FUNCTION fn_create_showtime(
  p_movie_id      integer,
  p_theater_id    integer,
  p_show_date     text,
  p_show_time     text,
  p_price_classic double precision DEFAULT NULL,
  p_price_prime   double precision DEFAULT NULL,
  p_price_recliner double precision DEFAULT NULL
) RETURNS integer AS $$
DECLARE
  v_id integer;
BEGIN
  INSERT INTO showtimes (movie_id, theater_id, show_date, show_time,
                         price_classic, price_prime, price_recliner)
  VALUES (p_movie_id, p_theater_id, p_show_date, p_show_time,
          COALESCE(p_price_classic, 59.0),
          COALESCE(p_price_prime, 200.0),
          COALESCE(p_price_recliner, 350.0))
  RETURNING showtime_id INTO v_id;

  PERFORM fn_generate_seats(v_id);
  RETURN v_id;
END;
$$ LANGUAGE plpgsql;

-- Book seats for a user. Locks the seats, checks they belong to the showtime and
-- are free, creates the booking + booking_seats rows (trg_book_seat marks them
-- booked) and returns the booking id.
CREATE OR REPLACE FUNCTION fn_book_seats(
  p_user_id     text,
  p_user_name   text,
  p_user_email  text,
  p_user_phone  text,
  p_showtime_id integer,
  p_seat_ids    integer[],
  p_seats_list  text,
  p_total       double precision
) RETURNS integer AS $$
DECLARE
  v_found integer;
  v_taken text;
  v_ref   text;
  v_id    integer;
BEGIN
  PERFORM 1 FROM seats WHERE seat_id = ANY (p_seat_ids) ORDER BY seat_id FOR UPDATE;

  SELECT count(*) INTO v_found
  FROM seats
  WHERE seat_id = ANY (p_seat_ids) AND showtime_id = p_showtime_id;

  IF v_found = 0 OR v_found <> cardinality(p_seat_ids) THEN
    RAISE EXCEPTION 'Invalid seats for this showtime';
  END IF;

  SELECT string_agg(seat_number, ', ' ORDER BY seat_number) INTO v_taken
  FROM seats
  WHERE seat_id = ANY (p_seat_ids) AND is_booked = 1;

  IF v_taken IS NOT NULL THEN
    RAISE EXCEPTION 'Seats already booked: %', v_taken;
  END IF;

  LOOP
    v_ref := 'BMS-' || (100000 + floor(random() * 900000))::integer;
    EXIT WHEN NOT EXISTS (SELECT 1 FROM bookings WHERE booking_ref = v_ref);
  END LOOP;

  INSERT INTO bookings (booking_ref, user_id, user_name, user_email, user_phone,
                        showtime_id, total_amount, seats_list)
  VALUES (v_ref, p_user_id, p_user_name, p_user_email, p_user_phone,
          p_showtime_id, p_total, p_seats_list)
  RETURNING booking_id INTO v_id;

  INSERT INTO booking_seats (booking_id, seat_id)
  SELECT v_id, unnest(p_seat_ids);

  RETURN v_id;
END;
$$ LANGUAGE plpgsql;

-- Cancel a booking owned by the user. Seats are released by trg_release_seat.
CREATE OR REPLACE FUNCTION fn_cancel_booking(
  p_booking_id integer,
  p_user_id    text
) RETURNS void AS $$
BEGIN
  DELETE FROM bookings WHERE booking_id = p_booking_id AND user_id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Booking not found';
  END IF;
END;
$$ LANGUAGE plpgsql;
