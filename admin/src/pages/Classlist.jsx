import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';
import toast,{Toaster} from 'react-hot-toast';
import { NavLink } from 'react-router-dom';

const Classlist = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [classes, setClasses] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);
  const [editFormData, setEditFormData] = useState({
    className: '',
    classTeacher: ''
  });
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const itemsPerPage = 20;
  const base_url = import.meta.env.VITE_API_KEY_Base_URL;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${base_url}/auth/all-classes`);
      setClasses(response.data.data);
      // Reset selection when data changes
      setSelectedClasses([]);
      setSelectAll(false);
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch classes');
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // Handle edit click - open modal and set current class data
  const handleEditClick = (classItem) => {
    setCurrentClass(classItem);
    setEditFormData({
      className: classItem.className,
      classTeacher: classItem.classTeacher
    });
    setIsEditModalOpen(true);
  };

  // Handle input change in edit form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle class update
  const handleUpdateClass = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${base_url}/api/admin/class/${currentClass._id}`, editFormData);
      toast.success('Class updated successfully');
      setIsEditModalOpen(false);
      fetchClasses(); // Refresh the list
    } catch (error) {
      console.error('Error updating class:', error);
      toast.error('Failed to update class');
    }
  };

  // Handle delete confirmation
  const handleDelete = (classId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteClass(classId);
      }
    });
  };

  // Delete a single class
  const deleteClass = async (classId) => {
    try {
      await axios.delete(`${base_url}/api/admin/class/${classId}`);
      toast.success('Class deleted successfully');
      fetchClasses(); // Refresh the list
    } catch (error) {
      console.error('Error deleting class:', error);
      toast.error('Failed to delete class');
    }
  };

  const totalPages = Math.ceil(classes.length / itemsPerPage);
  const paginatedData = classes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle individual selection
  const handleSelectClass = (classId) => {
    setSelectedClasses(prev => 
      prev.includes(classId) 
        ? prev.filter(id => id !== classId) 
        : [...prev, classId]
    );
  };

  // Handle select all on current page
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedClasses([]);
    } else {
      const currentPageIds = paginatedData.map(item => item._id);
      setSelectedClasses(currentPageIds);
    }
    setSelectAll(!selectAll);
  };

  // Handle delete selected classes
  const handleDeleteSelected = () => {
    if (selectedClasses.length === 0) {
      toast.error('No classes selected');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${selectedClasses.length} class(es)`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete them!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteSelectedClasses();
      }
    });
  };

  const deleteSelectedClasses = async () => {
    try {
      // Delete all selected classes at once using the new route
      await axios.delete(`${base_url}/api/admin/delete-all-classes`, {
        data: { classIds: selectedClasses }
      });
      
      toast.success(`${selectedClasses.length} class(es) deleted successfully`);
      setSelectedClasses([]);
      setSelectAll(false);
      fetchClasses(); // Refresh the class list
    } catch (error) {
      console.error('Error deleting classes:', error);
      toast.error('Failed to delete selected classes');
    }
  };

  return (
    <section className="font-nunito bg-[#f4f6f9] min-h-screen">
      <Header toggleSidebar={toggleSidebar} />
      <Toaster/>
      <div className="flex pt-[10vh] min-h-[90vh]">
        <Sidebar isOpen={isSidebarOpen} />

        <main className={`transition-all duration-300 flex-1 p-6 ${isSidebarOpen ? 'md:ml-[30%] lg:ml-[25%] xl:ml-[18%]' : 'ml-0'}`}>
          <div className="mb-4 text-gray-700 text-sm">
            <h1 className="text-xl font-semibold text-[#212529] mb-1">Class List</h1>
            <div className="text-sm text-[#6c757d]">
              Home <span className="mx-1 text-theme_color">›</span> <span className="text-theme_color font-medium">Classes</span>
            </div>
          </div>

          <div className="bg-white">
            <div className="px-6 py-4 font-semibold text-lg text-[#212529] flex justify-between items-center">
              <span>Classes</span>
              {selectedClasses.length > 0 && (
                <button 
                  onClick={handleDeleteSelected}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded flex items-center gap-2"
                >
                  <FaTrash /> Delete Selected ({selectedClasses.length})
                </button>
              )}
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
                          onChange={handleSelectAll}
                        /> 
                        ID
                      </th>
                      <th className="px-4 py-2">Class</th>
                      <th className="px-4 py-2">Class Teacher</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((item, i) => (
                      <tr key={i} className="border-b text-[14px] lg:text-[16px] border-gray-200 hover:bg-gray-50 text-[#212529]">
                        <td className="px-4 py-3 flex justify-start items-center gap-2">
                          <input 
                            type="checkbox" 
                            checked={selectedClasses.includes(item._id)}
                            onChange={() => handleSelectClass(item._id)}
                          /> 
                          {i+1}
                        </td>
                        <td className="px-4 py-3">
                          <NavLink to={`/class-section/class/${item.className}`}>
                            {item.className}
                          </NavLink>
                        </td>
                        <td className="px-4 py-3">{item.classTeacher}</td>
                        <td className="px-4 py-3 space-x-2 flex justify-start items-center">
                          <button 
                            onClick={() => handleEditClick(item)} 
                            className="w-[30px] cursor-pointer h-[30px] flex justify-center items-center rounded-[5px] text-white bg-green-500"
                          >
                            <FaEdit className="text-[15px]" />
                          </button>
                          <button 
                            onClick={() => handleDelete(item._id)} 
                            className="w-[30px] cursor-pointer h-[30px] flex justify-center items-center rounded-[5px] border text-white bg-red-500"
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

            {/* Pagination */}
            <div className="p-4 flex justify-end gap-2">
              <button
                className="px-3 py-1 border text-sm border-gray-300 rounded cursor-pointer hover:bg-gray-100 disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`px-3 py-1 border text-sm rounded border-gray-300 cursor-pointer ${currentPage === index + 1 ? 'bg-theme_color text-white' : 'hover:bg-gray-100'}`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className="px-3 py-1 border text-sm border-gray-300 rounded cursor-pointer hover:bg-gray-100 disabled:opacity-50"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Edit Class Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Class</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 text-[23px] cursor-pointer hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleUpdateClass}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="className">
                  Class Name
                </label>
                <input
                  type="text"
                  id="className"
                  name="className"
                  value={editFormData.className}
                  onChange={handleInputChange}
                  className=" appearance-none border border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight outline-theme_color"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="classTeacher">
                  Class Teacher
                </label>
                <input
                  type="text"
                  id="classTeacher"
                  name="classTeacher"
                  value={editFormData.classTeacher}
                  onChange={handleInputChange}
                  className=" appearance-none border border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight outline-theme_color"
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

export default Classlist;