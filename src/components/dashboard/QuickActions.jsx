import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import {
  FaUserPlus,
  FaMoneyBillWave,
  FaClipboardList,
  FaSearch,
  FaFileInvoice,
  FaCalendarAlt,
  FaGraduationCap
} from 'react-icons/fa';

const QuickActions = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const actions = [
    {
      title: 'New Admission',
      icon: <FaUserPlus size={18} />,
      route: '/admissionForm',
      bgColor: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700'
    },
    {
      title: 'Record Payment',
      icon: <FaMoneyBillWave size={18} />,
      route: '/feeform',
      bgColor: 'bg-green-600',
      hoverColor: 'hover:bg-green-700'
    },
    {
      title: 'New Enquiry',
      icon: <FaClipboardList size={18} />,
      route: '/enquiry',
      bgColor: 'bg-yellow-600',
      hoverColor: 'hover:bg-yellow-700'
    },
    {
      title: 'Add Course',
      icon: <FaGraduationCap size={18} />,
      route: '/course',
      bgColor: 'bg-indigo-600',
      hoverColor: 'hover:bg-indigo-700'
    },
    {
      title: 'Search Student',
      icon: <FaSearch size={18} />,
      route: '/studentGrid',
      bgColor: 'bg-purple-600',
      hoverColor: 'hover:bg-purple-700'
    },
    {
      title: 'Generate Report',
      icon: <FaFileInvoice size={18} />,
      route: '/report',
      bgColor: 'bg-red-600',
      hoverColor: 'hover:bg-red-700'
    },
    {
      title: 'Schedule',
      icon: <FaCalendarAlt size={18} />,
      route: '/time',
      bgColor: 'bg-indigo-600',
      hoverColor: 'hover:bg-indigo-700'
    }
  ];

  const handleActionClick = (route) => {
    navigate(route);
  };

  return (
    <div className={`${theme.colors.background.card} rounded-xl shadow-md p-4 border ${theme.colors.border.light}`}>
      <h3 className={`text-lg font-semibold mb-4 ${theme.colors.text.primary}`}>Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => handleActionClick(action.route)}
            className={`${action.bgColor} ${action.hoverColor} text-white p-3 rounded-lg flex flex-col items-center justify-center transition-transform duration-200 transform hover:-translate-y-1 hover:shadow-md`}
          >
            <span className="mb-1">{action.icon}</span>
            <span className="text-xs font-medium">{action.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
