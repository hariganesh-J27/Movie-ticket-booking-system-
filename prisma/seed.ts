import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const moviesData = [
  // HINDI
  { title: "Pathaan", genre: "Action / Spy / Thriller", duration: 146, rating: 8.8, lang: "Hindi", desc: "A spy action film with mid-air fistfights and jetpack sequences.", poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80", date: "2023-01-25" },
  { title: "Krrish", genre: "Superhero / Action / Sci-Fi", duration: 175, rating: 8.7, lang: "Hindi", desc: "A superhero film featuring massive leaps, high-flying acrobatics, and superhuman strength.", poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80", date: "2006-06-23" },
  { title: "Dhoom 2", genre: "Action / Thriller / Crime", duration: 152, rating: 8.9, lang: "Hindi", desc: "An action thriller with gravity-defying motorcycle stunts and parkour.", poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80", date: "2006-11-24" },
  { title: "Chennai Express", genre: "Action / Comedy / Romance", duration: 141, rating: 8.5, lang: "Hindi", desc: "An action-comedy with exaggerated, physics-defying fight scenes and colorful humor.", poster: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80", date: "2013-08-08" },
  { title: "Bang Bang!", genre: "Action / Romance / Thriller", duration: 153, rating: 8.6, lang: "Hindi", desc: "A high-octane thriller featuring stunts on flyboards, cars, and motorcycles.", poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80", date: "2014-10-02" },

  // TAMIL
  { title: "Master", genre: "Action / Thriller / Drama", duration: 179, rating: 8.9, lang: "Tamil", desc: "An alcoholic professor is sent to a juvenile school, where he clashes with a ruthless gangster.", poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80", date: "2021-01-13" },
  { title: "Anniyan", genre: "Action / Thriller / Mystery", duration: 181, rating: 9.2, lang: "Tamil", desc: "A stylish action thriller featuring high-flying martial arts and dramatic face-offs.", poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80", date: "2005-06-17" },
  { title: "Ghajini", genre: "Action / Drama / Romance", duration: 175, rating: 9.1, lang: "Tamil", desc: "An intense action drama with powerful, larger-than-life combat sequences.", poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80", date: "2005-09-29" },
  { title: "Enthiran / Robot", genre: "Sci-Fi / Action / Thriller", duration: 174, rating: 9.3, lang: "Tamil", desc: "A sci-fi epic where an Android robot defies all laws of physics and gravity in battle.", poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80", date: "2010-10-01" },
  { title: "Kaththi", genre: "Action / Drama / Social", duration: 166, rating: 9.0, lang: "Tamil", desc: "An action drama featuring stylized, gravity-defying coin fights and mass action beats.", poster: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80", date: "2014-10-22" },

  // MALAYALAM
  { title: "RDX: Robert Dony Xavier", genre: "Action / Martial Arts / Drama", duration: 151, rating: 9.0, lang: "Malayalam", desc: "A high-energy martial arts action film featuring gravity-defying street fights.", poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80", date: "2023-08-25" },
  { title: "Pulimurugan", genre: "Action / Adventure / Mass", duration: 161, rating: 9.1, lang: "Malayalam", desc: "A man battles wild tigers with gravity-defying leaps and extreme forest stunts.", poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80", date: "2016-10-07" },
  { title: "Kayamkulam Kochunni", genre: "Action / History / Drama", duration: 151, rating: 8.8, lang: "Malayalam", desc: "A folklore action film featuring high-flying acrobatics and parkour-style escapes.", poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80", date: "2018-10-11" },
  { title: "C.I.D. Moosa", genre: "Action / Slapstick / Comedy", duration: 158, rating: 9.3, lang: "Malayalam", desc: "A slapstick comedy with cartoonish, physics-defying action gags.", poster: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80", date: "2003-07-04" },
  { title: "Masterpiece", genre: "Action / Thriller / Campus", duration: 148, rating: 8.4, lang: "Malayalam", desc: "A campus action thriller with stylized mass fight sequences.", poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80", date: "2017-12-21" },

  // TELUGU
  { title: "RRR", genre: "Action / Epic / History", duration: 187, rating: 9.5, lang: "Telugu", desc: "An action spectacular featuring motorcycle-human throws and fire-and-water acrobatics.", poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80", date: "2022-03-25" },
  { title: "Baahubali 2: The Conclusion", genre: "Epic / Action / Fantasy", duration: 167, rating: 9.6, lang: "Telugu", desc: "Features legendary tree-bending catapult launches and massive physics-defying battle formations.", poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80", date: "2017-04-28" },
  { title: "Baahubali: The Beginning", genre: "Epic / Action / Drama", duration: 159, rating: 9.4, lang: "Telugu", desc: "Famous for soldiers running up shields and leaping across massive waterfalls and cliffs.", poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80", date: "2015-07-10" },
  { title: "Magadheera", genre: "Action / Romance / Fantasy", duration: 167, rating: 9.1, lang: "Telugu", desc: "A warrior single-handedly fighting a hundred men with impossible leaps across cliffs.", poster: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80", date: "2009-07-31" },
  { title: "Pushpa: The Rise", genre: "Action / Crime / Drama", duration: 179, rating: 8.9, lang: "Telugu", desc: "An action drama with high-energy, elevated stylized hero face-offs.", poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80", date: "2021-12-17" },
];

const BANNER_URL = "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80";

async function main() {
  const existingCount = await prisma.movie.count();
  if (existingCount > 0) {
    console.log(`Database already has ${existingCount} movies, skipping seed.`);
    return;
  }

  console.log("Seeding 20 movies & 5 multiplexes across 7 days...");

  const movieIds: number[] = [];
  for (const m of moviesData) {
    const movie = await prisma.movie.create({
      data: {
        title: m.title,
        genre: m.genre,
        duration: m.duration,
        rating: m.rating,
        language: m.lang,
        description: m.desc,
        posterUrl: m.poster,
        bannerUrl: BANNER_URL,
        releaseDate: m.date,
      },
    });
    movieIds.push(movie.movieId);
  }

  const theaterDefs = [
    { name: "Rakki Cinemas: OMR, Kelambakkam", location: "OMR Road, Kelambakkam, Chennai", city: "Chennai", totalScreens: 8, cancellationStatus: "Non-cancellable" },
    { name: "The Vijay Park Multiplex: Injambakkam ECR", location: "ECR Road, Injambakkam, Chennai", city: "Chennai", totalScreens: 6, cancellationStatus: "Cancellation available" },
    { name: "Rohini Silver Screens: Koyambedu", location: "Poonamallee High Rd, Koyambedu, Chennai", city: "Chennai", totalScreens: 7, cancellationStatus: "Non-cancellable" },
    { name: "KC (Krishnaveni Cinemas) RG3 LASER DOLBY ATMOS TNAGAR", location: "Usman Road, T.Nagar, Chennai", city: "Chennai", totalScreens: 5, cancellationStatus: "Non-cancellable" },
    { name: "AGS Cinemas: Maduravoyal", location: "Chennai Bypass Road, Maduravoyal, Chennai", city: "Chennai", totalScreens: 6, cancellationStatus: "Cancellation available" },
  ];

  const theaterIds: number[] = [];
  for (const t of theaterDefs) {
    const theater = await prisma.theater.create({ data: t });
    theaterIds.push(theater.theaterId);
  }

  const datesList: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(Date.now() + i * 86400000);
    datesList.push(d.toISOString().split("T")[0]);
  }

  const times = ["10:15 AM", "01:25 PM", "04:35 PM", "07:00 PM", "10:10 PM"];
  const seatRows = [
    { prefix: "A", cat: "DIAMOND", count: 12 },
    { prefix: "B", cat: "DIAMOND", count: 12 },
    { prefix: "C", cat: "DIAMOND", count: 12 },
    { prefix: "D", cat: "DIAMOND", count: 12 },
    { prefix: "E", cat: "DIAMOND", count: 12 },
    { prefix: "M", cat: "PEARL", count: 10 },
    { prefix: "N", cat: "PEARL", count: 10 },
  ];

  for (const movieId of movieIds) {
    for (const theaterId of theaterIds) {
      for (const showDate of datesList) {
        for (const showTime of times) {
          const showtime = await prisma.showtime.create({
            data: {
              movieId,
              theaterId,
              showDate,
              showTime,
              priceClassic: 59.0,
              pricePrime: 200.0,
              priceRecliner: 350.0,
            },
          });

          const seatsToCreate = [];
          for (const r of seatRows) {
            for (let i = 1; i <= r.count; i++) {
              const seatNum = `${r.prefix}${i < 10 ? "0" + i : i}`;
              const isBooked = Math.random() < 0.1 ? 1 : 0;
              seatsToCreate.push({
                showtimeId: showtime.showtimeId,
                seatNumber: seatNum,
                seatCategory: r.cat,
                isBooked,
              });
            }
          }
          await prisma.seat.createMany({ data: seatsToCreate });
        }
      }
    }
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
