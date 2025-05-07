// UserService.jsx - Service for user-related API calls
import API from './Api';

// User authentication and management functions
const UserService = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await API.post('/user/login', credentials);
      // Store token and user data in localStorage if login successful
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);

        // Store user data
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
          // Store user ID separately for easy access
          localStorage.setItem('userId', response.data.user._id);
        }
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Register new user
  register: async (userData) => {
    try {
      console.log('Registering user with data:', userData);
      const response = await API.post('/user/createUser', userData);
      console.log('Registration response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await API.get('/user/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await API.put('/user/me/update', userData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await API.get(`/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Update user profile by ID
  updateUserProfile: async (userId, userData) => {
    try {
      const response = await API.put(`/user/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return localStorage.getItem('authToken') ? true : false;
  },

  // Request password reset (sends email with new auto-generated password)
  forgotPassword: async (email) => {
    try {
      const response = await API.post('/user/forgotPassword', { email });
      return response.data;
    } catch (error) {
      console.error('Error requesting password reset:', error);
      throw error;
    }
  },

  // Get security questions by email
  getSecurityQuestionsByEmail: async (email) => {
    try {
      const response = await API.post('/user/getSecurityQuestionsByEmail', { email });
      return response.data;
    } catch (error) {
      console.error('Error getting security questions:', error);
      throw error;
    }
  },

  // Verify security questions for a user
  verifySecurityQuestions: async (verificationData) => {
    try {
      const response = await API.post('/user/verifySecurityQuestions', verificationData);
      return response.data;
    } catch (error) {
      console.error('Error verifying security questions:', error);
      throw error;
    }
  },

  // Set security questions
  setSecurityQuestions: async (securityData) => {
    try {
      const response = await API.post(`/user/setSecurityQuestions`, securityData);
      return response.data;
    } catch (error) {
      console.error('Error setting security questions:', error);
      throw error;
    }
  },

  // Reset password using security questions
  resetPasswordWithSecurityQuestions: async (resetData) => {
    try {
      const response = await API.post('/user/resetPasswordWithSecurityQuestions', resetData);
      return response.data;
    } catch (error) {
      console.error('Error resetting password with security questions:', error);
      throw error;
    }
  },

  // Reset password after security questions verification
  resetPassword: async (resetData) => {
    try {
      const response = await API.post('/user/resetPassword', resetData);
      return response.data;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  },

  // Change password when user is logged in
  changePassword: async (passwordData) => {
    try {
      const response = await API.post('/user/changePassword', passwordData);
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }
};

export default UserService;
