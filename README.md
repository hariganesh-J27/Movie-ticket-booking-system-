# BookMySeat — Movie Ticket Booking System

A movie ticket booking app: browse movies, pick a showtime and cinema, choose seats, and book tickets.

## Stack

- **Next.js 16** (App Router, TypeScript, Turbopack)
- **Tailwind CSS v4**
- **PostgreSQL** with plain SQL and PL/pgSQL (functions + triggers), via `pg`

## Getting Started

1. Copy `.env` and point `DATABASE_URL` at a Postgres database.
2. Install dependencies and set up the database:

   ```bash
   npm install
   npm run db:setup   # tables, PL/pgSQL functions, triggers, view (db/schema.sql, db/routines.sql)
   npm run db:seed    # movies, theaters, showtimes and seats (db/seed.sql)
   ```

3. Run the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Project layout

- `src/app` — pages and API route handlers (`src/app/api/*`)
- `src/components` — UI components
- `src/lib` — `pg` pool and SQL helpers, Auth.js SQL adapter, API client, shared types
- `db/schema.sql` — table definitions
- `db/routines.sql` — PL/pgSQL functions (`fn_book_seats`, `fn_cancel_booking`, `fn_create_showtime`), triggers (seat booking/release, audit log, validation) and the `v_booking_details` view
- `db/seed.sql` — seeds movies, theaters, showtimes, and seats
- `scripts/db.ts` — runs the SQL files above

## API

REST endpoints under `/api`: `movies`, `theaters`, `showtimes`, `showtimes/[id]/seats`, and `bookings` (create, list, cancel).
