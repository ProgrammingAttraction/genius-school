import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { FaSearch, FaEllipsisV } from 'react-icons/fa';
import axios from 'axios';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Exam = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [examRoutines, setExamRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [examTypeFilter, setExamTypeFilter] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentExam, setCurrentExam] = useState(null);
  const [formData, setFormData] = useState({
    examType: '',
    day: '',
    className: '',
    subjectName: '',
    roomNumber: '',
    supervisor: '',
    timeStart: '',
    timeEnd: '',
    date: ''
  });
  const itemsPerPage = 5;
  const base_url = import.meta.env.VITE_API_KEY_Base_URL;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const fetchExamRoutines = async () => {
      try {
        const response = await axios.get(`${base_url}/auth/all-exam-routines`);
        setExamRoutines(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Error fetching exam routines:', err);
      }
    };

    fetchExamRoutines();
  }, [base_url]);

  // Flatten the exam routines array to show all exam entries
  const allExams = examRoutines.flatMap(routine => 
    routine.examRoutine.map(exam => ({
      ...exam,
      date: new Date(exam.date).toISOString().split('T')[0],
      id: routine._id,
      entryId: exam._id,
      time: `${exam.timeStart} - ${exam.timeEnd}`,
      createdAt: new Date(routine.createdAt).toLocaleDateString()
    }))
  );

  // Apply filters
  const filteredData = allExams.filter(exam => {
    return (
      exam.day.toLowerCase().includes(searchTerm.toLowerCase()) &&
      exam.className.toLowerCase().includes(classFilter.toLowerCase()) &&
      exam.examType.toLowerCase().includes(examTypeFilter.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (routineId, entryId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        await axios.delete(`${base_url}/api/admin/exam-routine/${routineId}/entry/${entryId}`);
        
        // Update the state to remove the deleted entry
        setExamRoutines(prevRoutines => 
          prevRoutines.map(routine => {
            if (routine._id === routineId) {
              return {
                ...routine,
                examRoutine: routine.examRoutine.filter(entry => entry._id !== entryId)
              };
            }
            return routine;
          }).filter(routine => routine.examRoutine.length > 0) // Remove routines with no entries
        );

        Swal.fire(
          'Deleted!',
          'The exam entry has been deleted.',
          'success'
        );
      }
    } catch (err) {
      console.error('Error deleting exam routine:', err);
      Swal.fire(
        'Error!',
        err.response?.data?.message || 'Failed to delete exam entry.',
        'error'
      );
    }
  };

  const handleEditClick = (exam) => {
    setCurrentExam(exam);
    setFormData({
      examType: exam.examType,
      day: exam.day,
      className: exam.className,
      subjectName: exam.subjectName,
      roomNumber: exam.roomNumber,
      supervisor: exam.supervisor,
      timeStart: exam.timeStart,
      timeEnd: exam.timeEnd,
      date: exam.date
    });
    setIsEditModalOpen(true);
  };

  const handleViewClick = (exam) => {
    setCurrentExam(exam);
    setIsViewModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateExam = async () => {
    try {
      const response = await axios.put(
        `${base_url}/api/admin/exam-routine/${currentExam.id}/entry/${currentExam.entryId}`,
        formData
      );

      // Update the state with the updated exam routine
      setExamRoutines(prevRoutines => 
        prevRoutines.map(routine => {
          if (routine._id === currentExam.id) {
            return {
              ...routine,
              examRoutine: routine.examRoutine.map(entry => 
                entry._id === currentExam.entryId ? { 
                  ...entry, 
                  ...formData,
                  date: formData.date // Ensure date is properly updated
                } : entry
              )
            };
          }
          return routine;
        })
      );

      Swal.fire(
        'Updated!',
        'The exam entry has been updated.',
        'success'
      );
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Error updating exam routine:', err);
      Swal.fire(
        'Error!',
        err.response?.data?.message || 'Failed to update exam entry.',
        'error'
      );
    }
  };

  if (loading) {
    return (
      <section className="font-nunito bg-[#f4f6f9] min-h-screen">
        <Header toggleSidebar={toggleSidebar} />
        <div className="flex pt-[10vh] min-h-[90vh]">
          <Sidebar isOpen={isSidebarOpen} />
          <main className={`transition-all duration-300 flex-1 p-6 ${isSidebarOpen ? 'md:ml-[30%] lg:ml-[25%] xl:ml-[18%]' : 'ml-0'}`}>
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-theme_color"></div>
            </div>
          </main>
        </div>
      </section>
    );
  }

  return (
    <section className="font-nunito bg-[#f4f6f9] min-h-screen">
      <Header toggleSidebar={toggleSidebar} />

      <div className="flex pt-[10vh] min-h-[90vh]">
        <Sidebar isOpen={isSidebarOpen} />

        <main className={`transition-all duration-300 flex-1 p-6 ${isSidebarOpen ? 'md:ml-[30%] lg:ml-[25%] xl:ml-[18%]' : 'ml-0'}`}>
          {/* Header */}
          <div className="mb-4 text-gray-700 text-sm">
            <h1 className="text-xl font-semibold text-[#212529] mb-1">Exam Routine</h1>
            <div className="text-sm text-[#6c757d]">
              Home <span className="mx-1 text-theme_color">›</span> <span className="text-theme_color font-medium">Exam Routine</span>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white">
            <div className="px-6 py-4 font-semibold text-lg text-[#212529]">
              Exam Schedule
            </div>

            {/* Filters */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <input 
                placeholder="Search by Day ..." 
                className="border border-gray-300 rounded outline-theme_color px-3 py-3 w-full text-sm" 
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <input 
                placeholder="Search by Class ..." 
                className="border border-gray-300 outline-theme_color rounded px-3 py-3 w-full text-sm" 
                value={classFilter}
                onChange={(e) => {
                  setClassFilter(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <input 
                placeholder="Search by Exam Type ..." 
                className="border border-gray-300 rounded px-3 outline-theme_color py-3 w-full text-sm" 
                value={examTypeFilter}
                onChange={(e) => {
                  setExamTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <button 
                className="bg-theme_color text-white rounded text-sm px-4 py-2 flex items-center justify-center gap-2"
                onClick={() => {
                  setSearchTerm('');
                  setClassFilter('');
                  setExamTypeFilter('');
                  setCurrentPage(1);
                }}
              >
                <FaSearch /> RESET
              </button>
            </div>

            {/* Table */}
            <section className='p-[20px]'>
              <div className="overflow-x-auto border-[1px] border-b-0 border-gray-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-[#f8f9fa] text-[14px] lg:text-[16px] text-[#495057] text-left">
                    <tr>
                      <th className="px-4 py-2">#</th>
                      <th className="px-4 py-2">Exam Type</th>
                      <th className="px-4 py-2">Day</th>
                      <th className="px-4 py-2">Class</th>
                      <th className="px-4 py-2">Subject</th>
                      <th className="px-4 py-2">Room</th>
                      <th className="px-4 py-2">Supervisor</th>
                      <th className="px-4 py-2">Time</th>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Created By</th>
                      <th className="px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((exam, i) => (
                        <tr key={i} className="border-b text-[14px] lg:text-[16px] border-gray-200 cursor-pointer hover:bg-[#f1f1f1] text-[#212529]">
                          <td className="px-4 py-3">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                          <td className="px-4 py-3">{exam.examType}</td>
                          <td className="px-4 py-3">{exam.day}</td>
                          <td className="px-4 py-3">{exam.className}</td>
                          <td className="px-4 py-3">{exam.subjectName}</td>
                          <td className="px-4 py-3">{exam.roomNumber}</td>
                          <td className="px-4 py-3">{exam.supervisor}</td>
                          <td className="px-4 py-3">{exam.time}</td>
                          <td className="px-4 py-3">{exam.date}</td>
                          <td className="px-4 py-3">{exam?.createdBy}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3 text-lg">
                              <div 
                                className="w-[30px] h-[30px] flex justify-center items-center rounded-[5px] bg-blue-500 text-white"
                                onClick={() => handleViewClick(exam)}
                              >
                                <FaEye className="cursor-pointer text-[15px]" title="View" />
                              </div>
                              <div 
                                className="w-[30px] h-[30px] flex justify-center items-center rounded-[5px] text-white bg-green-500 "
                                onClick={() => handleEditClick(exam)}
                              >
                                <FaEdit className="cursor-pointer text-[15px] " title="Edit" />
                              </div>
                              <div 
                                onClick={() => handleDelete(exam.id, exam.entryId)} 
                                className="w-[30px] h-[30px] flex justify-center items-center rounded-[5px] border text-white bg-red-500"
                              >
                                <FaTrash className="cursor-pointer text-[15px] " title="Delete" />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="10" className="px-4 py-6 text-center text-gray-500">
                          No exam routine data found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Pagination */}
            {filteredData.length > 0 && (
              <div className="p-4 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 border text-sm border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    Prev
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      className={`px-3 py-1 border text-sm rounded ${currentPage === index + 1 ? 'bg-theme_color text-white' : 'hover:bg-gray-100'}`}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    className="px-3 py-1 border border-gray-300 text-sm rounded hover:bg-gray-100 disabled:opacity-50"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-lg p-6 w-full md:w-[60%] lg:w-[40%]">
            <h2 className="text-xl font-semibold mb-4">Edit Exam Routine</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
                <input
                  type="text"
                  name="examType"
                  value={formData.examType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                <input
                  type="text"
                  name="day"
                  value={formData.day}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <input
                  type="text"
                  name="className"
                  value={formData.className}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  name="subjectName"
                  value={formData.subjectName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                <input
                  type="text"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supervisor</label>
                <input
                  type="text"
                  name="supervisor"
                  value={formData.supervisor}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    name="timeStart"
                    value={formData.timeStart}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    name="timeEnd"
                    value={formData.timeEnd}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-gray-300 cursor-pointer rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateExam}
                className="px-4 py-2 bg-theme_color cursor-pointer text-white rounded hover:bg-green-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && currentExam && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-lg p-6 w-full md:w-[60%] lg:w-[40%]">
            <h2 className="text-xl font-semibold mb-4">Exam Routine Details</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between pb-2">
                <span className="font-medium text-gray-700">Exam Type:</span>
                <span>{currentExam.examType}</span>
              </div>
              
              <div className="flex justify-between pb-2">
                <span className="font-medium text-gray-700">Day:</span>
                <span>{currentExam.day}</span>
              </div>
              
              <div className="flex justify-between pb-2">
                <span className="font-medium text-gray-700">Class:</span>
                <span>{currentExam.className}</span>
              </div>
              
              <div className="flex justify-between pb-2">
                <span className="font-medium text-gray-700">Subject:</span>
                <span>{currentExam.subjectName}</span>
              </div>
              
              <div className="flex justify-between pb-2">
                <span className="font-medium text-gray-700">Room Number:</span>
                <span>{currentExam.roomNumber}</span>
              </div>
              
              <div className="flex justify-between pb-2">
                <span className="font-medium text-gray-700">Supervisor:</span>
                <span>{currentExam.supervisor}</span>
              </div>
              
              <div className="flex justify-between  pb-2">
                <span className="font-medium text-gray-700">Time:</span>
                <span>{currentExam.timeStart} - {currentExam.timeEnd}</span>
              </div>
              
              <div className="flex justify-between  pb-2">
                <span className="font-medium text-gray-700">Date:</span>
                <span>{currentExam.date}</span>
              </div>

              <div className="flex justify-between  pb-2">
                <span className="font-medium text-gray-700">Created By:</span>
                <span>{currentExam.createdBy || 'N/A'}</span>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 bg-theme_color cursor-pointer text-white rounded "
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Exam;