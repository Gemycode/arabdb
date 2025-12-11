import { axiosInstance } from './axiosInstance';

export const userService = {
    updateProfileImage: async (formData) => {
        try {
            const response = await axiosInstance.patch('/users/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
