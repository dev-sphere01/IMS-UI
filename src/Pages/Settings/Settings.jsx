import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { FaSun, FaMoon, FaPalette, FaCheck, FaUser, FaKey, FaEdit, FaShieldAlt, FaEnvelope, FaSpinner } from 'react-icons/fa';
import UserService from '../../Services/UserService';

const Settings = () => {
  const navigate = useNavigate();
  const { currentTheme, theme, changeTheme, themes } = useTheme();
  const [activeTab, setActiveTab] = useState('appearance');
  const [userInfo, setUserInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isEditing, setIsEditing] = useState({
    fullName: false,
    email: false,
    phone: false
  });
  const [hasSecurityQuestions, setHasSecurityQuestions] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // In a real app, you would get the user ID from auth context or localStorage
        // For now, we'll use a placeholder ID
        const userId = localStorage.getItem('userId') || '64f8b8e077e2a0c5a7bb3fd6';
        const response = await UserService.getUserById(userId);

        if (response.success) {
          const userData = response.user;
          setUserInfo({
            fullName: userData.fullName || '',
            email: userData.email || '',
            phone: userData.phone || '',
            role: userData.role || ''
          });
          setHasSecurityQuestions(userData.hasSecurityQuestions || false);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Function to handle theme change
  const handleThemeChange = (themeName) => {
    changeTheme(themeName);
  };

  // Function to handle change password
  const handleChangePassword = () => {
    navigate('/changePassword');
  };

  // Function to toggle editing mode
  const toggleEditing = (field) => {
    setIsEditing(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Function to handle profile update
  const handleUpdateProfile = async (field) => {
    try {
      // Get the current value from the form
      const value = userInfo[field];

      // Get the user ID from localStorage
      const userId = localStorage.getItem('userId') || '64f8b8e077e2a0c5a7bb3fd6';

      // Prepare the data to update
      const updateData = { [field]: value };

      // Show loading state
      setLoading(true);

      // Call the API to update the user profile
      const response = await UserService.updateUserProfile(userId, updateData);

      if (response.success) {
        // Update the user info with the response data
        if (response.user) {
          setUserInfo(prev => ({
            ...prev,
            [field]: response.user[field] || value
          }));
        }

        // Exit editing mode
        toggleEditing(field);

        // Show success message
        setError(null);
        setSuccessMessage(`${field === 'fullName' ? 'Name' : field} updated successfully!`);

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      }
    } catch (err) {
      console.error(`Error updating ${field}:`, err);
      setError(`Failed to update ${field}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle input change
  const handleInputChange = (field, value) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="flex-1 p-8">
      <h1 className={`text-3xl font-bold ${theme.colors.text.light} drop-shadow-md mb-2`}>
        IMS Settings
      </h1>
      <h2 className={`text-xl font-semibold ${theme.colors.text.light} drop-shadow-md mb-8`}>
        Customize your experience
      </h2>

      <div className={`${theme.isDark ? 'bg-gray-800' : 'bg-white'} bg-opacity-90 p-6 rounded-xl shadow-md`}>
        {/* Settings Tabs */}
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'appearance'
              ? `${theme.colors.text.primary} border-b-2 ${theme.isDark ? 'border-white' : `border-${theme.primary}-500`}`
              : `${theme.isDark ? 'text-gray-400' : 'text-gray-500'} hover:text-gray-700`}`}
            onClick={() => setActiveTab('appearance')}
          >
            <div className="flex items-center">
              <FaPalette className="mr-2" />
              Appearance
            </div>
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'account'
              ? `${theme.colors.text.primary} border-b-2 ${theme.isDark ? 'border-white' : `border-${theme.primary}-500`}`
              : `${theme.isDark ? 'text-gray-400' : 'text-gray-500'} hover:text-gray-700`}`}
            onClick={() => setActiveTab('account')}
          >
            <div className="flex items-center">
              <FaSun className="mr-2" />
              Account
            </div>
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'notifications'
              ? `${theme.colors.text.primary} border-b-2 ${theme.isDark ? 'border-white' : `border-${theme.primary}-500`}`
              : `${theme.isDark ? 'text-gray-400' : 'text-gray-500'} hover:text-gray-700`}`}
            onClick={() => setActiveTab('notifications')}
          >
            <div className="flex items-center">
              <FaMoon className="mr-2" />
              Notifications
            </div>
          </button>
        </div>

        {/* Appearance Tab Content */}
        {activeTab === 'appearance' && (
          <div>
            <h3 className={`text-xl font-semibold mb-6 ${theme.isDark ? 'text-white' : 'text-gray-800'}`}>Theme Settings</h3>

            {/* Theme Selection */}
            <div className="mb-8">
              <h4 className={`text-lg font-medium mb-4 ${theme.isDark ? 'text-gray-300' : 'text-gray-700'}`}>Select Theme</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.keys(themes).map((themeName) => {
                  const themeObj = themes[themeName];
                  return (
                    <div
                      key={themeName}
                      className={`relative p-4 rounded-lg cursor-pointer transition-all duration-200 ${currentTheme === themeName ? 'ring-2 ring-offset-2' : 'hover:bg-gray-100 dark:hover:bg-gray-700'} ${themeObj.isDark ? 'bg-gray-800 text-white' : 'bg-white border'}`}
                      style={{
                        ringColor: `var(--${themeObj.primary}-500)`,
                      }}
                      onClick={() => handleThemeChange(themeName)}
                    >
                      {/* Theme Preview */}
                      <div className="flex items-center mb-3">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-${themeObj.primary}-600 to-${themeObj.primary}-400 mr-3`}></div>
                        <span className="font-medium">{themeObj.name}</span>
                        {currentTheme === themeName && (
                          <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                            <FaCheck size={10} />
                          </div>
                        )}
                      </div>

                      {/* Theme Color Samples */}
                      <div className="flex space-x-1">
                        <div className={`w-6 h-6 rounded-full bg-${themeObj.primary}-500`}></div>
                        <div className={`w-6 h-6 rounded-full bg-${themeObj.secondary}-500`}></div>
                        <div className={`w-6 h-6 rounded-full bg-${themeObj.accent}-500`}></div>
                        <div className={`w-6 h-6 rounded-full bg-${themeObj.highlight}-500`}></div>
                      </div>

                      {/* Dark/Light Indicator */}
                      <div className={`mt-2 text-xs ${themeObj.isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {themeObj.isDark ? 'Dark Mode' : 'Light Mode'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <div className="mb-6">
              <h4 className={`text-lg font-medium mb-4 ${theme.isDark ? 'text-gray-300' : 'text-gray-700'}`}>Dark Mode</h4>
              <div className="flex items-center">
                <button
                  className={`flex items-center justify-center p-3 rounded-lg mr-4 ${!theme.isDark ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-400' : 'bg-gray-200 text-gray-600'}`}
                  onClick={() => handleThemeChange(Object.keys(themes).find(t => !themes[t].isDark && themes[t].name !== 'Dark'))}
                >
                  <FaSun className="mr-2" />
                  Light
                </button>
                <button
                  className={`flex items-center justify-center p-3 rounded-lg ${theme.isDark ? 'bg-blue-900 text-blue-100 ring-2 ring-blue-700' : 'bg-gray-200 text-gray-600'}`}
                  onClick={() => handleThemeChange(Object.keys(themes).find(t => themes[t].isDark))}
                >
                  <FaMoon className="mr-2" />
                  Dark
                </button>
              </div>
              <p className={`mt-2 text-sm ${theme.isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Dark mode reduces eye strain in low light environments and saves battery life.
              </p>
            </div>
          </div>
        )}

        {/* Account Tab Content */}
        {activeTab === 'account' && (
          <div>
            <h3 className={`text-xl font-semibold mb-4 ${theme.isDark ? 'text-white' : 'text-gray-800'}`}>Account Settings</h3>
            <p className={`${theme.isDark ? 'text-gray-300' : 'text-gray-700'} mb-6`}>
              Manage your account settings and preferences.
            </p>

            {/* Profile Information */}
            <div className={`mb-8 ${theme.isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6`}>
              <h4 className={`text-lg font-medium mb-4 flex items-center ${theme.isDark ? 'text-white' : 'text-gray-800'}`}>
                <FaUser className="mr-2" />
                Profile Information
              </h4>

              {/* Success Message */}
              {successMessage && (
                <div className={`mb-4 p-3 bg-green-100 text-green-800 rounded-lg flex items-center ${theme.isDark ? 'bg-opacity-20' : ''}`}>
                  <FaCheck className="mr-2" />
                  {successMessage}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className={`mb-4 p-3 bg-red-100 text-red-800 rounded-lg ${theme.isDark ? 'bg-opacity-20' : ''}`}>
                  {error}
                </div>
              )}

              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <FaSpinner className={`animate-spin text-${theme.primary}-500 text-2xl`} />
                  <span className={`ml-2 ${theme.isDark ? 'text-gray-300' : 'text-gray-600'}`}>Loading user data...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${theme.isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Full Name
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={userInfo.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        disabled={!isEditing.fullName}
                        className={`flex-1 rounded-${isEditing.fullName ? 'l-' : ''}lg border ${theme.isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-${theme.primary}-500 ${!isEditing.fullName && 'opacity-75'}`}
                      />
                      {isEditing.fullName ? (
                        <div className="flex">
                          <button
                            onClick={() => handleUpdateProfile('fullName')}
                            className={`px-3 py-2 bg-${theme.primary}-500 text-white hover:bg-${theme.primary}-600`}
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => toggleEditing('fullName')}
                            className={`rounded-r-lg px-3 py-2 bg-gray-500 text-white hover:bg-gray-600`}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => toggleEditing('fullName')}
                          className={`rounded-r-lg px-3 bg-${theme.primary}-500 text-white hover:bg-${theme.primary}-600`}
                        >
                          <FaEdit />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${theme.isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Email Address
                    </label>
                    <div className="flex">
                      <input
                        type="email"
                        value={userInfo.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={!isEditing.email}
                        className={`flex-1 rounded-${isEditing.email ? 'l-' : ''}lg border ${theme.isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-${theme.primary}-500 ${!isEditing.email && 'opacity-75'}`}
                      />
                      {isEditing.email ? (
                        <div className="flex">
                          <button
                            onClick={() => handleUpdateProfile('email')}
                            className={`px-3 py-2 bg-${theme.primary}-500 text-white hover:bg-${theme.primary}-600`}
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => toggleEditing('email')}
                            className={`rounded-r-lg px-3 py-2 bg-gray-500 text-white hover:bg-gray-600`}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => toggleEditing('email')}
                          className={`rounded-r-lg px-3 bg-${theme.primary}-500 text-white hover:bg-${theme.primary}-600`}
                        >
                          <FaEdit />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${theme.isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Phone Number
                    </label>
                    <div className="flex">
                      <input
                        type="tel"
                        value={userInfo.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!isEditing.phone}
                        className={`flex-1 rounded-${isEditing.phone ? 'l-' : ''}lg border ${theme.isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-${theme.primary}-500 ${!isEditing.phone && 'opacity-75'}`}
                      />
                      {isEditing.phone ? (
                        <div className="flex">
                          <button
                            onClick={() => handleUpdateProfile('phone')}
                            className={`px-3 py-2 bg-${theme.primary}-500 text-white hover:bg-${theme.primary}-600`}
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => toggleEditing('phone')}
                            className={`rounded-r-lg px-3 py-2 bg-gray-500 text-white hover:bg-gray-600`}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => toggleEditing('phone')}
                          className={`rounded-r-lg px-3 bg-${theme.primary}-500 text-white hover:bg-${theme.primary}-600`}
                        >
                          <FaEdit />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Role - Read Only */}
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${theme.isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Role
                    </label>
                    <input
                      type="text"
                      value={userInfo.role}
                      readOnly
                      className={`w-full rounded-lg border ${theme.isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'} px-3 py-2 focus:outline-none opacity-75`}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Security Settings */}
            <div className={`mb-8 ${theme.isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6`}>
              <h4 className={`text-lg font-medium mb-4 flex items-center ${theme.isDark ? 'text-white' : 'text-gray-800'}`}>
                <FaShieldAlt className="mr-2" />
                Security
              </h4>

              <div className="space-y-4">
                {/* Change Password */}
                <div className={`p-4 border ${theme.isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-white'} rounded-lg`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h5 className={`font-medium ${theme.isDark ? 'text-white' : 'text-gray-800'}`}>Password</h5>
                      <p className={`text-sm ${theme.isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Change your password to keep your account secure
                      </p>
                    </div>
                    <button
                      onClick={handleChangePassword}
                      className={`px-4 py-2 bg-${theme.primary}-500 text-white rounded-lg hover:bg-${theme.primary}-600 transition-colors flex items-center`}
                    >
                      <FaKey className="mr-2" />
                      Change Password
                    </button>
                  </div>
                </div>

                {/* Security Questions */}
                <div className={`p-4 border ${theme.isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-white'} rounded-lg`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h5 className={`font-medium ${theme.isDark ? 'text-white' : 'text-gray-800'}`}>Security Questions</h5>
                      <p className={`text-sm ${theme.isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {hasSecurityQuestions
                          ? 'Your security questions are set up'
                          : 'Set up security questions for account recovery'}
                      </p>
                    </div>
                    <button
                      className={`px-4 py-2 ${hasSecurityQuestions
                        ? `bg-${theme.secondary}-500 hover:bg-${theme.secondary}-600`
                        : `bg-${theme.primary}-500 hover:bg-${theme.primary}-600`}
                        text-white rounded-lg transition-colors flex items-center`}
                      onClick={() => navigate('/security-questions')}
                    >
                      <FaShieldAlt className="mr-2" />
                      {hasSecurityQuestions ? 'Update Questions' : 'Setup Questions'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Communication Preferences */}
            <div className={`${theme.isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6`}>
              <h4 className={`text-lg font-medium mb-4 flex items-center ${theme.isDark ? 'text-white' : 'text-gray-800'}`}>
                <FaEnvelope className="mr-2" />
                Communication Preferences
              </h4>

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    className={`h-4 w-4 rounded border-gray-300 text-${theme.primary}-600 focus:ring-${theme.primary}-500`}
                    defaultChecked
                  />
                  <label htmlFor="emailNotifications" className={`ml-2 block text-sm ${theme.isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email notifications
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="smsNotifications"
                    className={`h-4 w-4 rounded border-gray-300 text-${theme.primary}-600 focus:ring-${theme.primary}-500`}
                  />
                  <label htmlFor="smsNotifications" className={`ml-2 block text-sm ${theme.isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    SMS notifications
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="marketingEmails"
                    className={`h-4 w-4 rounded border-gray-300 text-${theme.primary}-600 focus:ring-${theme.primary}-500`}
                  />
                  <label htmlFor="marketingEmails" className={`ml-2 block text-sm ${theme.isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Marketing emails
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab Content */}
        {activeTab === 'notifications' && (
          <div>
            <h3 className={`text-xl font-semibold mb-4 ${theme.isDark ? 'text-white' : 'text-gray-800'}`}>Notification Settings</h3>
            <p className={`${theme.isDark ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
              Configure how and when you receive notifications.
            </p>
            <div className={`p-4 rounded-lg ${theme.isDark ? 'bg-gray-700' : 'bg-gray-100'} mb-4`}>
              <p className="text-sm">Notification settings will be available in a future update.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;



