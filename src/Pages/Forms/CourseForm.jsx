import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaSave, FaTimes } from 'react-icons/fa';
import CourseService from '../../Services/CourseService';
import FormCard from '../../components/forms/FormCard';

const CourseForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get course ID from URL if editing
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    centerCode: '',
    courseName: '',
    fee: '',
    description: '',
    duration: '',
    isActive: true
  });

  const [errors, setErrors] = useState({});

  // Fetch course data if in edit mode
  useEffect(() => {
    const fetchCourseData = async () => {
      if (id) {
        setIsEditMode(true);
        setLoading(true);
        try {
          const courseData = await CourseService.getCourseById(id);
          setFormData({
            centerCode: courseData.centerCode || '',
            courseName: courseData.courseName || '',
            fee: courseData.fee || '',
            description: courseData.description || '',
            duration: courseData.duration || '',
            isActive: courseData.isActive !== undefined ? courseData.isActive : true
          });
        } catch (error) {
          console.error('Error fetching course data:', error);
          setError('Failed to load course data. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCourseData();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? checked : value
    });

    // Clear error for this field when user starts typing
    if (errors[id]) {
      setErrors({
        ...errors,
        [id]: null
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.centerCode.trim()) {
      newErrors.centerCode = 'Center code is required';
    }

    if (!formData.courseName.trim()) {
      newErrors.courseName = 'Course name is required';
    }

    if (!formData.fee) {
      newErrors.fee = 'Fee is required';
    } else if (isNaN(formData.fee) || parseFloat(formData.fee) < 0) {
      newErrors.fee = 'Fee must be a valid positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare data for API
      const courseData = {
        ...formData,
        fee: parseFloat(formData.fee)
      };

      let response;
      if (isEditMode) {
        // Update existing course
        response = await CourseService.updateCourse(id, courseData);
        console.log('Course updated successfully:', response);
        setSuccess(true);
      } else {
        // Create new course
        response = await CourseService.createCourse(courseData);
        console.log('Course created successfully:', response);
        setSuccess(true);

        // Reset form after successful creation
        setFormData({
          centerCode: '',
          courseName: '',
          fee: '',
          description: '',
          duration: '',
          isActive: true
        });
      }

      // Redirect to home page after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error submitting course form:', error);
      setError(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} course. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel button
  const handleCancel = () => {
    // Navigate to the home page
    navigate('/');
  };

  return (
    <div className="p-8">
      <div className="max-w-3xl w-full mx-auto p-6 bg-white rounded-xl shadow-lg border border-purple-100">
        <div className="flex items-center mb-6">
          <FaGraduationCap className="text-purple-600 text-3xl mr-3" />
          <h2 className="text-2xl font-semibold text-gray-800">{isEditMode ? 'Edit Course' : 'Add New Course'}</h2>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
            <p>Course {isEditMode ? 'updated' : 'created'} successfully!</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <FormCard title="Course Details">
            <div className="flex space-x-4">
              <div className="mb-4 flex-1">
                <label htmlFor="centerCode" className="block text-gray-700">
                  Center Code<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="centerCode"
                  value={formData.centerCode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                  required
                />
                {errors.centerCode && <p className="text-red-500 text-sm mt-1">{errors.centerCode}</p>}
              </div>
              <div className="mb-4 flex-1">
                <label htmlFor="courseName" className="block text-gray-700">
                  Course Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="courseName"
                  value={formData.courseName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                  required
                />
                {errors.courseName && <p className="text-red-500 text-sm mt-1">{errors.courseName}</p>}
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="mb-4 flex-1">
                <label htmlFor="fee" className="block text-gray-700">
                  Course Fee<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="fee"
                  value={formData.fee}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                  min="0"
                  required
                />
                {errors.fee && <p className="text-red-500 text-sm mt-1">{errors.fee}</p>}
              </div>
              <div className="mb-4 flex-1">
                <label htmlFor="duration" className="block text-gray-700">
                  Duration
                </label>
                <input
                  type="text"
                  id="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 3 months"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-gray-700">Active Course</span>
              </label>
            </div>
          </FormCard>

          <div className="flex justify-end space-x-4 mt-6">
            <motion.button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              <FaTimes className="mr-2" /> Cancel
            </motion.button>
            <motion.button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center">
                  <FaSave className="mr-2" /> {isEditMode ? 'Update Course' : 'Save Course'}
                </span>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;