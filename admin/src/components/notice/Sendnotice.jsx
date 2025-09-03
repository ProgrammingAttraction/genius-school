import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const Sendnotice = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const base_url = import.meta.env.VITE_API_KEY_Base_URL;
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    students: [], // Array of selected student IDs
    sendToAll: false
  });

  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Fetch students on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoadingStudents(true);
        const response = await axios.get(`${base_url}/api/admin/students`);
        setStudents(response.data.data);
        setFilteredStudents(response.data.data);
      } catch (error) {
        toast.error('Failed to fetch students');
        console.error(error);
      } finally {
        setIsLoadingStudents(false);
      }
    };

    fetchStudents();
  }, [base_url]);

  // Filter students based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleStudentSelect = (studentId) => {
    setFormData(prev => {
      if (prev.students.includes(studentId)) {
        // Remove student if already selected
        return {
          ...prev,
          students: prev.students.filter(id => id !== studentId),
          sendToAll: false
        };
      } else {
        // Add student if not selected
        return {
          ...prev,
          students: [...prev.students, studentId],
          sendToAll: false
        };
      }
    });
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setFormData(prev => ({
      ...prev,
      sendToAll: isChecked,
      students: isChecked ? students.map(student => student._id) : []
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('content', formData.description);
      
      // Append all selected student IDs
      const studentIds = formData.sendToAll 
        ? students.map(student => student._id)
        : formData.students;
      
      studentIds.forEach(id => {
        data.append('student_ids', id);
      });

      if (formData.image) {
        data.append('image', formData.image);
      }

      const response = await axios.post(`${base_url}/api/admin/notices`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success(`Notice sent successfully to ${studentIds.length} students!`);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        image: null,
        students: [],
        sendToAll: false
      });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to send notice');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="font-nunito h-screen">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex pt-[10vh] h-[90vh]">
        <Sidebar isOpen={isSidebarOpen} />
        <Toaster/>
        <main
          className={`transition-all duration-300 flex-1 p-4 overflow-y-auto h-[90vh] ${
            isSidebarOpen ? 'md:ml-[30%] lg:ml-[25%] xl:ml-[18%]' : 'ml-0'
          }`}
        >
          <div className="bg-white border border-gray-200 p-6 w-full mt-6">
            <h2 className="text-xl lg:text-[22px] font-semibold mb-6">Send Notice</h2>

            <div className="text-sm text-[#6c757d] mb-[20px]">
              Home <span className="mx-1 text-theme_color">›</span>{' '}
              <span className="text-theme_color font-medium">Send Notice</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Notice Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Notice Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-theme_color focus:border-transparent"
                  required
                />
              </div>

              {/* Notice Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-theme_color focus:border-transparent"
                  required
                ></textarea>
              </div>

              {/* Image Upload */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  Image (Optional)
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-theme_color focus:border-transparent"
                  accept="image/*"
                />
              </div>

              {/* Student Selection */}
              <div className="border border-gray-200 rounded-md p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-700">Select Recipients</h3>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="sendToAll"
                      name="sendToAll"
                      checked={formData.sendToAll}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-theme_color focus:ring-theme_color border-gray-300 rounded"
                    />
                    <label htmlFor="sendToAll" className="ml-2 block text-sm text-gray-700">
                      Send to all students
                    </label>
                  </div>
                </div>

                {!formData.sendToAll && (
                  <>
                    {/* Search Students */}
                    <div className="mb-4">
                      <input
                        type="text"
                        placeholder="Search students by name or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-theme_color focus:border-transparent"
                      />
                    </div>

                    {/* Student List */}
                    <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
                      {isLoadingStudents ? (
                        <div className="p-4 text-center text-gray-500">Loading students...</div>
                      ) : filteredStudents.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">No students found</div>
                      ) : (
                        <ul className="divide-y divide-gray-200">
                          {filteredStudents.map(student => (
                            <li key={student._id} className="p-3 hover:bg-gray-50">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`student-${student._id}`}
                                  checked={formData.students.includes(student._id)}
                                  onChange={() => handleStudentSelect(student._id)}
                                  className="h-4 w-4 text-theme_color focus:ring-theme_color border-gray-300 rounded"
                                />
                                <label htmlFor={`student-${student._id}`} className="ml-3 flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10">
                                    <img
                                      className="h-10 w-10 rounded-full object-cover"
                                      src={student.profilePic ? `${base_url}/images/${student.profilePic}` : 'https://via.placeholder.com/40'}
                                      alt=""
                                    />
                                  </div>
                                  <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-900">{student.name}</p>
                                    <p className="text-sm text-gray-500">ID: {student.id} | Class: {student.studentClass}</p>
                                  </div>
                                </label>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 bg-theme_color text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme_color ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Notice'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
};

export default Sendnotice;