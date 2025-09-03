import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { FaSearch, FaEllipsisV } from 'react-icons/fa';
import axios from 'axios';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Routine = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [formData, setFormData] = useState({
    day: '',
    className: '',
    subjectName: '',
    section: 'A',
    teacherName: '',
    timeStart: '',
    timeEnd: ''
  });
  const itemsPerPage = 5;
  const base_url = import.meta.env.VITE_API_KEY_Base_URL;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    fetchRoutines();
  }, []);

  const fetchRoutines = async () => {
    try {
      const response = await axios.get(`${base_url}/auth/routines`);
      setRoutines(response.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error('Error fetching routines:', err);
    }
  };

  // Flatten the routines array to show all period entries
  const allPeriods = routines.flatMap(routine => 
    routine.routine.map(period => ({
      ...period,
      date: new Date(routine.createdAt).toLocaleDateString(),
      routineId: routine._id, // Parent routine document ID
      _id: period._id, // Individual period ID
      id: `${routine._id}-${period.day}-${period.timeStart}`,
      time: `${period.timeStart} - ${period.timeEnd}`,
      class: period.className,
      section: 'A'
    }))
  );

  // Apply filters
  const filteredData = allPeriods.filter(period => {
    return (
      period.day.toLowerCase().includes(searchTerm.toLowerCase()) &&
      period.class.toLowerCase().includes(classFilter.toLowerCase()) &&
      period.section.toLowerCase().includes(sectionFilter.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle View Click
  const handleViewClick = (routine) => {
    setSelectedRoutine(routine);
    setShowViewModal(true);
  };

  // Handle Edit Click
  const handleEditClick = (routine) => {
    setSelectedRoutine(routine);
    setFormData({
      day: routine.day,
      className: routine.className || routine.class,
      subjectName: routine.subjectName,
      section: routine.section,
      teacherName: routine.teacherName,
      timeStart: routine.timeStart,
      timeEnd: routine.timeEnd
    });
    setShowEditModal(true);
  };

  // Handle Form Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${base_url}/api/admin/routines/${selectedRoutine.routineId}`, {
        routineItemId: selectedRoutine._id,
        updatedData: formData
      });
      await fetchRoutines();
      setShowEditModal(false);
      Swal.fire('Success!', 'Routine updated successfully.', 'success');
    } catch (error) {
      console.error('Error updating routine:', error);
      Swal.fire('Error!', 'Failed to update routine.', 'error');
    }
  };

  // Handle Delete
  const handleDelete = (routine) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${base_url}/api/admin/routines/${routine.routineId}`, {
            data: { routineItemId: routine._id }
          });

          await fetchRoutines();
          Swal.fire('Deleted!', 'Routine has been deleted.', 'success');
        } catch (error) {
          console.error('Error deleting routine:', error);
          Swal.fire('Error!', 'Failed to delete routine.', 'error');
        }
      }
    });
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
          {/* View Modal */}
          {showViewModal && selectedRoutine && (
            <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] bg-opacity-50 flex items-center justify-center z-[1000]">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Routine Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Day</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedRoutine.day}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Class</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedRoutine.class}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Subject</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedRoutine.subjectName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Section</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedRoutine.section}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Teacher</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedRoutine.teacherName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Time</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedRoutine.time}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Date Created</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedRoutine.date}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Created By</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedRoutine?.createdBy || 'N/A'}</p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="px-4 py-2 bg-theme_color text-white rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Modal */}
          {showEditModal && (
            <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] bg-opacity-50 flex items-center justify-center z-[1000]">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Edit Routine</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Day</label>
                    <input
                      type="text"
                      name="day"
                      value={formData.day}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2 border-gray-200 outline-theme_color"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Class</label>
                    <input
                      type="text"
                      name="className"
                      value={formData.className}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2 border-gray-200 outline-theme_color"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Subject</label>
                    <input
                      type="text"
                      name="subjectName"
                      value={formData.subjectName}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2 border-gray-200 outline-theme_color"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Teacher</label>
                    <input
                      type="text"
                      name="teacherName"
                      value={formData.teacherName}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2 border-gray-200 outline-theme_color"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Start Time</label>
                      <input
                        type="time"
                        name="timeStart"
                        value={formData.timeStart}
                        onChange={handleInputChange}
                        className="w-full border rounded px-3 py-2 border-gray-200 outline-theme_color"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">End Time</label>
                      <input
                        type="time"
                        name="timeEnd"
                        value={formData.timeEnd}
                        onChange={handleInputChange}
                        className="w-full border rounded px-3 py-2 border-gray-200 outline-theme_color"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 border border-gray-300 cursor-pointer rounded text-gray-700 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-theme_color cursor-pointer text-white rounded hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="mb-4 text-gray-700 text-sm">
            <h1 className="text-xl font-semibold text-[#212529] mb-1">Class Routine</h1>
            <div className="text-sm text-[#6c757d]">
              Home <span className="mx-1 text-theme_color">›</span> <span className="text-theme_color font-medium">Class Routine</span>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white">
            <div className="px-6 py-4 font-semibold text-lg text-[#212529]">
              Routine Schedule
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
                placeholder="Search by Section ..." 
                className="border border-gray-300 rounded px-3 outline-theme_color py-3 w-full text-sm" 
                value={sectionFilter}
                onChange={(e) => {
                  setSectionFilter(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <button 
                className="bg-theme_color text-white rounded text-sm px-4 py-2 flex items-center justify-center gap-2"
                onClick={() => {
                  setSearchTerm('');
                  setClassFilter('');
                  setSectionFilter('');
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
                      <th className="px-4 py-2">Day</th>
                      <th className="px-4 py-2">Class</th>
                      <th className="px-4 py-2">Subject</th>
                      <th className="px-4 py-2">Section</th>
                      <th className="px-4 py-2">Teacher</th>
                      <th className="px-4 py-2">Time</th>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Created By</th>
                      <th className="px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((routine, i) => (
                        <tr key={routine.id} className="border-b text-[14px] lg:text-[16px] border-gray-200 cursor-pointer hover:bg-[#f1f1f1] text-[#212529]">
                          <td className="px-4 py-3">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                          <td className="px-4 py-3">{routine.day}</td>
                          <td className="px-4 py-3">{routine.class}</td>
                          <td className="px-4 py-3">{routine.subjectName}</td>
                          <td className="px-4 py-3">{routine.section}</td>
                          <td className="px-4 py-3">{routine.teacherName}</td>
                          <td className="px-4 py-3">{routine.time}</td>
                          <td className="px-4 py-3">{routine.date}</td>
                          <td className="px-4 py-3">{routine?.createdBy}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3 text-lg">
                              <div 
                                className="w-[30px] h-[30px] flex justify-center items-center rounded-[5px] bg-blue-500 text-white"
                                onClick={() => handleViewClick(routine)}
                              >
                                <FaEye className="cursor-pointer text-[15px]" title="View" />
                              </div>
                              <div 
                                className="w-[30px] h-[30px] flex justify-center items-center rounded-[5px] text-white bg-green-500"
                                onClick={() => handleEditClick(routine)}
                              >
                                <FaEdit className="cursor-pointer text-[15px]" title="Edit" />
                              </div>
                              <div 
                                className="w-[30px] h-[30px] flex justify-center items-center rounded-[5px] border text-white bg-red-500"
                                onClick={() => handleDelete(routine)}
                              >
                                <FaTrash className="cursor-pointer text-[15px]" title="Delete" />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="px-4 text-[14px] lg:text-[16px] py-6 text-center text-gray-500">
                          No routine data found
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
    </section>
  );
};

export default Routine;