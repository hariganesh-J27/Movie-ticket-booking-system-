-- ====================================================================
-- Oracle SQL Database Schema for Movie Ticket Booking System (BookMyShow)
-- Designed for Oracle SQL Developer / SQL*Plus compatibility
-- ====================================================================

-- 1. DROP EXISTING TABLES AND SEQUENCES (Clean setup)
BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE BOOKING_SEATS CASCADE CONSTRAINTS';
   EXECUTE IMMEDIATE 'DROP TABLE BOOKINGS CASCADE CONSTRAINTS';
   EXECUTE IMMEDIATE 'DROP TABLE SEATS CASCADE CONSTRAINTS';
   EXECUTE IMMEDIATE 'DROP TABLE SHOWTIMES CASCADE CONSTRAINTS';
   EXECUTE IMMEDIATE 'DROP TABLE THEATERS CASCADE CONSTRAINTS';
   EXECUTE IMMEDIATE 'DROP TABLE MOVIES CASCADE CONSTRAINTS';
EXCEPTION
   WHEN OTHERS THEN NULL;
END;
/

-- 2. CREATE MOVIES TABLE
CREATE TABLE MOVIES (
    movie_id NUMBER PRIMARY KEY,
    title VARCHAR2(150) NOT NULL,
    genre VARCHAR2(100) NOT NULL,
    duration NUMBER NOT NULL, -- duration in minutes
    rating NUMBER(3,1) CHECK (rating >= 0 AND rating <= 10),
    language VARCHAR2(50) DEFAULT 'English',
    description VARCHAR2(1000),
    poster_url VARCHAR2(500),
    banner_url VARCHAR2(500),
    release_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sequence for Movies ID
CREATE SEQUENCE movie_seq START WITH 1 INCREMENT BY 1 NOCACHE;

-- 3. CREATE THEATERS TABLE (Contains 3 Threat/Theaters as requested)
CREATE TABLE THEATERS (
    theater_id NUMBER PRIMARY KEY,
    name VARCHAR2(150) NOT NULL,
    location VARCHAR2(200) NOT NULL,
    city VARCHAR2(100) DEFAULT 'Mumbai',
    total_screens NUMBER DEFAULT 4,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sequence for Theaters ID
CREATE SEQUENCE theater_seq START WITH 1 INCREMENT BY 1 NOCACHE;

-- 4. CREATE SHOWTIMES TABLE
CREATE TABLE SHOWTIMES (
    showtime_id NUMBER PRIMARY KEY,
    movie_id NUMBER NOT NULL,
    theater_id NUMBER NOT NULL,
    show_date DATE NOT NULL,
    show_time VARCHAR2(20) NOT NULL, -- e.g., '10:30 AM', '02:15 PM'
    price_classic NUMBER(8,2) DEFAULT 180.00,
    price_prime NUMBER(8,2) DEFAULT 250.00,
    price_recliner NUMBER(8,2) DEFAULT 400.00,
    CONSTRAINT fk_showtime_movie FOREIGN KEY (movie_id) REFERENCES MOVIES(movie_id) ON DELETE CASCADE,
    CONSTRAINT fk_showtime_theater FOREIGN KEY (theater_id) REFERENCES THEATERS(theater_id) ON DELETE CASCADE
);

-- Sequence for Showtimes ID
CREATE SEQUENCE showtime_seq START WITH 1 INCREMENT BY 1 NOCACHE;

-- 5. CREATE SEATS TABLE
CREATE TABLE SEATS (
    seat_id NUMBER PRIMARY KEY,
    showtime_id NUMBER NOT NULL,
    seat_number VARCHAR2(10) NOT NULL, -- e.g., 'A1', 'B5', 'R2'
    seat_category VARCHAR2(20) CHECK (seat_category IN ('CLASSIC', 'PRIME', 'RECLINER')),
    is_booked NUMBER(1) DEFAULT 0 CHECK (is_booked IN (0, 1)),
    CONSTRAINT fk_seat_showtime FOREIGN KEY (showtime_id) REFERENCES SHOWTIMES(showtime_id) ON DELETE CASCADE,
    CONSTRAINT unq_showtime_seat UNIQUE (showtime_id, seat_number)
);

-- Sequence for Seats ID
CREATE SEQUENCE seat_seq START WITH 1 INCREMENT BY 1 NOCACHE;

-- 6. CREATE BOOKINGS TABLE
CREATE TABLE BOOKINGS (
    booking_id NUMBER PRIMARY KEY,
    booking_ref VARCHAR2(30) UNIQUE NOT NULL,
    user_name VARCHAR2(100) NOT NULL,
    user_email VARCHAR2(100) NOT NULL,
    user_phone VARCHAR2(20) NOT NULL,
    showtime_id NUMBER NOT NULL,
    total_amount NUMBER(10,2) NOT NULL,
    seats_list VARCHAR2(200) NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_showtime FOREIGN KEY (showtime_id) REFERENCES SHOWTIMES(showtime_id)
);

-- Sequence for Bookings ID
CREATE SEQUENCE booking_seq START WITH 1 INCREMENT BY 1 NOCACHE;

-- 7. CREATE BOOKING_SEATS (Junction Table)
CREATE TABLE BOOKING_SEATS (
    booking_id NUMBER NOT NULL,
    seat_id NUMBER NOT NULL,
    PRIMARY KEY (booking_id, seat_id),
    CONSTRAINT fk_bs_booking FOREIGN KEY (booking_id) REFERENCES BOOKINGS(booking_id) ON DELETE CASCADE,
    CONSTRAINT fk_bs_seat FOREIGN KEY (seat_id) REFERENCES SEATS(seat_id) ON DELETE CASCADE
);

COMMIT;
