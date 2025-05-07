import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserService from '../../Services/UserService';

const ChangePassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Get isAutoGenPass from location state or default to false
  const isAutoGenPass = location.state?.isAutoGenPass || false;
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

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

    // Validate passwords
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      // Get user ID from localStorage
      const userId = localStorage.getItem('userId') || JSON.parse(localStorage.getItem('user'))?._id;
      
      if (!userId) {
        setError('User not authenticated. Please log in again.');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      // Prepare data for API call
      const passwordData = {
        userId,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      };

      // Call API to change password
      const response = await UserService.changePassword(passwordData);
      
      console.log('Password changed successfully:', response);
      setSuccess(true);
      
      // Clear form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Redirect to home or dashboard after a delay
      setTimeout(() => navigate('/home'), 2000);
    } catch (err) {
      console.error('Error changing password:', err);
      setError(err.response?.data?.message || 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-300">
      <div className="max-w-md w-full mx-auto p-6 bg-white bg-opacity-80 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6">
          {isAutoGenPass ? 'Set New Password' : 'Change Password'}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded">
            Password changed successfully!
          </div>
        )}
        
        {isAutoGenPass && (
          <div className="mb-4 p-3 bg-blue-100 border border-blue-300 text-blue-700 rounded">
            You are using an auto-generated password. Please set a new password for your account.
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="currentPassword" className="block text-gray-700">
              Current Password<span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-gray-700">
              New Password<span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Password must be at least 8 characters long
            </p>
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-700">
              Confirm New Password<span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
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
            {loading ? 'Changing Password...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
