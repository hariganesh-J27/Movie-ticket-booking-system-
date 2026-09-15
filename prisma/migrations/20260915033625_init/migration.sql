-- CreateTable
CREATE TABLE "movies" (
    "movie_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION,
    "language" TEXT NOT NULL,
    "description" TEXT,
    "poster_url" TEXT,
    "banner_url" TEXT,
    "release_date" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movies_pkey" PRIMARY KEY ("movie_id")
);

-- CreateTable
CREATE TABLE "theaters" (
    "theater_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "city" TEXT NOT NULL DEFAULT 'Chennai',
    "total_screens" INTEGER NOT NULL DEFAULT 6,
    "cancellation_status" TEXT NOT NULL DEFAULT 'Non-cancellable',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "theaters_pkey" PRIMARY KEY ("theater_id")
);

-- CreateTable
CREATE TABLE "showtimes" (
    "showtime_id" SERIAL NOT NULL,
    "movie_id" INTEGER NOT NULL,
    "theater_id" INTEGER NOT NULL,
    "show_date" TEXT NOT NULL,
    "show_time" TEXT NOT NULL,
    "price_classic" DOUBLE PRECISION NOT NULL DEFAULT 59.00,
    "price_prime" DOUBLE PRECISION NOT NULL DEFAULT 200.00,
    "price_recliner" DOUBLE PRECISION NOT NULL DEFAULT 350.00,

    CONSTRAINT "showtimes_pkey" PRIMARY KEY ("showtime_id")
);

-- CreateTable
CREATE TABLE "seats" (
    "seat_id" SERIAL NOT NULL,
    "showtime_id" INTEGER NOT NULL,
    "seat_number" TEXT NOT NULL,
    "seat_category" TEXT NOT NULL,
    "is_booked" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "seats_pkey" PRIMARY KEY ("seat_id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "booking_id" SERIAL NOT NULL,
    "booking_ref" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "user_phone" TEXT NOT NULL,
    "showtime_id" INTEGER NOT NULL,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "seats_list" TEXT NOT NULL,
    "booking_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("booking_id")
);

-- CreateTable
CREATE TABLE "booking_seats" (
    "booking_id" INTEGER NOT NULL,
    "seat_id" INTEGER NOT NULL,

    CONSTRAINT "booking_seats_pkey" PRIMARY KEY ("booking_id","seat_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "seats_showtime_id_seat_number_key" ON "seats"("showtime_id", "seat_number");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_booking_ref_key" ON "bookings"("booking_ref");

-- AddForeignKey
ALTER TABLE "showtimes" ADD CONSTRAINT "showtimes_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("movie_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "showtimes" ADD CONSTRAINT "showtimes_theater_id_fkey" FOREIGN KEY ("theater_id") REFERENCES "theaters"("theater_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seats" ADD CONSTRAINT "seats_showtime_id_fkey" FOREIGN KEY ("showtime_id") REFERENCES "showtimes"("showtime_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_showtime_id_fkey" FOREIGN KEY ("showtime_id") REFERENCES "showtimes"("showtime_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_seats" ADD CONSTRAINT "booking_seats_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("booking_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_seats" ADD CONSTRAINT "booking_seats_seat_id_fkey" FOREIGN KEY ("seat_id") REFERENCES "seats"("seat_id") ON DELETE CASCADE ON UPDATE CASCADE;
