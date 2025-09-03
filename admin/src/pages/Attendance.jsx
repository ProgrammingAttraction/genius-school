import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { format } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Attendance = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [attendance, setAttendance] = useState({});
  const [error, setError] = useState('');
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [createdBy, setCreatedBy] = useState('Admin'); // Assuming you'll get this from auth context
  const base_url = import.meta.env.VITE_API_KEY_Base_URL;

  useEffect(() => {
    // Get user info from local storage or auth context
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setCreatedBy(user._id);
    }

    const fetchClasses = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${base_url}/auth/all-classes`);
        setClasses(response.data.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
        toast.error('Failed to load classes');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchSections = async () => {
      try {
        const response = await axios.get(`${base_url}/auth/sections`);
        setSections(response.data.data);
      } catch (error) {
        console.error('Error fetching sections:', error);
        toast.error('Failed to load sections');
      }
    };

    fetchClasses();
    fetchSections();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCheckboxChange = (id, type) => {
    setAttendance(prev => {
      const newAttendance = { ...prev };
      // Ensure only one status is selected
      newAttendance[id] = {
        present: type === 'present',
        absent: type === 'absent',
        late: type === 'late',
        remarks: newAttendance[id]?.remarks || ''
      };
      return newAttendance;
    });
  };

  const handleRemarksChange = (id, remarks) => {
    setAttendance(prev => {
      const newAttendance = { ...prev };
      if (newAttendance[id]) {
        newAttendance[id].remarks = remarks;
      } else {
        newAttendance[id] = {
          present: false,
          absent: false,
          late: false,
          remarks: remarks
        };
      }
      return newAttendance;
    });
  };

  const handleSelectAll = (type) => {
    const updated = {};
    students.forEach(student => {
      updated[student._id] = {
        present: type === 'present',
        absent: type === 'absent',
        late: type === 'late',
        remarks: attendance[student._id]?.remarks || ''
      };
    });
    setAttendance(updated);
  };

  const handleClassChange = e => {
    const selected = classes.find(c => c._id === e.target.value);
    setSelectedClass(selected?.className || '');
    setSelectedClassId(e.target.value);
    setSelectedSection('');
    setSelectedSectionId('');
    setStudents([]);
    setAttendance({});
  };

  const handleSectionChange = e => {
    const selected = sections.find(s => s._id === e.target.value);
    setSelectedSection(selected?.sectionName || '');
    setSelectedSectionId(e.target.value);
    setStudents([]);
    setAttendance({});
  };

  const handleDateChange = e => {
    setSelectedDate(e.target.value);
  };

  const handleShowStudents = async () => {
    if (!selectedClassId) {
      toast.error('Please select a class first');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const response = await axios.get(`${base_url}/api/admin/search-students`, {
        params: { 
          classId: selectedClassId,
          sectionId: selectedSection || null
        }
      });
      setStudents(response.data.data);
      // Initialize all students as present by default
      const defaultAttendance = {};
      response.data.data.forEach(student => {
        defaultAttendance[student._id] = {
          present: true,
          absent: false,
          late: false,
          remarks: ''
        };
      });
      setAttendance(defaultAttendance);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students for this class/section');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedClassId) {
      toast.error('Please select a class first');
      return;
    }

    if (!createdBy) {
      toast.error('User information not found. Please login again.');
      return;
    }

    if (Object.keys(attendance).length !== students.length) {
      toast.error('Please mark attendance for all students');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.post(`${base_url}/api/admin/attendance`, {
        classId: selectedClassId,
        sectionId: selectedSectionId || null,
        date: selectedDate,
        attendance,
        createdBy
      });
      
      toast.success('Attendance submitted successfully!');
      // Reset form after successful submission
      setStudents([]);
      setAttendance({});
    } catch (error) {
      console.error('Error submitting attendance:', error);
      toast.error(error.response?.data?.message || 'Failed to submit attendance');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="font-nunito min-h-screen bg-gray-50">
      <Header toggleSidebar={toggleSidebar} />
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex pt-[10vh] h-[90vh]">
        <Sidebar isOpen={isSidebarOpen} />

        <main
          className={`transition-all duration-300 flex-1 p-6 overflow-y-auto h-[90vh] ${
            isSidebarOpen ? 'md:ml-[30%] lg:ml-[25%] xl:ml-[18%]' : 'ml-0'
          }`}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#08085A] mb-1">Student Attendance System</h2>
            <p className="text-gray-600">Track and manage student attendance records</p>
          </div>

          {/* Filters Section */}
          <div className="bg-white p-4 rounded-[5px] border-[1px] border-gray-200 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <select
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedClassId}
                  onChange={handleClassChange}
                  disabled={isLoading}
                >
                  <option value="">Select a class</option>
                  {classes.map(classItem => (
                    <option key={classItem._id} value={classItem.className}>
                      Class {classItem.className}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                <select
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedSectionId}
                  onChange={handleSectionChange}
                  disabled={isLoading || !selectedClassId}
                >
                  <option value="">All Sections</option>
                  {sections.map(section => (
                    <option key={section._id} value={section._id}>
                      {section.sectionName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedDate}
                  onChange={handleDateChange}
                />
              </div>

              <div className="flex items-end">
                <button
                  className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-4 py-2 rounded-md w-full transition-colors"
                  onClick={handleShowStudents}
                  disabled={isLoading || !selectedClassId}
                >
                  {isLoading ? 'Loading...' : 'Load Students'}
                </button>
              </div>
            </div>
          </div>

          {/* Attendance Table Section */}
          {students.length > 0 && (
            <div className="bg-white rounded-[5px] border-[1px] border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex justify-start w-full gap-2 lg:justify-between md:flex-row flex-col items-center">
                <h3 className="font-semibold text-[17px] lg:text-lg text-gray-800">
                  Attendance for Class {selectedClass} 
                  {selectedSection ? ` - Section ${selectedSection}` : ''} 
                  - {format(new Date(selectedDate), 'MMM dd, yyyy')}
                </h3>
                <div className="relative w-full lg:w-64">
                  <input
                    type="text"
                    placeholder="Search students..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md outline-theme_color"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <svg
                    className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr className='text-[13px] lg:text-[14px] font-[700] text-nowrap'>
                      <th className="px-6 py-3 text-left text-gray-700 uppercase tracking-wider">
                        Student ID
                      </th>
                      <th className="px-6 py-3 text-left text-gray-700 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-center text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center justify-center">
                          <span>Present</span>
                          <button
                            onClick={() => handleSelectAll('present')}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                            title="Mark all present"
                          >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-center text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center justify-center">
                          <span>Absent</span>
                          <button
                            onClick={() => handleSelectAll('absent')}
                            className="ml-2 text-red-600 hover:text-red-800"
                            title="Mark all absent"
                          >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-center text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center justify-center">
                          <span>Late</span>
                          <button
                            onClick={() => handleSelectAll('late')}
                            className="ml-2 text-yellow-600 hover:text-yellow-800"
                            title="Mark all late"
                          >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-gray-700 uppercase tracking-wider">
                        Remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y text-[13px] lg:text-[15px] divide-gray-200">
                    {filteredStudents.map(student => (
                      <tr key={student._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          {student.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {student.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <input
                            type="checkbox"
                            name={`attendance-${student._id}`}
                            checked={attendance[student._id]?.present || false}
                            onChange={() => handleCheckboxChange(student._id, 'present')}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <input
                            type="checkbox"
                            name={`attendance-${student._id}`}
                            checked={attendance[student._id]?.absent || false}
                            onChange={() => handleCheckboxChange(student._id, 'absent')}
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <input
                            type="checkbox"
                            name={`attendance-${student._id}`}
                            checked={attendance[student._id]?.late || false}
                            onChange={() => handleCheckboxChange(student._id, 'late')}
                            className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            className="w-full border border-gray-300 px-3 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={attendance[student._id]?.remarks || ''}
                            onChange={(e) => handleRemarksChange(student._id, e.target.value)}
                            placeholder="Enter remarks"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Empty State */}
          {selectedClass && students.length === 0 && !isLoading && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Load students for Class {selectedClass}{selectedSection ? ` - Section ${selectedSection}` : ''} to mark attendance
              </p>
            </div>
          )}

          {/* Submit Button */}
          {students.length > 0 && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Submit Attendance'
                )}
              </button>
            </div>
          )}
        </main>
      </div>
    </section>
  );
};

export default Attendance;