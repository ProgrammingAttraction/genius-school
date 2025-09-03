import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { FaSearch, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import toast, { Toaster } from "react-hot-toast";
import { NavLink } from 'react-router-dom';

const Teachers = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    motherName: '',
    address: '',
    gender: '',
    education: '',
    subject: '',
    mobile: '',
    email: '',
    profilePic: null
  });
  const [previewImage, setPreviewImage] = useState('');
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const itemsPerPage = 5;
  const base_url = import.meta.env.VITE_API_KEY_Base_URL;

  const fetchTeachers = async () => {
    try {
      const response = await axios.get(`${base_url}/api/admin/all-teachers`);
      if (response.data.success) {
        setTeachers(response.data.data);
        setFilteredTeachers(response.data.data);
      } else {
        setError('Failed to fetch teachers');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Apply filters whenever search terms change
  useEffect(() => {
    const filtered = teachers.filter(teacher => {
      const matchesId = teacher.id?.toString().toLowerCase().includes(searchId.toLowerCase());
      const matchesName = teacher.name?.toLowerCase().includes(searchName.toLowerCase());
      const matchesPhone = teacher.mobile?.toString().toLowerCase().includes(searchPhone.toLowerCase());
      
      return matchesId && matchesName && matchesPhone;
    });
    setFilteredTeachers(filtered);
    setCurrentPage(1);
    setSelectAll(false);
    setSelectedTeachers([]);
  }, [searchId, searchName, searchPhone, teachers]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const paginatedData = filteredTeachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const truncateText = (text, maxLength = 12) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedTeachers([]);
    } else {
      setSelectedTeachers(filteredTeachers.map(teacher => teacher._id));
    }
    setSelectAll(!selectAll);
  };

  const toggleTeacherSelection = (teacherId) => {
    if (selectedTeachers.includes(teacherId)) {
      setSelectedTeachers(selectedTeachers.filter(id => id !== teacherId));
    } else {
      setSelectedTeachers([...selectedTeachers, teacherId]);
    }
  };

  const handleDelete = (teacherId) => {
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
          const response = await axios.delete(`${base_url}/api/admin/delete-teacher/${teacherId}`);
          
          if (response.data.message) {
            setTeachers(prevTeachers => prevTeachers.filter(teacher => teacher._id !== teacherId));
            setFilteredTeachers(prevTeachers => prevTeachers.filter(teacher => teacher._id !== teacherId));
            setSelectedTeachers(prev => prev.filter(id => id !== teacherId));
            toast.success('Teacher has been deleted.');
          } else {
            throw new Error(response.data.error || 'Failed to delete teacher');
          }
        } catch (err) {
          toast.error(err.message || 'Something went wrong while deleting the teacher.');
        }
      }
    });
  };

  const handleBulkDelete = () => {
    if (selectedTeachers.length === 0) {
      toast.error('Please select at least one teacher to delete');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${selectedTeachers.length} teacher(s). This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete them!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`${base_url}/api/admin/delete-all-teachers`, {
            data: { teacherIds: selectedTeachers }
          });
          
          if (response.data.success) {
            toast.success(`${response.data.deletedCount} teacher(s) deleted successfully`);
            setSelectedTeachers([]);
            setSelectAll(false);
            fetchTeachers();
          } else {
            throw new Error(response.data.error || 'Failed to delete teachers');
          }
        } catch (err) {
          toast.error(err.message || 'Something went wrong while deleting teachers');
        }
      }
    });
  };

  const openEditModal = (teacher) => {
    setCurrentTeacher(teacher);
    setFormData({
      name: teacher.name || '',
      fatherName: teacher.fatherName || '',
      motherName: teacher.motherName || '',
      address: teacher.address || '',
      gender: teacher.gender || '',
      education: teacher.education || '',
      subject: teacher.subject || '',
      mobile: teacher.mobile || '',
      email: teacher.email || '',
      profilePic: null
    });
    setPreviewImage(teacher.profilePic ? `${base_url}/images/${teacher.profilePic}` : 'https://i.pravatar.cc/150?img=7');
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePic: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('fatherName', formData.fatherName);
      formDataToSend.append('motherName', formData.motherName);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('education', formData.education);
      formDataToSend.append('subject', formData.subject);
      formDataToSend.append('mobile', formData.mobile);
      formDataToSend.append('email', formData.email);
      if (formData.profilePic) {
        formDataToSend.append('profilePic', formData.profilePic);
      }

      const response = await axios.put(
        `${base_url}/api/admin/teacher/${currentTeacher._id}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.message) {
        toast.success('Teacher updated successfully');
        fetchTeachers();
        setIsEditModalOpen(false);
      } else {
        throw new Error(response.data.error || 'Failed to update teacher');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || 'Something went wrong while updating the teacher.');
    }
  };

  if (loading) {
    return (
      <section className="font-nunito bg-[#f4f6f9] min-h-screen">
        <Header toggleSidebar={toggleSidebar} />
        <div className="flex pt-[10vh] min-h-[90vh]">
          <Sidebar isOpen={isSidebarOpen} />
          <main className={`transition-all duration-300 flex-1 p-6 ${isSidebarOpen ? 'ml-[13%]' : 'ml-0'}`}>
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-theme_color"></div>
            </div>
          </main>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="font-nunito bg-[#f4f6f9] min-h-screen">
        <Header toggleSidebar={toggleSidebar} />
        <div className="flex pt-[10vh] min-h-[90vh]">
          <Sidebar isOpen={isSidebarOpen} />
          <main className={`transition-all duration-300 flex-1 p-6 ${isSidebarOpen ? 'ml-[13%]' : 'ml-0'}`}>
            <div className="bg-white p-6 rounded shadow">
              <div className="text-red-500">{error}</div>
            </div>
          </main>
        </div>
      </section>
    );
  }

  return (
    <section className="font-nunito bg-[#f4f6f9] min-h-screen">
      <Header toggleSidebar={toggleSidebar} />
      <Toaster/>
      <div className="flex pt-[10vh] min-h-[90vh]">
        <Sidebar isOpen={isSidebarOpen} />

        <main className={`transition-all duration-300 flex-1 p-6 ${isSidebarOpen ? 'md:ml-[30%] lg:ml-[25%] xl:ml-[18%]' : 'ml-0'}`}>
          {/* Breadcrumb */}
          <div className="mb-4 text-gray-700 text-sm">
            <h1 className="text-xl lg:text-[25px] font-semibold text-[#212529] mb-1">Teachers</h1>
            <div className="text-sm text-[#6c757d]">
              Home <span className="mx-1 text-theme_color">›</span> <span className="text-theme_color font-medium">All Teachers</span>
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-white">
            <div className="px-6 py-4 font-semibold text-lg lg:text-[22px] text-[#212529]">
              All Teachers Data
            </div>

            {/* Search Filters */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                placeholder="Search by ID ..."
                className="border border-gray-300 rounded outline-theme_color px-3 py-2.5 w-full text-[15px]"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
              <input
                placeholder="Search by Name ..."
                className="border border-gray-300 outline-theme_color rounded px-3 py-2.5 w-full text-[15px]"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
              <input
                placeholder="Search by Phone ..."
                className="border border-gray-300 rounded px-3 outline-theme_color py-2.5 w-full text-[15px]"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
              />
              <button 
                className="bg-theme_color text-white rounded text-sm px-4 py-2 flex items-center justify-center gap-2"
                onClick={() => {
                  setSearchId('');
                  setSearchName('');
                  setSearchPhone('');
                }}
              >
                <FaSearch /> RESET
              </button>
            </div>

            {/* Bulk Actions */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {selectedTeachers.length} teacher(s) selected
              </div>
              <div className="flex gap-2">
                {selectedTeachers.length > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm flex items-center gap-1"
                  >
                    <FaTrash /> Delete Selected
                  </button>
                )}
         
              </div>
            </div>

            {/* Table */}
            <section className="p-[20px]">
              <div className="overflow-x-auto border border-b-0 border-gray-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-[#f8f9fa] text-[#495057] text-left">
                    <tr className='text-[14px] lg:text-[16px]'>
                      <th className="px-4 py-2 flex justify-start items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={selectAll}
                          onChange={toggleSelectAll}
                        /> 
                        ID
                      </th>
                      <th className="px-4 py-2">Teacher ID</th>
                      <th className="px-4 py-2">Photo</th>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Gender</th>
                      <th className="px-4 py-2">Address</th>
                      <th className="px-4 py-2">Phone</th>
                      <th className="px-4 py-2">Email</th>
                      <th className="px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((teacher, i) => (
                        <tr key={i} className="border-b text-[14px] lg:text-[16px] border-gray-200 hover:bg-gray-50 text-[#212529]">
                          <td className="px-4 py-3 flex justify-start items-center gap-2">
                            <input 
                              type="checkbox" 
                              checked={selectedTeachers.includes(teacher._id)}
                              onChange={() => toggleTeacherSelection(teacher._id)}
                            /> 
                            {i+1}
                          </td>
                          <td className="px-4 py-3">{teacher.id}</td>
                          <td className="px-4 py-3">
                            <img
                              src={teacher.profilePic ? `${base_url}/images/${teacher.profilePic}` : 'https://i.pravatar.cc/150?img=7'}
                              alt="avatar"
                              className="w-8 h-8 rounded-full"
                            />
                          </td>
                          <td className="px-4 py-3">{teacher.name}</td>
                          <td className="px-4 py-3">{teacher.gender}</td>
                          <td className="px-4 py-3" title={teacher.address}>
                            {truncateText(teacher.address)}
                          </td>
                          <td className="px-4 py-3">{teacher.mobile}</td>
                          <td className="px-4 py-3">{teacher.email}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3 text-lg">
                              <NavLink to={`/teachers/view-teacher/${teacher._id}`} className="w-[30px] h-[30px] flex justify-center items-center rounded-[5px] bg-blue-500 text-white ">
                                <FaEye className="cursor-pointer text-[15px]" title="View" />
                              </NavLink>
                              <div 
                                className="w-[30px] h-[30px] flex justify-center items-center rounded-[5px] text-white bg-green-500 "
                                onClick={() => openEditModal(teacher)}
                              >
                                <FaEdit className="cursor-pointer text-[15px] " title="Edit" />
                              </div>
                              <div onClick={() => handleDelete(teacher._id)} className="w-[30px] h-[30px] flex justify-center items-center rounded-[5px] border text-white bg-red-500">
                                <FaTrash className="cursor-pointer text-[15px]" title="Delete" />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="12" className="px-4 py-[10px]  text-[15px] lg:text-[17px] text-center">
                          No teachers found! 
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Pagination */}
            {filteredTeachers.length > 0 && (
              <div className="p-4 flex justify-end gap-2">
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
                    className={`px-3 py-1 border text-sm rounded ${
                      currentPage === index + 1
                        ? 'bg-theme_color text-white'
                        : 'hover:bg-gray-100'
                    }`}
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
            )}
          </div>
        </main>
      </div>

      {/* Edit Teacher Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] bg-opacity-50 flex items-center overflow-y-auto justify-center z-[1000] p-4 no-scrollbar">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Edit Teacher</h3>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-500 text-[25px] hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Profile Picture */}
                  <div className="col-span-2 flex flex-col items-center mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-2 border-2 border-gray-200">
                      <img 
                        src={previewImage} 
                        alt="Profile Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <label className="cursor-pointer bg-theme_color text-white px-4 py-2 rounded">
                      Change Photo
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>

                  {/* Personal Information */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded outline-theme_color"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Father's Name</label>
                    <input
                      type="text"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded outline-theme_color"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Mother's Name</label>
                    <input
                      type="text"
                      name="motherName"
                      value={formData.motherName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded outline-theme_color"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded outline-theme_color"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Education</label>
                    <input
                      type="text"
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded outline-theme_color"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded outline-theme_color"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Mobile</label>
                    <input
                      type="text"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded outline-theme_color"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded outline-theme_color"
                      required
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded outline-theme_color"
                      rows="3"
                    ></textarea>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
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
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Teachers;