import React, { useState, useEffect } from 'react';
import { FaUserGraduate, FaClipboardList, FaMoneyBillWave, FaBookOpen } from 'react-icons/fa';
import { animate } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import PropTypes from 'prop-types';

// Format numbers in K (thousands) or M (millions)
const formatNumber = (value) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  } else {
    return value.toString();
  }
};

const StatisticsCards = ({
  stats = {},
  isLoading = false,
  error = null
}) => {
  // Get theme context
  const { theme } = useTheme();

  // State for animated values
  const [totalStudents, setTotalStudents] = useState(0);
  const [pendingEnquiries, setPendingEnquiries] = useState(0);
  const [totalFees, setTotalFees] = useState(0);
  const [courses, setCourses] = useState(0);

  useEffect(() => {
    // Only animate if we have real data and not loading
    if (!isLoading && stats) {
      // Animate the counters from current value to new value
      animate(totalStudents, stats.totalStudents || 0, {
        duration: 0.5,
        onUpdate: (value) => setTotalStudents(Math.round(value))
      });

      animate(pendingEnquiries, stats.pendingEnquiries || 0, {
        duration: 0.5,
        onUpdate: (value) => setPendingEnquiries(Math.round(value))
      });

      animate(totalFees, stats.totalFees || 0, {
        duration: 0.5,
        onUpdate: (value) => setTotalFees(Math.round(value))
      });

      animate(courses, stats.courses || 0, {
        duration: 0.5,
        onUpdate: (value) => setCourses(Math.round(value))
      });
    }
  }, [stats, isLoading, totalStudents, pendingEnquiries, totalFees, courses]);

  const statCards = [
    {
      title: 'Total Students',
      value: formatNumber(totalStudents),
      icon: <FaUserGraduate size={24} className="text-blue-600" />,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800'
    },
    {
      title: 'Pending Enquiries',
      value: formatNumber(pendingEnquiries),
      icon: <FaClipboardList size={24} className="text-yellow-600" />,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800'
    },
    {
      title: 'Total Fees Collected',
      value: `₹${formatNumber(totalFees)}`,
      icon: <FaMoneyBillWave size={24} className="text-green-600" />,
      bgColor: 'bg-green-100',
      textColor: 'text-green-800'
    },
    {
      title: 'Active Courses',
      value: formatNumber(courses),
      icon: <FaBookOpen size={24} className="text-purple-600" />,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-800'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`${theme.colors.background.card} rounded-xl shadow-md p-4 animate-pulse border ${theme.colors.border.light}`}>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-100 p-4 rounded-xl text-red-800 mb-6 ${theme.isDark ? 'bg-opacity-20' : ''}`}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} rounded-xl shadow-md p-4 transition-transform duration-300 transform hover:-translate-y-1 hover:shadow-lg`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
                <p className={`text-2xl font-bold ${card.textColor}`}>{card.value}</p>
              </div>
              <div className="p-3 rounded-full bg-white bg-opacity-50">
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
  );
};

StatisticsCards.propTypes = {
  stats: PropTypes.shape({
    totalStudents: PropTypes.number,
    pendingEnquiries: PropTypes.number,
    totalFees: PropTypes.number,
    courses: PropTypes.number
  }),
  isLoading: PropTypes.bool,
  error: PropTypes.string
};

export default StatisticsCards;
