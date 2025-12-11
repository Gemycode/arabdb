import React, { useState, useEffect, useCallback } from 'react';
import MovieFilterSection from './MovieFilterSection';
import Navbar from '../componet/Navbar';
import Footer from '../componet/Footer';
import { useLocation } from 'react-router-dom';
const useMovieFilters = () => {
  const [filters, setFilters] = useState({
    search: '',
    genre: '',
    year: '',
    country: ''
  });

  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters.search]);

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({
      search: '',
      genre: '',
      year: '',
      country: ''
    });
  }, []);

  const getActiveFiltersCount = useCallback(() => {
    let count = 0;
    if (filters.genre) count++;
    if (filters.year) count++;
    if (filters.country) count++;
    return count;
  }, [filters]);

  return {
    filters: { ...filters, search: debouncedSearch },
    updateFilter,
    clearAllFilters,
    getActiveFiltersCount,
    rawSearch: filters.search,
    setFilters
  };
};

const useFilteredMovies = (movies, filters) => {
  const [filteredMovies, setFilteredMovies] = useState(movies);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      let filtered = [...movies];

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filtered = filtered.filter(movie =>
          movie.title.toLowerCase().includes(searchTerm) ||
          movie.englishTitle.toLowerCase().includes(searchTerm) ||
          movie.description.toLowerCase().includes(searchTerm)
        );
      }

      if (filters.genre) {
        filtered = filtered.filter(movie => movie.genre === filters.genre);
      }

      
      if (filters.year) {
        if (filters.year === 'older') {
          filtered = filtered.filter(movie => parseInt(movie.year) < 2020);
        } else {
          filtered = filtered.filter(movie => movie.year === filters.year);
        }
      }

      
      if (filters.country) {
        filtered = filtered.filter(movie => movie.country === filters.country);
      }

    
      filtered.sort((a, b) => {
        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }
        return parseInt(b.year) - parseInt(a.year);
      });

      setFilteredMovies(filtered);
      setIsLoading(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [movies, filters]);

  return { filteredMovies, isLoading };
};


const EnhancedMovieFilterSection = () => {
  const {
    filters,
    updateFilter,
    clearAllFilters,
    getActiveFiltersCount,
    rawSearch,
    setFilters
  } = useMovieFilters()
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    if (q) {
      setFilters(prev => ({ ...prev, search: q }));
    }
  }, [location.search, setFilters]);

  const [movies] = useState([
    {
      id: '1',
      title: 'فيلم الأكشن الكبير',
      englishTitle: 'The Great Action Movie',
      genre: 'action',
      year: '2024',
      country: 'مصر',
      description: 'فيلم مليء بالإثارة والمغامرات يجعلك على حافة مقعدك.',
      rating: 4.5,
      imageUrl: 'https://via.placeholder.com/300x450/FF5733/FFFFFF?text=Action+Movie',
    },
  
  ]);

  const { filteredMovies, isLoading } = useFilteredMovies(movies, filters);

  return (
    <div className="min-h-screen bg-black">
        <Navbar />
      <MovieFilterSection
        movies={movies}
        filteredMovies={filteredMovies}
        filters={filters}
        rawSearch={rawSearch}
        updateFilter={updateFilter}
        clearAllFilters={clearAllFilters}
        getActiveFiltersCount={getActiveFiltersCount}
        isLoading={isLoading}
      />
      <Footer />
    </div>
  );
};

export default EnhancedMovieFilterSection;

