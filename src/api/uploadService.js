import { axiosInstance } from './axiosInstance';

export const uploadService = {
  uploadImage: async (file) => {
    if (!file) throw new Error('No file provided');
    const fd = new FormData();
    fd.append('image', file);
    const response = await axiosInstance.post('/upload/image', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data?.data || response.data;
  }
};
