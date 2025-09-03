import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import {
  FaUser, FaPhone, FaEnvelope, FaLock, FaMapMarkerAlt,
  FaGraduationCap, FaBook, FaIdBadge, FaUserTie, FaUserNurse, 
  FaCamera, FaVenusMars, FaIdCard
} from 'react-icons/fa';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const Newteacher = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const base_url = import.meta.env.VITE_API_KEY_Base_URL;
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    fatherName: '',
    motherName: '',
    address: '',
    gender: '',
    education: '',
    subject: '',
    mobile: '',
    email: '',
    password: '',
    nidNumber: '',
    emergencyContact: '',
    profilePic: null,
    nidPhoto: null
  });

  const [preview, setPreview] = useState({
    profilePic: null,
    nidPhoto: null
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const genderOptions = ['Male', 'Female', 'Other'];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePic' || name === 'nidPhoto') {
      const file = files[0];
      setFormData({ ...formData, [name]: file });
      setPreview({ ...preview, [name]: URL.createObjectURL(file) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.id) newErrors.id = 'ID is required';
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.fatherName) newErrors.fatherName = "Father's Name is required";
    if (!formData.motherName) newErrors.motherName = "Mother's Name is required";
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.education) newErrors.education = 'Education is required';
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.mobile.match(/^\d{11}$/)) newErrors.mobile = 'Valid 11-digit mobile number required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Valid email required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.nidNumber.match(/^[0-9]{10,17}$/)) newErrors.nidNumber = 'Valid NID number required';
    if (!formData.emergencyContact.match(/^\d{11}$/)) newErrors.emergencyContact = 'Valid 11-digit emergency contact required';
    if (!formData.profilePic) newErrors.profilePic = 'Profile picture is required';
    if (!formData.nidPhoto) newErrors.nidPhoto = 'NID photo is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Creating teacher...');

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await axios.post(`${base_url}/api/admin/create-teacher`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Teacher created successfully!', { id: toastId });
      
      // Reset form
      setFormData({
        id: '',
        name: '',
        fatherName: '',
        motherName: '',
        address: '',
        gender: '',
        education: '',
        subject: '',
        mobile: '',
        email: '',
        password: '',
        nidNumber: '',
        emergencyContact: '',
        profilePic: null,
        nidPhoto: null
      });
      setPreview({ profilePic: null, nidPhoto: null });
      setErrors({});
    } catch (err) {
      let errorMessage = 'Failed to create teacher';
      if (err.response) {
        if (err.response.data.error) {
          errorMessage = err.response.data.error;
        } else {
          errorMessage = 'Server error while creating teacher';
        }
      } else if (err.request) {
        errorMessage = 'Network error. Please try again.';
      }
      toast.error(errorMessage, { id: toastId });
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      id: '',
      name: '',
      fatherName: '',
      motherName: '',
      address: '',
      gender: '',
      education: '',
      subject: '',
      mobile: '',
      email: '',
      password: '',
      nidNumber: '',
      emergencyContact: '',
      profilePic: null,
      nidPhoto: null
    });
    setPreview({ profilePic: null, nidPhoto: null });
    setErrors({});
    toast('Form cleared', { icon: '🗑️' });
  };

  return (
    <section className="font-nunito h-screen bg-gray-50">
      <Header toggleSidebar={toggleSidebar} />
      <Toaster/>
      <div className="flex pt-[10vh] h-[90vh]">
        <Sidebar isOpen={isSidebarOpen} />
        <main className={`transition-all duration-300 flex-1 overflow-y-auto h-[90vh] ${isSidebarOpen ? 'md:ml-[30%] lg:ml-[25%] xl:ml-[18%]' : 'ml-0'}`}>
          <div className="w-full p-[20px]">
            <div className='px-[20px] py-[15px] bg-white border-[1px] border-gray-200 rounded-[5px] flex justify-between items-center mb-[20px]'>
              <h2 className="text-[20px] font-semibold text-theme_color">Add New Teacher</h2>
              <div className="text-sm text-[#6c757d]">
                Home <span className="mx-1 text-theme_color">›</span> <span className="text-theme_color font-medium">New Teacher</span>
              </div>
            </div>
            
            <div className='w-full bg-white p-[15px] border-[1px] border-gray-200 rounded-[5px]'>
              <h1 className='mb-[20px] text-[18px] lg:text-[23px] font-[500]'>Basic Information</h1>
              
              {/* Profile Picture Upload */}
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="relative w-40 h-40">
                  <div className="w-40 h-40 rounded-[10px] border-4 border-blue-500 bg-gray-100 overflow-hidden shadow-md">
                    {preview.profilePic ? (
                      <img
                        src={preview.profilePic}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FaUser className="text-4xl" />
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow cursor-pointer">
                    <FaCamera className="text-gray-700" />
                    <input
                      type="file"
                      name="profilePic"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>
                  {errors.profilePic && <p className="text-red-500 text-sm text-center mt-1">{errors.profilePic}</p>}
                </div>

                {/* NID Photo Upload */}
                <div className="relative w-40 h-40">
                  <div className="w-40 h-40 rounded-[10px] border-4 border-blue-500 bg-gray-100 overflow-hidden shadow-md">
                    {preview.nidPhoto ? (
                      <img
                        src={preview.nidPhoto}
                        alt="NID Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FaIdCard className="text-4xl" />
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow cursor-pointer">
                    <FaCamera className="text-gray-700" />
                    <input
                      type="file"
                      name="nidPhoto"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>
                  {errors.nidPhoto && <p className="text-red-500 text-sm text-center mt-1">{errors.nidPhoto}</p>}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="">
                <div className='w-full flex gap-3 lg:gap-[20px] flex-col md:flex-row mb-4'>
                  {/* Teacher ID */}
                  <div className="w-full md:w-[50%]">
                    <label className="text-[15px] lg:text-[16px] flex items-center gap-2">
                     Teacher ID
                    </label>
                    <input
                      type="text"
                      name="id"
                      value={formData.id}
                      onChange={handleChange}
                      placeholder="Enter Teacher ID"
                      className="w-full h-[45px] outline-none bg-transparent text-gray-700 mt-[4px] px-[10px] py-[6px] border-[1px] border-gray-300 rounded-[5px]"
                    />
                    {errors.id && <p className="text-red-500 text-sm mt-1">{errors.id}</p>}
                  </div>

                  {/* Full Name */}
                  <div className="w-full md:w-[50%]">
                    <label className="text-[15px] lg:text-[16px] flex items-center gap-2">
                    Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter Full Name"
                      className="w-full h-[45px] outline-none bg-transparent text-gray-700 mt-[4px] px-[10px] py-[6px] border-[1px] border-gray-300 rounded-[5px]"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                </div>

                <div className='w-full flex gap-3 lg:gap-[20px] flex-col md:flex-row mb-4'>
                  {/* Father's Name */}
                  <div className="w-full md:w-[50%]">
                    <label className="text-[15px] lg:text-[16px] flex items-center gap-2">
                     Father's Name
                    </label>
                    <input
                      type="text"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleChange}
                      placeholder="Enter Father's Name"
                      className="w-full h-[45px] outline-none bg-transparent text-gray-700 mt-[4px] px-[10px] py-[6px] border-[1px] border-gray-300 rounded-[5px]"
                    />
                    {errors.fatherName && <p className="text-red-500 text-sm mt-1">{errors.fatherName}</p>}
                  </div>

                  {/* Mother's Name */}
                  <div className="w-full md:w-[50%]">
                    <label className="text-[15px] lg:text-[16px] flex items-center gap-2">
                     Mother's Name
                    </label>
                    <input
                      type="text"
                      name="motherName"
                      value={formData.motherName}
                      onChange={handleChange}
                      placeholder="Enter Mother's Name"
                      className="w-full h-[45px] outline-none bg-transparent text-gray-700 mt-[4px] px-[10px] py-[6px] border-[1px] border-gray-300 rounded-[5px]"
                    />
                    {errors.motherName && <p className="text-red-500 text-sm mt-1">{errors.motherName}</p>}
                  </div>
                </div>

                <div className='w-full flex gap-3 lg:gap-[20px] flex-col md:flex-row mb-4'>
                  {/* Gender */}
                  <div className="w-full md:w-[50%]">
                    <label className="text-[15px] lg:text-[16px] flex items-center gap-2">
                       Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full h-[45px] outline-none bg-transparent text-gray-700 mt-[4px] px-[10px] py-[6px] border-[1px] border-gray-300 rounded-[5px]"
                    >
                      <option value="">Select Gender</option>
                      {genderOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                  </div>

                  {/* Education */}
                  <div className="w-full md:w-[50%]">
                    <label className="text-[15px] lg:text-[16px] flex items-center gap-2">
                      Education
                    </label>
                    <input
                      type="text"
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      placeholder="Enter Education"
                      className="w-full h-[45px] outline-none bg-transparent text-gray-700 mt-[4px] px-[10px] py-[6px] border-[1px] border-gray-300 rounded-[5px]"
                    />
                    {errors.education && <p className="text-red-500 text-sm mt-1">{errors.education}</p>}
                  </div>
                </div>

                <div className='w-full flex gap-3 lg:gap-[20px] flex-col md:flex-row mb-4'>
                  {/* Subject */}
                  <div className="w-full md:w-[50%]">
                    <label className="text-[15px] lg:text-[16px] flex items-center gap-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Enter Subject"
                      className="w-full h-[45px] outline-none bg-transparent text-gray-700 mt-[4px] px-[10px] py-[6px] border-[1px] border-gray-300 rounded-[5px]"
                    />
                    {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                  </div>

                  {/* Mobile Number */}
                  <div className="w-full md:w-[50%]">
                    <label className="text-[15px] lg:text-[16px] flex items-center gap-2">
                     Mobile Number
                    </label>
                    <input
                      type="text"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="Enter Mobile Number"
                      className="w-full h-[45px] outline-none bg-transparent text-gray-700 mt-[4px] px-[10px] py-[6px] border-[1px] border-gray-300 rounded-[5px]"
                    />
                    {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
                  </div>
                </div>

                <div className='w-full flex gap-3 lg:gap-[20px] flex-col md:flex-row mb-4'>
                  {/* Email */}
                  <div className="w-full md:w-[50%]">
                    <label className="text-[15px] lg:text-[16px] flex items-center gap-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter Email"
                      className="w-full h-[45px] outline-none bg-transparent text-gray-700 mt-[4px] px-[10px] py-[6px] border-[1px] border-gray-300 rounded-[5px]"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  {/* Password */}
                  <div className="w-full md:w-[50%]">
                    <label className="text-[15px] lg:text-[16px] flex items-center gap-2">
                       Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter Password"
                      className="w-full h-[45px] outline-none bg-transparent text-gray-700 mt-[4px] px-[10px] py-[6px] border-[1px] border-gray-300 rounded-[5px]"
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>
                </div>

                <div className='w-full flex gap-3 lg:gap-[20px] flex-col md:flex-row mb-4'>
                  {/* NID Number */}
                  <div className="w-full md:w-[50%]">
                    <label className="text-[15px] lg:text-[16px] flex items-center gap-2">
                      NID Number
                    </label>
                    <input
                      type="text"
                      name="nidNumber"
                      value={formData.nidNumber}
                      onChange={handleChange}
                      placeholder="Enter NID Number"
                      className="w-full h-[45px] outline-none bg-transparent text-gray-700 mt-[4px] px-[10px] py-[6px] border-[1px] border-gray-300 rounded-[5px]"
                    />
                    {errors.nidNumber && <p className="text-red-500 text-sm mt-1">{errors.nidNumber}</p>}
                  </div>

                  {/* Emergency Contact */}
                  <div className="w-full md:w-[50%]">
                    <label className="text-[15px] lg:text-[16px] flex items-center gap-2">
                      Emergency Contact
                    </label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      placeholder="Enter Emergency Contact"
                      className="w-full h-[45px] outline-none bg-transparent text-gray-700 mt-[4px] px-[10px] py-[6px] border-[1px] border-gray-300 rounded-[5px]"
                    />
                    {errors.emergencyContact && <p className="text-red-500 text-sm mt-1">{errors.emergencyContact}</p>}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-[15px] lg:text-[16px] flex items-center gap-2">
                   Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter Address"
                    className="w-full h-[150px] outline-none bg-transparent text-gray-700 mt-[4px] px-[10px] py-[6px] border-[1px] border-gray-300 rounded-[5px]"
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                <div className="flex justify-start items-center gap-[10px]">
                  <button 
                    type="submit" 
                    className="bg-theme_color cursor-pointer text-white px-8 py-3 rounded-lg font-[600] focus:outline-none transition duration-200 disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                  <button 
                    type="button" 
                    className="bg-red-200 text-red-500 px-8 cursor-pointer py-3 rounded-lg font-[600] hover:bg-red-300 focus:outline-none transition duration-200"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};

export default Newteacher;