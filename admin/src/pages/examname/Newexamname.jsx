import React, { useState } from 'react';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const Newexamname = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const base_url = import.meta.env.VITE_API_KEY_Base_URL;

  const [formData, setFormData] = useState({
    name: '',
    title: '',
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
    if (!formData.name) newErrors.name = 'Exam Name is required';
    if (!formData.title) newErrors.title = 'Exam Title is required';
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
      const response = await axios.post(`${base_url}/api/admin/exam-name`, formData);
      toast.success('Exam Name added successfully!');
      console.log(response.data);
      setFormData({ name: '', title: '' });
    } catch (error) {
      toast.error('Error saving exam.');
      console.error(error);
    }
  };

  const handleReset = () => {
    setFormData({ name: '', title: '' });
    setErrors({});
  };

  return (
    <section className="font-nunito h-screen">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex pt-[10vh] h-[90vh]">
        <Sidebar isOpen={isSidebarOpen} />
        <Toaster />
        <main
          className={`transition-all duration-300 flex-1 p-4 overflow-y-auto h-[90vh] ${
            isSidebarOpen ? 'md:ml-[30%] lg:ml-[25%] xl:ml-[18%]' : 'ml-0'
          }`}
        >
          <div className="bg-white border border-gray-200 p-6 w-full mt-6">
            <h2 className="text-xl lg:text-[22px] font-semibold mb-6">Add New Exam Name</h2>

            <div className="text-sm text-[#6c757d] mb-[20px]">
              Home <span className="mx-1 text-theme_color">›</span>{' '}
              <span className="text-theme_color font-medium">Add Exam Name</span>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Exam Name */}
              <div className="mb-4">
                <label className="block font-medium mb-1">Exam Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Exam Name"
                  className="w-full border border-gray-300 rounded-[5px] px-4 py-2 outline-theme_color"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Exam Title */}
              <div className="mb-4">
                <label className="block font-medium mb-1">Exam Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Exam Title"
                  className="w-full border border-gray-300 rounded-[5px] px-4 py-2 outline-theme_color"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
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

export default Newexamname;
