// EnquiryService.jsx - Service for enquiry-related API calls
import API from './Api';

const EnquiryService = {
  // Get all enquiries
  getAllEnquiries: async () => {
    try {
      console.log('Fetching all enquiries from API');
      const response = await API.get('/enquiry');
      console.log('API response:', response);
      return response.data;
    } catch (error) {
      console.error('Error in getAllEnquiries:', error);
      throw error;
    }
  },

  // Search enquiries by name
  searchEnquiriesByName: async (name) => {
    try {
      console.log(`Searching enquiries with name: ${name}`);
      const response = await API.get(`/enquiry/search?name=${encodeURIComponent(name)}`);
      console.log('Search response:', response);
      return response.data;
    } catch (error) {
      console.error('Error searching enquiries by name:', error);
      throw error;
    }
  },

  // Get enquiry by ID
  getEnquiryById: async (id) => {
    try {
      const response = await API.get(`/enquiry/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new enquiry
  createEnquiry: async (enquiryData) => {
    try {
      const response = await API.post('/enquiry', enquiryData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update enquiry
  updateEnquiry: async (id, enquiryData) => {
    try {
      const response = await API.put(`/enquiry/${id}`, enquiryData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete enquiry
  deleteEnquiry: async (id) => {
    try {
      const response = await API.delete(`/enquiry/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default EnquiryService;
