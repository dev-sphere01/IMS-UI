import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaEnvelope,
  FaChartBar,
  FaClock,
  FaChartLine,
  FaCog,
  FaBars,
  FaClipboardList,
  FaUserPlus,
  FaUserGraduate,
  FaMoneyBillWave,
  FaGraduationCap,
  FaList,
  FaUsers,
  FaFileInvoice,
  FaBookOpen,
  FaChevronDown,
  FaChevronRight,
  FaDatabase,
  FaCogs
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

// Standalone navigation items
const standaloneNavItems = [
  { icon: FaHome, label: "Home", route: "/" },
];

// Grouped navigation items
const navGroups = [
  {
    name: "Enquiries",
    icon: FaClipboardList,
    items: [
      { icon: FaClipboardList, label: "Enquiry Form", route: "/enquiry" },
      { icon: FaList, label: "Enquiry List", route: "/enquiryGrid" },
    ]
  },
  {
    name: "Admissions",
    icon: FaUserPlus,
    items: [
      { icon: FaUserPlus, label: "Admission Form", route: "/admissionForm" },
      { icon: FaList, label: "Admission List", route: "/admissionTable" },
    ]
  },
  {
    name: "Students",
    icon: FaUsers,
    items: [
      { icon: FaUserGraduate, label: "Student Form", route: "/student" },
      { icon: FaList, label: "Student List", route: "/studentGrid" },
    ]
  },
  {
    name: "Fees",
    icon: FaMoneyBillWave,
    items: [
      { icon: FaFileInvoice, label: "Fee Form", route: "/feeform" },
      { icon: FaList, label: "Fee List", route: "/feeTable" },
    ]
  },
  {
    name: "Courses",
    icon: FaGraduationCap,
    items: [
      { icon: FaBookOpen, label: "Manage Course", route: "/course" },
      { icon: FaList, label: "Course List", route: "/courseGrid" },
    ]
  }
];

// Utility navigation items
const utilityNavItems = [
  { icon: FaDatabase, label: "Master Management", route: "/master-management" },
  { icon: FaEnvelope, label: "Mail", route: "/mail" },
  { icon: FaChartBar, label: "Report", route: "/report" },
  { icon: FaClock, label: "Time", route: "/time" },
  { icon: FaChartLine, label: "Progress", route: "/progress" },
  { icon: FaCog, label: "Settings", route: "/settings" },
];

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, isMobileView = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const [expandedGroups, setExpandedGroups] = useState({});

  const handleNavigation = (route) => {
    navigate(route);

    // Close the mobile sidebar drawer when navigating to a new route
    if (isMobileView) {
      // We need to access the parent component's state
      // This will be handled by the parent component
      const event = new CustomEvent('closeMobileSidebar');
      window.dispatchEvent(event);
    }
  };

  const isActive = (route) => {
    if (route === "/" && location.pathname === "/") {
      return true;
    }
    return location.pathname === route;
  };

  const isGroupActive = (items) => {
    return items.some(item => location.pathname === item.route);
  };

  const toggleGroup = (groupName) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  // Auto-expand the group containing the active route
  useEffect(() => {
    navGroups.forEach(group => {
      const isActive = group.items.some(item => location.pathname === item.route);
      if (isActive || isMobileView) {
        setExpandedGroups(prev => ({
          ...prev,
          [group.name]: true
        }));
      }
    });
  }, [location.pathname, isMobileView]);

  return (
    <>
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64 md:w-56 lg:w-64" : "w-16"
        } h-full bg-gradient-to-b ${theme.colors.gradient.sidebar} text-white backdrop-blur-lg shadow-xl flex flex-col justify-between py-4 transition-all duration-300 ease-in-out relative overflow-hidden`}
      >
        {/* Top section with toggle and icons */}
        <div className="flex flex-col gap-4 h-full">
          {/* Mobile header - only visible in mobile view */}
          {isMobileView && (
            <div className="flex items-center justify-between px-4 py-2 mb-4 border-b border-white border-opacity-20">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-white mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                <span className="text-lg font-semibold text-white">IMS Portal</span>
              </div>
            </div>
          )}

          {/* Toggle button - hidden in mobile view */}
          {!isMobileView && (
            <div
              className={`flex ${
                isSidebarOpen ? "justify-end pr-3" : "justify-center"
              } mb-4`}
            >
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`text-white bg-${theme.primary}-700 p-2 rounded-md hover:bg-${theme.primary}-800 transition-all duration-200 hover:rotate-180`}
              >
                <FaBars size={16} />
              </button>
            </div>
          )}

          {/* Navigation section */}
          <div className="flex-1 flex flex-col items-start space-y-2 px-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {/* Home navigation (isolated at top) */}
            {standaloneNavItems.map((item, index) => (
              <div
                key={`standalone-${index}`}
                onClick={() => handleNavigation(item.route)}
                className={`flex items-center w-full ${
                  isSidebarOpen ? "pl-4" : "justify-center"
                } gap-x-4 ${
                  isActive(item.route)
                    ? `text-white font-semibold bg-${theme.primary}-700 rounded-lg py-2 px-3`
                    : "text-white"
                } hover:bg-${theme.primary}-600 hover:bg-opacity-50 rounded-lg py-2 px-3 transition-all duration-200 cursor-pointer relative group`}
              >
                <div>
                  <item.icon size={20} />
                </div>
                {isSidebarOpen ? (
                  <span className="text-sm font-medium whitespace-nowrap">
                    {item.label}
                  </span>
                ) : (
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 origin-left scale-0 transform rounded-md bg-gray-800 px-3 py-1 text-xs font-medium text-white shadow-lg transition-all duration-200 group-hover:scale-100 whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </div>
            ))}

            {/* Divider after Home */}
            <div className={`w-full border-t ${theme.colors.border.light} border-opacity-30 my-2`}></div>

            {/* Grouped navigation items */}
            {isSidebarOpen ? (
              // Expanded sidebar - show groups with collapsible sections
              <>
                {navGroups.map((group, groupIndex) => (
                  <div key={`group-${groupIndex}`} className="w-full">
                    {/* Group header */}
                    <div
                      onClick={() => toggleGroup(group.name)}
                      className={`flex items-center justify-between w-full pl-4 py-2 cursor-pointer ${
                        isGroupActive(group.items) ? `text-white font-semibold` : "text-white"
                      } hover:bg-${theme.primary}-600 hover:bg-opacity-30 rounded-lg transition-all duration-200`}
                    >
                      <div className="flex items-center gap-x-4">
                        <group.icon size={18} />
                        <span className="text-sm font-medium">{group.name}</span>
                      </div>
                      {expandedGroups[group.name] ? (
                        <FaChevronDown size={12} className="mr-2" />
                      ) : (
                        <FaChevronRight size={12} className="mr-2" />
                      )}
                    </div>

                    {/* Group items */}
                    {expandedGroups[group.name] && (
                      <div className="ml-4 mt-1 space-y-1">
                        {group.items.map((item, itemIndex) => (
                          <div
                            key={`item-${groupIndex}-${itemIndex}`}
                            onClick={() => handleNavigation(item.route)}
                            className={`flex items-center w-full pl-4 gap-x-4 ${
                              isActive(item.route)
                                ? `text-white font-semibold bg-${theme.primary}-700 rounded-lg py-2 px-2`
                                : "text-white"
                            } hover:bg-${theme.primary}-600 hover:bg-opacity-50 rounded-lg py-2 px-2 transition-all duration-200 cursor-pointer`}
                          >
                            <div>
                              <item.icon size={16} />
                            </div>
                            <span className="text-sm font-medium whitespace-nowrap">
                              {item.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </>
            ) : (
              // Collapsed sidebar - show all items directly with tooltips
              <>
                {navGroups.map((group, groupIndex) => (
                  <React.Fragment key={`collapsed-group-${groupIndex}`}>
                    {/* Group header as visual separator */}
                    <div className="w-full flex justify-center py-1">
                      <div className="relative group">
                        <group.icon
                          size={20}
                          className={`${isGroupActive(group.items) ? 'text-white' : 'text-white opacity-70'} hover:opacity-100`}
                        />
                        {/* Tooltip */}
                        <div className="absolute left-full ml-2 top-0 z-50 origin-left scale-0 transform rounded-md bg-gray-800 px-3 py-1 text-xs font-medium text-white shadow-lg transition-all duration-200 group-hover:scale-100 whitespace-nowrap">
                          {group.name}
                        </div>
                      </div>
                    </div>

                    {/* Group items */}
                    {group.items.map((item, itemIndex) => (
                      <div
                        key={`collapsed-item-${groupIndex}-${itemIndex}`}
                        onClick={() => handleNavigation(item.route)}
                        className={`flex items-center justify-center w-full gap-x-4 ${
                          isActive(item.route)
                            ? `text-white font-semibold bg-${theme.primary}-700 rounded-lg py-2`
                            : "text-white"
                        } hover:bg-${theme.primary}-600 hover:bg-opacity-50 rounded-lg py-2 transition-all duration-200 cursor-pointer relative group`}
                      >
                        <item.icon size={16} />
                        {/* Tooltip */}
                        <div className="absolute left-full ml-2 top-0 z-50 origin-left scale-0 transform rounded-md bg-gray-800 px-3 py-1 text-xs font-medium text-white shadow-lg transition-all duration-200 group-hover:scale-100 whitespace-nowrap">
                          {`${group.name} - ${item.label}`}
                        </div>
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </>
            )}

            {/* Divider before utility items */}
            <div className={`w-full border-t ${theme.colors.border.light} border-opacity-30 my-2`}></div>

            {/* Utility navigation items */}
            {utilityNavItems.map((item, index) => (
              <div
                key={`utility-${index}`}
                onClick={() => handleNavigation(item.route)}
                className={`flex items-center w-full ${
                  isSidebarOpen ? "pl-4" : "justify-center"
                } gap-x-4 ${
                  isActive(item.route)
                    ? `text-white font-semibold bg-${theme.primary}-700 rounded-lg py-2 px-3`
                    : "text-white"
                } hover:bg-${theme.primary}-600 hover:bg-opacity-50 rounded-lg py-2 px-3 transition-all duration-200 cursor-pointer relative group`}
              >
                <div>
                  <item.icon size={20} />
                </div>
                {isSidebarOpen ? (
                  <span className="text-sm font-medium whitespace-nowrap">
                    {item.label}
                  </span>
                ) : (
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 origin-left scale-0 transform rounded-md bg-gray-800 px-3 py-1 text-xs font-medium text-white shadow-lg transition-all duration-200 group-hover:scale-100 whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer - hidden in mobile view and collapsed sidebar */}
          {(!isMobileView && isSidebarOpen) && (
            <div className="mt-2">
              <div className={`border-t ${theme.colors.border.light} border-opacity-50 pt-2 mx-3`}></div>
              <div className={`bg-${theme.primary}-700 bg-opacity-40 rounded-lg mx-3 p-3 shadow-inner border ${theme.colors.border.light} border-opacity-30 hover:bg-${theme.primary}-600 transition-all duration-300 cursor-pointer`}>
                <div className="flex items-center justify-center mb-1">
                  <svg className="w-4 h-4 text-white mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-medium text-white">IMS Portal</span>
                </div>
                <div className="text-center text-xs text-white opacity-80">
                  © 2025 IMS • v1.2.0
                </div>
              </div>
            </div>
          )}

          {/* Mobile footer - only visible in mobile view */}
          {isMobileView && (
            <div className="mt-2 px-4 py-3 border-t border-white border-opacity-20">
              <div className="text-center text-xs text-white opacity-80">
                © 2025 IMS • v1.2.0
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
