import React, { useState } from 'react';
import { Star, Play, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FavoriteButton from './FavoriteButton';

const MediaCard = ({ 
  work, 
  onFavoriteChange, 
  showFavoriteButton = true,
  className = "" 
}) => {
  const navigate = useNavigate();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleCardClick = () => {
    navigate(`/details/${work._id}`);
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/details/${work._id}`;
    
    if (navigator.share) {
      navigator.share({
        title: work.nameArabic,
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
          className={`lucide lucide-star fill-current text-primary transition-colors duration-200 ${
            isFilled ? '' : isHalf ? 'opacity-75' : 'opacity-50'
          }`}
        />
      );
    }

    return stars;
  };

  const handleFavoriteStatusChange = (newStatus, response) => {
    if (onFavoriteChange) {
      onFavoriteChange(work._id, newStatus, response);
    }
  };

  return (
    <div className={`group card-hover bg-card border text-3xl border-white/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md hover:shadow-amber-300/100 hover:-translate-y-10 text-white ${className}`} style={{ backgroundColor: 'var(--color-dark)' }}>
      <div
        className="block cursor-pointer"
        role="button"
        aria-label={`مشاهدة ${work.nameArabic}`}
        onClick={handleCardClick}
      >
        <div className="relative aspect-[2/3] overflow-hidden">
          {!isImageLoaded && !imageError && (
            <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
          )}
          <img
            alt={work.nameArabic}
            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            src={work.posterUrl || 'https://via.placeholder.com/300x450/1f2937/9ca3af?text=صورة+غير+متوفرة'}
            onLoad={() => setIsImageLoaded(true)}
            onError={(e) => {
              setImageError(true);
              e.target.src = 'https://via.placeholder.com/300x450/1f2937/9ca3af?text=صورة+غير+متوفرة';
            }}
          />

          <div className="absolute top-2 right-2 bg-amber-300 backdrop-blur-sm rounded-lg px-3 text-black font-extrabold py-1 transition-all duration-300 group-hover:bg-amber-400">
            <span className="text-primary-foreground text-base font-bold">
              {work.type === 'film' ? 'فيلم' : 'مسلسل'}
            </span>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-6">
              <button className="w-12 h-12 flex items-center justify-center bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2">
                <Play size={30} className="fill-current" />
              </button>

              {showFavoriteButton && (
                <FavoriteButton
                  workId={work._id}
                  onStatusChange={handleFavoriteStatusChange}
                />
              )}

              <button
                onClick={handleShareClick}
                className="w-12 h-12 flex items-center justify-center bg-white/20 hover:bg-white/30 text-blue-700 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
              >
                <Share2 size={30} />
              </button>
            </div>
          </div>

          {work.rating && (
            <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm rounded-lg px-2 py-1 transition-all duration-300 group-hover:bg-primary/90">
              <div className="flex items-center space-x-1 space-x-reverse">
                <Star
                  size={12}
                  className="lucide lucide-star fill-current text-primary group-hover:text-primary-foreground transition-colors duration-300"
                  aria-hidden="true"
                />
                <span className="text-white text-xs font-medium group-hover:text-primary-foreground transition-colors duration-300">
                  {work.rating.toFixed(1)}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-bold text-foreground text-2xl line-clamp-2 group-hover:text-primary transition-colors duration-300">
              {work.nameArabic}
            </h3>
            <p className="text-muted-foreground text-sm mt-1 ltr transition-colors duration-300 group-hover:text-muted-foreground/80">
              {work.nameEnglish}
            </p>
          </div>
          
          {work.rating && (
            <div className="flex items-center justify-between">
              <div className="flex items-center text-amber-300 space-x-1 space-x-reverse">
                {renderStars(work.rating)}
                <span className="text text-xs mr-2 text-white transition-colors duration-300">
                  ({work.rating.toFixed(1)})
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaCard;
