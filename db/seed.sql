-- Seed data: 20 movies, 5 theaters, and 7 days of showtimes with seats.
-- Skips itself if the movies table already has rows.

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM movies) THEN
    RAISE NOTICE 'Database already has movies, skipping seed.';
    RETURN;
  END IF;

  RAISE NOTICE 'Seeding 20 movies & 5 multiplexes across 7 days...';

  INSERT INTO movies (title, genre, duration, rating, language, description, poster_url, banner_url, release_date)
  VALUES
    ('Pathaan', 'Action / Spy / Thriller', 146, 8.8, 'Hindi', 'A spy action film with mid-air fistfights and jetpack sequences.', 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80', '2023-01-25'),
    ('Krrish', 'Superhero / Action / Sci-Fi', 175, 8.7, 'Hindi', 'A superhero film featuring massive leaps, high-flying acrobatics, and superhuman strength.', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80', '2006-06-23'),
    ('Dhoom 2', 'Action / Thriller / Crime', 152, 8.9, 'Hindi', 'An action thriller with gravity-defying motorcycle stunts and parkour.', 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80', '2006-11-24'),
    ('Chennai Express', 'Action / Comedy / Romance', 141, 8.5, 'Hindi', 'An action-comedy with exaggerated, physics-defying fight scenes and colorful humor.', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80', '2013-08-08'),
    ('Bang Bang!', 'Action / Romance / Thriller', 153, 8.6, 'Hindi', 'A high-octane thriller featuring stunts on flyboards, cars, and motorcycles.', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80', '2014-10-02'),
    ('Master', 'Action / Thriller / Drama', 179, 8.9, 'Tamil', 'An alcoholic professor is sent to a juvenile school, where he clashes with a ruthless gangster.', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80', '2021-01-13'),
    ('Anniyan', 'Action / Thriller / Mystery', 181, 9.2, 'Tamil', 'A stylish action thriller featuring high-flying martial arts and dramatic face-offs.', 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80', '2005-06-17'),
    ('Ghajini', 'Action / Drama / Romance', 175, 9.1, 'Tamil', 'An intense action drama with powerful, larger-than-life combat sequences.', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80', '2005-09-29'),
    ('Enthiran / Robot', 'Sci-Fi / Action / Thriller', 174, 9.3, 'Tamil', 'A sci-fi epic where an Android robot defies all laws of physics and gravity in battle.', 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80', '2010-10-01'),
    ('Kaththi', 'Action / Drama / Social', 166, 9, 'Tamil', 'An action drama featuring stylized, gravity-defying coin fights and mass action beats.', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80', '2014-10-22'),
    ('RDX: Robert Dony Xavier', 'Action / Martial Arts / Drama', 151, 9, 'Malayalam', 'A high-energy martial arts action film featuring gravity-defying street fights.', 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80', '2023-08-25'),
    ('Pulimurugan', 'Action / Adventure / Mass', 161, 9.1, 'Malayalam', 'A man battles wild tigers with gravity-defying leaps and extreme forest stunts.', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80', '2016-10-07'),
    ('Kayamkulam Kochunni', 'Action / History / Drama', 151, 8.8, 'Malayalam', 'A folklore action film featuring high-flying acrobatics and parkour-style escapes.', 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80', '2018-10-11'),
    ('C.I.D. Moosa', 'Action / Slapstick / Comedy', 158, 9.3, 'Malayalam', 'A slapstick comedy with cartoonish, physics-defying action gags.', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80', '2003-07-04'),
    ('Masterpiece', 'Action / Thriller / Campus', 148, 8.4, 'Malayalam', 'A campus action thriller with stylized mass fight sequences.', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80', '2017-12-21'),
    ('RRR', 'Action / Epic / History', 187, 9.5, 'Telugu', 'An action spectacular featuring motorcycle-human throws and fire-and-water acrobatics.', 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80', '2022-03-25'),
    ('Baahubali 2: The Conclusion', 'Epic / Action / Fantasy', 167, 9.6, 'Telugu', 'Features legendary tree-bending catapult launches and massive physics-defying battle formations.', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80', '2017-04-28'),
    ('Baahubali: The Beginning', 'Epic / Action / Drama', 159, 9.4, 'Telugu', 'Famous for soldiers running up shields and leaping across massive waterfalls and cliffs.', 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80', '2015-07-10'),
    ('Magadheera', 'Action / Romance / Fantasy', 167, 9.1, 'Telugu', 'A warrior single-handedly fighting a hundred men with impossible leaps across cliffs.', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80', '2009-07-31'),
    ('Pushpa: The Rise', 'Action / Crime / Drama', 179, 8.9, 'Telugu', 'An action drama with high-energy, elevated stylized hero face-offs.', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80', '2021-12-17')
  ;

  INSERT INTO theaters (name, location, city, total_screens, cancellation_status)
  VALUES
    ('Rakki Cinemas: OMR, Kelambakkam', 'OMR Road, Kelambakkam, Chennai', 'Chennai', 8, 'Non-cancellable'),
    ('The Vijay Park Multiplex: Injambakkam ECR', 'ECR Road, Injambakkam, Chennai', 'Chennai', 6, 'Cancellation available'),
    ('Rohini Silver Screens: Koyambedu', 'Poonamallee High Rd, Koyambedu, Chennai', 'Chennai', 7, 'Non-cancellable'),
    ('KC (Krishnaveni Cinemas) RG3 LASER DOLBY ATMOS TNAGAR', 'Usman Road, T.Nagar, Chennai', 'Chennai', 5, 'Non-cancellable'),
    ('AGS Cinemas: Maduravoyal', 'Chennai Bypass Road, Maduravoyal, Chennai', 'Chennai', 6, 'Cancellation available');

  INSERT INTO showtimes (movie_id, theater_id, show_date, show_time, price_classic, price_prime, price_recliner)
  SELECT m.movie_id,
         t.theater_id,
         to_char(current_date + d.day_offset, 'YYYY-MM-DD'),
         tm.show_time,
         59.0, 200.0, 350.0
  FROM movies m
  CROSS JOIN theaters t
  CROSS JOIN generate_series(0, 6) AS d(day_offset)
  CROSS JOIN (VALUES ('10:15 AM'), ('01:25 PM'), ('04:35 PM'), ('07:00 PM'), ('10:10 PM')) AS tm(show_time);

  -- Seats for every showtime, with roughly 10% already booked.
  PERFORM fn_generate_seats(showtime_id, 0.1) FROM showtimes;

  RAISE NOTICE 'Seeding completed!';
END;
$$;
