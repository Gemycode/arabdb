import React, { useState, useEffect, useCallback } from 'react';
import SeriesFilterSection from './SeriesFilterSection';
import Navbar from '../componet/Navbar';
import Footer from '../componet/Footer';
import { useLocation } from 'react-router-dom';


const useSeriesFilters = () => {
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
        setFilters(prev => ({ ...prev, [key]: value }));
    }, []);
    const clearAllFilters = useCallback(() => {
        setFilters({ search: '', genre: '', year: '', country: '' });
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

const EnhancedSeriesFilterSection = () => {
    const {
        filters,
        updateFilter,
        clearAllFilters,
        getActiveFiltersCount,
        rawSearch,
        setFilters
    } = useSeriesFilters();

    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get('q') || '';
        if (q) {
            setFilters(prev => ({ ...prev, search: q }));
        }
    }, [location.search, setFilters]);

    return (
        <div className="min-h-screen bg-black">
            <Navbar />
            <SeriesFilterSection
                filters={filters}
                rawSearch={rawSearch}
                updateFilter={updateFilter}
                clearAllFilters={clearAllFilters}
                getActiveFiltersCount={getActiveFiltersCount}
            />
            <Footer />
        </div>
    );
};

export default EnhancedSeriesFilterSection;
