// GoalService.jsx - Service for goal-related API calls
import API from './Api';

const GoalService = {
  // Get all goals
  getAllGoals: async () => {
    try {
      const response = await API.get('/goal');
      return response.data;
    } catch (error) {
      console.error('Error fetching goals:', error);
      throw error;
    }
  },

  // Get goal by ID
  getGoalById: async (id) => {
    try {
      const response = await API.get(`/goal/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching goal with ID ${id}:`, error);
      throw error;
    }
  },

  // Create new goal
  createGoal: async (goalData) => {
    try {
      const response = await API.post('/goal', goalData);
      return response.data;
    } catch (error) {
      console.error('Error creating goal:', error);
      throw error;
    }
  },

  // Update goal
  updateGoal: async (id, goalData) => {
    try {
      const response = await API.put(`/goal/${id}`, goalData);
      return response.data;
    } catch (error) {
      console.error(`Error updating goal with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete goal
  deleteGoal: async (id) => {
    try {
      const response = await API.delete(`/goal/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting goal with ID ${id}:`, error);
      throw error;
    }
  }
};

export default GoalService;
