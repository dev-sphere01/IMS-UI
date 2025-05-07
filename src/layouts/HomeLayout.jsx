import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import Breadcrumb from "../components/Breadcrumb";
import { FaBars } from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";

const HomeLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const { theme } = useTheme();

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Auto-close sidebar on mobile
      if (mobile && isSidebarOpen) {
        setSidebarVisible(false);
      } else {
        setSidebarVisible(true);
      }
    };

    // Handle closing mobile sidebar from child components
    const handleCloseMobileSidebar = () => {
      if (isMobile) {
        setSidebarVisible(false);
      }
    };

    // Initial check
    handleResize();

    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('closeMobileSidebar', handleCloseMobileSidebar);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('closeMobileSidebar', handleCloseMobileSidebar);
    };
  }, [isSidebarOpen, isMobile]);

  // Toggle sidebar visibility on mobile
  const toggleMobileSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="flex h-screen bg-white relative">
      {/* Mobile sidebar toggle button - only visible on mobile */}
      {isMobile && (
        <button
          onClick={toggleMobileSidebar}
          className={`md:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-${theme.primary}-600 text-white shadow-lg`}
        >
          <FaBars size={18} />
        </button>
      )}

      {/* Sidebar Component */}
      <div className={`${isMobile ? 'fixed inset-y-0 left-0 z-40' : ''} transition-transform duration-300 ease-in-out transform ${
        isMobile && !sidebarVisible ? '-translate-x-full' : 'translate-x-0'
      }`}>
        <Sidebar
          isSidebarOpen={isMobile ? true : isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isMobileView={isMobile}
        />
      </div>

      {/* Overlay for mobile sidebar */}
      {isMobile && sidebarVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-30"
          onClick={toggleMobileSidebar}
        ></div>
      )}

      {/* Main Content with TopNav */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <TopNav />

        {/* Breadcrumb */}
        <Breadcrumb />

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="container mx-auto py-6 px-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default HomeLayout;
