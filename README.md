# BookMySeat — Movie Ticket Booking System

A movie ticket booking app: browse movies, pick a showtime and cinema, choose seats, and book tickets.

## Stack

- **Next.js 16** (App Router, TypeScript, Turbopack)
- **Tailwind CSS v4**
- **Prisma** + **PostgreSQL**

## Getting Started

1. Copy `.env` and point `DATABASE_URL` at a Postgres database.
2. Install dependencies and set up the database:

   ```bash
   npm install
   npx prisma migrate dev
   npx prisma db seed
   ```

3. Run the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Project layout

- `src/app` — pages and API route handlers (`src/app/api/*`)
- `src/components` — UI components
- `src/lib` — Prisma client, API client, shared types
- `prisma/schema.prisma` — database schema
- `prisma/seed.ts` — seeds movies, theaters, showtimes, and seats

## API

REST endpoints under `/api`: `movies`, `theaters`, `showtimes`, `showtimes/[id]/seats`, and `bookings` (create, list, cancel).
