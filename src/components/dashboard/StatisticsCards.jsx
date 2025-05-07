import React, { useState, useEffect } from 'react';
import { FaUserGraduate, FaClipboardList, FaMoneyBillWave, FaBookOpen } from 'react-icons/fa';
import { animate } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

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

const StatisticsCards = () => {
  // Get theme context
  const { theme } = useTheme();

  // State for loading and error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for animated values
  const [totalStudents, setTotalStudents] = useState(0);
  const [pendingEnquiries, setPendingEnquiries] = useState(0);
  const [totalFees, setTotalFees] = useState(0);
  const [courses, setCourses] = useState(0);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);

      // Animate the counters
      animate(0, 245, {
        duration: 0.5,
        onUpdate: (value) => setTotalStudents(Math.round(value))
      });

      animate(0, 18, {
        duration: 0.5,
        onUpdate: (value) => setPendingEnquiries(Math.round(value))
      });

      animate(0, 1250000, {
        duration: 0.5,
        onUpdate: (value) => setTotalFees(Math.round(value))
      });

      animate(0, 12, {
        duration: 0.5,
        onUpdate: (value) => setCourses(Math.round(value))
      });
    }, 800);

    return () => clearTimeout(timer);
  }, []);

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

  if (loading) {
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

export default StatisticsCards;
