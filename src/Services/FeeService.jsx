// FeeService.jsx - Service for fee-related API calls
import API from './Api';

const FeeService = {
  // Get all fees
  getAllFees: async () => {
    try {
      const response = await API.get('/fee/all');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get fee by ID
  getFeeById: async (id) => {
    try {
      const response = await API.get(`/fee/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get fees by student ID
  getFeesByStudentId: async (studentId) => {
    try {
      const response = await API.get(`/fee/student/${studentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new fee record
  createFee: async (feeData) => {
    try {
      const response = await API.post('/fee/create', feeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update fee record
  updateFee: async (id, feeData) => {
    try {
      const response = await API.put(`/fee/${id}`, feeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete fee record
  deleteFee: async (id) => {
    try {
      const response = await API.delete(`/fee/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default FeeService;
