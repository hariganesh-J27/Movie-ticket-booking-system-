-- ====================================================================
-- Oracle SQL CRUD Operations & Sample Queries
-- BookMyShow Movie Ticket Booking System
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. INSERT COMMANDS (Adding Data)
-- --------------------------------------------------------------------

-- Add Movies
INSERT INTO MOVIES (movie_id, title, genre, duration, rating, language, description, poster_url, banner_url, release_date)
VALUES (movie_seq.NEXTVAL, 'Jawan: Extended Cut', 'Action/Thriller', 169, 8.4, 'Hindi', 'A high-octane action thriller outlining the emotional journey of a man who is set to rectify the wrongs in society.', 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80', TO_DATE('2024-09-07', 'YYYY-MM-DD'));

INSERT INTO MOVIES (movie_id, title, genre, duration, rating, language, description, poster_url, banner_url, release_date)
VALUES (movie_seq.NEXTVAL, 'Inception: Remastered', 'Sci-Fi/Action', 148, 8.8, 'English', 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.', 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80', TO_DATE('2024-07-16', 'YYYY-MM-DD'));

INSERT INTO MOVIES (movie_id, title, genre, duration, rating, language, description, poster_url, banner_url, release_date)
VALUES (movie_seq.NEXTVAL, 'Avatar: The Way of Water', 'Sci-Fi/Adventure', 192, 7.8, 'English', 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora.', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80', TO_DATE('2024-12-16', 'YYYY-MM-DD'));

-- Add 3 Theaters (as specified in user requirements)
INSERT INTO THEATERS (theater_id, name, location, city, total_screens)
VALUES (theater_seq.NEXTVAL, 'PVR: Forum Mall, Koramangala', 'Hosur Road, Koramangala, Bengaluru', 'Bengaluru', 8);

INSERT INTO THEATERS (theater_id, name, location, city, total_screens)
VALUES (theater_seq.NEXTVAL, 'INOX: Megaplex, Central Mall', 'MG Road, Central District, Mumbai', 'Mumbai', 6);

INSERT INTO THEATERS (theater_id, name, location, city, total_screens)
VALUES (theater_seq.NEXTVAL, 'Cinépolis: Nexus Galleria', 'Viman Nagar, Pune', 'Pune', 5);

-- Add Showtimes
INSERT INTO SHOWTIMES (showtime_id, movie_id, theater_id, show_date, show_time, price_classic, price_prime, price_recliner)
VALUES (showtime_seq.NEXTVAL, 1, 1, SYSDATE, '10:30 AM', 180, 250, 400);

INSERT INTO SHOWTIMES (showtime_id, movie_id, theater_id, show_date, show_time, price_classic, price_prime, price_recliner)
VALUES (showtime_seq.NEXTVAL, 1, 2, SYSDATE, '02:15 PM', 200, 280, 450);

INSERT INTO SHOWTIMES (showtime_id, movie_id, theater_id, show_date, show_time, price_classic, price_prime, price_recliner)
VALUES (showtime_seq.NEXTVAL, 2, 3, SYSDATE, '07:00 PM', 220, 300, 500);

-- Insert Booking Record
INSERT INTO BOOKINGS (booking_id, booking_ref, user_name, user_email, user_phone, showtime_id, total_amount, seats_list, booking_date)
VALUES (booking_seq.NEXTVAL, 'BMS-982341', 'Rahul Sharma', 'rahul@example.com', '9876543210', 1, 500.00, 'A1, A2', CURRENT_TIMESTAMP);

COMMIT;


-- --------------------------------------------------------------------
-- 2. DELETE COMMANDS (Removing Data)
-- --------------------------------------------------------------------

-- Delete a specific booking by Reference ID
DELETE FROM BOOKINGS WHERE booking_ref = 'BMS-982341';

-- Delete a movie by ID (Cascades to related showtimes & seats)
DELETE FROM MOVIES WHERE movie_id = 3;

-- Delete a theater by ID
DELETE FROM THEATERS WHERE theater_id = 3;

-- Delete showtimes older than yesterday
DELETE FROM SHOWTIMES WHERE show_date < TRUNC(SYSDATE);

COMMIT;


-- --------------------------------------------------------------------
-- 3. UPDATE COMMANDS (Modifying Data)
-- --------------------------------------------------------------------

-- Update Movie rating
UPDATE MOVIES SET rating = 8.9 WHERE title LIKE '%Inception%';

-- Update ticket prices for a specific theater
UPDATE SHOWTIMES SET price_classic = 210.00, price_prime = 290.00 WHERE theater_id = 1;

-- Mark a seat as booked
UPDATE SEATS SET is_booked = 1 WHERE showtime_id = 1 AND seat_number = 'B4';

COMMIT;


-- --------------------------------------------------------------------
-- 4. SELECT / QUERY COMMANDS (Retrieving & Filtering Data)
-- --------------------------------------------------------------------

-- Retrieve all active movies
SELECT movie_id, title, genre, rating, language FROM MOVIES ORDER BY rating DESC;

-- List all 3 theaters with total screens
SELECT theater_id, name, location, city FROM THEATERS;

-- Query showtimes for a movie along with theater names and ticket prices (JOIN Query)
SELECT s.showtime_id, m.title AS movie_name, t.name AS theater_name, s.show_date, s.show_time, s.price_classic, s.price_prime
FROM SHOWTIMES s
JOIN MOVIES m ON s.movie_id = m.movie_id
JOIN THEATERS t ON s.theater_id = t.theater_id
WHERE m.movie_id = 1
ORDER BY s.show_time;

-- Calculate total revenue per movie (Aggregation Query)
SELECT m.title, COUNT(b.booking_id) AS total_bookings, NVL(SUM(b.total_amount), 0) AS total_revenue
FROM MOVIES m
LEFT JOIN SHOWTIMES s ON m.movie_id = s.movie_id
LEFT JOIN BOOKINGS b ON s.showtime_id = b.showtime_id
GROUP BY m.title;
