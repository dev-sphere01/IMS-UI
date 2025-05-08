import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaClipboardCheck, FaMoneyBillWave } from 'react-icons/fa';
import EnquiryService from '../../Services/EnquiryService';
import StudentService from '../../Services/StudentService';
import FeeService from '../../Services/FeeService';
import { useTheme } from '../../contexts/ThemeContext';

const RecentActivity = () => {
  const { theme } = useTheme();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // Fetch data from different services
        const [enquiriesData, studentsData, feesData] = await Promise.allSettled([
          EnquiryService.getAllEnquiries(),
          StudentService.getAllStudents(),
          FeeService.getAllFees()
        ]);

        // Process enquiries
        const enquiriesResponse = enquiriesData.status === 'fulfilled' ? enquiriesData.value : { success: false, data: [] };
        const enquiries = (enquiriesResponse.success && Array.isArray(enquiriesResponse.data) ? enquiriesResponse.data : [])
          .map(item => ({
            id: item._id,
            type: 'enquiry',
            icon: <FaClipboardCheck className="text-yellow-500" />,
            title: `New Enquiry: ${item.fullName || 'Unknown'}`,
            description: `Enquiry for ${item._interestedCourse || item.interestedCourse || 'course'}`,
            date: new Date(item.createdAt || Date.now()),
            status: item.status || 'pending'
          }));

        // Process students (admissions)
        const studentsResponse = studentsData.status === 'fulfilled' ? studentsData.value : { success: false, data: [] };
        const students = (studentsResponse.success && Array.isArray(studentsResponse.data) ? studentsResponse.data : [])
          .map(item => ({
            id: item._id,
            type: 'admission',
            icon: <FaUserPlus className="text-blue-500" />,
            title: `New Admission: ${item.fullName || 'Unknown'}`,
            description: `Admitted to ${item.courseApplied || 'course'}`,
            date: new Date(item.timestamp || item.createdAt || Date.now()),
            status: item.status || 'completed'
          }));

        // Process fees
        const feesResponse = feesData.status === 'fulfilled' ? feesData.value : { success: false, data: [] };
        const fees = (feesResponse.success && Array.isArray(feesResponse.data) ? feesResponse.data : [])
          .map(item => ({
            id: item._id,
            type: 'payment',
            icon: <FaMoneyBillWave className="text-green-500" />,
            title: `Fee Payment: ${item.studentName || 'Unknown'}`,
            description: `₹${item.amount || 0} paid for ${item.feeType || 'fees'}`,
            date: new Date(item.paymentDate || item.createdAt || Date.now()),
            status: item.status || 'completed'
          }));

        // Log the processed data for debugging
        console.log('Processed data for Recent Activity:', {
          enquiries: enquiries.length,
          students: students.length,
          fees: fees.length
        });

        // Combine all activities
        const allActivities = [...enquiries, ...students, ...fees]
          .sort((a, b) => b.date - a.date) // Sort by date (newest first)
          .slice(0, 5); // Get only the 5 most recent

        console.log('Final activities for display:', allActivities);

        setActivities(allActivities);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError('Failed to load recent activities');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Only use sample data if explicitly requested (disabled by default)
  const useSampleData = false; // Set to true to use sample data when no real data is available

  useEffect(() => {
    if (useSampleData && !loading && activities.length === 0 && !error) {
      // Sample data
      const sampleActivities = [
        {
          id: '1',
          type: 'enquiry',
          icon: <FaClipboardCheck className="text-yellow-500" />,
          title: 'New Enquiry: John Doe',
          description: 'Enquiry for Web Development course',
          date: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
          status: 'pending'
        },
        {
          id: '2',
          type: 'admission',
          icon: <FaUserPlus className="text-blue-500" />,
          title: 'New Admission: Jane Smith',
          description: 'Admitted to Data Science course',
          date: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
          status: 'completed'
        },
        {
          id: '3',
          type: 'payment',
          icon: <FaMoneyBillWave className="text-green-500" />,
          title: 'Fee Payment: Mike Johnson',
          description: '₹15,000 paid for Tuition fees',
          date: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
          status: 'completed'
        },
        {
          id: '4',
          type: 'enquiry',
          icon: <FaClipboardCheck className="text-yellow-500" />,
          title: 'New Enquiry: Sarah Williams',
          description: 'Enquiry for Mobile App Development course',
          date: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
          status: 'pending'
        },
        {
          id: '5',
          type: 'payment',
          icon: <FaMoneyBillWave className="text-green-500" />,
          title: 'Fee Payment: Robert Brown',
          description: '₹8,500 paid for Exam fees',
          date: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
          status: 'completed'
        }
      ];
      setActivities(sampleActivities);
    }
  }, [loading, activities, error, useSampleData]);

  const formatDate = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 0) {
      return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    } else if (diffHour > 0) {
      return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    } else if (diffMin > 0) {
      return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  if (loading) {
    return (
      <div className={`${theme.colors.background.card} rounded-xl shadow-md p-4 animate-pulse border ${theme.colors.border.light}`}>
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className={`flex items-center gap-3 mb-3 pb-3 border-b ${theme.isDark ? 'border-gray-700' : 'border-gray-100'}`}>
            <div className="w-8 h-8 rounded-full bg-gray-200"></div>
            <div className="flex-1">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-100 p-4 rounded-xl text-red-800 ${theme.isDark ? 'bg-opacity-20' : ''}`}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={`${theme.colors.background.card} rounded-xl shadow-md p-4 border ${theme.colors.border.light}`}>
      <h3 className={`text-lg font-semibold mb-4 ${theme.colors.text.primary}`}>Recent Activity</h3>

      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6">
          <div className={`p-3 rounded-full ${theme.isDark ? 'bg-gray-700' : 'bg-gray-100'} mb-3`}>
            <FaClipboardCheck className={`text-xl ${theme.isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          <p className={`text-center ${theme.isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            No recent activities to display
          </p>
          <p className={`text-center text-sm mt-1 ${theme.isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            New admissions and enquiries will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className={`flex items-start gap-3 pb-3 border-b ${theme.isDark ? 'border-gray-700' : 'border-gray-100'} last:border-0`}
            >
              <div className={`p-2 rounded-full ${theme.isDark ? 'bg-gray-700' : 'bg-gray-100'} mt-1`}>
                {activity.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className={`font-medium ${theme.isDark ? 'text-white' : 'text-gray-800'}`}>{activity.title}</h4>
                  <span className={`text-xs ${theme.isDark ? 'text-gray-400' : 'text-gray-500'}`}>{formatDate(activity.date)}</span>
                </div>
                <p className={`text-sm ${theme.isDark ? 'text-gray-300' : 'text-gray-600'}`}>{activity.description}</p>
                <div className="mt-1">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      activity.status === 'pending'
                        ? theme.isDark ? 'bg-yellow-900 bg-opacity-50 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
                        : theme.isDark ? 'bg-green-900 bg-opacity-50 text-green-200' : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {activity.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
