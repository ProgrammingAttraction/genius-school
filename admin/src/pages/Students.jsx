import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { FaSearch, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';

const Students = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    studentClass: '',
    section: '',
    classRoll: '',
    address: '',
    mobile: '',
    email: '',
    profilePic: null
  });
  const [imagePreview, setImagePreview] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  
  const itemsPerPage = 10;
  const base_url = import.meta.env.VITE_API_KEY_Base_URL;

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${base_url}/api/admin/students`);
      if (response.data.success) {
        setStudents(response.data.data);
        setFilteredStudents(response.data.data);
      } else {
        setError('Failed to fetch students');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${base_url}/auth/all-classes`);
      setClasses(response.data.data);
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch classes');
    }
  };

  const fetchSections = async () => {
    try {
      const response = await axios.get(`${base_url}/auth/sections`);
      setSections(response.data.data);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchClasses();
    fetchSections();
  }, []);

  useEffect(() => {
    const filtered = students.filter(student => {
      const matchesSearch = 
        student.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.mobile?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesClass = selectedClass ? student.studentClass === selectedClass : true;
      const matchesSection = selectedSection ? student.section === selectedSection : true;
      const matchesGender = selectedGender ? student.gender === selectedGender : true;
      
      return matchesSearch && matchesClass && matchesSection && matchesGender;
    });
    setFilteredStudents(filtered);
    setCurrentPage(1);
    setSelectAll(false);
    setSelectedStudents([]);
  }, [searchTerm, selectedClass, selectedSection, selectedGender, students]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedData = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const truncateText = (text, maxLength = 12) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId) 
        : [...prev, studentId]
    );
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    if (isChecked) {
      setSelectedStudents(paginatedData.map(student => student._id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleDelete = (studentId) => {
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
          const response = await axios.delete(`${base_url}/api/admin/delete-student/${studentId}`);
          
          if (response.data.success) {
            setStudents(prevStudents => prevStudents.filter(student => student._id !== studentId));
            setFilteredStudents(prevStudents => prevStudents.filter(student => student._id !== studentId));
            setSelectedStudents(prev => prev.filter(id => id !== studentId));
            
            Swal.fire(
              'Deleted!',
              'Student has been deleted successfully.',
              'success'
            );
            fetchStudents();
          } else {
            throw new Error(response.data.message || 'Failed to delete student');
          }
        } catch (err) {
          Swal.fire(
            'Error!',
            err.message || 'Something went wrong while deleting the student.',
            'error'
          );
        }
      }
    });
  };

  const handleBulkDelete = () => {
    if (selectedStudents.length === 0) {
      Swal.fire('Info', 'Please select at least one student to delete', 'info');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${selectedStudents.length} student(s)`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete them!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`${base_url}/api/admin/delete-students`, {
            data: { studentIds: selectedStudents }
          });
          
          if (response.data.success) {
            Swal.fire(
              'Deleted!',
              `${response.data.deletedCount} student(s) deleted successfully.`,
              'success'
            );
            fetchStudents();
            setSelectedStudents([]);
            setSelectAll(false);
          } else {
            throw new Error(response.data.message || 'Failed to delete students');
          }
        } catch (err) {
          Swal.fire(
            'Error!',
            err.message || 'Something went wrong while deleting students.',
            'error'
          );
        }
      }
    });
  };

  const handleEditClick = (student) => {
    setCurrentStudent(student);
    setFormData({
      name: student.name,
      gender: student.gender,
      studentClass: student.studentClass,
      section: student.section,
      classRoll: student.classRoll,
      address: student.address,
      mobile: student.mobile,
      email: student.email,
      profilePic: null
    });
    setImagePreview(student.profilePic ? `${base_url}/images/${student.profilePic}` : 'https://i.pravatar.cc/150?img=7');
    setShowEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profilePic: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await axios.put(
        `${base_url}/api/admin/update-student/${currentStudent._id}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        Swal.fire(
          'Success!',
          'Student updated successfully!',
          'success'
        );
        fetchStudents();
        setShowEditModal(false);
      } else {
        throw new Error(response.data.message || 'Failed to update student');
      }
    } catch (error) {
      Swal.fire(
        'Error!',
        error.message || 'Something went wrong!',
        'error'
      );
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedClass('');
    setSelectedSection('');
    setSelectedGender('');
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

      <div className="flex pt-[10vh] min-h-[90vh]">
        <Sidebar isOpen={isSidebarOpen} />

        <main className={`transition-all duration-300 flex-1 p-6 ${isSidebarOpen ? 'md:ml-[30%] lg:ml-[25%] xl:ml-[18%]' : 'ml-0'}`}>
          {/* Breadcrumb */}
          <div className="mb-4 text-gray-700 text-sm">
            <h1 className="text-xl lg:text-[25px] font-semibold text-[#212529] mb-1">Students</h1>
            <div className="text-sm text-[#6c757d]">
              Home <span className="mx-1 text-theme_color">›</span> <span className="text-theme_color font-medium">All Students</span>
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-white">
            <div className="px-6 py-4 font-semibold lg:text-[22px] text-[#212529]">
              All Student Data
            </div>

            {/* Search Filters */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-5 gap-4">
              <input
                placeholder="Search by ID, Name, Phone or Email ..."
                className="border border-gray-300 rounded outline-theme_color px-3 py-2.5 w-full text-[15px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              
              <select
                className="border border-gray-300 rounded outline-theme_color px-3 py-2.5 w-full text-[15px]"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">All Classes</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls.className}>
                    {cls.className}
                  </option>
                ))}
              </select>
              
              <select
                className="border border-gray-300 rounded outline-theme_color px-3 py-2.5 w-full text-[15px]"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                <option value="">All Sections</option>
                {sections.map((section) => (
                  <option key={section._id} value={section.sectionName}>
                    {section.sectionName}
                  </option>
                ))}
              </select>
              
              <select
                className="border border-gray-300 rounded outline-theme_color px-3 py-2.5 w-full text-[15px]"
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
              >
                <option value="">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              
              <button 
                className="bg-theme_color text-white rounded text-sm px-4 py-2 flex items-center justify-center gap-2"
                onClick={resetFilters}
              >
                <FaSearch /> RESET
              </button>
            </div>

            {/* Bulk Actions */}
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleBulkDelete}
                  disabled={selectedStudents.length === 0}
                  className={`px-4 py-2 rounded text-sm flex items-center gap-2 ${
                    selectedStudents.length === 0 
                      ? 'bg-gray-100 cursor-not-allowed' 
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  <FaTrash /> Delete Selected ({selectedStudents.length})
                </button>
              </div>
            </div>

            {/* Table */}
            <section className="p-[20px]">
              <div className="overflow-x-auto border border-b-0 border-gray-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-[#f8f9fa] text-[#495057] text-left">
                    <tr className='text-[14px] lg:text-[16px]'>
                      <th className="px-4 py-2">
                        <input 
                          type="checkbox" 
                          checked={selectAll}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th className="px-4 py-2">ID</th>
                      <th className="px-4 py-2">Photo</th>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Gender</th>
                      <th className="px-4 py-2">Class</th>
                      <th className="px-4 py-2">Section</th>
                      <th className="px-4 py-2">Roll</th>
                      <th className="px-4 py-2">Address</th>
                      <th className="px-4 py-2">Phone</th>
                      <th className="px-4 py-2">Email</th>
                      <th className="px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((student, i) => (
                        <tr key={i} className="border-b text-[14px] lg:text-[16px] border-gray-200 hover:bg-[#f1f1f1] text-[#212529]">
                          <td className="px-4 py-3">
                            <input 
                              type="checkbox" 
                              checked={selectedStudents.includes(student._id)}
                              onChange={() => handleSelectStudent(student._id)}
                            />
                          </td>
                          <td className="px-4 py-3">{student.id}</td>
                          <td className="px-4 py-3">
                            <img
                              src={student.profilePic ? `${base_url}/images/${student.profilePic}` : 'https://i.pravatar.cc/150?img=7'}
                              alt="avatar"
                              className="w-8 h-8 rounded-full"
                            />
                          </td>
                          <td className="px-4 py-3">{student.name}</td>
                          <td className="px-4 py-3">{student.gender}</td>
                          <td className="px-4 py-3">{student.studentClass}</td>
                          <td className="px-4 py-3">{student.section}</td>
                          <td className="px-4 py-3">{student.classRoll}</td>
                          <td className="px-4 py-3" title={student.address}>
                            {truncateText(student.address)}
                          </td>
                          <td className="px-4 py-3">{student.mobile}</td>
                          <td className="px-4 py-3">{student.email}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3 text-lg">
                              <NavLink to={`/students/view-student/${student._id}`} className="w-[30px] h-[30px] flex justify-center items-center rounded-[5px] bg-blue-500 text-white ">
                                <FaEye className="cursor-pointer text-[15px]" title="View" />
                              </NavLink>
                              <div 
                                onClick={() => handleEditClick(student)} 
                                className="w-[30px] h-[30px] flex justify-center items-center rounded-[5px] text-white bg-green-500 "
                              >
                                <FaEdit className="cursor-pointer text-[15px] " title="Edit" />
                              </div>
                              <div onClick={() => handleDelete(student._id)} className="w-[30px] h-[30px] flex justify-center items-center rounded-[5px] border text-white bg-red-500">
                                <FaTrash className="cursor-pointer text-[15px] " title="Delete" />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="12" className="px-4 py-3 text-[15px] lg:text-[17px] text-center">
                          No students found matching your criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Pagination */}
            {filteredStudents.length > 0 && (
              <div className="p-4 flex justify-end gap-2">
                <button
                  className="px-3 py-1 border text-sm border-gray-300 cursor-pointer rounded hover:bg-gray-100 disabled:opacity-50"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >
                  Prev
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    className={`px-3 py-1 border text-sm rounded cursor-pointer border-gray-300 ${
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
                  className="px-3 py-1 border border-gray-300 cursor-pointer  text-sm rounded hover:bg-gray-100 disabled:opacity-50"
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

      {/* Edit Student Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Student</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                  <input
                    type="text"
                    name="studentClass"
                    value={formData.studentClass}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                  <input
                    type="text"
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                  <input
                    type="text"
                    name="classRoll"
                    value={formData.classRoll}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-300">
                      <img 
                        src={imagePreview} 
                        alt="Profile Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <input
                      type="file"
                      name="profilePic"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="border border-gray-300 rounded px-3 py-2 flex-1"
                    />
                  </div>
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
    </section>
  );
};

export default Students;