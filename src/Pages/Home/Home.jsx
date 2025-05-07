

import React, { useState, useEffect } from "react";
import {
  FaClipboardCheck,
  FaUser,
  FaInfoCircle,
  FaBell,
  FaGraduationCap,
  FaMoneyBillWave,
  FaUserPlus,
  FaChartBar,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { SiGoogleforms } from "react-icons/si";
import { useTheme } from "../../contexts/ThemeContext";

// Import dashboard components
import StatisticsCards from "../../components/dashboard/StatisticsCards";
import EnrollmentChart from "../../components/dashboard/EnrollmentChart";
import RecentActivity from "../../components/dashboard/RecentActivity";
import QuickActions from "../../components/dashboard/QuickActions";

const features = [
  {
    icon: <FaClipboardCheck size={30} />,
    title: "Enquiry",
    description: "Manage student enquiries and leads",
    Route: "/enquiry",
    infoRoute: "/enquiryGrid",
    bgColor: "from-yellow-400 to-yellow-600",
    textColor: "text-yellow-800",
    lightBg: "bg-yellow-50",
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    buttonBg: "bg-yellow-500",
    buttonHover: "hover:bg-yellow-600",
    countType: "pendingEnquiries"
  },
  {
    icon: <FaUserPlus size={30} />,
    title: "Admission",
    description: "Process new student admissions",
    Route: "/admissionForm",
    infoRoute: "/admissionTable",
    bgColor: "from-blue-400 to-blue-600",
    textColor: "text-blue-800",
    lightBg: "bg-blue-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    buttonBg: "bg-blue-500",
    buttonHover: "hover:bg-blue-600",
    countType: "recentAdmissions"
  },
  {
    icon: <FaUser size={30} />,
    title: "Student Details",
    description: "View and manage student information",
    Route: "/student",
    infoRoute: "/studentGrid",
    bgColor: "from-purple-400 to-purple-600",
    textColor: "text-purple-800",
    lightBg: "bg-purple-50",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    buttonBg: "bg-purple-500",
    buttonHover: "hover:bg-purple-600",
    countType: "totalStudents"
  },
  {
    icon: <FaMoneyBillWave size={30} />,
    title: "Fees",
    description: "Manage fee collection and payments",
    Route: "/feeform",
    infoRoute: "/feeTable",
    bgColor: "from-green-400 to-green-600",
    textColor: "text-green-800",
    lightBg: "bg-green-50",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    buttonBg: "bg-green-500",
    buttonHover: "hover:bg-green-600",
    countType: "pendingFees"
  },
  {
    icon: <FaGraduationCap size={30} />,
    title: "Courses",
    description: "Manage courses and curriculum",
    Route: "/course",
    infoRoute: "/courseGrid",
    bgColor: "from-indigo-400 to-indigo-600",
    textColor: "text-indigo-800",
    lightBg: "bg-indigo-50",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    buttonBg: "bg-indigo-500",
    buttonHover: "hover:bg-indigo-600",
    countType: "courses"
  },
  {
    icon: <FaChartBar size={30} />,
    title: "Reports",
    description: "Generate and view reports",
    Route: "/report",
    infoRoute: "/report",
    bgColor: "from-red-400 to-red-600",
    textColor: "text-red-800",
    lightBg: "bg-red-50",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    buttonBg: "bg-red-500",
    buttonHover: "hover:bg-red-600",
    countType: "reports"
  },
];

const Home = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [featureCounts, setFeatureCounts] = useState({
    totalStudents: 0,
    pendingEnquiries: 0,
    recentAdmissions: 0,
    pendingFees: 0,
    courses: 0,
    reports: 5, // Static count for reports
    loading: true
  });

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    let greetingText = '';

    if (hour < 12) greetingText = 'Good Morning';
    else if (hour < 18) greetingText = 'Good Afternoon';
    else greetingText = 'Good Evening';

    setGreeting(greetingText);

    // Format current date
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    setCurrentTime(new Date().toLocaleDateString(undefined, options));
  }, []);

  // Fetch feature counts
  useEffect(() => {
    const fetchFeatureCounts = async () => {
      try {
        // Import services
        const StudentService = (await import('../../Services/StudentService')).default;
        const EnquiryService = (await import('../../Services/EnquiryService')).default;
        const FeeService = (await import('../../Services/FeeService')).default;
        const CourseService = (await import('../../Services/CourseService')).default;

        // Fetch data in parallel
        const [studentsData, enquiriesData, feesData, coursesData] = await Promise.allSettled([
          StudentService.getAllStudents(),
          EnquiryService.getAllEnquiries(),
          FeeService.getAllFees(),
          CourseService.getAllCourses()
        ]);

        // Process results safely
        const students = studentsData.status === 'fulfilled' ? studentsData.value : [];
        const enquiries = enquiriesData.status === 'fulfilled' ? enquiriesData.value : [];
        const fees = feesData.status === 'fulfilled' ? feesData.value : [];
        const courses = coursesData.status === 'fulfilled' ? coursesData.value : [];

        // Calculate statistics
        const pendingEnquiries = Array.isArray(enquiries)
          ? enquiries.filter(e => e.status === 'pending').length
          : 0;

        // Get recent admissions (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentAdmissions = Array.isArray(students)
          ? students.filter(s => {
              const admissionDate = new Date(s.admissionDate || s.createdAt);
              return admissionDate >= thirtyDaysAgo;
            }).length
          : 0;

        // Get pending fees
        const pendingFees = Array.isArray(fees)
          ? fees.filter(f => f.status === 'pending').length
          : 0;

        // Get active courses count
        const activeCourses = Array.isArray(courses)
          ? courses.filter(c => c.isActive).length
          : 0;

        setFeatureCounts({
          totalStudents: Array.isArray(students) ? students.length : 0,
          pendingEnquiries,
          recentAdmissions,
          pendingFees,
          courses: activeCourses,
          reports: 5, // Static count for reports
          loading: false
        });
      } catch (error) {
        console.error('Error fetching feature counts:', error);
        setFeatureCounts(prev => ({
          ...prev,
          loading: false
        }));
      }
    };

    fetchFeatureCounts();
  }, []);

  const handleGoogleFormClick = (route) => {
    navigate(route);
  };

  const handleInfoClick = (infoRoute) => {
    navigate(infoRoute);
  };

  return (
    <div className={`flex-1 p-6 overflow-auto bg-gradient-to-br ${theme.colors.background.page} relative`}>
      {/* Header Section */}
      <div className={`flex flex-col md:flex-row md:justify-between md:items-center mb-8 ${theme.colors.background.header} p-4 rounded-xl shadow-md`}>
        <div>
          <h1 className={`text-3xl font-bold ${theme.colors.text.primary} mb-1`}>
            {greeting}
          </h1>
          <h2 className={`text-lg ${theme.colors.text.secondary}`}>
            {currentTime}
          </h2>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <div className={`${theme.colors.primary[50]} px-3 py-2 rounded-lg border ${theme.colors.border.light} flex items-center`}>
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
            <span className={`text-sm ${theme.colors.text.primary} font-medium`}>Online</span>
          </div>
          <button className={`${theme.colors.primary[100]} p-3 rounded-full shadow-md hover:${theme.colors.primary[200]} transition-all duration-300`}>
            <FaBell className={`${theme.colors.text.secondary}`} />
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <StatisticsCards />

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column - Enrollment Chart */}
        <div className="lg:col-span-2">
          <EnrollmentChart />
        </div>

        {/* Right Column - Quick Actions */}
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Recent Activity and Feature Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left Column - Recent Activity */}
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>

        {/* Right Column - Feature Cards */}
        <div className="lg:col-span-2">
          <div className={`${theme.colors.background.card} rounded-xl p-4 border ${theme.colors.border.light}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-semibold ${theme.colors.text.primary}`}>Main Features</h3>
              <div className="text-sm text-gray-500">
                {featureCounts.loading ? 'Loading data...' : 'Last updated just now'}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, index) => {
                // Get the count for this feature
                const count = featureCounts[feature.countType] || 0;

                return (
                  <div
                    key={index}
                    className={`bg-gradient-to-br ${feature.bgColor} text-white rounded-xl shadow-md overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg group`}
                  >
                    <div className="p-4">
                      {/* Top section with icon and count */}
                      <div className="flex justify-between items-start mb-3">
                        <div className={`${feature.iconBg} ${feature.iconColor} p-3 rounded-lg`}>
                          {feature.icon}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{count}</div>
                          <div className="text-xs text-white text-opacity-80">
                            {feature.countType === 'pendingEnquiries' && 'Pending'}
                            {feature.countType === 'recentAdmissions' && 'Last 30 days'}
                            {feature.countType === 'totalStudents' && 'Total'}
                            {feature.countType === 'pendingFees' && 'Pending'}
                            {feature.countType === 'courses' && 'Active'}
                            {feature.countType === 'reports' && 'Available'}
                          </div>
                        </div>
                      </div>

                      {/* Title and description */}
                      <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-white text-opacity-90 mb-3">{feature.description}</p>

                      {/* Action buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleGoogleFormClick(feature.Route)}
                          className={`flex-1 ${feature.lightBg} ${feature.textColor} py-1.5 px-3 rounded-md text-sm font-medium flex items-center justify-center gap-1 transition-colors hover:bg-opacity-90`}
                        >
                          <SiGoogleforms size={14} />
                          <span>Add</span>
                        </button>
                        <button
                          onClick={() => handleInfoClick(feature.infoRoute)}
                          className="flex-1 bg-white bg-opacity-20 text-white py-1.5 px-3 rounded-md text-sm font-medium flex items-center justify-center gap-1 transition-colors hover:bg-opacity-30"
                        >
                          <FaInfoCircle size={14} />
                          <span>View</span>
                        </button>
                      </div>
                    </div>

                    {/* Progress indicator at bottom */}
                    <div className="h-1 w-full bg-white bg-opacity-20">
                      <div
                        className="h-full bg-white"
                        style={{
                          width: `${feature.countType === 'pendingEnquiries' || feature.countType === 'pendingFees'
                            ? Math.min(count * 10, 100)
                            : Math.min(count * 5, 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-4">
        <div className={`${theme.colors.background.card} rounded-xl p-3 border ${theme.colors.border.light} flex justify-between items-center text-xs text-gray-500`}>
          <div>© 2025 IMS - All rights reserved</div>
          <div className="flex items-center space-x-2">
            <span className={`${theme.colors.primary[100]} ${theme.colors.text.primary} px-2 py-1 rounded-full text-xs font-medium`}>System Status: Online</span>
            <span className={`${theme.colors.text.secondary}`}>v1.2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
