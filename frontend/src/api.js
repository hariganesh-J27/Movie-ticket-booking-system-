const API_BASE = 'http://localhost:5050/api';

export async function fetchMovies() {
  const res = await fetch(`${API_BASE}/movies`);
  if (!res.ok) throw new Error('Failed to fetch movies');
  return res.json();
}

export async function fetchMovieById(id) {
  const res = await fetch(`${API_BASE}/movies/${id}`);
  if (!res.ok) throw new Error('Failed to fetch movie details');
  return res.json();
}

export async function createMovie(movieData) {
  const res = await fetch(`${API_BASE}/movies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(movieData)
  });
  return res.json();
}

export async function deleteMovie(id) {
  const res = await fetch(`${API_BASE}/movies/${id}`, {
    method: 'DELETE'
  });
  return res.json();
}

export async function fetchTheaters() {
  const res = await fetch(`${API_BASE}/theaters`);
  if (!res.ok) throw new Error('Failed to fetch theaters');
  return res.json();
}

export async function fetchShowtimes(movieId, date) {
  let url = `${API_BASE}/showtimes?`;
  if (movieId) url += `movieId=${movieId}&`;
  if (date) url += `date=${date}&`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch showtimes');
  return res.json();
}

export async function fetchSeats(showtimeId) {
  const res = await fetch(`${API_BASE}/showtimes/${showtimeId}/seats`);
  if (!res.ok) throw new Error('Failed to fetch seats');
  return res.json();
}

export async function createBooking(bookingData) {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData)
  });
  return res.json();
}

export async function fetchUserBookings(email) {
  let url = `${API_BASE}/bookings`;
  if (email) url += `?email=${encodeURIComponent(email)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch bookings');
  return res.json();
}

export async function cancelBooking(bookingId) {
  const res = await fetch(`${API_BASE}/bookings/${bookingId}`, {
    method: 'DELETE'
  });
  return res.json();
}

export async function executeAdminSql(query) {
  const res = await fetch(`${API_BASE}/admin/sql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  return res.json();
}
