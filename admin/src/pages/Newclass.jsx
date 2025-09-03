import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const Newclass = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const base_url = import.meta.env.VITE_API_KEY_Base_URL;
  const [formData, setFormData] = useState({
    className: '',
    classTeacher: '',
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
    if (!formData.className) newErrors.className = 'Class Name is required';
    if (!formData.classTeacher) newErrors.classTeacher = 'Class Teacher Name is required';
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
      const response = await axios.post(`${base_url}/api/admin/new-class`, formData); // Adjust API endpoint if needed
      if(response.data.success){
      toast.success('Class added successfully!'); // Success toast
      console.log(response.data);
      setFormData({ className: '', classTeacher: '' });
      }else{
              toast.error(response.data.message); // Success toast
      }

    } catch (error) {
      toast.error('Error saving class.'); // Error toast
      console.error(error);
    }
  };

  const handleReset = () => {
    setFormData({ className: '', classTeacher: '' });
    setErrors({});
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
            <h2 className="text-xl lg:text-[22px] font-semibold mb-6">Add New Class</h2>

            <div className="text-sm text-[#6c757d] mb-[20px]">
              Home <span className="mx-1 text-theme_color">›</span>{' '}
              <span className="text-theme_color font-medium">Add Class</span>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Class Name */}
              <div className="mb-4">
                <label className="block font-medium mb-1">Class Name *</label>
                <input
                  type="text"
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                  placeholder='Class Name'
                  className="w-full border border-gray-300 rounded-[5px] px-4 py-2 outline-theme_color"
                />
                {errors.className && <p className="text-red-500 text-sm mt-1">{errors.className}</p>}
              </div>

              {/* Class Teacher */}
              <div className="mb-4">
                <label className="block font-medium mb-1">Class Teacher Name *</label>
                <input
                  type="text"
                  name="classTeacher"
                  value={formData.classTeacher}
                  placeholder='Class Teacher Name'
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-[5px] px-4 py-2 outline-theme_color"
                />
                {errors.classTeacher && <p className="text-red-500 text-sm mt-1">{errors.classTeacher}</p>}
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
                  className="bg-blue-900 cursor-pointer hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded-md"
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

export default Newclass;
