const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// -------------------------------------------------------------------
// 1. MOVIES ENDPOINTS
// -------------------------------------------------------------------

// GET /api/movies - List all movies
app.get('/api/movies', (req, res) => {
  try {
    const movies = db.prepare('SELECT * FROM movies ORDER BY rating DESC').all();
    res.json({ success: true, data: movies });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/movies/:id - Get movie details
app.get('/api/movies/:id', (req, res) => {
  try {
    const movie = db.prepare('SELECT * FROM movies WHERE movie_id = ?').get(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    res.json({ success: true, data: movie });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/movies - Add new movie (Admin/User feature)
app.post('/api/movies', (req, res) => {
  const { title, genre, duration, rating, language, description, poster_url, banner_url, release_date } = req.body;
  if (!title || !genre || !duration) {
    return res.status(400).json({ success: false, message: 'Title, genre, and duration are required' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO movies (title, genre, duration, rating, language, description, poster_url, banner_url, release_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      title,
      genre,
      Number(duration),
      Number(rating) || 8.0,
      language || 'English',
      description || '',
      poster_url || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
      banner_url || 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80',
      release_date || new Date().toISOString().split('T')[0]
    );

    res.status(201).json({
      success: true,
      message: 'Movie created successfully',
      movie_id: result.lastInsertRowid
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/movies/:id - Delete movie by ID (SQL Delete support)
app.delete('/api/movies/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM movies WHERE movie_id = ?');
    const result = stmt.run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    res.json({ success: true, message: `Movie with ID ${req.params.id} deleted successfully` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// -------------------------------------------------------------------
// 2. THEATERS ENDPOINTS (Manages 3 Theaters)
// -------------------------------------------------------------------

// GET /api/theaters - Get all theaters
app.get('/api/theaters', (req, res) => {
  try {
    const theaters = db.prepare('SELECT * FROM theaters ORDER BY theater_id ASC').all();
    res.json({ success: true, count: theaters.length, data: theaters });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/theaters - Add new theater
app.post('/api/theaters', (req, res) => {
  const { name, location, city, total_screens } = req.body;
  if (!name || !location) {
    return res.status(400).json({ success: false, message: 'Theater name and location required' });
  }

  try {
    const stmt = db.prepare('INSERT INTO theaters (name, location, city, total_screens) VALUES (?, ?, ?, ?)');
    const result = stmt.run(name, location, city || 'Mumbai', Number(total_screens) || 4);
    res.status(201).json({ success: true, message: 'Theater added successfully', theater_id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/theaters/:id - Delete theater (SQL Delete command)
app.delete('/api/theaters/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM theaters WHERE theater_id = ?').run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Theater not found' });
    }
    res.json({ success: true, message: `Theater ID ${req.params.id} deleted successfully` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// -------------------------------------------------------------------
// 3. SHOWTIMES & SEATS ENDPOINTS
// -------------------------------------------------------------------

// GET /api/showtimes?movieId=1&date=YYYY-MM-DD
app.get('/api/showtimes', (req, res) => {
  const { movieId, date } = req.query;

  try {
    let query = `
      SELECT s.showtime_id, s.show_date, s.show_time, s.price_classic, s.price_prime, s.price_recliner,
             m.movie_id, m.title as movie_title, m.poster_url,
             t.theater_id, t.name as theater_name, t.location as theater_location, t.city
      FROM showtimes s
      JOIN movies m ON s.movie_id = m.movie_id
      JOIN theaters t ON s.theater_id = t.theater_id
      WHERE 1=1
    `;
    const params = [];

    if (movieId) {
      query += ' AND s.movie_id = ?';
      params.push(movieId);
    }
    if (date) {
      query += ' AND s.show_date = ?';
      params.push(date);
    }

    query += ' ORDER BY t.name, s.show_time';

    const showtimes = db.prepare(query).all(...params);

    // Group by theater for BookMyShow UX
    const grouped = {};
    showtimes.forEach(st => {
      if (!grouped[st.theater_id]) {
        grouped[st.theater_id] = {
          theater_id: st.theater_id,
          name: st.theater_name,
          location: st.theater_location,
          city: st.city,
          shows: []
        };
      }
      grouped[st.theater_id].shows.push({
        showtime_id: st.showtime_id,
        show_date: st.show_date,
        show_time: st.show_time,
        price_classic: st.price_classic,
        price_prime: st.price_prime,
        price_recliner: st.price_recliner
      });
    });

    res.json({ success: true, data: Object.values(grouped) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/showtimes/:id/seats - Get seat layout & real-time booking status
app.get('/api/showtimes/:id/seats', (req, res) => {
  try {
    const showtime = db.prepare(`
      SELECT s.*, m.title as movie_title, m.poster_url, t.name as theater_name
      FROM showtimes s
      JOIN movies m ON s.movie_id = m.movie_id
      JOIN theaters t ON s.theater_id = t.theater_id
      WHERE s.showtime_id = ?
    `).get(req.params.id);

    if (!showtime) {
      return res.status(404).json({ success: false, message: 'Showtime not found' });
    }

    const seats = db.prepare('SELECT * FROM seats WHERE showtime_id = ? ORDER BY seat_number').all(req.params.id);

    res.json({
      success: true,
      showtime,
      seats
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// -------------------------------------------------------------------
// 4. BOOKINGS ENDPOINTS
// -------------------------------------------------------------------

// POST /api/bookings - Create ticket booking
app.post('/api/bookings', (req, res) => {
  const { user_name, user_email, user_phone, showtime_id, seat_ids, seat_numbers, total_amount } = req.body;

  if (!user_name || !user_email || !user_phone || !showtime_id || !seat_ids || seat_ids.length === 0) {
    return res.status(400).json({ success: false, message: 'Invalid booking data. Please select seats and provide user info.' });
  }

  try {
    const bookingRef = 'BMS-' + Math.floor(100000 + Math.random() * 900000);
    const seatsStr = seat_numbers ? seat_numbers.join(', ') : seat_ids.join(', ');

    const transaction = db.transaction(() => {
      // 1. Check if seats are already booked
      const placeholders = seat_ids.map(() => '?').join(',');
      const checkSeats = db.prepare(`SELECT seat_id, seat_number, is_booked FROM seats WHERE seat_id IN (${placeholders})`).all(...seat_ids);

      const alreadyBooked = checkSeats.filter(s => s.is_booked === 1);
      if (alreadyBooked.length > 0) {
        throw new Error(`Seats already booked: ${alreadyBooked.map(s => s.seat_number).join(', ')}`);
      }

      // 2. Insert Booking Record
      const bookingResult = db.prepare(`
        INSERT INTO bookings (booking_ref, user_name, user_email, user_phone, showtime_id, total_amount, seats_list)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(bookingRef, user_name, user_email, user_phone, showtime_id, total_amount, seatsStr);

      const bookingId = bookingResult.lastInsertRowid;

      // 3. Update Seat Status to Booked (is_booked = 1)
      const updateSeat = db.prepare('UPDATE seats SET is_booked = 1 WHERE seat_id = ?');
      const insertBookingSeat = db.prepare('INSERT INTO booking_seats (booking_id, seat_id) VALUES (?, ?)');

      for (const seatId of seat_ids) {
        updateSeat.run(seatId);
        insertBookingSeat.run(bookingId, seatId);
      }

      return { bookingId, bookingRef };
    });

    const result = transaction();

    // Fetch details for ticket response
    const bookingDetails = db.prepare(`
      SELECT b.*, s.show_date, s.show_time, s.price_classic, m.title as movie_title, m.poster_url, t.name as theater_name, t.location as theater_location
      FROM bookings b
      JOIN showtimes s ON b.showtime_id = s.showtime_id
      JOIN movies m ON s.movie_id = m.movie_id
      JOIN theaters t ON s.theater_id = t.theater_id
      WHERE b.booking_id = ?
    `).get(result.bookingId);

    res.status(201).json({
      success: true,
      message: 'Ticket booked successfully!',
      data: bookingDetails
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// GET /api/bookings - Get user bookings list
app.get('/api/bookings', (req, res) => {
  const { email } = req.query;

  try {
    let query = `
      SELECT b.*, s.show_date, s.show_time, m.title as movie_title, m.poster_url, t.name as theater_name, t.location as theater_location
      FROM bookings b
      JOIN showtimes s ON b.showtime_id = s.showtime_id
      JOIN movies m ON s.movie_id = m.movie_id
      JOIN theaters t ON s.theater_id = t.theater_id
    `;

    const params = [];
    if (email) {
      query += ' WHERE b.user_email = ?';
      params.push(email);
    }
    query += ' ORDER BY b.booking_date DESC';

    const bookings = db.prepare(query).all(...params);
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/bookings/:id - Cancel/Delete Booking (SQL DELETE Command)
app.delete('/api/bookings/:id', (req, res) => {
  try {
    const transaction = db.transaction(() => {
      // Find seats attached to this booking
      const seats = db.prepare('SELECT seat_id FROM booking_seats WHERE booking_id = ?').all(req.params.id);
      
      // Un-book seats
      const unbookSeat = db.prepare('UPDATE seats SET is_booked = 0 WHERE seat_id = ?');
      for (const s of seats) {
        unbookSeat.run(s.seat_id);
      }

      // Delete from booking_seats & bookings
      db.prepare('DELETE FROM booking_seats WHERE booking_id = ?').run(req.params.id);
      const resBooking = db.prepare('DELETE FROM bookings WHERE booking_id = ?').run(req.params.id);

      if (resBooking.changes === 0) {
        throw new Error('Booking not found');
      }
    });

    transaction();
    res.json({ success: true, message: `Booking ID ${req.params.id} cancelled successfully and seats released.` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// -------------------------------------------------------------------
// 5. INTERACTIVE ADMIN SQL CONSOLE (Executes SQL commands directly)
// -------------------------------------------------------------------

app.post('/api/admin/sql', (req, res) => {
  const { query } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ success: false, message: 'Query string is required' });
  }

  const cleanQuery = query.trim();
  const lowerQuery = cleanQuery.toLowerCase();

  try {
    let result;
    const isSelect = lowerQuery.startsWith('select') || lowerQuery.startsWith('pragma');

    if (isSelect) {
      const rows = db.prepare(cleanQuery).all();
      result = { type: 'SELECT', rowCount: rows.length, rows };
    } else {
      const info = db.prepare(cleanQuery).run();
      result = { type: 'MUTATION', changes: info.changes, lastInsertRowid: info.lastInsertRowid };
    }

    res.json({
      success: true,
      executedQuery: cleanQuery,
      result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      executedQuery: cleanQuery,
      error: error.message
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🎬 BookMyShow Backend API running on http://localhost:${PORT}`);
  console.log(`=======================================================`);
});
