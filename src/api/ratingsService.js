import { axiosInstance } from './axiosInstance';

export const ratingsService = {
    // Get user's ratings (all works rated by the user)
    getUserRatings: async () => {
        try {
            const response = await axiosInstance.get('/ratings/my-ratings');
            return response.data;
        } catch (error) {
            // If the endpoint doesn't exist (404), return empty array
            if (error.response?.status === 404) {
                console.log('Ratings endpoint not available yet');
                return [];
            }
            console.error('Error fetching user ratings:', error);
            return [];
        }
    },

    // Get user's rating for a specific work
    getUserRatingForWork: async (workId) => {
        try {
            const response = await axiosInstance.get(`/ratings/user/${workId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user rating for work:', error);
            throw error;
        }
    },

    // Get average rating for a work
    getAverageRating: async (workId) => {
        try {
            const response = await axiosInstance.get(`/ratings/average/${workId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching average rating:', error);
            throw error;
        }
    },

    // Submit a rating
    submitRating: async (workId, ratingValue) => {
        try {
            const response = await axiosInstance.post('/ratings', {
                workId,
                ratingValue
            });
            return response.data;
        } catch (error) {
            console.error('Error submitting rating:', error);
            throw error;
        }
    },

    // Update a rating
    updateRating: async (workId, ratingValue) => {
        try {
            const response = await axiosInstance.put(`/ratings/${workId}`, {
                ratingValue
            });
            return response.data;
        } catch (error) {
            console.error('Error updating rating:', error);
            throw error;
        }
    },

    // Delete a rating
    deleteRating: async (workId) => {
        try {
            const response = await axiosInstance.delete(`/ratings/${workId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting rating:', error);
            throw error;
        }
    }
};

export default ratingsService;
