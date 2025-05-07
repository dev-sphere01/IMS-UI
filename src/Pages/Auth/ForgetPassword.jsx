import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../../Services/UserService';

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: Security Questions, 3: New Password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const [securityQuestions, setSecurityQuestions] = useState([]);

  const [formData, setFormData] = useState({
    email: '',
    securityAnswer1: '',
    securityAnswer2: '',
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

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate email
      if (!formData.email || !formData.email.includes('@')) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }

      // Get security questions by email
      const response = await UserService.getSecurityQuestionsByEmail(formData.email);

      // Store user ID and security questions
      setUserId(response.userId);
      setSecurityQuestions(response.securityQuestions);

      // Move to security questions step
      setStep(2);
    } catch (err) {
      console.error('Error getting security questions:', err);
      setError(err.response?.data?.message || 'User not found or security questions not set.');

      // Offer email method as fallback
      if (err.response?.status === 400 && err.response?.data?.message?.includes('not set')) {
        setError('Security questions not set for this account. Would you like to reset your password via email instead?');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSecurityQuestionsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate answers
      if (!formData.securityAnswer1 || !formData.securityAnswer2) {
        setError('Please answer both security questions');
        setLoading(false);
        return;
      }

      // Move to new password step
      setStep(3);
    } catch (err) {
      console.error('Error verifying security questions:', err);
      setError(err.response?.data?.message || 'Incorrect answers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewPasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    setSuccessMessage('');

    try {
      // Validate passwords
      if (formData.newPassword !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      if (formData.newPassword.length < 8) {
        setError('Password must be at least 8 characters long');
        setLoading(false);
        return;
      }

      // Reset password with security questions
      const response = await UserService.resetPasswordWithSecurityQuestions({
        userId,
        securityAnswer1: formData.securityAnswer1,
        securityAnswer2: formData.securityAnswer2,
        newPassword: formData.newPassword
      });

      // Handle successful response
      setSuccess(true);
      setSuccessMessage(response.message || 'Password reset successfully!');

      // Clear form
      setFormData({
        email: '',
        securityAnswer1: '',
        securityAnswer2: '',
        newPassword: '',
        confirmPassword: ''
      });

      // Redirect to login page after a delay
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      console.error('Error resetting password:', err);
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');

      // If security answers are incorrect, go back to security questions step
      if (err.response?.status === 400 && err.response?.data?.message?.includes('security answers')) {
        setStep(2);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailMethodFallback = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setSuccessMessage('');

    try {
      // Call the forgotPassword API
      const response = await UserService.forgotPassword(formData.email);

      // Handle successful response
      setSuccess(true);
      setSuccessMessage(response.message || 'Password reset email sent. Please check your email for the new password.');

      // Clear form
      setFormData({
        email: '',
        securityAnswer1: '',
        securityAnswer2: '',
        newPassword: '',
        confirmPassword: ''
      });

      // Redirect to login page after a delay
      setTimeout(() => navigate('/login'), 5000);
    } catch (err) {
      console.error('Error requesting password reset:', err);
      setError(err.response?.data?.message || 'Failed to process your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-300">
      <div className="max-w-md w-full mx-auto p-6 bg-white bg-opacity-80 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Forgot Password</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
            {error}
            {error.includes('Would you like to reset') && (
              <div className="mt-2">
                <button
                  onClick={handleEmailMethodFallback}
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Yes, send me a reset link via email
                </button>
              </div>
            )}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded">
            {successMessage || 'Password reset successfully. Redirecting to login...'}
          </div>
        )}

        {!success && step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">
                Email<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                Enter your email to retrieve your security questions.
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full ${loading ? 'bg-gray-400' : 'bg-gray-500 hover:bg-gray-600'} text-white py-2 rounded-lg focus:outline-none`}
              >
                {loading ? 'Submitting...' : 'Continue'}
              </button>
              <button
                type="button"
                onClick={handleEmailMethodFallback}
                disabled={loading || !formData.email}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
              >
                Reset via Email
              </button>
            </div>
          </form>
        )}

        {!success && step === 2 && securityQuestions.length === 2 && (
          <form onSubmit={handleSecurityQuestionsSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">
                Security Question 1<span className="text-red-500">*</span>
              </label>
              <p className="mb-2 font-medium">{securityQuestions[0]?.question}</p>
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
              <label className="block text-gray-700">
                Security Question 2<span className="text-red-500">*</span>
              </label>
              <p className="mb-2 font-medium">{securityQuestions[1]?.question}</p>
              <input
                type="text"
                id="securityAnswer2"
                value={formData.securityAnswer2}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/2 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 focus:outline-none"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`w-1/2 ${loading ? 'bg-gray-400' : 'bg-gray-500 hover:bg-gray-600'} text-white py-2 rounded-lg focus:outline-none`}
              >
                {loading ? 'Verifying...' : 'Continue'}
              </button>
            </div>
          </form>
        )}

        {!success && step === 3 && (
          <form onSubmit={handleNewPasswordSubmit}>
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
                Confirm Password<span className="text-red-500">*</span>
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
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-1/2 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 focus:outline-none"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`w-1/2 ${loading ? 'bg-gray-400' : 'bg-gray-500 hover:bg-gray-600'} text-white py-2 rounded-lg focus:outline-none`}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>
        )}

        <div className="mt-4 text-center">
          <p className="text-gray-700">
            Remember your password?{' '}
            <a href="/login" className="text-blue-500 hover:underline">
              Back to Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
