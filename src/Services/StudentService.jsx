// StudentService.jsx - Service for student-related API calls
import API from './Api';

const StudentService = {
  // Get all students
  getAllStudents: async () => {
    try {
      const response = await API.get('/studentDetails/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching all students:', error);
      throw error;
    }
  },

  // Get student by ID
  getStudentById: async (id) => {
    try {
      const response = await API.get(`/studentDetails/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching student with ID ${id}:`, error);
      throw error;
    }
  },

  // Get student by registration number
  getStudentByRegNo: async (regNo) => {
    try {
      console.log(`Fetching student with registration number: ${regNo}`);
      // First try to find by generatedRegNo
      const response = await API.get(`/studentDetails/regNo/${regNo}`);
      console.log('Student found by registration number:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching student with registration number ${regNo}:`, error);
      throw error;
    }
  },

  // Create new student (admission form submission)
  createStudent: async (studentData) => {
    try {
      console.log('Sending student data to API:', studentData);
      const response = await API.post('/studentDetails/create', studentData);
      console.log('API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  },



  // Update student
  updateStudent: async (id, studentData) => {
    try {
      // Validate ID before making the request
      if (!id || id === 'undefined' || id === undefined) {
        console.error('Invalid student ID for update:', id);
        throw new Error('Invalid student ID. Cannot update record.');
      }

      console.log(`Updating student with ID: ${id}`);
      console.log('Update data:', studentData);

      const response = await API.put(`/studentDetails/${id}`, studentData);
      console.log('Update response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating student with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete student
  deleteStudent: async (id) => {
    try {
      const response = await API.delete(`/studentDetails/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting student with ID ${id}:`, error);
      throw error;
    }
  }
};

export default StudentService;
