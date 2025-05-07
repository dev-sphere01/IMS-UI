import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SecurityQuestionService from '../../Services/SecurityQuestionService';

const SetSecurityQuestions = () => {
  const navigate = useNavigate();
  const [securityQuestions, setSecurityQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    securityQuestionId1: '',
    securityAnswer1: '',
    securityQuestionId2: '',
    securityAnswer2: ''
  });

  // Fetch security questions when component mounts
  useEffect(() => {
    const fetchSecurityQuestions = async () => {
      try {
        setLoading(true);
        const response = await SecurityQuestionService.getAllSecurityQuestions();
        setSecurityQuestions(response.questions || []);
      } catch (err) {
        console.error('Error fetching security questions:', err);
        setError('Failed to load security questions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSecurityQuestions();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validate that different questions are selected
    if (formData.securityQuestionId1 === formData.securityQuestionId2) {
      setError('Please select two different security questions');
      setLoading(false);
      return;
    }

    try {
      // Get JWT token from localStorage
      const token = localStorage.getItem('authToken');

      if (!token) {
        setError('User not authenticated. Please log in again.');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      // Get user ID from JWT token or from user data in localStorage
      // For this example, we'll assume the user ID is stored in localStorage
      // In a real app, you might decode the JWT token or get it from a user context
      const userId = localStorage.getItem('userId') || JSON.parse(localStorage.getItem('user'))?._id;

      if (!userId) {
        setError('User ID not found. Please log in again.');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      // Prepare the data according to the API requirements
      const securityData = {
        userId,
        securityQuestionId1: formData.securityQuestionId1,
        securityAnswer1: formData.securityAnswer1,
        securityQuestionId2: formData.securityQuestionId2,
        securityAnswer2: formData.securityAnswer2
      };

      // Call the API to set security questions
      const response = await SecurityQuestionService.setSecurityQuestions(securityData);

      console.log('Security questions set successfully:', response);
      setSuccess(true);

      // Get isAutoGenPass from localStorage or response
      const user = JSON.parse(localStorage.getItem('user')) || {};
      const isAutoGenPass = user.isAutoGenPass || response.userAuth?.isAutoGenPass || false;

      // Redirect to change password page after a delay
      setTimeout(() => {
        navigate('/changePassword', { state: { isAutoGenPass } });
      }, 2000);
    } catch (err) {
      console.error('Error setting security questions:', err);
      setError(err.response?.data?.message || 'Failed to set security questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-300">
      <div className="max-w-md w-full mx-auto p-6 bg-white bg-opacity-80 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Set Security Questions</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded">
            Security questions set successfully! Redirecting to change password page...
          </div>
        )}

        {loading && !securityQuestions.length ? (
          <div className="text-center py-4">Loading security questions...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="securityQuestionId1" className="block text-gray-700">
                Security Question 1<span className="text-red-500">*</span>
              </label>
              <select
                id="securityQuestionId1"
                value={formData.securityQuestionId1}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Select a question</option>
                {securityQuestions.map(question => (
                  <option key={question._id} value={question._id}>
                    {question.securityQuestion}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="securityAnswer1" className="block text-gray-700">
                Answer 1<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="securityAnswer1"
                value={formData.securityAnswer1}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="securityQuestionId2" className="block text-gray-700">
                Security Question 2<span className="text-red-500">*</span>
              </label>
              <select
                id="securityQuestionId2"
                value={formData.securityQuestionId2}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Select a question</option>
                {securityQuestions.map(question => (
                  <option key={question._id} value={question._id}>
                    {question.securityQuestion}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="securityAnswer2" className="block text-gray-700">
                Answer 2<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="securityAnswer2"
                value={formData.securityAnswer2}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${loading ? 'bg-gray-400' : 'bg-gray-500 hover:bg-gray-600'} text-white py-2 rounded-lg focus:outline-none`}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SetSecurityQuestions;
