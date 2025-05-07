// SecurityQuestionService.jsx - Service for security question-related API calls
import API from './Api';

const SecurityQuestionService = {
  /**
   * Get all available security questions
   * @returns {Promise} Promise object representing the API response
   */
  getAllSecurityQuestions: async () => {
    try {
      const response = await API.get('/createSecurityQuestion');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get a specific security question by ID
   * @param {string} id - The ID of the security question
   * @returns {Promise} Promise object representing the API response
   */
  getSecurityQuestionById: async (id) => {
    try {
      const response = await API.get(`/createSecurityQuestion/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Set security questions for a user
   * @param {Object} securityData - Object containing security question data
   * @param {string} securityData.userId - User ID
   * @param {string} securityData.securityQuestionId1 - ID of the first security question
   * @param {string} securityData.securityAnswer1 - Answer to the first security question
   * @param {string} securityData.securityQuestionId2 - ID of the second security question
   * @param {string} securityData.securityAnswer2 - Answer to the second security question
   * @returns {Promise} Promise object representing the API response
   */
  setSecurityQuestions: async (securityData) => {
    try {
      const response = await API.post('/user/setSecurityQuestions', securityData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Verify security questions for a user
   * @param {Object} verificationData - Object containing verification data
   * @param {string} verificationData.userId - User ID
   * @param {string} verificationData.securityAnswer1 - Answer to the first security question
   * @param {string} verificationData.securityAnswer2 - Answer to the second security question
   * @returns {Promise} Promise object representing the API response
   */
  verifySecurityQuestions: async (verificationData) => {
    try {
      const response = await API.post('/user/verifySecurityQuestions', verificationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new security question (admin function)
   * @param {Object} questionData - Object containing the question data
   * @param {string} questionData.securityQuestion - The security question text
   * @returns {Promise} Promise object representing the API response
   */
  createSecurityQuestion: async (questionData) => {
    try {
      const response = await API.post('/createSecurityQuestion', questionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default SecurityQuestionService;