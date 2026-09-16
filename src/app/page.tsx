"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import MovieCard from "@/components/MovieCard";
import MovieDetailsModal from "@/components/MovieDetailsModal";
import ShowtimeSelector from "@/components/ShowtimeSelector";
import SeatPicker from "@/components/SeatPicker";
import BookingSummaryModal from "@/components/BookingSummaryModal";
import TicketModal from "@/components/TicketModal";
import UserBookingsModal from "@/components/UserBookingsModal";
import CitySelectorModal from "@/components/CitySelectorModal";
import SeatCountModal from "@/components/SeatCountModal";
import LanguageFormatModal from "@/components/LanguageFormatModal";
import SidebarFilters from "@/components/SidebarFilters";
import { fetchMovies } from "@/lib/api";
import { MapPin } from "lucide-react";
import type { MovieLike, TheaterLike, ShowLike, SeatSelection, BookingLike } from "@/lib/types";

const DEFAULT_MOVIES: MovieLike[] = [
  // HINDI
  { movie_id: 1, title: "Pathaan", genre: "Action / Spy / Thriller", duration: 146, rating: 8.8, language: "Hindi", description: "A spy action film with mid-air fistfights and jetpack sequences.", poster_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80", release_date: "2023-01-25" },
  { movie_id: 2, title: "Krrish", genre: "Superhero / Action / Sci-Fi", duration: 175, rating: 8.7, language: "Hindi", description: "A superhero film featuring massive leaps, high-flying acrobatics, and superhuman strength.", poster_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80", release_date: "2006-06-23" },
  { movie_id: 3, title: "Dhoom 2", genre: "Action / Thriller / Crime", duration: 152, rating: 8.9, language: "Hindi", description: "An action thriller with gravity-defying motorcycle stunts and parkour.", poster_url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80", release_date: "2006-11-24" },
  { movie_id: 4, title: "Chennai Express", genre: "Action / Comedy / Romance", duration: 141, rating: 8.5, language: "Hindi", description: "An action-comedy with exaggerated, physics-defying fight scenes and colorful humor.", poster_url: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80", release_date: "2013-08-08" },
  { movie_id: 5, title: "Bang Bang!", genre: "Action / Romance / Thriller", duration: 153, rating: 8.6, language: "Hindi", description: "A high-octane thriller featuring stunts on flyboards, cars, and motorcycles.", poster_url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80", release_date: "2014-10-02" },

  // TAMIL
  { movie_id: 6, title: "Master", genre: "Action / Thriller / Drama", duration: 179, rating: 8.9, language: "Tamil", description: "An alcoholic professor is sent to a juvenile school, where he clashes with a ruthless gangster.", poster_url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80", release_date: "2021-01-13" },
  { movie_id: 7, title: "Anniyan", genre: "Action / Thriller / Mystery", duration: 181, rating: 9.2, language: "Tamil", description: "A stylish action thriller featuring high-flying martial arts and dramatic face-offs.", poster_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80", release_date: "2005-06-17" },
  { movie_id: 8, title: "Ghajini", genre: "Action / Drama / Romance", duration: 175, rating: 9.1, language: "Tamil", description: "An intense action drama with powerful, larger-than-life combat sequences.", poster_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80", release_date: "2005-09-29" },
  { movie_id: 9, title: "Enthiran / Robot", genre: "Sci-Fi / Action / Thriller", duration: 174, rating: 9.3, language: "Tamil", description: "A sci-fi epic where an Android robot defies all laws of physics and gravity in battle.", poster_url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80", release_date: "2010-10-01" },
  { movie_id: 10, title: "Kaththi", genre: "Action / Drama / Social", duration: 166, rating: 9.0, language: "Tamil", description: "An action drama featuring stylized, gravity-defying coin fights and mass action beats.", poster_url: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80", release_date: "2014-10-22" },

  // MALAYALAM
  { movie_id: 11, title: "RDX: Robert Dony Xavier", genre: "Action / Martial Arts / Drama", duration: 151, rating: 9.0, language: "Malayalam", description: "A high-energy martial arts action film featuring gravity-defying street fights.", poster_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80", release_date: "2023-08-25" },
  { movie_id: 12, title: "Pulimurugan", genre: "Action / Adventure / Mass", duration: 161, rating: 9.1, language: "Malayalam", description: "A man battles wild tigers with gravity-defying leaps and extreme forest stunts.", poster_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80", release_date: "2016-10-07" },
  { movie_id: 13, title: "Kayamkulam Kochunni", genre: "Action / History / Drama", duration: 151, rating: 8.8, language: "Malayalam", description: "A folklore action film featuring high-flying acrobatics and parkour-style escapes.", poster_url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80", release_date: "2018-10-11" },
  { movie_id: 14, title: "C.I.D. Moosa", genre: "Action / Slapstick / Comedy", duration: 158, rating: 9.3, language: "Malayalam", description: "A slapstick comedy with cartoonish, physics-defying action gags.", poster_url: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80", release_date: "2003-07-04" },
  { movie_id: 15, title: "Masterpiece", genre: "Action / Thriller / Campus", duration: 148, rating: 8.4, language: "Malayalam", description: "A campus action thriller with stylized mass fight sequences.", poster_url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80", release_date: "2017-12-21" },

  // TELUGU
  { movie_id: 16, title: "RRR", genre: "Action / Epic / History", duration: 187, rating: 9.5, language: "Telugu", description: "An action spectacular featuring motorcycle-human throws and fire-and-water acrobatics.", poster_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80", release_date: "2022-03-25" },
  { movie_id: 17, title: "Baahubali 2: The Conclusion", genre: "Epic / Action / Fantasy", duration: 167, rating: 9.6, language: "Telugu", description: "Features legendary tree-bending catapult launches and massive physics-defying battle formations.", poster_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80", release_date: "2017-04-28" },
  { movie_id: 18, title: "Baahubali: The Beginning", genre: "Epic / Action / Drama", duration: 159, rating: 9.4, language: "Telugu", description: "Famous for soldiers running up shields and leaping across massive waterfalls and cliffs.", poster_url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80", release_date: "2015-07-10" },
  { movie_id: 19, title: "Magadheera", genre: "Action / Romance / Fantasy", duration: 167, rating: 9.1, language: "Telugu", description: "A warrior single-handedly fighting a hundred men with impossible leaps across cliffs.", poster_url: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80", release_date: "2009-07-31" },
  { movie_id: 20, title: "Pushpa: The Rise", genre: "Action / Crime / Drama", duration: 179, rating: 8.9, language: "Telugu", description: "An action drama with high-energy, elevated stylized hero face-offs.", poster_url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80", release_date: "2021-12-17" },
];

type View = "home" | "showtimes" | "seatpicker";

export default function Home() {
  const { status: authStatus } = useSession();
  const [currentView, setCurrentView] = useState<View>("home");

  const [movies, setMovies] = useState<MovieLike[]>(DEFAULT_MOVIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Chennai");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedFormat, setSelectedFormat] = useState("All");

  const [showCityModal, setShowCityModal] = useState(true);
  const [showSeatCountModal, setShowSeatCountModal] = useState(false);
  const [showLangFormatModal, setShowLangFormatModal] = useState(false);
  const [targetSeatCount, setTargetSeatCount] = useState(5);
  const [targetCategory, setTargetCategory] = useState("DIAMOND");

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    if (city === "Chennai") setSelectedLanguage("Tamil");
    else if (["Delhi-NCR", "Mumbai", "Ahmedabad", "Chandigarh"].includes(city)) setSelectedLanguage("Hindi");
    else if (city === "Hyderabad") setSelectedLanguage("Telugu");
    else if (city === "Kochi") setSelectedLanguage("Malayalam");
    else setSelectedLanguage("All");
  };

  const [selectedMovie, setSelectedMovie] = useState<MovieLike | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<ShowLike | null>(null);
  const [selectedTheater, setSelectedTheater] = useState<TheaterLike | null>(null);
  const [selectedSeatData, setSelectedSeatData] = useState<SeatSelection | null>(null);
  const [latestBooking, setLatestBooking] = useState<BookingLike | null>(null);

  const [showMovieDetailModal, setShowMovieDetailModal] = useState(false);
  const [showBookingSummaryModal, setShowBookingSummaryModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showMyBookingsModal, setShowMyBookingsModal] = useState(false);

  const loadMoviesList = async () => {
    try {
      const res = await fetchMovies();
      if (res.success && res.data && res.data.length > 0) {
        setMovies(res.data);
      }
    } catch (err) {
      console.error("Failed to load movies:", err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load on mount
    loadMoviesList();
  }, []);

  const handleSelectMovieForDetails = (movie: MovieLike) => {
    setSelectedMovie(movie);
    setShowLangFormatModal(true);
  };

  const handleConfirmLanguageFormat = () => {
    setShowLangFormatModal(false);
    setCurrentView("showtimes");
  };

  const handleProceedToShowtimes = (movie: MovieLike) => {
    setSelectedMovie(movie);
    setShowMovieDetailModal(false);
    setCurrentView("showtimes");
  };

  const handleSelectShowtime = (showtime: ShowLike, theater: TheaterLike) => {
    setSelectedShowtime(showtime);
    setSelectedTheater(theater);
    setShowSeatCountModal(true);
  };

  const handleConfirmSeatCount = (count: number, category: string) => {
    setTargetSeatCount(count);
    if (category) setTargetCategory(category);
    setShowSeatCountModal(false);
    setCurrentView("seatpicker");
  };

  const handleProceedToCheckout = (seatData: SeatSelection) => {
    if (authStatus !== "authenticated") {
      signIn("google");
      return;
    }
    setSelectedSeatData(seatData);
    setShowBookingSummaryModal(true);
  };

  const handleBookingSuccess = (bookingDetails: BookingLike) => {
    setShowBookingSummaryModal(false);
    setLatestBooking(bookingDetails);
    setShowTicketModal(true);
    setCurrentView("home");
  };

  const filteredMovies = movies.filter((m) => {
    const matchesSearch =
      searchQuery === "" ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.genre.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLang = selectedLanguage === "All" || m.language.toLowerCase().includes(selectedLanguage.toLowerCase());

    const matchesGenre = selectedGenre === "All" || m.genre.toLowerCase().includes(selectedGenre.toLowerCase());

    return matchesSearch && matchesLang && matchesGenre;
  });

  const languagePills = ["Tamil", "Hindi", "Telugu", "Malayalam", "English"];

  return (
    <div className="min-h-screen bg-[#F5F5F7] font-sans antialiased text-gray-900 flex flex-col">
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCity={selectedCity}
        onOpenCitySelector={() => setShowCityModal(true)}
        onOpenMyBookings={() => setShowMyBookingsModal(true)}
        onResetHome={() => setCurrentView("home")}
      />

      <main className="flex-1">
        {currentView === "home" && (
          <div>
            <HeroBanner movies={movies} onSelectMovie={handleSelectMovieForDetails} />

            <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
              <div className="bg-gradient-to-r from-bms-darker via-[#2B3141] to-bms-darker text-white p-5 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 border border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-bms-red rounded-xl">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base md:text-lg">Partner Cinema Multiplexes (5 Venues Available)</h3>
                    <p className="text-xs text-gray-300">
                      Rakki Cinemas OMR • The Vijay Park Multiplex ECR • Rohini Silver Screens Koyambedu • KC Krishnaveni
                      Cinemas T.Nagar • AGS Cinemas Maduravoyal
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                  <span>● Live Real-Time Seat Booking</span>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <SidebarFilters
                  selectedLanguage={selectedLanguage}
                  setSelectedLanguage={setSelectedLanguage}
                  selectedGenre={selectedGenre}
                  setSelectedGenre={setSelectedGenre}
                  selectedFormat={selectedFormat}
                  setSelectedFormat={setSelectedFormat}
                  onClearFilters={() => {
                    setSelectedLanguage("All");
                    setSelectedGenre("All");
                    setSelectedFormat("All");
                  }}
                />

                <div className="flex-1 space-y-6 w-full">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-extrabold text-gray-900">Movies In {selectedCity}</h2>
                      <span className="text-xs font-bold bg-red-100 text-bms-red px-3 py-1 rounded-full">
                        {filteredMovies.length} Movies Available
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 overflow-x-auto py-1">
                      <button
                        onClick={() => setSelectedLanguage("All")}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer border ${
                          selectedLanguage === "All"
                            ? "bg-bms-red text-white border-bms-red shadow-sm"
                            : "bg-white text-gray-700 border-gray-300 hover:border-bms-red"
                        }`}
                      >
                        All Languages
                      </button>
                      {languagePills.map((lang) => (
                        <button
                          key={lang}
                          onClick={() => setSelectedLanguage(selectedLanguage === lang ? "All" : lang)}
                          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer border ${
                            selectedLanguage === lang
                              ? "bg-bms-red text-white border-bms-red shadow-sm"
                              : "bg-white text-bms-red border-red-200 hover:border-bms-red hover:bg-red-50"
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filteredMovies.length === 0 ? (
                    <div className="bg-white p-12 text-center rounded-2xl border border-gray-200 text-gray-500 space-y-3">
                      <p className="font-semibold text-base">No movies found matching language &quot;{selectedLanguage}&quot;.</p>
                      <button
                        onClick={() => {
                          setSelectedLanguage("All");
                          setSelectedGenre("All");
                        }}
                        className="inline-flex items-center gap-2 bg-bms-red text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
                      >
                        Show All Languages
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                      {filteredMovies.map((movie) => (
                        <MovieCard key={movie.movie_id} movie={movie} onSelect={handleSelectMovieForDetails} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === "showtimes" && selectedMovie && (
          <ShowtimeSelector movie={selectedMovie} onBack={() => setCurrentView("home")} onSelectShowtime={handleSelectShowtime} />
        )}

        {currentView === "seatpicker" && (
          <SeatPicker
            movie={selectedMovie || movies[0] || DEFAULT_MOVIES[0]}
            showtime={
              selectedShowtime || { showtime_id: 1, show_time: "10:10 PM", show_date: "Today", price_prime: 200, price_classic: 59, price_recliner: 350 }
            }
            theater={selectedTheater || { theater_id: 0, name: "PVR: Forum Mall, Koramangala" }}
            targetSeatCount={targetSeatCount}
            targetCategory={targetCategory}
            onBack={() => setCurrentView("showtimes")}
            onProceedToCheckout={handleProceedToCheckout}
          />
        )}
      </main>

      {showSeatCountModal && selectedShowtime && selectedTheater && selectedMovie && (
        <SeatCountModal
          movie={selectedMovie}
          showtime={selectedShowtime}
          onClose={() => setShowSeatCountModal(false)}
          onConfirmSeatCount={handleConfirmSeatCount}
        />
      )}

      {showMovieDetailModal && (
        <MovieDetailsModal
          movie={selectedMovie}
          onClose={() => setShowMovieDetailModal(false)}
          onProceedToBooking={handleProceedToShowtimes}
        />
      )}

      {showBookingSummaryModal && selectedMovie && selectedShowtime && selectedTheater && selectedSeatData && (
        <BookingSummaryModal
          movie={selectedMovie}
          showtime={selectedShowtime}
          theater={selectedTheater}
          selectedSeats={selectedSeatData.selectedSeats}
          basePrice={selectedSeatData.totalPrice}
          onClose={() => setShowBookingSummaryModal(false)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {showTicketModal && <TicketModal booking={latestBooking} onClose={() => setShowTicketModal(false)} />}

      {showMyBookingsModal && <UserBookingsModal onClose={() => setShowMyBookingsModal(false)} />}

      {showCityModal && (
        <CitySelectorModal
          selectedCity={selectedCity}
          onSelectCity={handleCitySelect}
          onClose={() => setShowCityModal(false)}
          isInitialPopup
        />
      )}

      {showLangFormatModal && selectedMovie && (
        <LanguageFormatModal
          movie={selectedMovie}
          onClose={() => setShowLangFormatModal(false)}
          onConfirmLanguageFormat={handleConfirmLanguageFormat}
        />
      )}

      <footer className="bg-bms-darker text-gray-400 text-xs py-8 border-t border-gray-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="bg-bms-red text-white p-1 rounded font-black">BMS</span>
            <span className="font-bold text-white">BookMySeat Movie Ticket Booking System</span>
          </div>

          <p>© 2026 Movie Ticket Booking System. All Rights Reserved.</p>

          <div className="flex items-center gap-4 text-gray-400">
            <button onClick={() => setShowMyBookingsModal(true)} className="hover:text-white underline">
              My Bookings
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
