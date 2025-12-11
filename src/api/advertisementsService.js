import { axiosInstance } from './axiosInstance';
import axios from 'axios';
const advertisementsService = {
    /**
     * Create a new advertisement (admin only)
     * @param {FormData} formData - Form data with name, mediaType, and media file
     * @returns {Promise} Advertisement data
     */
    createAdvertisement: async (formData) => {
        const response = await axiosInstance.post('/advertisements', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    /**
     * Get all advertisements (admin only)
     * @returns {Promise} Array of advertisements
     */
    getAllAdvertisements: async () => {
        const response = await axiosInstance.get('/advertisements');
        return response.data;
    },

    /**
     * Get active advertisements (public)
     * @returns {Promise} Array of active advertisements
     */
    getActiveAdvertisements: async () => {
        const response = await axiosInstance.get('/advertisements/active');
        return response.data;
    },

    /**
     * Get a specific advertisement (admin only)
     * @param {string} id - Advertisement ID
     * @returns {Promise} Advertisement data
     */
    getAdvertisementById: async (id) => {
        const response = await axiosInstance.get(`/advertisements/${id}`);
        return response.data;
    },

    /**
     * Update an advertisement (admin only)
     * @param {string} id - Advertisement ID
     * @param {FormData} formData - Updated data
     * @returns {Promise} Updated advertisement data
     */
    updateAdvertisement: async (id, data) => {
        try {
            // Reverting to axiosInstance but explicitly setting multipart/form-data
            // This matches the successfully working createAdvertisement function
            const response = await axiosInstance.patch(`/advertisements/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error("Update advertisement error:", error.response || error);
            throw error;
        }
    },


    /**
     * Toggle advertisement active status (admin only)
     * @param {string} id - Advertisement ID
     * @returns {Promise} Updated advertisement data
     */
    toggleAdvertisement: async (id) => {
        const response = await axiosInstance.patch(`/advertisements/${id}/toggle`);
        return response.data;
    },

    /**
     * Delete an advertisement (admin only)
     * @param {string} id - Advertisement ID
     * @returns {Promise} Deletion confirmation
     */
    deleteAdvertisement: async (id) => {
        const response = await axiosInstance.delete(`/advertisements/${id}`);
        return response.data;
    },
};

export default advertisementsService;
