import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState({
    stats: true,
    activities: true
  });
  const base_url = import.meta.env.VITE_API_KEY_Base_URL;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch dashboard stats
        const statsRes = await axios.get(`${base_url}/api/admin/dashboard/stats`);
        if (statsRes.data.success) {
          setDashboardData(statsRes.data.data);
          setLoading(prev => ({ ...prev, stats: false }));
        }

        // Fetch recent activities
        const activitiesRes = await axios.get(`${base_url}/api/admin/recent-activities`);
        if (activitiesRes.data.success) {
          console.log(activitiesRes)
          setRecentActivities(activitiesRes.data.activities);
          setLoading(prev => ({ ...prev, activities: false }));
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setLoading({ stats: false, activities: false });
      }
    };

    fetchData();
  }, []);

  const stats = dashboardData
    ? [
        {
          title: "Total Students",
          value: dashboardData.totalStudents.toLocaleString(),
          change: `${dashboardData.studentGrowthPercent >= 0 ? '+' : ''}${dashboardData.studentGrowthPercent}%`,
          trend: dashboardData.studentGrowthPercent >= 0 ? "up" : "down",
          progress: Math.min(100, Math.max(0, dashboardData.studentGrowthPercent + 50)),
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ),
          gradient: "bg-gradient-to-br from-blue-600 to-blue-700",
          textColor: "text-white"
        },
        {
          title: "Total Teachers",
          value: dashboardData.totalTeachers.toLocaleString(),
          change: `${dashboardData.teacherGrowthPercent >= 0 ? '+' : ''}${dashboardData.teacherGrowthPercent}%`,
          trend: dashboardData.teacherGrowthPercent >= 0 ? "up" : "down",
          progress: Math.min(100, Math.max(0, dashboardData.teacherGrowthPercent + 50)),
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          ),
          gradient: "bg-gradient-to-br from-green-600 to-green-700",
          textColor: "text-white"
        },
        {
          title: "Attendance Rate",
          value: `${dashboardData.attendanceRate}%`,
          change: dashboardData.attendanceRate > 0 ? "+3.2%" : "0%",
          trend: "up",
          progress: dashboardData.attendanceRate,
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          gradient: "bg-gradient-to-br from-purple-600 to-purple-700",
          textColor: "text-white"
        },
        {
          title: "Exams Today",
          value: dashboardData.examsToday.toString(),
          change: dashboardData.examsToday > 0 ? "+1" : "0",
          trend: dashboardData.examsToday > 0 ? "up" : "down",
          progress: Math.min(100, dashboardData.examsToday * 20),
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          ),
          gradient: "bg-gradient-to-br from-amber-600 to-amber-700",
          textColor: "text-white"
        }
      ]
    : [];

  const ProgressBar = ({ percentage, color }) => {
    return (
      <div className="w-full bg-white bg-opacity-20 rounded-full h-2.5 mt-2">
        <div 
          className={`h-2.5 rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

  const getActivityIcon = (message) => {
    if (message.includes('student')) {
      return (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    } else if (message.includes('teacher')) {
      return (
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      );
    }
  };
// --------------typing-effect----------------------
const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const targetText = 'Arbeit Technology';
  const typingSpeed = 150;
  const delayBeforeStart = 1000;
  const delayBeforeDelete = 2000; // delay before deleting starts
  const deleteSpeed = 100;

  useEffect(() => {
    let timer;

    if (!isDeleting && currentIndex < targetText.length) {
      // Typing phase
      timer = setTimeout(() => {
        setDisplayedText(prev => prev + targetText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, currentIndex === 0 ? delayBeforeStart : typingSpeed);
    } else if (isDeleting && currentIndex > 0) {
      // Deleting phase
      timer = setTimeout(() => {
        setDisplayedText(prev => prev.slice(0, -1));
        setCurrentIndex(prev => prev - 1);
      }, deleteSpeed);
    } else if (currentIndex === targetText.length) {
      // Switch to deleting after pause
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, delayBeforeDelete);
    } else if (isDeleting && currentIndex === 0) {
      // Switch back to typing after deleting
      timer = setTimeout(() => {
        setIsDeleting(false);
      }, delayBeforeStart);
    }

    return () => clearTimeout(timer);
  }, [currentIndex, isDeleting]);

  return (
    <div className="flex h-screen bg-gray-50 font-nunito">
      <Sidebar isOpen={isSidebarOpen} />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'md:ml-[30%] lg:ml-[25%] xl:ml-[18%]' : 'ml-0'}`}>
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
          </div>

          {/* Stats Cards */}
          {loading.stats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className={`${stat.gradient} rounded-xl shadow-lg overflow-hidden text-white`}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium opacity-90">{stat.title}</p>
                        <h3 className="text-3xl font-semibold mt-1">{stat.value}</h3>
                      </div>
                      <div className="p-3 rounded-lg text-green-800 bg-white bg-opacity-20">
                        {stat.icon}
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center mb-2">
                        <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-200' : 'text-red-200'}`}>
                          {stat.change}
                        </span>
                        <span className="text-white text-sm opacity-80 ml-2">vs last week</span>
                      </div>
                      <ProgressBar 
                        percentage={stat.progress} 
                        color={stat.trend === 'up' ? 'bg-green-500' : 'bg-amber-500'} 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
                <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
              </div>
              {loading.activities ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="flex items-start pb-4 border-b border-gray-100 last:border-0 animate-pulse">
                      <div className="bg-gray-200 p-2 rounded-lg mr-4 w-9 h-9"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.slice(0, 5).map((activity, index) => (
                    <div key={index} className="flex items-start pb-4 border-b border-gray-100 last:border-0">
                      <div className="bg-blue-100 p-2 rounded-lg mr-4">
                        {getActivityIcon(activity.message)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No recent activities found
                </div>
              )}
            </div>

            {/* Progress Overview */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Progress Overview</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>New Students This Week</span>
                    <span>{dashboardData?.thisWeekStudents || 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-700 h-2.5 rounded-full" 
                      style={{ width: `${Math.min(100, (dashboardData?.thisWeekStudents || 0) * 10)}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>New Teachers This Week</span>
                    <span>{dashboardData?.thisWeekTeachers || 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-green-700 h-2.5 rounded-full" 
                      style={{ width: `${Math.min(100, (dashboardData?.thisWeekTeachers || 0) * 20)}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Attendance Rate</span>
                    <span>{dashboardData?.attendanceRate || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-purple-700 h-2.5 rounded-full" 
                      style={{ width: `${dashboardData?.attendanceRate || 0}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Exams Today</span>
                    <span>{dashboardData?.examsToday || 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-amber-600 h-2.5 rounded-full" 
                      style={{ width: `${Math.min(100, (dashboardData?.examsToday || 0) * 25)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Section */}
          <div className="mt-6 bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl shadow-lg p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-xl font-semibold mb-2">System Summary</h2>
                <p className="opacity-90">
                  {dashboardData ? (
                    <>
                      {dashboardData.totalStudents} students, {dashboardData.totalTeachers} teachers, 
                      and {dashboardData.examsToday} exams today
                    </>
                  ) : (
                    "Loading system statistics..."
                  )}
                </p>
              </div>
              <button className="bg-white text-blue-700 hover:bg-gray-100 px-6 py-2 rounded-lg font-medium transition-colors">
                View Full Report
              </button>
            </div>
 <p className='text-center py-2'>
      Developed By {displayedText}
      <span className="cursor-blink">|</span>
    </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;