import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaUser, FaBirthdayCake, FaPhone, FaEnvelope, FaHome, FaSchool, FaChalkboardTeacher, FaVenusMars, FaCalendarAlt, FaIdCard } from 'react-icons/fa';
import { IoMdMale, IoMdFemale } from 'react-icons/io';
import { BsCalendarCheck, BsCalendarX, BsCalendarMinus } from 'react-icons/bs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Sidebar from '../Sidebar';
import Header from '../Header';
import StudentProfile from './Studentprofile';
import { MdCheckCircle, MdCancel, MdAccessTime } from "react-icons/md";

const Viewstudent = () => {
    const { id } = useParams();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('calendar'); // 'calendar' or 'list'
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    
    const [student, setStudent] = useState({
        attendance: [],
        profilePic: '',
        name: '',
        id: '',
        educationStatus: '',
        studentClass: '',
        section: '',
        classRoll: '',
        subject: '',
        gender: '',
        birthdate: { $date: '' },
        education: '',
        address: '',
        mobile: '',
        email: '',
        fatherName: '',
        motherName: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    const [endDate, setEndDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0));
    const base_url = import.meta.env.VITE_API_KEY_Base_URL;

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const response = await fetch(`${base_url}/api/admin/student/${id}`);
                if (!response.ok) {
                    throw new Error('Student not found');
                }
                const data = await response.json();
                setStudent({
                    ...data.data,
                    attendance: data.data.attendance || []
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, [id]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const filteredAttendance = student.attendance.filter(record => {
        if (!record.date) return false;
        
        const recordDate = new Date(record.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        const recordDateOnly = new Date(recordDate.getFullYear(), recordDate.getMonth(), recordDate.getDate());
        const startDateOnly = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        const endDateOnly = new Date(end.getFullYear(), end.getMonth(), end.getDate() + 1);
        
        return recordDateOnly >= startDateOnly && recordDateOnly < endDateOnly;
    });

    const totalDays = filteredAttendance.length;
    const presentDays = filteredAttendance.filter(record => record.status === 'present').length;
    const absentDays = filteredAttendance.filter(record => record.status === 'absent').length;
    const lateDays = filteredAttendance.filter(record => record.status === 'late').length;
    const presentPercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

    // Calendar view functions
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        
        const days = [];
        
        // Add empty slots for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(null);
        }
        
        // Add all days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            const currentDate = new Date(year, month, i);
            days.push(currentDate);
        }
        
        return days;
    };

    const getAttendanceForDate = (date) => {
        if (!date) return null;
        
        const dateString = date.toISOString().split('T')[0];
        return student.attendance.find(record => {
            if (!record.date) return false;
            const recordDate = new Date(record.date).toISOString().split('T')[0];
            return recordDate === dateString;
        });
    };

    const renderDay = (day) => {
        if (!day) {
            return <div className="h-10 border border-gray-100"></div>;
        }
        
        const attendance = getAttendanceForDate(day);
        const isToday = day.toDateString() === new Date().toDateString();
        const isWeekend = day.getDay() === 0 || day.getDay() === 6;
        
        let dayClass = "h-10 flex items-center justify-center border border-gray-100 text-sm";
        let statusIndicator = null;
        
        if (isToday) {
            dayClass += " bg-blue-50 font-medium";
        }
        
        if (isWeekend) {
            dayClass += " bg-gray-50";
        }
        
        if (attendance) {
            if (attendance.status === 'present') {
                statusIndicator = <div className="w-2 h-2 rounded-full bg-blue-500 absolute top-1 right-1"></div>;
                dayClass += " relative";
            } else if (attendance.status === 'absent') {
                statusIndicator = <div className="w-2 h-2 rounded-full bg-red-500 absolute top-1 right-1"></div>;
                dayClass += " relative";
            } else if (attendance.status === 'late') {
                statusIndicator = <div className="w-2 h-2 rounded-full bg-amber-500 absolute top-1 right-1"></div>;
                dayClass += " relative";
            }
        }
        
        return (
            <div className={dayClass}>
                {day.getDate()}
                {statusIndicator}
            </div>
        );
    };

    const changeMonth = (increment) => {
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(newMonth.getMonth() + increment);
        setCurrentMonth(newMonth);
        
        // Update the date range filters as well
        const year = newMonth.getFullYear();
        const month = newMonth.getMonth();
        setStartDate(new Date(year, month, 1));
        setEndDate(new Date(year, month + 1, 0));
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            </div>
        );
    }

    return (
        <section className="font-nunito h-screen">
            <Header toggleSidebar={toggleSidebar} />

            <div className="flex pt-[10vh] h-[90vh]">
                <Sidebar isOpen={isSidebarOpen} />

                <main
                    className={`transition-all duration-300 flex-1 p-4 overflow-y-auto h-[90vh] ${
                        isSidebarOpen ? 'md:ml-[30%] lg:ml-[25%] xl:ml-[18%]' : 'ml-0'
                    }`}
                >
                    <div className="container mx-auto px-1 lg:px-4 py-8">
                        {/* Profile Section */}
                        <StudentProfile student={student}/>

                        {/* Attendance Section */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-6">Attendance Records</h3>

                                {/* Date Range Selector */}
                                <div className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Select Date Range</h4>
                                    <div className="flex flex-col md:flex-row gap-3">
                                        <div className="flex-1">
                                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Start Date</label>
                                            <input
                                                type="date"
                                                value={startDate.toISOString().split('T')[0]}
                                                onChange={(e) => setStartDate(new Date(e.target.value))}
                                                className="w-full p-2 text-sm border border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">End Date</label>
                                            <input
                                                type="date"
                                                value={endDate.toISOString().split('T')[0]}
                                                onChange={(e) => setEndDate(new Date(e.target.value))}
                                                className="w-full p-2 text-sm border border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div className="flex items-end">
                                            <button
                                                onClick={() => {
                                                    const today = new Date();
                                                    const first = new Date(today.getFullYear(), today.getMonth(), 1);
                                                    const last = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                                                    setStartDate(first);
                                                    setEndDate(last);
                                                    setCurrentMonth(new Date());
                                                }}
                                                className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition border border-blue-100"
                                            >
                                                Current Month
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Attendance Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                                    {/* Present */}
                                    <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
                                        <div className="p-2 bg-blue-100 rounded-full">
                                            <BsCalendarCheck className="text-blue-600 text-xl" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">Present</p>
                                            <p className="text-lg font-semibold text-gray-800">{presentDays} <span className="text-xs text-gray-500">days</span></p>
                                        </div>
                                    </div>

                                    {/* Absent */}
                                    <div className="flex items-center gap-3 bg-red-50 p-3 rounded-lg border border-red-100">
                                        <div className="p-2 bg-red-100 rounded-full">
                                            <BsCalendarX className="text-red-600 text-xl" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">Absent</p>
                                            <p className="text-lg font-semibold text-gray-800">{absentDays} <span className="text-xs text-gray-500">days</span></p>
                                        </div>
                                    </div>

                                    {/* Late */}
                                    <div className="flex items-center gap-3 bg-amber-50 p-3 rounded-lg border border-amber-100">
                                        <div className="p-2 bg-amber-100 rounded-full">
                                            <BsCalendarMinus className="text-amber-600 text-xl" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">Late</p>
                                            <p className="text-lg font-semibold text-gray-800">{lateDays} <span className="text-xs text-gray-500">days</span></p>
                                        </div>
                                    </div>

                                    {/* Progress Circle */}
                                    <div className="col-span-2 flex flex-col items-center justify-center gap-1 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Attendance</h4>
                                        <div className="relative w-24 h-24">
                                            <svg className="transform -rotate-90" viewBox="0 0 36 36">
                                                <path
                                                    className="text-gray-200"
                                                    stroke="currentColor"
                                                    strokeWidth="3.8"
                                                    fill="none"
                                                    d="M18 2.0845 a 15.9155 15.9155 0 1 1 0 31.831 a 15.9155 15.9155 0 1 1 0 -31.831"
                                                />
                                                <path
                                                    className="text-blue-500"
                                                    stroke="currentColor"
                                                    strokeWidth="3.8"
                                                    strokeDasharray={`${presentPercentage}, 100`}
                                                    fill="none"
                                                    d="M18 2.0845 a 15.9155 15.9155 0 1 1 0 31.831 a 15.9155 15.9155 0 1 1 0 -31.831"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-gray-800">
                                                {presentPercentage}%
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* View Toggle */}
                                <div className="flex mb-4 border-b border-gray-200">
                                    <button
                                        className={`px-4 py-2 text-sm font-medium ${activeTab === 'calendar' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                        onClick={() => setActiveTab('calendar')}
                                    >
                                        Calendar View
                                    </button>
                                    <button
                                        className={`px-4 py-2 text-sm font-medium ${activeTab === 'list' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                        onClick={() => setActiveTab('list')}
                                    >
                                        List View
                                    </button>
                                </div>

                                {/* Calendar View */}
                                {activeTab === 'calendar' && (
                                    <div className="mb-8">
                                        <div className="flex items-center justify-between mb-4">
                                            <button 
                                                onClick={() => changeMonth(-1)}
                                                className="p-2 rounded-md hover:bg-gray-100"
                                            >
                                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>
                                            <h4 className="text-lg font-semibold text-gray-800">
                                                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                            </h4>
                                            <button 
                                                onClick={() => changeMonth(1)}
                                                className="p-2 rounded-md hover:bg-gray-100"
                                            >
                                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </div>
                                        
                                        <div className="grid grid-cols-7 gap-0 border-b border-gray-200">
                                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                                <div key={day} className="py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {day}
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <div className="grid grid-cols-7 gap-0">
                                            {getDaysInMonth(currentMonth).map((day, index) => (
                                                <div key={index}>
                                                    {renderDay(day)}
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <div className="mt-4 flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                                <span className="text-xs text-gray-600">Present</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                <span className="text-xs text-gray-600">Absent</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                                <span className="text-xs text-gray-600">Late</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* List View */}
                                {activeTab === 'list' && (
                                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Date
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Day
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {filteredAttendance.length > 0 ? (
                                                    filteredAttendance.map((record, index) => {
                                                        let statusIcon = <MdAccessTime className="text-amber-500 text-base" />;
                                                        let statusClass = "bg-amber-50 text-amber-800";

                                                        if (record.status === "present") {
                                                            statusIcon = <MdCheckCircle className="text-blue-500 text-base" />;
                                                            statusClass = "bg-blue-50 text-blue-800";
                                                        } else if (record.status === "absent") {
                                                            statusIcon = <MdCancel className="text-red-500 text-base" />;
                                                            statusClass = "bg-red-50 text-red-800";
                                                        }

                                                        return (
                                                            <tr key={index} className="hover:bg-gray-50">
                                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                    {formatDate(record.date)}
                                                                </td>
                                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                                    {record.date
                                                                        ? new Date(record.date).toLocaleDateString("en-US", { weekday: "short" })
                                                                        : "N/A"}
                                                                </td>
                                                                <td className="px-4 py-3 whitespace-nowrap">
                                                                    <span
                                                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${statusClass}`}
                                                                    >
                                                                        {statusIcon}
                                                                        {record.status ? record.status.charAt(0).toUpperCase() + record.status.slice(1) : "N/A"}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                ) : (
                                                    <tr>
                                                        <td colSpan="3" className="px-4 py-4 text-center text-sm text-gray-500">
                                                            No attendance records found for the selected date range
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </section>
    );
};

export default Viewstudent;