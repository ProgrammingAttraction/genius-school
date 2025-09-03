import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { FaSearch, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';

const Lesson = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [dayFilter, setDayFilter] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(null);
  const itemsPerPage = 5;
  const base_url = import.meta.env.VITE_API_KEY_Base_URL;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    fetchLessons();
  }, [base_url, classFilter, dayFilter]);

  const fetchLessons = async () => {
    try {
      const params = {};
      if (classFilter) params.className = classFilter;
      if (dayFilter) params.day = dayFilter;
      
      const response = await axios.get(`${base_url}/auth/daily-diary`, { params });
      
      // Flatten the entries array and format the data
      const formattedLessons = response.data.data.flatMap(entry => ({
        ...entry,
        date: new Date(entry.date).toLocaleDateString(),
        class: entry.className,
        section: 'A', // Default section since it's not in the data
        time: 'N/A'   // Time not available in the diary data
      }));

      setLessons(formattedLessons);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error('Error fetching lessons:', err);
      toast.error('Failed to load lesson data');
    }
  };

  // Helper function to truncate text
  const truncateText = (text, maxLength = 15) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  // Apply search filter
  const filteredData = lessons.filter(lesson => {
    return (
      lesson.day.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (classFilter ? lesson.class.toLowerCase().includes(classFilter.toLowerCase()) : true) &&
      (dayFilter ? lesson.day.toLowerCase().includes(dayFilter.toLowerCase()) : true)
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (id, diaryId) => {
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
        await axios.delete(`${base_url}/api/admin/daily-diary/entry/${id}`, {
          data: { diaryId } // Send diaryId in request body
        });
        toast.success('Lesson deleted successfully');
        setLessons(lessons.filter(lesson => lesson._id !== id));
        Swal.fire(
          'Deleted!',
          'Your lesson has been deleted.',
          'success'
        );
      }
    } catch (err) {
      console.error('Error deleting lesson:', err);
      toast.error('Failed to delete lesson');
    }
  };

  const handleEditClick = (lesson) => {
    setCurrentLesson({
      ...lesson,
      date: new Date(lesson.date).toISOString().split('T')[0] // Format date for input
    });
    setIsEditModalOpen(true);
  };

  const handleViewClick = (lesson) => {
    setCurrentLesson(lesson);
    setIsViewModalOpen(true);
  };

  const handleUpdateLesson = async (e) => {
    e.preventDefault();
    try {
      const { _id, diaryId, ...updateData } = currentLesson;
      await axios.put(`${base_url}/api/admin/daily-diary/entry/${_id}`, {
        ...updateData,
        diaryId,
        date: new Date(updateData.date) // Convert date string to Date object
      });
      toast.success('Lesson updated successfully');
      setIsEditModalOpen(false);
      fetchLessons(); // Refresh the data
    } catch (err) {
      console.error('Error updating lesson:', err);
      toast.error('Failed to update lesson');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentLesson(prev => ({
      ...prev,
      [name]: value
    }));
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
            <h1 className="text-xl font-semibold text-[#212529] mb-1">Lesson Diary</h1>
            <div className="text-sm text-[#6c757d]">
              Home <span className="mx-1 text-theme_color">›</span> <span className="text-theme_color font-medium">Lesson Diary</span>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white">
            <div className="px-6 py-4 font-semibold text-lg text-[#212529]">
              Lesson Schedule
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
                placeholder="Filter by Class ..." 
                className="border border-gray-300 outline-theme_color rounded px-3 py-3 w-full text-sm" 
                value={classFilter}
                onChange={(e) => {
                  setClassFilter(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <input 
                placeholder="Filter by Day ..." 
                className="border border-gray-300 rounded px-3 outline-theme_color py-3 w-full text-sm" 
                value={dayFilter}
                onChange={(e) => {
                  setDayFilter(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <button 
                className="bg-theme_color text-white rounded text-sm px-4 py-2 flex items-center justify-center gap-2"
                onClick={() => {
                  setSearchTerm('');
                  setClassFilter('');
                  setDayFilter('');
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
                  <thead className="bg-[#f8f9fa] text-[14px] lg:text-[16px]  text-[#495057] text-left">
                    <tr>
                      <th className="px-4 py-2">#</th>
                      <th className="px-4 py-2">Day</th>
                      <th className="px-4 py-2">Class</th>
                      <th className="px-4 py-2">Subject</th>
                      <th className="px-4 py-2">Section</th>
                      <th className="px-4 py-2">Teacher</th>
                      <th className="px-4 py-2">Topic Covered</th>
                      <th className="px-4 py-2">Homework</th>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Created By</th>
                      <th className="px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((lesson, i) => (
                        <tr key={i} className="border-b border-gray-200 text-[14px] lg:text-[16px] cursor-pointer hover:bg-[#f1f1f1] text-[#212529]">
                          <td className="px-4 py-3">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                          <td className="px-4 py-3">{lesson.day}</td>
                          <td className="px-4 py-3">{lesson.class}</td>
                          <td className="px-4 py-3">{lesson.subjectName}</td>
                          <td className="px-4 py-3">{lesson.section}</td>
                          <td className="px-4 py-3">{lesson.teacherName}</td>
                          <td className="px-4 py-3" title={lesson.topicCovered}>
                            {truncateText(lesson.topicCovered)}
                          </td>
                          <td className="px-4 py-3" title={lesson.homework}>
                            {truncateText(lesson.homework)}
                          </td>
                          <td className="px-4 py-3">{lesson.date}</td>
                          <td className="px-4 py-3">{lesson?.createdBy}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3 text-lg">
                              <div 
                                className="w-[30px] h-[30px] flex justify-center items-center rounded-[5px] bg-blue-500 text-white"
                                onClick={() => handleViewClick(lesson)}
                              >
                                <FaEye className="cursor-pointer text-[15px]" title="View" />
                              </div>
                              <div 
                                className="w-[30px] h-[30px] flex justify-center items-center rounded-[5px] text-white bg-green-500"
                                onClick={() => handleEditClick(lesson)}
                              >
                                <FaEdit className="cursor-pointer text-[15px]" title="Edit" />
                              </div>
                              <div 
                                onClick={() => handleDelete(lesson._id, lesson.diaryId)} 
                                className="w-[30px] h-[30px] flex justify-center items-center rounded-[5px] border text-white bg-red-500"
                              >
                                <FaTrash className="cursor-pointer text-[15px]" title="Delete" />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="10" className="px-4 py-6 text-[14px] lg:text-[16px] text-center text-gray-500">
                          No lesson data found
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
      {isEditModalOpen && currentLesson && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] bg-opacity-50 flex items-center justify-center z-[1000] p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Lesson</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer text-2xl"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleUpdateLesson}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                  <input
                    type="text"
                    name="day"
                    value={currentLesson.day}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={currentLesson.date}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                  <input
                    type="text"
                    name="className"
                    value={currentLesson.className}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    name="subjectName"
                    value={currentLesson.subjectName}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
                  <input
                    type="text"
                    name="teacherName"
                    value={currentLesson.teacherName}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Topic Covered</label>
                  <textarea
                    name="topicCovered"
                    value={currentLesson.topicCovered}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    rows="3"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Homework</label>
                  <textarea
                    name="homework"
                    value={currentLesson.homework}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    rows="3"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                  <textarea
                    name="note"
                    value={currentLesson.note}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    rows="3"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                 className="px-4 py-2 border border-gray-300 cursor-pointer rounded text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                 className="px-4 py-2 bg-theme_color cursor-pointer text-white rounded hover:bg-blue-700"
                >
                  Update Lesson
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && currentLesson && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] bg-opacity-50 flex items-center justify-center z-[1000] p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Lesson Details</h3>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer text-2xl"
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Day</label>
                  <p className="text-gray-900">{currentLesson.day || 'N/A'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Date</label>
                  <p className="text-gray-900">{currentLesson.date || 'N/A'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Class</label>
                  <p className="text-gray-900">{currentLesson.class || 'N/A'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Section</label>
                  <p className="text-gray-900">{currentLesson.section || 'N/A'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Subject</label>
                  <p className="text-gray-900">{currentLesson.subjectName || 'N/A'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Teacher</label>
                  <p className="text-gray-900">{currentLesson.teacherName || 'N/A'}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-500 mb-1">Topic Covered</label>
                <p className="text-gray-900 whitespace-pre-wrap">{currentLesson.topicCovered || 'N/A'}</p>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-500 mb-1">Homework</label>
                <p className="text-gray-900 whitespace-pre-wrap">{currentLesson.homework || 'N/A'}</p>
              </div>
              
              {currentLesson.note && (
                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Note</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{currentLesson.note}</p>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Created By</label>
                  <p className="text-gray-900">{currentLesson.createdBy || 'N/A'}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 bg-theme_color cursor-pointer text-white rounded"
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

export default Lesson;