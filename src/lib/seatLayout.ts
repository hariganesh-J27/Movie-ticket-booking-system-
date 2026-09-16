const SEAT_ROWS = [
  { prefix: "A", cat: "DIAMOND", count: 12 },
  { prefix: "B", cat: "DIAMOND", count: 12 },
  { prefix: "C", cat: "DIAMOND", count: 12 },
  { prefix: "D", cat: "DIAMOND", count: 12 },
  { prefix: "E", cat: "DIAMOND", count: 12 },
  { prefix: "M", cat: "PEARL", count: 10 },
  { prefix: "N", cat: "PEARL", count: 10 },
];

export function buildSeatLayout(): { seatNumber: string; seatCategory: string }[] {
  const seats: { seatNumber: string; seatCategory: string }[] = [];
  for (const r of SEAT_ROWS) {
    for (let i = 1; i <= r.count; i++) {
      const seatNumber = `${r.prefix}${i < 10 ? "0" + i : i}`;
      seats.push({ seatNumber, seatCategory: r.cat });
    }
  }
  return seats;
}
