import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLatestMovies, fetchLatestSeries } from '../redux/moviesSlice';
import { useNavigate } from 'react-router-dom';
import AddToFavoritesButton from '../componet/AddToFavoritesButton';
import './MediaSlider.css';

const MediaSlider = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { latestMovies, latestSeries, latestMoviesLoading, latestSeriesLoading } = useSelector(state => state.movies);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef(null);
  const AUTO_PLAY_DURATION = 6000;

  // Combine latest movies and series
  const sliderData = useMemo(() => {
    const movies = latestMovies.slice(0, 3).map(movie => ({
      id: movie._id,
      title: movie.nameArabic,
      description: movie.summary || 'لا يوجد وصف متاح حالياً لهذا العمل السينمائي.',
      imageUrl: movie.posterUrl || movie.posterImage?.url,
      type: 'movie',
      year: movie.year,
      duration: movie.duration || 'غير محدد',
      rating: movie.rating || 0,
      genre: movie.genre || 'غير محدد',
      newRelease: true
    }));

    const series = latestSeries.slice(0, 3).map(serie => ({
      id: serie._id,
      title: serie.nameArabic,
      description: serie.summary || 'لا يوجد وصف متاح حالياً لهذا المسلسل.',
      imageUrl: serie.posterUrl || serie.posterImage?.url,
      type: 'series',
      year: serie.year,
      seasons: serie.seasons || 1,
      rating: serie.rating || 0,
      genre: serie.genre || 'غير محدد',
      newRelease: true
    }));

    return [...movies, ...series].sort(() => Math.random() - 0.5); // Randomize mix
  }, [latestMovies, latestSeries]);

  useEffect(() => {
    dispatch(fetchLatestMovies());
    dispatch(fetchLatestSeries());
  }, [dispatch]);

  // Auto-play logic with progress bar
  useEffect(() => {
    if (isAutoPlaying && sliderData.length > 0 && !isTransitioning) {
      const startTime = Date.now();
      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const newProgress = (elapsed / AUTO_PLAY_DURATION) * 100;

        if (newProgress >= 100) {
          handleSlideChange((currentSlide + 1) % sliderData.length);
          setProgress(0);
        } else {
          setProgress(newProgress);
          progressInterval.current = requestAnimationFrame(updateProgress);
        }
      };

      progressInterval.current = requestAnimationFrame(updateProgress);

      return () => {
        if (progressInterval.current) cancelAnimationFrame(progressInterval.current);
      };
    } else {
      setProgress(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAutoPlaying, currentSlide, sliderData.length, isTransitioning]);

  const handleSlideChange = (newIndex) => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentSlide(newIndex);
    setProgress(0);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
  };

  const nextSlide = () => {
    handleSlideChange((currentSlide + 1) % sliderData.length);
  };

  const prevSlide = () => {
    handleSlideChange((currentSlide - 1 + sliderData.length) % sliderData.length);
  };

  const goToSlide = (index) => {
    if (index !== currentSlide) {
      handleSlideChange(index);
    }
  };

  const isLoading = latestMoviesLoading || latestSeriesLoading;

  if (isLoading || sliderData.length === 0) {
    return (
      <div className="relative w-full h-[80vh] flex items-center justify-center bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 animate-pulse"></div>
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
          <p className="text-amber-500 font-medium animate-pulse">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  const currentItem = sliderData[currentSlide];

  return (
    <div
      className="relative w-full h-[85vh] overflow-hidden bg-gray-900 group"
      style={{ fontFamily: "'Cairo', sans-serif" }}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Image with Ken Burns Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          key={currentItem.id}
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-out scale-110 animate-ken-burns"
          style={{ backgroundImage: `url(${currentItem.imageUrl || currentItem.posterImage?.url || 'https://via.placeholder.com/400x600?text=No+Image'})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/40 to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="absolute inset-0 flex items-center px-4 sm:px-8 lg:px-16 z-20">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Text Content (Right Side for Arabic) */}
          <div className={`flex flex-col items-start text-right space-y-6 transform transition-all duration-700 ${isTransitioning ? 'translate-y-10 opacity-0' : 'translate-y-0 opacity-100'}`}>

            {/* Badges */}
            <div className="flex flex-wrap gap-3">
              <span className={`px-4 py-1.5 rounded-lg text-sm font-bold shadow-lg backdrop-blur-md ${currentItem.type === 'movie'
                ? 'bg-amber-500 text-black'
                : 'bg-purple-600 text-white'
                }`}>
                {currentItem.type === 'movie' ? 'فيلم' : 'مسلسل'}
              </span>
              {currentItem.newRelease && (
                <span className="px-4 py-1.5 rounded-lg text-sm font-bold bg-red-600 text-white shadow-lg backdrop-blur-md flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  جديد
                </span>
              )}
              <span className="px-4 py-1.5 rounded-lg text-sm font-bold bg-white/10 text-white border border-white/20 backdrop-blur-md flex items-center gap-1">
                <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                {currentItem.rating.toFixed(1)}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight drop-shadow-2xl">
              {currentItem.title}
            </h1>


            <div className="flex items-center gap-6 text-gray-300 text-sm md:text-base font-medium">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                {currentItem.year}
              </span>
              <span className="w-1.5 h-1.5 bg-gray-600 rounded-full"></span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {currentItem.type === 'movie' ? currentItem.duration : `${currentItem.seasons} مواسم`}
              </span>
              <span className="w-1.5 h-1.5 bg-gray-600 rounded-full"></span>
              <span className="text-amber-400">{currentItem.genre}</span>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl line-clamp-3">
              {currentItem.description}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => navigate(`/Details/${currentItem.id}`)}
                className="flex items-center gap-3 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                التفاصيل
              </button>

              <div className="transform hover:scale-105 transition-all">
                <AddToFavoritesButton
                  workId={currentItem.id}
                  workName={currentItem.title}
                  variant="card"
                  className="!bg-white/10 !hover:bg-white/20 !border !border-white/10 !backdrop-blur-md !px-8 !py-4 !rounded-xl !h-auto !text-lg !font-bold"
                />
              </div>
            </div>
          </div>

          {/* Thumbnails / Next Items (Hidden on mobile) */}
          <div className="hidden lg:flex flex-col gap-4 items-end justify-center pl-8">
            {sliderData.map((item, index) => {
              // Show only next 3 items
              if (index === currentSlide) return null;
              const isNext = index === (currentSlide + 1) % sliderData.length;
              const isNextNext = index === (currentSlide + 2) % sliderData.length;

              if (!isNext && !isNextNext) return null;

              return (
                <div
                  key={item.id}
                  onClick={() => goToSlide(index)}
                  className={`relative w-64 h-36 rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 transform hover:scale-105 border-2 ${isNext ? 'border-amber-500/50' : 'border-transparent'}`}
                >
                  <img
                    src={
                      item.imageUrl ||
                      item.posterUrl ||
                      item.posterImage?.url ||
                      'https://via.placeholder.com/200x300?text=No+Image'
                    }

                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors flex flex-col justify-end p-4">
                    <span className="text-white font-bold truncate">{item.title}</span>
                    <span className="text-gray-400 text-xs flex items-center gap-1">
                      <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      {item.rating}
                    </span>
                  </div>
                  {isNext && isAutoPlaying && (
                    <div className="absolute bottom-0 left-0 h-1 bg-amber-500 z-10" style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all transform hover:scale-110 border border-white/10 group"
      >
        <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all transform hover:scale-110 border border-white/10 group"
      >
        <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>

      {/* Bottom Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        {sliderData.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${index === currentSlide
              ? 'w-8 h-2 bg-amber-500'
              : 'w-2 h-2 bg-white/30 hover:bg-white/50'
              }`}
          />
        ))}
      </div>
    </div>
  );
};

export default MediaSlider;
