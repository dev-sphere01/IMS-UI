import React from 'react';
import { FaUser, FaBell, FaSearch, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const TopNav = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleLogout = () => {
    // Add any logout logic here
    navigate('/login');
  };

  return (
    <div className={`bg-gradient-to-r ${theme.colors.gradient.topnav} text-white backdrop-blur-lg shadow-md px-4 py-3 flex justify-between items-center relative overflow-hidden`}>
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>
      <div className="relative z-10 flex justify-between items-center w-full">
      {/* Left side - Brand/Logo */}
      <div className="flex items-center">
        <div className={`flex items-center bg-${theme.primary}-700 bg-opacity-40 px-3 py-1.5 rounded-full shadow-inner border ${theme.colors.border.light} border-opacity-30 hover:bg-${theme.primary}-600 transition-all duration-300 cursor-pointer`}>
          <svg className="w-5 h-5 text-white mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
          </svg>
          <h1 className="text-xl font-bold text-white">IMS</h1>
        </div>
      </div>

      {/* Right side - Search, notifications, profile */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className={`pl-8 pr-4 py-1.5 rounded-full bg-${theme.primary}-500 border ${theme.colors.border.medium} focus:outline-none focus:ring-2 focus:ring-${theme.primary}-300 text-sm text-white placeholder-${theme.primary}-200 transition-all duration-300 w-40 focus:w-56`}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white text-sm" />
        </div>

        {/* Notifications */}
        <button className={`p-2 rounded-full hover:bg-${theme.primary}-500 transition-all duration-200`}>
          <FaBell className="text-white" />
        </button>

        {/* Profile */}
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full bg-${theme.primary}-700 flex items-center justify-center text-white shadow-md hover:bg-${theme.primary}-600 transition-all duration-300 cursor-pointer transform hover:scale-110`}>
            <FaUser />
          </div>
          <span className="text-sm font-medium text-white">Admin</span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`p-2 rounded-full hover:bg-${theme.primary}-500 transition-all duration-200`}
        >
          <FaSignOutAlt className="text-white" />
        </button>
      </div>
      </div>
    </div>
  );
};

export default TopNav;
