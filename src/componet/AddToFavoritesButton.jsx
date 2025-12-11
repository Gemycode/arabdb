import React, { useState } from 'react';
import { Heart, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { favoritesService } from '../api/favoritesService';
import { toast } from 'react-toastify';

const AddToFavoritesButton = ({ 
  workId, 
  workName = "هذا العمل",
  className = "",
  size = 30,
  variant = "default" // "default", "card", "inline"
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToFavorites = async (e) => {
    e.stopPropagation();
    
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await favoritesService.addToFavoritesAndRedirect(workId, navigate, null, toast);
    } catch (error) {
      console.error('Error adding to favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Default variant - heart icon button
  if (variant === "default") {
    return (
      <button
        onClick={handleAddToFavorites}
        disabled={isLoading}
        className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white/20 hover:bg-white/30 text-amber-300 focus:ring-amber-300 ${className}`}
        title="أضف إلى المفضلة"
      >
        <Heart 
          size={size} 
          className={`${isLoading ? 'animate-pulse' : ''}`} 
        />
      </button>
    );
  }

  // Card variant - larger button with text
  if (variant === "card") {
    return (
      <button
        onClick={handleAddToFavorites}
        disabled={isLoading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors bg-white/20 text-white hover:bg-white/30 ${className}`}
      >
        <Heart size={20} className={isLoading ? 'animate-pulse' : ''} />
        <span>{isLoading ? 'جاري الإضافة...' : 'أضف للمفضلة'}</span>
      </button>
    );
  }

  // Inline variant - simple text button
  if (variant === "inline") {
    return (
      <button
        onClick={handleAddToFavorites}
        disabled={isLoading}
        className={`flex items-center gap-1 text-amber-300 hover:text-amber-400 transition-colors ${className}`}
      >
        <Plus size={16} className={isLoading ? 'animate-pulse' : ''} />
        <span>{isLoading ? 'جاري الإضافة...' : 'أضف للمفضلة'}</span>
      </button>
    );
  }

  return null;
};

export default AddToFavoritesButton;
