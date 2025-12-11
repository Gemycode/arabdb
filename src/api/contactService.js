import { axiosInstance } from './axiosInstance';

export const contactService = {
    sendContactForm: async (data) => {
        try {
            const response = await axiosInstance.post('/contact', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getAllMessages: async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {}
            };
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            const response = await axiosInstance.get('/contact', config);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getMessageById: async (id) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {}
            };
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            const response = await axiosInstance.get(`/contact/${id}`, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    markAsRead: async (id) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {}
            };
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            const response = await axiosInstance.patch(`/contact/${id}/read`, {}, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    deleteMessage: async (id) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {}
            };
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            const response = await axiosInstance.delete(`/contact/${id}`, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
