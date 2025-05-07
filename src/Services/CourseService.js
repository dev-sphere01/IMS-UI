import axios from 'axios';

const API_URL = 'http://localhost:4000/api/v1/course';

class CourseService {
  // Create a new course
  static async createCourse(courseData) {
    try {
      const response = await axios.post(API_URL, courseData);
      return response.data;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  }

  // Get all courses
  static async getAllCourses() {
    try {
      const response = await axios.get(API_URL);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  }

  // Get a course by ID
  static async getCourseById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching course with ID ${id}:`, error);
      throw error;
    }
  }

  // Update a course
  static async updateCourse(id, courseData) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, courseData);
      return response.data;
    } catch (error) {
      console.error(`Error updating course with ID ${id}:`, error);
      throw error;
    }
  }

  // Delete a course
  static async deleteCourse(id) {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting course with ID ${id}:`, error);
      throw error;
    }
  }
}

export default CourseService;
