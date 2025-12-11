import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { favoritesService } from '../api/favoritesService';

const FavoriteButton = ({ workId, initialStatus = false, onStatusChange, className = "", size = 30 }) => {
  const [isFavorite, setIsFavorite] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check initial favorite status if not provided
    if (workId && initialStatus === false) {
      checkFavoriteStatus();
    }
  }, [workId]);

  const checkFavoriteStatus = async () => {
    try {
      const response = await favoritesService.checkeStatus(workId);
      setIsFavorite(response.isFavorite);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();

    if (isLoading) return;

    setIsLoading(true);
    try {
      console.log('Toggling favorite for workId:', workId, 'current status:', isFavorite);
      const response = await favoritesService.toggleFavorite(workId, isFavorite);
      console.log('Toggle response:', response);

      setIsFavorite(!isFavorite);

      // Call the callback if provided
      if (onStatusChange) {
        onStatusChange(!isFavorite, response);
      }

      // Show success message
      const message = isFavorite ? 'تم إزالة من المفضلة' : 'تم الإضافة إلى المفضلة';
      console.log(message);

    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert the state on error
      setIsFavorite(isFavorite);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleFavoriteClick}
      disabled={isLoading}
      className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isFavorite
          ? 'bg-red-500/90 hover:bg-red-500 text-white focus:ring-red-500'
          : 'bg-white/20 hover:bg-white/30 text-amber-300 focus:ring-amber-300'
        } ${className}`}
    >
      <Heart
        size={size}
        className={`${isFavorite ? 'fill-current' : ''} ${isLoading ? 'animate-pulse' : ''}`}
      />
    </button>
  );
};

export default FavoriteButton;
