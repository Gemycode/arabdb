import React, { useState, useEffect, useMemo } from 'react';
import { Star, Play, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFilms, fetchSeries, fetchAverageRatings } from '../redux/moviesSlice';
import AddToFavoritesButton from '../componet/AddToFavoritesButton';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const MostRated = () => {
  const dispatch = useDispatch();
  const { films, series, ratings, filmsLoading, seriesLoading, ratingsLoading } = useSelector(state => state.movies);

  const [imageStates, setImageStates] = useState({});

  // Combine films and series
  const allWorks = useMemo(() => [...films, ...series], [films, series]);

  useEffect(() => {
    dispatch(fetchFilms());
    dispatch(fetchSeries());
  }, [dispatch]);

  useEffect(() => {
    if (allWorks.length > 0) {
      // Only fetch ratings for top 10 works that will be displayed
      const topWorks = allWorks.slice(0, 10);
      const workIds = topWorks.map(work => work._id);
      dispatch(fetchAverageRatings(workIds));
    }
  }, [allWorks, dispatch]);

  // Sort by rating and get top rated works
  const topRatedWorks = useMemo(() => {
    return allWorks
      .map(work => ({
        ...work,
        rating: ratings[work._id]?.average || 0,
        ratingCount: ratings[work._id]?.count || 0
      }))
      .filter(work => work.rating > 0)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);
  }, [allWorks, ratings]);

  const handleShareClick = (e, movie) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/Details/${movie._id}`;

    if (navigator.share) {
      navigator.share({
        title: movie.nameArabic,
        url: shareUrl
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('تم نسخ الرابط!');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      const isFilled = i < fullStars;
      const isHalf = i === fullStars && hasHalfStar;
      stars.push(
        <Star
          key={i}
          size={14}
          className={`fill-current transition-colors duration-200 ${isFilled ? 'text-yellow-400' : isHalf ? 'text-yellow-400 opacity-75' : 'text-gray-400'
            }`}
        />
      );
    }
    return stars;
  };

  const handleImageLoad = (movieId) => {
    setImageStates(prev => ({ ...prev, [movieId]: { loaded: true, error: false } }));
  };

  const handleImageError = (movieId, e) => {
    setImageStates(prev => ({ ...prev, [movieId]: { loaded: true, error: true } }));
    e.target.src = 'https://via.placeholder.com/300x450/1f2937/9ca3af?text=صورة+غير+متوفرة';
  };

  const isLoading = filmsLoading || seriesLoading;

  if (isLoading) {
    return (
      <div className="bg-background p-8 w-full flex items-center justify-center" dir="rtl">
        <div className="w-12 h-12 border-4 border-amber-300/20 border-t-amber-300 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-background p-8 w-full" dir="rtl">
      <Swiper
        style={{ width: "100%", height: "100%" }}
        modules={[Navigation, Pagination]}
        spaceBetween={10}
        slidesPerView={2}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          320: { slidesPerView: 2, spaceBetween: 8 },
          480: { slidesPerView: 2, spaceBetween: 10 },
          640: { slidesPerView: 3, spaceBetween: 12 },
          768: { slidesPerView: 3, spaceBetween: 15 },
          1024: { slidesPerView: 4, spaceBetween: 18 },
          1280: { slidesPerView: 5, spaceBetween: 20 }
        }}
      >
        {topRatedWorks.map((movie, index) => {
          const imageState = imageStates[movie._id] || { loaded: false, error: false };
          return (
            <SwiperSlide key={index} style={{ paddingBottom: `60px` }}>
              <div
                className="group card-hover bg-card border border-white/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md hover:shadow-amber-300/100 hover:-translate-y-2 text-white w-full max-w-[180px] sm:max-w-[200px] md:max-w-[240px] lg:max-w-[260px] xl:max-w-[280px] mx-auto z-10"
                style={{ backgroundColor: 'var(--color-dark)' }}
              >
                <div className="block cursor-pointer" role="button">
                  <div className="relative aspect-[2/3] overflow-hidden">
                    {!imageState.loaded && !imageState.error && (
                      <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                      </div>
                    )}
                    <img
                      className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${imageState.loaded ? 'opacity-100' : 'opacity-0'}`}
                      src={movie.posterUrl || movie.posterImage?.url || 'https://via.placeholder.com/400x600?text=No+Image'}
                      width={300}         // أبعاد ثابتة
                      height={450}        // أبعاد ثابتة
                      loading="eager"     // لو هذه صورة LCP أساسية
                      onLoad={() => handleImageLoad(movie._id)}
                      onError={(e) => handleImageError(movie._id, e)}
                    />

                    <div className="absolute top-2 right-2 bg-amber-300 backdrop-blur-sm rounded-lg px-2 text-black font-extrabold py-1 transition-all duration-300 group-hover:bg-amber-400">
                      <span className="text-primary-foreground text-xs font-medium">{movie?.genre}</span>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 sm:gap-4 md:gap-6">
                        <Link to={`/Details/${movie._id}`}>
                          <button className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2">
                            <Play size={24} className="fill-current sm:w-[30px] sm:h-[30px]" />
                          </button>
                        </Link>

                        <AddToFavoritesButton workId={movie._id} />

                        <button
                          onClick={(e) => handleShareClick(e, movie)}
                          className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white/20 hover:bg-white/30 text-blue-700 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                        >
                          <Share2 size={24} className="sm:w-[30px] sm:h-[30px]" />
                        </button>
                      </div>
                    </div>

                    {movie.rating > 0 && (
                      <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm rounded-lg px-2 py-1 transition-all duration-300 group-hover:bg-primary/90">
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <Star
                            size={12}
                            className="lucide lucide-star fill-current text-yellow-400 group-hover:text-primary-foreground transition-colors duration-300"
                            aria-hidden="true"
                          />
                          <span className="text-white text-xs font-medium group-hover:text-primary-foreground transition-colors duration-300">
                            {movie.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                    <div>
                      <h3 className="font-bold text-foreground text-base sm:text-lg md:text-xl lg:text-2xl line-clamp-2 group-hover:text-primary transition-colors duration-300">
                        {movie?.nameArabic}
                      </h3>
                      <p className="text-muted-foreground text-xs sm:text-sm mt-1 ltr transition-colors duration-300 group-hover:text-muted-foreground/80 line-clamp-1">
                        {movie?.nameEnglish}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-amber-300 space-x-1 space-x-reverse">
                        {ratingsLoading ? (
                          <div className="animate-pulse bg-gray-600 h-3 sm:h-4 w-12 sm:w-16 rounded"></div>
                        ) : movie.rating > 0 ? (
                          <>
                            {renderStars(movie.rating)}
                            <span className="text-xs sm:text-sm mr-1 sm:mr-2 text-white transition-colors duration-300">
                              ({movie.rating.toFixed(1)} - {movie.ratingCount})
                            </span>
                          </>
                        ) : (
                          <span className="text-xs sm:text-sm mr-1 sm:mr-2 text-gray-400 transition-colors duration-300">
                            لا توجد تقييمات
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default MostRated;
