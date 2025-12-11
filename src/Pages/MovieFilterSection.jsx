import React, { useState, useEffect } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFilms } from '../redux/moviesSlice';
import { Link } from 'react-router-dom';

const MoviesList = ({ filteredMovies, loading, searchTerm, clearAllFilters }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);

  const getGenreName = (id) => id;
  const getYearName = (id) => id;
  const getCountryName = (id) => id;

  return (
    <>
      <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-gray-800 shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 4h10m-7 4h4m-8 0h.01m6 4h2m-6 0h.01m2 4h2m-6 0h.01" />
        </svg>
        <p className="text-lg text-white">
          تم العثور على{" "}
          <span className="font-bold text-amber-300">{filteredMovies.length}</span> فيلم
          {searchTerm && (
            <span>
              {" "}للبحث عن{" "}
              <span className="font-medium text-amber-200">"{searchTerm}"</span>
            </span>
          )}
        </p>
      </div>
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-300"></div>
        </div>
      )}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {currentMovies.map((movie, index) => (
            <Link
              key={index}
              to={`/Details/${movie._id}`}
              className="text-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              style={{ backgroundColor: "var(--color-dark)" }}
            >
              <div className="relative">
                <img
                  src={movie.posterUrl || movie.posterImage?.url || 'https://via.placeholder.com/400x600?text=No+Image'}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-lg text-sm">
                  ⭐ {movie.rating}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-white mb-1 line-clamp-1">
                  {movie.nameArabic}
                </h3>
                <p className="text-sm text-white mb-2">{movie.nameEnglish}</p>
                <p className="text-white text-sm mb-3 line-clamp-2">
                  {movie.summary}
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {getGenreName(movie.genre)}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                    {movie.year}
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                    {getCountryName(movie.country)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1
                ? "bg-amber-300 text-white"
                : "bg-gray-200 text-black"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
      {!loading && filteredMovies.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            لم يتم العثور على أفلام
          </h3>
          <p className="text-white mb-4">
            جرب تغيير معايير البحث أو الفلاتر
          </p>
          <button
            onClick={clearAllFilters}
            className="px-6 py-3 bg-amber-300 text-black rounded-xl hover:bg-amber-400 transition-colors duration-200"
          >
            مسح جميع الفلاتر
          </button>
        </div>
      )}
    </>
  );
};

const MovieFilterSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);
  const [genreDropdownOpen, setGenreDropdownOpen] = useState(false);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const { films, filmsLoading, error } = useSelector(state => state.movies);

  useEffect(() => {
    dispatch(fetchFilms());
  }, [dispatch]);

  useEffect(() => {
    let filtered = [...films];
    if (searchTerm) {
      filtered = filtered.filter(movie =>
        movie.nameArabic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.nameEnglish.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedGenre) {
      filtered = filtered.filter(movie => movie.genre === selectedGenre);
    }
    if (selectedYear) {
      if (selectedYear === 'older') {
        filtered = filtered.filter(movie => parseInt(movie.year) < 2020);
      } else {
        filtered = filtered.filter(movie => movie.year === selectedYear);
      }
    }
    if (selectedCountry) {
      filtered = filtered.filter(movie => movie.country === selectedCountry);
    }
    setFilteredMovies(filtered);

    let count = 0;
    if (selectedGenre) count++;
    if (selectedYear) count++;
    if (selectedCountry) count++;
    setActiveFilters(count);
  }, [films, searchTerm, selectedGenre, selectedYear, selectedCountry]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedGenre('');
    setSelectedYear('');
    setSelectedCountry('');
    setGenreDropdownOpen(false);
    setYearDropdownOpen(false);
    setCountryDropdownOpen(false);
  };

  const uniqueGenres = Array.from(new Set(films.map(m => m.genre))).filter(Boolean);
  const uniqueYears = Array.from(new Set(films.map(m => m.year))).filter(Boolean);
  const uniqueCountries = Array.from(new Set(films.map(m => m.country))).filter(Boolean);

  const getGenreName = (id) => id;
  const getYearName = (id) => id;
  const getCountryName = (id) => id;

  return (
    <div className="w-full  py-8  sm:px-6 lg:px-1" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-8">
            الأفلام
          </h1>
          <p className="text-xl text-amber-300">
            اكتشف أفضل الأفلام من جميع أنحاء العالم العربي
          </p>
        </div>
        <div className=" rounded-2xl shadow-5xl p-20 mb-8 border border-none" style={{ backgroundColor: 'var(--color-primary)' }}>
          <div className="relative mb-6">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5  text-white" />
            </div>
            <input
              type="text"
              placeholder="ابحث عن فيلم..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-white pr-10 pl-4 py-4 text-lg border border-none rounded-xl focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all duration-200" style={{ backgroundColor: 'var(--color-grayy)' }} />
          </div>
          <div className="md:hidden mb-4">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber-300 text-black rounded-xl hover:bg-amber-300 transition-colors duration-200 text-xl font-medium"
            >
              <Filter className="h-6 w-6 text-black" />
              <span>بحث متقدم</span>
              {activeFilters > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                  {activeFilters}
                </span>
              )}
            </button>
          </div>
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${isFilterOpen ? 'block' : 'hidden'} md:grid`}>
            <div className="relative">
              <button
                onClick={() => {
                  setGenreDropdownOpen(!genreDropdownOpen);
                  setYearDropdownOpen(false);
                  setCountryDropdownOpen(false);
                }}
                className="flex items-center justify-between w-full bg-white/5 text-white font-bold px-13 py-4 rounded-2xl hover:bg-yellow-300 hover:text-black transition"          >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white mx-4 hover:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4zM4 8h16M8 4v16" />
                </svg>
                <span className={selectedGenre ? 'text-white' : 'text-white'}>
                  {selectedGenre ? getGenreName(selectedGenre) : 'التصنيف'}
                </span>
                <ChevronDown className={`h-5 w-5 text-white transition-transform duration-200 ${genreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {genreDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                  <div
                    onClick={() => {
                      setSelectedGenre('');
                      setGenreDropdownOpen(false);
                    }}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 text-gray-500"
                  >
                    جميع التصنيفات
                  </div>
                  {uniqueGenres.map((genre) => (
                    <div
                      key={genre}
                      onClick={() => {
                        setSelectedGenre(genre);
                        setGenreDropdownOpen(false);
                      }}
                      className={`px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-150 ${selectedGenre === genre ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'}`}
                    >
                      {getGenreName(genre)}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => {
                  setYearDropdownOpen(!yearDropdownOpen);
                  setGenreDropdownOpen(false);
                  setCountryDropdownOpen(false);
                }}
                className="flex items-center justify-between w-full bg-white/5 text-white font-bold px-13 py-4 rounded-2xl hover:bg-yellow-300 hover:text-black transition"          >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white mx-4 hover:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10m-11 4h12M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className={selectedYear ? 'text-white' : 'text-white'}>
                  {selectedYear ? getYearName(selectedYear) : 'السنة'}
                </span>
                <ChevronDown className={`h-5 w-5 text-white transition-transform duration-200 ${yearDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {yearDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                  <div
                    onClick={() => {
                      setSelectedYear('');
                      setYearDropdownOpen(false);
                    }}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 text-gray-500"
                  >
                    جميع السنوات
                  </div>
                  {uniqueYears.map((year) => (
                    <div
                      key={year}
                      onClick={() => {
                        setSelectedYear(year);
                        setYearDropdownOpen(false);
                      }}
                      className={`px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-150 ${selectedYear === year ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'}`}
                    >
                      {getYearName(year)}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => {
                  setCountryDropdownOpen(!countryDropdownOpen);
                  setGenreDropdownOpen(false);
                  setYearDropdownOpen(false);
                }}
                className="flex items-center justify-between w-full bg-white/5 text-white font-bold px-13 py-4 rounded-2xl hover:bg-yellow-300 hover:text-black transition"          >
                <svg xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-white mx-4 hover:text-black">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c5.385 0 9.75 4.365 9.75 9.75s-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12 6.615 2.25 12 2.25z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12h19.5M12 2.25c2.485 2.27 3.75 5.77 3.75 9.75s-1.265 7.48-3.75 9.75c-2.485-2.27-3.75-5.77-3.75-9.75S9.515 4.52 12 2.25z" />
                </svg>
                <span className={selectedCountry ? 'text-white' : 'text-white'}>
                  {selectedCountry ? getCountryName(selectedCountry) : 'البلد'}
                </span>
                <ChevronDown className={`h-5 w-5 text-white transition-transform duration-200 ${countryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {countryDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                  <div
                    onClick={() => {
                      setSelectedCountry('');
                      setCountryDropdownOpen(false);
                    }}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 text-gray-500"
                  >
                    جميع البلدان
                  </div>
                  {uniqueCountries.map((country) => (
                    <div
                      key={country}
                      onClick={() => {
                        setSelectedCountry(country);
                        setCountryDropdownOpen(false);
                      }}
                      className={`px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-150 ${selectedCountry === country ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'}`}
                    >
                      {getCountryName(country)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {(activeFilters > 0 || searchTerm) && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="text-sm text-gray-600">الفلاتر النشطة:</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  <Search className="h-4 w-4 text-blue-500" />
                  {`البحث: "${searchTerm}"`}
                  <button
                    onClick={() => setSearchTerm('')}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {selectedGenre && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4zM4 8h16M8 4v16" /></svg>
                  {getGenreName(selectedGenre)}
                  <button
                    onClick={() => setSelectedGenre('')}
                    className="hover:bg-green-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {selectedYear && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 4h10m-7 4h4m-8 0h.01m6 4h2m-6 0h.01m2 4h2m-6 0h.01" /></svg>
                  {getYearName(selectedYear)}
                  <button
                    onClick={() => setSelectedYear('')}
                    className="hover:bg-purple-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {selectedCountry && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c5.385 0 9.75 4.365 9.75 9.75s-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12 6.615 2.25 12 2.25z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12h19.5M12 2.25c2.485 2.27 3.75 5.77 3.75 9.75s-1.265 7.48-3.75 9.75c-2.485-2.27-3.75-5.77-3.75-9.75S9.515 4.52 12 2.25z" /></svg>
                  {getCountryName(selectedCountry)}
                  <button
                    onClick={() => setSelectedCountry('')}
                    className="hover:bg-orange-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm hover:bg-red-200 transition-colors duration-200"
              >
                مسح جميع الفلاتر
              </button>
            </div>
          )}
        </div>
        {/* عرض قائمة الأفلام والصفحات عبر MoviesList */}
        <MoviesList
          filteredMovies={filteredMovies}
          loading={filmsLoading}
          searchTerm={searchTerm}
          clearAllFilters={clearAllFilters}
        />
      </div>
    </div>
  );
};

export default MovieFilterSection;