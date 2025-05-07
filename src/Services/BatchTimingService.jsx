// BatchTimingService.jsx - Service for batch timing-related API calls
import API from './Api';

const BatchTimingService = {
  // Get all batch timings
  getAllBatchTimings: async () => {
    try {
      const response = await API.get('/batchTiming');
      return response.data;
    } catch (error) {
      console.error('Error fetching batch timings:', error);
      throw error;
    }
  },

  // Get batch timing by ID
  getBatchTimingById: async (id) => {
    try {
      const response = await API.get(`/batchTiming/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching batch timing with ID ${id}:`, error);
      throw error;
    }
  },

  // Create new batch timing
  createBatchTiming: async (batchTimingData) => {
    try {
      const response = await API.post('/batchTiming', batchTimingData);
      return response.data;
    } catch (error) {
      console.error('Error creating batch timing:', error);
      throw error;
    }
  },

  // Update batch timing
  updateBatchTiming: async (id, batchTimingData) => {
    try {
      const response = await API.put(`/batchTiming/${id}`, batchTimingData);
      return response.data;
    } catch (error) {
      console.error(`Error updating batch timing with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete batch timing
  deleteBatchTiming: async (id) => {
    try {
      const response = await API.delete(`/batchTiming/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting batch timing with ID ${id}:`, error);
      throw error;
    }
  }
};

export default BatchTimingService;
