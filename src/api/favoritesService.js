import { axiosInstance } from './axiosInstance';

// Local storage key for favorites (fallback only)
const FAVORITES_KEY = 'user_favorites';

// Helper function to get favorites from localStorage
const getLocalFavorites = () => {
    try {
        const favorites = localStorage.getItem(FAVORITES_KEY);
        return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
        console.error('Error reading favorites from localStorage:', error);
        return [];
    }
};

// Helper function to save favorites to localStorage
const saveLocalFavorites = (favorites) => {
    try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
        console.error('Error saving favorites to localStorage:', error);
    }
};

export const favoritesService = {
    // Add work to favorites
    addToFavorites: async (workId) => {
        try {
            const response = await axiosInstance.post('/users/favorites', { workId });
            return response.data;
        } catch (error) {
            console.error('Error adding to favorites:', error);

            // Fallback to localStorage if API fails
            if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
                console.log('API not available, using localStorage for favorites');
                const favorites = getLocalFavorites();

                if (favorites.some(fav => fav.workId === workId)) {
                    throw new Error('Already in favorites');
                }

                favorites.push({
                    workId,
                    addedAt: new Date().toISOString()
                });

                saveLocalFavorites(favorites);
                return { success: true, workId };
            }

            throw error;
        }
    },

    // Remove work from favorites
    removeFromFavorites: async (workId) => {
        try {
            const response = await axiosInstance.delete(`/users/favorites/${workId}`);
            return response.data;
        } catch (error) {
            console.error('Error removing from favorites:', error);

            // Fallback to localStorage if API fails
            if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
                console.log('API not available, using localStorage for favorites');
                const favorites = getLocalFavorites();
                const filtered = favorites.filter(fav => fav.workId !== workId);
                saveLocalFavorites(filtered);
                return { success: true, workId };
            }

            throw error;
        }
    },

    // Toggle favorite status
    toggleFavorite: async (workId, currentStatus) => {
        try {
            if (currentStatus) {
                return await favoritesService.removeFromFavorites(workId);
            } else {
                return await favoritesService.addToFavorites(workId);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            throw error;
        }
    },

    // Check if work is in favorites
    checkeStatus: async (workId) => {
        try {
            // Get all favorites and check if workId exists
            const response = await axiosInstance.get('/users/favorites');
            const favorites = response.data.favorites || response.data || [];
            const isFavorite = favorites.some(fav =>
                (fav._id === workId || fav.workId === workId || fav.work?._id === workId)
            );
            return { isFavorite };
        } catch (error) {
            console.error('Error checking favorite status:', error);

            // Fallback to localStorage if API fails
            if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
                const favorites = getLocalFavorites();
                const isFavorite = favorites.some(fav => fav.workId === workId);
                return { isFavorite };
            }

            return { isFavorite: false };
        }
    },

    // Get all user favorites with full work details
    getFavorites: async () => {
        try {
            const response = await axiosInstance.get('/users/favorites');

            // Handle different response formats
            if (response.data.favorites) {
                return { favorites: response.data.favorites };
            } else if (Array.isArray(response.data)) {
                return { favorites: response.data };
            } else {
                return { favorites: [] };
            }
        } catch (error) {

            // Fallback to localStorage if API fails
            if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
                const localFavorites = getLocalFavorites();

                if (localFavorites.length === 0) {
                    return { favorites: [] };
                }

                // Fetch full details for each favorite work
                const worksPromises = localFavorites.map(async (fav) => {
                    try {
                        const response = await axiosInstance.get(`/works/public/${fav.workId}`);
                        return response.data;
                    } catch (error) {
                        console.error(`Error fetching work ${fav.workId}:`, error);
                        return null;
                    }
                });

                const works = await Promise.all(worksPromises);
                const validWorks = works.filter(work => work !== null);

                return { favorites: validWorks };
            }

            throw error;
        }
    },

    // Alias for backward compatibility
    getes: async () => {
        return favoritesService.getFavorites();
    },

    // Add to favorites and redirect to profile
    addToFavoritesAndRedirect: async (workId, navigate, workName = null, toast = null) => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                if (toast) {
                    toast.error('يجب تسجيل الدخول أولاً');
                } else {
                    alert('يجب تسجيل الدخول لإضافة الأعمال إلى المفضلة');
                }
                navigate('/login');
                return;
            }

            // Check if already in favorites
            const statusCheck = await favoritesService.checkeStatus(workId);

            if (statusCheck.isFavorite) {
                if (toast) {
                    toast.info('هذا العمل موجود بالفعل في المفضلة');
                } else {
                    alert('هذا العمل موجود بالفعل في قائمة المفضلة');
                }
                navigate('/profile');
                return;
            }

            // Add to favorites
            const result = await favoritesService.addToFavorites(workId);

            if (toast) {
                toast.success('تم إضافة العمل إلى المفضلة بنجاح!');
            }

            // Redirect to profile with success parameter
            navigate('/profile?added=true');

        } catch (error) {
            console.error('Error in addToFavoritesAndRedirect:', error);

            if (error.response?.status === 401) {
                if (toast) {
                    toast.error('يجب تسجيل الدخول أولاً');
                } else {
                    alert('يجب تسجيل الدخول لإضافة الأعمال إلى المفضلة');
                }
                navigate('/login');
            } else if (error.message === 'Already in favorites') {
                if (toast) {
                    toast.info('هذا العمل موجود بالفعل في المفضلة');
                } else {
                    alert('هذا العمل موجود بالفعل في قائمة المفضلة');
                }
                navigate('/profile');
            } else {
                if (toast) {
                    toast.error('حدث خطأ أثناء إضافة العمل إلى المفضلة');
                } else {
                    alert('حدث خطأ أثناء إضافة العمل إلى المفضلة. يرجى المحاولة مرة أخرى.');
                }
            }
            throw error;
        }
    },

    // Clear all favorites (utility function)
    clearAllFavorites: () => {
        localStorage.removeItem(FAVORITES_KEY);
    }
};

export default favoritesService;
