import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';

const Examnamelist = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [exams, setExams] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentExam, setCurrentExam] = useState(null);
  const [editFormData, setEditFormData] = useState({
    examTitle: '',
    examType: ''
  });
  const [selectedExams, setSelectedExams] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const itemsPerPage = 5;
  const base_url = import.meta.env.VITE_API_KEY_Base_URL;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const fetchExams = async () => {
    try {
      const response = await axios.get(`${base_url}/api/admin/exam-name`);
      setExams(response.data);
      // Reset selections when exams are refreshed
      setSelectedExams([]);
      setSelectAll(false);
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch exams');
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const totalPages = Math.ceil(exams.length / itemsPerPage);
  const paginatedData = exams.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle individual checkbox selection
  const handleSelectExam = (examId) => {
    setSelectedExams(prev => 
      prev.includes(examId) 
        ? prev.filter(id => id !== examId) 
        : [...prev, examId]
    );
  };

  // Handle "Select All" checkbox
  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    if (isChecked) {
      setSelectedExams(paginatedData.map(exam => exam._id));
    } else {
      setSelectedExams([]);
    }
  };

  // Update select all checkbox when individual selections change
  useEffect(() => {
    const allSelected = paginatedData.length > 0 && 
      paginatedData.every(exam => selectedExams.includes(exam._id));
    setSelectAll(allSelected);
  }, [selectedExams, paginatedData]);

  const handleEditClick = (examItem) => {
    setCurrentExam(examItem);
    setEditFormData({
      examTitle: examItem.title,
      examType: examItem.name
    });
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateExam = async (e) => {
    e.preventDefault();

    if (!editFormData.examTitle || !editFormData.examType) {
      toast.error('All fields are required');
      return;
    }

    try {
      await axios.put(
        `${base_url}/api/admin/exam-name/${currentExam._id}`,
        editFormData
      );
      toast.success('Exam updated successfully');
      setIsEditModalOpen(false);
      fetchExams();
    } catch (error) {
      console.error('Error updating exam:', error);
      toast.error('Failed to update exam');
    }
  };

  const handleDelete = (examId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete this exam`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteExam(examId);
      }
    });
  };

  const handleDeleteSelected = () => {
    if (selectedExams.length === 0) {
      toast.error('Please select at least one exam to delete');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${selectedExams.length} exam(s)`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete them!',
      cancelButtonText: 'No, cancel!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteSelectedExams();
      }
    });
  };

  const deleteExam = async (examId) => {
    try {
      await axios.delete(`${base_url}/api/admin/exam-name/${examId}`);
      toast.success('Exam deleted successfully');
      fetchExams();
    } catch (error) {
      console.error('Error deleting exam:', error);
      toast.error('Failed to delete exam');
    }
  };

  const deleteSelectedExams = async () => {
    try {
      // Using the bulk delete endpoint
      await axios.delete(`${base_url}/api/admin/exam-name`, {
        data: { examIds: selectedExams }
      });
      toast.success(`${selectedExams.length} exam(s) deleted successfully`);
      fetchExams();
    } catch (error) {
      console.error('Error deleting exams:', error);
      toast.error('Failed to delete selected exams');
    }
  };

  return (
    <section className="font-nunito bg-[#f4f6f9] min-h-screen">
      <Header toggleSidebar={toggleSidebar} />
      <Toaster />
      <div className="flex pt-[10vh] min-h-[90vh]">
        <Sidebar isOpen={isSidebarOpen} />
        <main className={`transition-all duration-300 flex-1 p-6 ${isSidebarOpen ? 'md:ml-[30%] lg:ml-[25%] xl:ml-[18%]' : 'ml-0'}`}>
          <div className="mb-4 text-gray-700 text-sm">
            <h1 className="text-xl font-semibold text-[#212529] mb-1">Exam List</h1>
            <div className="text-sm text-[#6c757d]">
              Home <span className="mx-1 text-theme_color">›</span> <span className="text-theme_color font-medium">Exams</span>
            </div>
          </div>

          <div className="bg-white">
            <div className="px-6 py-4 flex justify-between items-center">
              <div className="font-semibold text-lg text-[#212529]">Exams</div>
              {selectedExams.length > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2"
                >
                  <FaTrash /> Delete Selected ({selectedExams.length})
                </button>
              )}
            </div>

            <section className="p-[20px]">
              <div className="overflow-x-auto border border-b-0 border-gray-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-[#f8f9fa] text-[#495057] text-left">
                    <tr className="text-[14px] lg:text-[16px]">
                      <th className="px-4 py-2 flex justify-start items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={selectAll}
                          onChange={handleSelectAll}
                        /> 
                        ID
                      </th>
                      <th className="px-4 py-2">Exam Title</th>
                      <th className="px-4 py-2">Exam Type</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((item, i) => (
                      <tr key={i} className="border-b text-[14px] lg:text-[16px] border-gray-200 hover:bg-gray-50 text-[#212529]">
                        <td className="px-4 py-3 flex justify-start items-center gap-2">
                          <input 
                            type="checkbox" 
                            checked={selectedExams.includes(item._id)}
                            onChange={() => handleSelectExam(item._id)}
                          /> 
                          {(currentPage - 1) * itemsPerPage + i + 1}
                        </td>
                        <td className="px-4 py-3">{item.title}</td>
                        <td className="px-4 py-3">{item.name}</td>
                        <td className="px-4 py-3 space-x-2 flex justify-start items-center">
                          <button
                            onClick={() => handleEditClick(item)}
                            className="w-[30px] cursor-pointer h-[30px] flex justify-center items-center rounded-[5px] text-white bg-green-500"
                          >
                            <FaEdit className="text-[15px]" />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="w-[30px] cursor-pointer h-[30px] flex justify-center items-center rounded-[5px] text-white bg-red-500"
                          >
                            <FaTrash className="text-[15px]" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <div className="p-4 flex justify-end gap-2">
              <button
                className="px-3 py-1 border text-sm border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
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
                className="px-3 py-1 border text-sm border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Exam</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 text-[23px] cursor-pointer hover:text-gray-700"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleUpdateExam}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="examTitle">
                  Exam Title
                </label>
                <input
                  type="text"
                  id="examTitle"
                  name="examTitle"
                  value={editFormData.examTitle}
                  onChange={handleInputChange}
                  className="border border-gray-200 rounded w-full py-2 px-3 text-gray-700 outline-theme_color"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="examType">
                  Exam Type
                </label>
                <input
                  type="text"
                  id="examType"
                  name="examType"
                  value={editFormData.examType}
                  onChange={handleInputChange}
                  className="border border-gray-200 rounded w-full py-2 px-3 text-gray-700 outline-theme_color"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-200 cursor-pointer hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-theme_color cursor-pointer hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Examnamelist;