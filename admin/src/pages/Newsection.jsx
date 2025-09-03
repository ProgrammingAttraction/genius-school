import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import toast,{Toaster} from 'react-hot-toast';

const NewSection = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const base_url = import.meta.env.VITE_API_KEY_Base_URL;
  const [formData, setFormData] = useState({
    sectionName: '',
    sectionType: '',
  });

  const [errors, setErrors] = useState({});

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.sectionName) newErrors.sectionName = 'Section Name is required';
    if (!formData.sectionType) newErrors.sectionType = 'Section Type is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post(`${base_url}/api/admin/sections`, formData); // Adjust API endpoint if needed
      toast.success('Section added successfully!'); // Success toast
      console.log(response.data);
      setFormData({ sectionName: '', sectionType: '' });
    } catch (error) {
      toast.error('Error saving section.'); // Error toast
      console.error(error);
    }
  };

  const handleReset = () => {
    setFormData({ sectionName: '', sectionType: '' });
    setErrors({});
  };

  return (
    <section className="font-nunito h-screen">
      <Header toggleSidebar={toggleSidebar} />
      <Toaster/>
      <div className="flex pt-[10vh] h-[90vh]">
        <Sidebar isOpen={isSidebarOpen} />
        <main
          className={`transition-all duration-300 flex-1 p-4 overflow-y-auto h-[90vh] ${
            isSidebarOpen ? 'md:ml-[30%] lg:ml-[25%] xl:ml-[18%]' : 'ml-0'
          }`}
        >
          <div className="bg-white border border-gray-200 p-6 w-full mt-6">
            <h2 className="text-xl font-semibold mb-6">Add New Section</h2>

            <div className="text-sm text-[#6c757d] mb-[20px]">
              Home <span className="mx-1 text-theme_color">›</span>{' '}
              <span className="text-theme_color font-medium">Add Section</span>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Section Name */}
              <div className="mb-4">
                <label className="block font-medium mb-1">Section Name *</label>
                <input
                  type="text"
                  name="sectionName"
                  value={formData.sectionName}
                  onChange={handleChange}
                  placeholder='Section Name'
                  className="w-full border border-gray-300 rounded-[5px] px-4 py-2 outline-theme_color"
                />
                {errors.sectionName && <p className="text-red-500 text-sm mt-1">{errors.sectionName}</p>}
              </div>

              {/* Section Type */}
              <div className="mb-4">
                <label className="block font-medium mb-1">Section Type *</label>
                <input
                  type="text"
                  name="sectionType"
                  value={formData.sectionType}
                  onChange={handleChange}
                  placeholder='Section Type'
                  className="w-full border border-gray-300 rounded-[5px] px-4 py-2 outline-theme_color"
                />
                {errors.sectionType && <p className="text-red-500 text-sm mt-1">{errors.sectionType}</p>}
              </div>

              {/* Buttons */}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-theme_color cursor-pointer text-white font-semibold px-6 py-2 rounded-md"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-blue-900 hover:bg-blue-800 cursor-pointer text-white font-semibold px-6 py-2 rounded-md"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
};

export default NewSection;
