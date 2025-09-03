import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';
import { NavLink } from 'react-router-dom';

const Allnotices = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNotice, setCurrentNotice] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    student_ids: [],
    student_names: [],
    image: '',
    priority: 'medium',
    is_active: true
  });
  const base_url = import.meta.env.VITE_API_KEY_Base_URL;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    fetchNotices();
  }, [base_url]);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${base_url}/api/admin/notices`);
      setNotices(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notices:', error);
      toast.error('Failed to fetch notices');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = async (id) => {
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
        await axios.delete(`${base_url}/api/admin/delete-notices/${id}`);
        setNotices(notices.filter(notice => notice._id !== id));
        toast.success('Notice deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting notice:', error);
      toast.error('Failed to delete notice');
    }
  };

  const openModal = (notice = null) => {
    if (notice) {
      setCurrentNotice(notice);
      setFormData({
        title: notice.title,
        content: notice.content,
        student_ids: notice.student_ids || [],
        student_names: notice.student_names || [],
        image: notice.image || '',
        priority: notice.priority || 'medium',
        is_active: notice.is_active !== undefined ? notice.is_active : true
      });
    } else {
      setCurrentNotice(null);
      setFormData({
        title: '',
        content: '',
        student_ids: [],
        student_names: [],
        image: '',
        priority: 'medium',
        is_active: true
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentNotice(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleArrayInputChange = (e, field) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      [field]: value.split(',').map(item => item.trim())
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentNotice) {
        // Update existing notice
        await axios.put(`${base_url}/api/admin/notices/${currentNotice._id}`, formData);
        toast.success('Notice updated successfully');
      } else {
        // Create new notice
        await axios.post(`${base_url}/api/admin/notices`, formData);
        toast.success('Notice created successfully');
      }
      fetchNotices();
      closeModal();
    } catch (error) {
      console.error('Error saving notice:', error);
      toast.error(`Failed to ${currentNotice ? 'update' : 'create'} notice`);
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
            <h1 className="text-xl font-semibold text-[#212529] mb-1">All Notices</h1>
            <div className="text-sm text-[#6c757d]">
              Home <span className="mx-1 text-theme_color">›</span> <span className="text-theme_color font-medium">Notices</span>
            </div>
          </div>

          <div className="bg-white  p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Notice List</h2>

            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-theme_color"></div>
              </div>
            ) : (
              <div className="overflow-x-auto border-[1px] border-gray-200">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-50">
                    <tr className='text-[13px] lg:text-[14px] text-[#495057]'>
                      <th className="px-6 py-3 text-left  text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left  text-gray-500 uppercase tracking-wider">Content</th>
                      <th className="px-6 py-3 text-left  text-gray-500 uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-3 text-left  text-gray-500 uppercase tracking-wider">Date Posted</th>
                      <th className="px-6 py-3 text-left  text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left  text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {notices.length > 0 ? (
                      notices.map((notice) => (
                        <tr key={notice._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{notice.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {notice.content.length > 50 ? `${notice.content.substring(0, 50)}...` : notice.content}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{notice.priority}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(notice.date_posted)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`px-2 py-1 rounded-full text-xs ${notice.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {notice.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => openModal(notice)}
                                className="bg-blue-500 rounded-[5px] px-[10px] cursor-pointer py-[8px] text-white"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(notice._id)}
                                className="bg-red-500 text-white px-[10px] py-[8px] cursor-pointer rounded-[5px]"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                          No notices found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal for Add/Edit Notice */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] bg-opacity-50 flex items-center justify-center z-[10000] p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between border-gray-200 items-center border-b p-4">
              <h3 className="text-lg font-semibold">
                {currentNotice ? 'Edit Notice' : 'Add New Notice'}
              </h3>
              <button onClick={closeModal} className="text-gray-500 cursor-pointer hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-4">
                <label className="block text-gray-700 border-gray-200 text-sm font-bold mb-2" htmlFor="title">
                  Title*
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded border-gray-200 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
                  Content*
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows="4"
                  className="shadow appearance-none border rounded border-gray-200 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="student_ids">
                    Student IDs (comma separated)
                  </label>
                  <input
                    type="text"
                    id="student_ids"
                    value={formData.student_ids.join(', ')}
                    onChange={(e) => handleArrayInputChange(e, 'student_ids')}
                    className="shadow appearance-none border rounded border-gray-200 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="student_names">
                    Student Names (comma separated)
                  </label>
                  <input
                    type="text"
                    id="student_names"
                    value={formData.student_names.join(', ')}
                    onChange={(e) => handleArrayInputChange(e, 'student_names')}
                    className="shadow appearance-none border rounded border-gray-200 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
   

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="priority">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full border-gray-200 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="mb-6 flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor="is_active" className="text-gray-700 text-sm font-bold">
                  Active Notice
                </label>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 hover:bg-gray-400 cursor-pointer text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-theme_color cursor-pointer text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  {currentNotice ? 'Update Notice' : 'Create Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Allnotices;