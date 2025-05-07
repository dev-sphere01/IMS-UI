import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaChevronRight } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';

// Map of route paths to human-readable names
const routeNames = {
  '/': 'Home',
  '/enquiry': 'Enquiry Form',
  '/enquiryGrid': 'Enquiry List',
  '/admissionForm': 'Admission Form',
  '/admissionTable': 'Admission List',
  '/student': 'Student Form',
  '/studentGrid': 'Student List',
  '/feeform': 'Fee Form',
  '/feeTable': 'Fee List',
  '/mail': 'Mail',
  '/report': 'Reports',
  '/time': 'Time Management',
  '/progress': 'Progress Tracking',
  '/settings': 'Settings',
  '/course': 'Manage Course',
  '/courseGrid': 'Course List',
  '/master-management': 'Master Management',
  '/batch-timing-table': 'Batch Timings',
  '/goal-table': 'Course Goals',
};

// Map routes to their parent routes for hierarchical breadcrumbs
const parentRoutes = {
  '/enquiryGrid': '/enquiry',
  '/admissionTable': '/admissionForm',
  '/studentGrid': '/student',
  '/feeTable': '/feeform',
  '/courseGrid': '/course',
};

// Group routes by section
const routeSections = {
  '/enquiry': 'Enquiries',
  '/enquiryGrid': 'Enquiries',
  '/admissionForm': 'Admissions',
  '/admissionTable': 'Admissions',
  '/student': 'Students',
  '/studentGrid': 'Students',
  '/feeform': 'Fees',
  '/feeTable': 'Fees',
  '/course': 'Courses',
  '/courseGrid': 'Courses',
};

const Breadcrumb = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  const currentPath = location.pathname;

  // If we're at the root path, don't show breadcrumbs
  if (currentPath === '/') {
    return null;
  }

  // Get the section for the current route
  const section = routeSections[currentPath];

  return (
    <div className={`${theme.isDark ? 'bg-gray-800' : 'bg-gray-50'} px-4 py-2.5 flex items-center text-sm border-b ${theme.isDark ? 'border-gray-700' : 'border-gray-200'} shadow-sm`}>
      <div className="flex items-center space-x-2">
      <Link
        to="/"
        className={`${theme.colors.text.primary} hover:${theme.colors.text.dark} flex items-center transition-colors`}
      >
        <FaHome className="mr-1" />
        <span>Home</span>
      </Link>

      <FaChevronRight className={`mx-2 ${theme.isDark ? 'text-gray-500' : `text-${theme.primary}-300`}`} size={12} />

      {/* Show section if available */}
      {section && (
        <>
          <span className={`${theme.colors.text.primary}`}>{section}</span>
          <FaChevronRight className={`mx-2 ${theme.isDark ? 'text-gray-500' : `text-${theme.primary}-300`}`} size={12} />
        </>
      )}

      {/* Show parent route if available */}
      {parentRoutes[currentPath] && (
        <>
          <Link
            to={parentRoutes[currentPath]}
            className={`${theme.colors.text.primary} hover:${theme.colors.text.dark} transition-colors`}
          >
            {routeNames[parentRoutes[currentPath]]}
          </Link>
          <FaChevronRight className={`mx-2 ${theme.isDark ? 'text-gray-500' : `text-${theme.primary}-300`}`} size={12} />
        </>
      )}

      {/* Current page */}
      <span className={`font-medium ${theme.isDark ? 'text-white' : theme.colors.text.dark}`}>
        {routeNames[currentPath] || pathnames[pathnames.length - 1]}
      </span>
      </div>
    </div>
  );
};

export default Breadcrumb;
