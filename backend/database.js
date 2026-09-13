const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

db.pragma('foreign_keys = ON');

function initDatabase() {
  console.log('Initializing SQLite Database with fast 7-day showtime seeding...');

  // Create Tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS movies (
      movie_id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      genre TEXT NOT NULL,
      duration INTEGER NOT NULL,
      rating REAL CHECK (rating >= 0 AND rating <= 10),
      language TEXT NOT NULL,
      description TEXT,
      poster_url TEXT,
      banner_url TEXT,
      release_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS theaters (
      theater_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      city TEXT DEFAULT 'Chennai',
      total_screens INTEGER DEFAULT 6,
      cancellation_status TEXT DEFAULT 'Non-cancellable',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS showtimes (
      showtime_id INTEGER PRIMARY KEY AUTOINCREMENT,
      movie_id INTEGER NOT NULL,
      theater_id INTEGER NOT NULL,
      show_date TEXT NOT NULL,
      show_time TEXT NOT NULL,
      price_classic REAL DEFAULT 59.00,
      price_prime REAL DEFAULT 200.00,
      price_recliner REAL DEFAULT 350.00,
      FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE,
      FOREIGN KEY (theater_id) REFERENCES theaters(theater_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS seats (
      seat_id INTEGER PRIMARY KEY AUTOINCREMENT,
      showtime_id INTEGER NOT NULL,
      seat_number TEXT NOT NULL,
      seat_category TEXT CHECK (seat_category IN ('PEARL', 'DIAMOND', 'RECLINER', 'CLASSIC', 'PRIME')),
      is_booked INTEGER DEFAULT 0,
      FOREIGN KEY (showtime_id) REFERENCES showtimes(showtime_id) ON DELETE CASCADE,
      UNIQUE(showtime_id, seat_number)
    );

    CREATE TABLE IF NOT EXISTS bookings (
      booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_ref TEXT UNIQUE NOT NULL,
      user_name TEXT NOT NULL,
      user_email TEXT NOT NULL,
      user_phone TEXT NOT NULL,
      showtime_id INTEGER NOT NULL,
      total_amount REAL NOT NULL,
      seats_list TEXT NOT NULL,
      booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (showtime_id) REFERENCES showtimes(showtime_id)
    );

    CREATE TABLE IF NOT EXISTS booking_seats (
      booking_id INTEGER NOT NULL,
      seat_id INTEGER NOT NULL,
      PRIMARY KEY (booking_id, seat_id),
      FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
      FOREIGN KEY (seat_id) REFERENCES seats(seat_id) ON DELETE CASCADE
    );
  `);

  const count = db.prepare('SELECT COUNT(*) as count FROM movies').get().count;
  if (count === 0) {
    console.log('Seeding 20 Movies & 5 Multiplexes across 7 Days...');

    const insertMovie = db.prepare(`
      INSERT INTO movies (title, genre, duration, rating, language, description, poster_url, banner_url, release_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const moviesData = [
      // HINDI
      { title: 'Pathaan', genre: 'Action / Spy / Thriller', duration: 146, rating: 8.8, lang: 'Hindi', desc: 'A spy action film with mid-air fistfights and jetpack sequences.', poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80', date: '2023-01-25' },
      { title: 'Krrish', genre: 'Superhero / Action / Sci-Fi', duration: 175, rating: 8.7, lang: 'Hindi', desc: 'A superhero film featuring massive leaps, high-flying acrobatics, and superhuman strength.', poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80', date: '2006-06-23' },
      { title: 'Dhoom 2', genre: 'Action / Thriller / Crime', duration: 152, rating: 8.9, lang: 'Hindi', desc: 'An action thriller with gravity-defying motorcycle stunts and parkour.', poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80', date: '2006-11-24' },
      { title: 'Chennai Express', genre: 'Action / Comedy / Romance', duration: 141, rating: 8.5, lang: 'Hindi', desc: 'An action-comedy with exaggerated, physics-defying fight scenes and colorful humor.', poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80', date: '2013-08-08' },
      { title: 'Bang Bang!', genre: 'Action / Romance / Thriller', duration: 153, rating: 8.6, lang: 'Hindi', desc: 'A high-octane thriller featuring stunts on flyboards, cars, and motorcycles.', poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80', date: '2014-10-02' },

      // TAMIL
      { title: 'Master', genre: 'Action / Thriller / Drama', duration: 179, rating: 8.9, lang: 'Tamil', desc: 'An alcoholic professor is sent to a juvenile school, where he clashes with a ruthless gangster.', poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80', date: '2021-01-13' },
      { title: 'Anniyan', genre: 'Action / Thriller / Mystery', duration: 181, rating: 9.2, lang: 'Tamil', desc: 'A stylish action thriller featuring high-flying martial arts and dramatic face-offs.', poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80', date: '2005-06-17' },
      { title: 'Ghajini', genre: 'Action / Drama / Romance', duration: 175, rating: 9.1, lang: 'Tamil', desc: 'An intense action drama with powerful, larger-than-life combat sequences.', poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80', date: '2005-09-29' },
      { title: 'Enthiran / Robot', genre: 'Sci-Fi / Action / Thriller', duration: 174, rating: 9.3, lang: 'Tamil', desc: 'A sci-fi epic where an Android robot defies all laws of physics and gravity in battle.', poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80', date: '2010-10-01' },
      { title: 'Kaththi', genre: 'Action / Drama / Social', duration: 166, rating: 9.0, lang: 'Tamil', desc: 'An action drama featuring stylized, gravity-defying coin fights and mass action beats.', poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80', date: '2014-10-22' },

      // MALAYALAM
      { title: 'RDX: Robert Dony Xavier', genre: 'Action / Martial Arts / Drama', duration: 151, rating: 9.0, lang: 'Malayalam', desc: 'A high-energy martial arts action film featuring gravity-defying street fights.', poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80', date: '2023-08-25' },
      { title: 'Pulimurugan', genre: 'Action / Adventure / Mass', duration: 161, rating: 9.1, lang: 'Malayalam', desc: 'A man battles wild tigers with gravity-defying leaps and extreme forest stunts.', poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80', date: '2016-10-07' },
      { title: 'Kayamkulam Kochunni', genre: 'Action / History / Drama', duration: 151, rating: 8.8, lang: 'Malayalam', desc: 'A folklore action film featuring high-flying acrobatics and parkour-style escapes.', poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80', date: '2018-10-11' },
      { title: 'C.I.D. Moosa', genre: 'Action / Slapstick / Comedy', duration: 158, rating: 9.3, lang: 'Malayalam', desc: 'A slapstick comedy with cartoonish, physics-defying action gags.', poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80', date: '2003-07-04' },
      { title: 'Masterpiece', genre: 'Action / Thriller / Campus', duration: 148, rating: 8.4, lang: 'Malayalam', desc: 'A campus action thriller with stylized mass fight sequences.', poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80', date: '2017-12-21' },

      // TELUGU
      { title: 'RRR', genre: 'Action / Epic / History', duration: 187, rating: 9.5, lang: 'Telugu', desc: 'An action spectacular featuring motorcycle-human throws and fire-and-water acrobatics.', poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80', date: '2022-03-25' },
      { title: 'Baahubali 2: The Conclusion', genre: 'Epic / Action / Fantasy', duration: 167, rating: 9.6, lang: 'Telugu', desc: 'Features legendary tree-bending catapult launches and massive physics-defying battle formations.', poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80', date: '2017-04-28' },
      { title: 'Baahubali: The Beginning', genre: 'Epic / Action / Drama', duration: 159, rating: 9.4, lang: 'Telugu', desc: 'Famous for soldiers running up shields and leaping across massive waterfalls and cliffs.', poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80', date: '2015-07-10' },
      { title: 'Magadheera', genre: 'Action / Romance / Fantasy', duration: 167, rating: 9.1, lang: 'Telugu', desc: 'A warrior single-handedly fighting a hundred men with impossible leaps across cliffs.', poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80', date: '2009-07-31' },
      { title: 'Pushpa: The Rise', genre: 'Action / Crime / Drama', duration: 179, rating: 8.9, lang: 'Telugu', desc: 'An action drama with high-energy, elevated stylized hero face-offs.', poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80', date: '2021-12-17' }
    ];

    const movieIds = [];
    for (const m of moviesData) {
      const id = insertMovie.run(
        m.title,
        m.genre,
        m.duration,
        m.rating,
        m.lang,
        m.desc,
        m.poster,
        'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80',
        m.date
      ).lastInsertRowid;
      movieIds.push(id);
    }

    // Seed 5 Multiplex Theaters matching user screenshot
    const insertTheater = db.prepare(`
      INSERT INTO theaters (name, location, city, total_screens, cancellation_status)
      VALUES (?, ?, ?, ?, ?)
    `);

    const t1 = insertTheater.run('Rakki Cinemas: OMR, Kelambakkam', 'OMR Road, Kelambakkam, Chennai', 'Chennai', 8, 'Non-cancellable').lastInsertRowid;
    const t2 = insertTheater.run('The Vijay Park Multiplex: Injambakkam ECR', 'ECR Road, Injambakkam, Chennai', 'Chennai', 6, 'Cancellation available').lastInsertRowid;
    const t3 = insertTheater.run('Rohini Silver Screens: Koyambedu', 'Poonamallee High Rd, Koyambedu, Chennai', 'Chennai', 7, 'Non-cancellable').lastInsertRowid;
    const t4 = insertTheater.run('KC (Krishnaveni Cinemas) RG3 LASER DOLBY ATMOS TNAGAR', 'Usman Road, T.Nagar, Chennai', 'Chennai', 5, 'Non-cancellable').lastInsertRowid;
    const t5 = insertTheater.run('AGS Cinemas: Maduravoyal', 'Chennai Bypass Road, Maduravoyal, Chennai', 'Chennai', 6, 'Cancellation available').lastInsertRowid;

    // Generate 7 consecutive days starting today
    const datesList = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(Date.now() + i * 86400000);
      datesList.push(d.toISOString().split('T')[0]);
    }

    const insertShowtime = db.prepare(`
      INSERT INTO showtimes (movie_id, theater_id, show_date, show_time, price_classic, price_prime, price_recliner)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const insertSeat = db.prepare(`
      INSERT INTO seats (showtime_id, seat_number, seat_category, is_booked)
      VALUES (?, ?, ?, ?)
    `);

    const seedTransaction = db.transaction(() => {
      for (const movieId of movieIds) {
        for (const theaterId of [t1, t2, t3, t4, t5]) {
          const times = ['10:15 AM', '01:25 PM', '04:35 PM', '07:00 PM', '10:10 PM'];
          for (const showDate of datesList) {
            for (const showTime of times) {
              const showtimeId = insertShowtime.run(
                movieId,
                theaterId,
                showDate,
                showTime,
                59.00,  // PEARL Tier (₹59)
                200.00, // DIAMOND Tier (₹200)
                350.00  // RECLINER Tier
              ).lastInsertRowid;

              const rows = [
                { prefix: 'A', cat: 'DIAMOND', count: 12 },
                { prefix: 'B', cat: 'DIAMOND', count: 12 },
                { prefix: 'C', cat: 'DIAMOND', count: 12 },
                { prefix: 'D', cat: 'DIAMOND', count: 12 },
                { prefix: 'E', cat: 'DIAMOND', count: 12 },
                { prefix: 'M', cat: 'PEARL', count: 10 },
                { prefix: 'N', cat: 'PEARL', count: 10 }
              ];

              for (const r of rows) {
                for (let i = 1; i <= r.count; i++) {
                  const seatNum = `${r.prefix}${i < 10 ? '0' + i : i}`;
                  const isBooked = Math.random() < 0.10 ? 1 : 0;
                  insertSeat.run(showtimeId, seatNum, r.cat, isBooked);
                }
              }
            }
          }
        }
      }
    });

    seedTransaction();
    console.log('Fast database seeding completed!');
  }
}

initDatabase();

module.exports = db;
