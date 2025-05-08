import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';
import StudentService from '../../Services/StudentService';

// Custom tooltip component
const CustomTooltip = ({ active, payload, label, theme }) => {
  if (active && payload && payload.length) {
    return (
      <div className={`${theme.isDark ? 'bg-gray-800' : 'bg-white'} p-3 border ${theme.colors.border.medium} rounded-lg shadow-lg`}>
        <p className={`font-medium ${theme.colors.text.primary}`}>{label}</p>
        <p className={`text-lg font-bold ${theme.colors.text.primary}`}>
          {payload[0].value} Students
        </p>
      </div>
    );
  }
  return null;
};

const EnrollmentChart = () => {
  const { theme } = useTheme();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define gradient colors based on theme
  const getGradientColors = () => {
    if (theme.isDark) {
      return {
        start: `#${theme.primary}700`,
        end: `#${theme.primary}900`
      };
    } else {
      return {
        start: `#${theme.primary}400`,
        end: `#${theme.primary}600`
      };
    }
  };

  // State for active bar
  const [activeIndex, setActiveIndex] = useState(null);

  // Handle bar hover
  const handleBarMouseEnter = (_, index) => {
    setActiveIndex(index);
  };

  const handleBarMouseLeave = () => {
    setActiveIndex(null);
  };

  useEffect(() => {
    const fetchAdmissionData = async () => {
      try {
        setLoading(true);
        const response = await StudentService.getAllStudents();

        if (response && response.success) {
          // Process the admission data
          const students = response.data;

          // Get current date to determine the range
          const currentDate = new Date();
          const currentYear = currentDate.getFullYear();
          const currentMonth = currentDate.getMonth();
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

          // Initialize counters for the last 6 months
          const monthlyData = {};

          // Initialize the last 6 months with zero counts
          for (let i = 5; i >= 0; i--) {
            const monthIndex = (currentMonth - i + 12) % 12; // Handle wrapping around to previous year
            const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;
            const monthKey = `${monthNames[monthIndex]} ${year}`;
            monthlyData[monthKey] = 0;
          }

          // Count admissions by month
          students.forEach(student => {
            if (student.timestamp) {
              const admissionDate = new Date(student.timestamp);
              const admissionMonth = admissionDate.getMonth();
              const admissionYear = admissionDate.getFullYear();
              const monthKey = `${monthNames[admissionMonth]} ${admissionYear}`;

              // Only count if it's within the last 6 months
              if (monthlyData.hasOwnProperty(monthKey)) {
                monthlyData[monthKey]++;
              }
            }
          });

          // Convert to array format for the chart
          const chartDataArray = Object.entries(monthlyData).map(([month, count]) => ({
            month,
            count
          }));

          // Sort by date (oldest to newest)
          chartDataArray.sort((a, b) => {
            const [aMonth, aYear] = a.month.split(' ');
            const [bMonth, bYear] = b.month.split(' ');

            if (aYear !== bYear) {
              return parseInt(aYear) - parseInt(bYear);
            }

            return monthNames.indexOf(aMonth) - monthNames.indexOf(bMonth);
          });

          setChartData(chartDataArray);
        } else {
          setError('Failed to fetch admission data');
        }
      } catch (err) {
        console.error('Error fetching admission data:', err);
        setError('Error fetching admission data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdmissionData();
  }, []);

  if (loading) {
    return (
      <div className={`${theme.colors.background.card} rounded-xl shadow-md p-4 h-80 animate-pulse border ${theme.colors.border.light}`}>
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-64 bg-gray-100 rounded"></div>
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

  // Get gradient colors
  const gradientColors = getGradientColors();

  return (
    <div className={`${theme.colors.background.card} rounded-xl shadow-md p-4 border ${theme.colors.border.light}`}>
      <h3 className={`text-lg font-semibold mb-4 ${theme.colors.text.primary}`}>Monthly Admission Trends</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="enrollmentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={gradientColors.start} stopOpacity={0.9} />
                <stop offset="95%" stopColor={gradientColors.end} stopOpacity={0.9} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.isDark ? '#444' : '#ddd'} opacity={0.5} />
            <XAxis
              dataKey="month"
              stroke={theme.isDark ? '#ccc' : '#666'}
              tick={{ fill: theme.isDark ? '#ccc' : '#666', fontSize: 12 }}
              axisLine={{ stroke: theme.isDark ? '#555' : '#ddd' }}
            />
            <YAxis
              stroke={theme.isDark ? '#ccc' : '#666'}
              tick={{ fill: theme.isDark ? '#ccc' : '#666', fontSize: 12 }}
              axisLine={{ stroke: theme.isDark ? '#555' : '#ddd' }}
            />
            <Tooltip content={<CustomTooltip theme={theme} />} />
            <Legend
              wrapperStyle={{
                paddingTop: '10px',
                color: theme.isDark ? '#ccc' : '#666'
              }}
            />
            <Bar
              dataKey="count"
              name="Student Admissions"
              radius={[4, 4, 0, 0]}
              barSize={30}
              animationDuration={1500}
              onMouseEnter={handleBarMouseEnter}
              onMouseLeave={handleBarMouseLeave}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={activeIndex === index ? gradientColors.start : "url(#enrollmentGradient)"}
                  cursor="pointer"
                  opacity={activeIndex === null || activeIndex === index ? 1 : 0.7}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EnrollmentChart;
