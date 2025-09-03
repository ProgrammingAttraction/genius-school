import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import toast, { Toaster } from "react-hot-toast";
import Swal from 'sweetalert2';

const Sectionlist = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sections, setSections] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [formData, setFormData] = useState({
    sectionName: '',
    sectionType: ''
  });
  const [selectedSections, setSelectedSections] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const itemsPerPage = 10;
  const base_url = import.meta.env.VITE_API_KEY_Base_URL;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const response = await axios.get(`${base_url}/auth/sections`);
      setSections(response.data.data);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  // Calculate paginated data
  const totalPages = Math.ceil(sections.length / itemsPerPage);
  const paginatedData = sections.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Selection handlers
  const handleSelectSection = (sectionId) => {
    setSelectedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId) 
        : [...prev, sectionId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedSections([]);
    } else {
      const currentPageIds = paginatedData.map(item => item._id);
      setSelectedSections(currentPageIds);
    }
    setSelectAll(!selectAll);
  };

  // Edit handlers
  const handleEdit = (section) => {
    setCurrentSection(section);
    setFormData({
      sectionName: section.sectionName,
      sectionType: section.sectionType
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${base_url}/api/admin/sections/${currentSection._id}`,
        formData
      );
      
      if (response.data.success) {
        toast.success('Section updated successfully');
        setShowEditModal(false);
        fetchSections();
      }
    } catch (error) {
      console.error('Error updating section:', error);
      toast.error('Failed to update section');
    }
  };

  // Delete handlers
  const handleDelete = async (sectionId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You want to delete this section?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${base_url}/api/admin/sections/${sectionId}`);
        toast.success('The section has been deleted.');
        setSections(sections.filter((section) => section._id !== sectionId));
      } catch (error) {
        toast.error('There was an error deleting the section.');
        console.error('Error deleting section:', error);
      }
    }
  };

  const handleDeleteSelected = async () => {
  if (selectedSections.length === 0) {
    toast.error('No sections selected');
    return;
  }

  const result = await Swal.fire({
    title: 'Are you sure?',
    text: `You are about to delete ${selectedSections.length} section(s)`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete them!',
    cancelButtonText: 'No, cancel!',
  });

  if (result.isConfirmed) {
    try {
      // Send array of IDs to delete
      const response = await axios.post(`${base_url}/api/admin/sections/delete-multiple`, {
        sectionIds: selectedSections
      });
      
      toast.success(response.data.message);
      setSelectedSections([]);
      setSelectAll(false);
      fetchSections(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete sections');
    }
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <section className="font-nunito bg-[#f4f6f9] min-h-screen">
      <Header toggleSidebar={toggleSidebar} />
      <Toaster/>
      <div className="flex pt-[10vh] min-h-[90vh]">
        <Sidebar isOpen={isSidebarOpen} />

        <main className={`transition-all duration-300 flex-1 p-6 ${isSidebarOpen ? 'md:ml-[30%] lg:ml-[25%] xl:ml-[18%]' : 'ml-0'}`}>
          <div className="mb-4 text-gray-700 text-sm">
            <h1 className="text-xl font-semibold text-[#212529] mb-1">Section List</h1>
            <div className="text-sm text-[#6c757d]">
              Home <span className="mx-1 text-theme_color">›</span> <span className="text-theme_color font-medium">Sections</span>
            </div>
          </div>

          <div className="bg-white">
            <div className="px-6 py-4 font-semibold text-lg text-[#212529] flex justify-between items-center">
              <span>Sections</span>
              {selectedSections.length > 0 && (
                <button 
                  onClick={handleDeleteSelected}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  <FaTrash /> Delete Selected ({selectedSections.length})
                </button>
              )}
            </div>

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
                      <th className="px-4 py-2">Section Name</th>
                      <th className="px-4 py-2">Section Type</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((section, i) => (
                      <tr key={i} className="border-b text-[14px] lg:text-[16px] border-gray-200 hover:bg-gray-50 text-[#212529]">
                        <td className="px-4 py-3 flex justify-start items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedSections.includes(section._id)}
                            onChange={() => handleSelectSection(section._id)}
                          />
                          {i+1}
                        </td>
                        <td className="px-4 py-3">{section.sectionName}</td>
                        <td className="px-4 py-3">{section.sectionType}</td>
                        <td className="px-4 py-3 space-x-2 flex justify-start items-center">
                          <button onClick={() => handleEdit(section)} className="w-[30px] cursor-pointer h-[30px] flex justify-center items-center rounded-[5px] text-white bg-green-500">
                            <FaEdit className="text-[15px]"/>
                          </button>
                          <button onClick={() => handleDelete(section._id)} className="w-[30px] cursor-pointer h-[30px] flex justify-center items-center rounded-[5px] border text-white bg-red-500">
                            <FaTrash className="text-[15px]"/>
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
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`px-3 py-1 border text-sm rounded border-gray-200 ${currentPage === index + 1 ? 'bg-theme_color text-white' : 'hover:bg-gray-100'}`}
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
        </main>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Section</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sectionName">
                  Section Name
                </label>
                <input
                  type="text"
                  id="sectionName"
                  name="sectionName"
                  value={formData.sectionName}
                  onChange={handleChange}
                  className=" appearance-none border rounded w-full py-2 px-3 border-gray-200 text-gray-700 leading-tight outline-theme_color"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sectionType">
                  Section Type
                </label>
                <input
                  type="text"
                  id="sectionType"
                  name="sectionType"
                  value={formData.sectionType}
                  onChange={handleChange}
                  className=" appearance-none border rounded w-full py-2 px-3 border-gray-200 text-gray-700 leading-tight outline-theme_color"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-200 cursor-pointer text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-theme_color cursor-pointer text-white rounded hover:bg-green-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Sectionlist;