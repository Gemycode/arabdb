import { axiosInstance } from './axiosInstance';

export const commentService = {
  // Get comments for a specific work
  getCommentsForWork: async (workId) => {
    try {
      const response = await axiosInstance.get(`/comments/work/${workId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  // Add a new comment
  addComment: async (workId, commentText) => {
    try {
      const response = await axiosInstance.post('/comments', {
        workId,
        commentText
      });
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  // Delete a comment (admin only)
  deleteComment: async (commentId) => {
    try {
      const response = await axiosInstance.delete(`/comments/${commentId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  },

  // Get all comments (admin only)
  getAllComments: async () => {
    try {
      const response = await axiosInstance.get('/comments/admin');
      return response.data;
    } catch (error) {
      console.error('Error fetching all comments:', error);
      throw error;
    }
  }
};
