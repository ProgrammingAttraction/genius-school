import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaUser, FaPhone, FaEnvelope, FaLock, FaMapMarkerAlt,
  FaGraduationCap, FaBook, FaIdBadge, FaUserTie, FaUserNurse, 
  FaCamera, FaListOl, FaEye, FaEyeSlash
} from 'react-icons/fa';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import toast, { Toaster } from "react-hot-toast"

const Newstudent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const base_url = import.meta.env.VITE_API_KEY_Base_URL;
  const [address, setAddress] = useState("");
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [groups, setGroups] = useState(["Science", "Commerce", "Arts"]);
  const [religions, setReligions] = useState(["Islam", "Hinduism", "Christianity", "Buddhism", "Other"]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    fatherName: '',
    motherName: '',
    gender: '',
    birthdate: '',
    education: '',
    subject: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    classRoll: '',
    studentClass: '',
    section: '',
    group: '',
    religion: '',
    profilePic: null,
  });

  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(`${base_url}/auth/all-classes`);
        setClasses(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchClasses();
  }, [base_url]);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await axios.get(`${base_url}/auth/sections`);
        setSections(response.data.data);
      } catch (error) {
        console.error('Error fetching sections:', error);
      }
    };
    fetchSections();
  }, [base_url]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePic') {
      const file = files[0];
      setFormData({ ...formData, profilePic: file });
      setPreview(URL.createObjectURL(file));
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
    if (!address) newErrors.address = 'Address is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.birthdate) newErrors.birthdate = 'Birth Date is required';
    if (!formData.mobile.match(/^\d{11}$/)) newErrors.mobile = 'Valid 11-digit mobile number required';
    if (!formData.email.includes('@')) newErrors.email = 'Valid email required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.profilePic) newErrors.profilePic = 'Profile picture is required';
    if (!formData.classRoll) newErrors.classRoll = 'Class roll is required';
    if (!formData.studentClass) newErrors.studentClass = 'Class is required';
    if (!formData.section) newErrors.section = 'Section is required';
    // if (!formData.group) newErrors.group = 'Group is required';
    if (!formData.religion) newErrors.religion = 'Religion is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const submitData = new FormData();
    
    // Append all form fields to FormData
    submitData.append('id', formData.id);
    submitData.append('name', formData.name);
    submitData.append('fatherName', formData.fatherName);
    submitData.append('motherName', formData.motherName);
    submitData.append('address', address);
    submitData.append('gender', formData.gender);
    submitData.append('birthdate', formData.birthdate);
    submitData.append('subject', formData.subject);
    submitData.append('mobile', formData.mobile);
    submitData.append('email', formData.email);
    submitData.append('password', formData.password);
    submitData.append('classRoll', formData.classRoll);
    submitData.append('studentClass', formData.studentClass);
    submitData.append('section', formData.section);
    submitData.append('group', formData.group);
    submitData.append('religion', formData.religion);
    
    // Append the profile picture file
    if (formData.profilePic) {
      submitData.append('profilePic', formData.profilePic);
    }

    const toastId = toast.loading('Creating student...');

    axios.post(`${base_url}/api/admin/create-student`, submitData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((response) => {
      toast.success('Student created successfully!', { id: toastId });
      
      setFormData({
        id: '',
        name: '',
        fatherName: '',
        motherName: '',
        address: '',
        gender: '',
        birthdate: '',
        subject: '',
        mobile: '',
        email: '',
        password: '',
        confirmPassword: '',
        classRoll: '',
        studentClass: '',
        section: '',
        group: '',
        religion: '',
        profilePic: null,
      });
      setAddress("");
      setPreview(null);
      setErrors({});
    })
    .catch(err => {
      console.error('Submission error:', err);
      if (err.response) {
        // Handle specific errors from backend
        if (err.response.data.message === 'Student ID already exists') {
          toast.error('Student ID already exists', { id: toastId });
          setErrors({...errors, id: 'Student ID already exists'});
        } else if (err.response.data.message === 'Email already exists') {
          toast.error('Email already exists', { id: toastId });
          setErrors({...errors, email: 'Email already exists'});
        } else {
          toast.error(err.response.data.message || 'An error occurred', { id: toastId });
          setErrors({...errors, general: err.response.data.message || 'An error occurred'});
        }
      } else {
        toast.error('Network error or server unavailable', { id: toastId });
        setErrors({...errors, general: 'Network error or server unavailable'});
      }
    });
  };

  return (
    <section className="font-nunito h-screen bg-[#F2F1F2]">
      <Header toggleSidebar={toggleSidebar} />
      <Toaster/>
      <div className="flex pt-[10vh] h-[90vh]">
        <Sidebar isOpen={isSidebarOpen} />
        <main className={`transition-all duration-300 flex-1 overflow-y-auto h-[90vh] ${isSidebarOpen ? 'md:ml-[30%] lg:ml-[25%] xl:ml-[18%]' : 'ml-0'}`}>
          <div className="w-full p-[20px]">
            <div className='px-[20px] py-[15px] bg-white rounded-[5px] flex justify-between items-center mb-[20px]'>
              <h2 className="text-[20px] font-semibold text-gray-800">Add New Student</h2>
              <div className="text-sm text-[#6c757d]">
                Home <span className="mx-1 text-theme_color">›</span> <span className="text-theme_color font-medium">New Student</span>
              </div>
            </div>
            
            <div className='w-full bg-white p-[15px] rounded-[5px]'>
              <h1 className='mb-[20px] text-[18px] lg:text-[23px] font-[500]'>Basic Information</h1>
              {/* Profile Picture Upload */}
              <div className="flex mb-6">
                <div className="relative w-40 h-40">
                  <div className="w-40 h-40 rounded-[10px] border-4 border-blue-500 bg-gray-100 overflow-hidden shadow-md">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
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
                </div>
              </div>
              {errors.profilePic && <p className="text-red-500 text-sm text-center">{errors.profilePic}</p>}

              {success && <p className="text-green-600 mb-4 text-center">Student added successfully!</p>}

              <form onSubmit={handleSubmit} className="">
                <div className='w-full flex gap-3 lg:gap-[20px] flex-col md:flex-row mb-4'>
                  {/* Student ID */}
                  <div className="w-full md:w-[50%]">
                    <label className="text-[15px] lg:text-[16px]">
                      Student ID
                    </label>
                    <input
                      type="text"
                      name="id"
                      value={formData.id}
                      onChange={handleChange}
                      placeholder="Enter Student ID"
                      className="w-full h-[45px] outline-none bg-transparent text-gray-700 mt-[4px] px-[10px] py-[6px] border-[1px] border-gray-300 rounded-[5px]"
                    />
                    {errors.id && <p className="text-red-500 text-sm mt-1">{errors.id}</p>}
                  </div>

                  {/* Full Name */}
                  <div className="w-full md:w-[50%]">
                    <label className="text-[15px] lg:text-[16px]">
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
                    <label className="text-[15px] lg:text-[16px]">Father's Name</label>
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
                    <label className="text-[15px] lg:text-[16px]">
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
                  {/* Section */}
                  <div className="w-[100%] lg:w-[50%]">
                    <label className="text-[15px] lg:text-[16px]">
                      Section
                    </label>
                    <select
                      name="section"
                      value={formData.section}
                      onChange={handleChange}
                      className="w-full h-[45px] outline-none bg-transparent text-gray-700 mt-[4px] px-[10px] py-[6px] border-[1px] border-gray-300 rounded-[5px]"
                    >
                      <option value="">Select Section</option>
                      {sections.map((section) => (
                        <option key={section._id} value={section.sectionName}>
                          {section.sectionName}
                        </option>
                      ))}
                    </select>
                    {errors.section && <p className="text-red-500 text-sm mt-1">{errors.section}</p>}
                  </div>
                  
                  {/* Mobile Number */}
                  <div className="w-[100%] lg:w-[50%]">
                    <label className="text-[15px] lg:text-[16px]">
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
                  {/* Gender */}
                  <div className="w-[100%] lg:w-[50%]">
                    <label className="text-[15px] lg:text-[16px]">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full h-[45px] outline-none bg-transparent text-gray-700 mt-[4px] px-[10px] py-[6px] border-[1px] border-gray-300 rounded-[5px]"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                  </div>
                  
                  {/* Date of Birth */}
                  <div className="w-[100%] lg:w-[50%]">
                    <label className="text-[15px] lg:text-[16px]">
                      Date Of Birth
                    </label>
                    <input
                      type="date"
                      name="birthdate"
                      value={formData.birthdate}
                      onChange={handleChange}
                      placeholder="Enter Birth Date"
                      className="w-full h-[45px] outline-none bg-transparent text-gray-700 mt-[4px] px-[10px] py-[6px] border-[1px] border-gray-300 rounded-[5px]"
                    />
                    {errors.birthdate && <p className="text-red-500 text-sm mt-1">{errors.birthdate}</p>}
                  </div>
                </div>

                <div className='w-full flex gap-3 lg:gap-[20px] flex-col md:flex-row mb-4'>
                  {/* Group */}
                  <div className="w-[100%] lg:w-[50%]">
                    <label className="text-[15px] lg:text-[16px]">
                      Group (Optional)
                    </label>
                    <select
                      name="group"
                      value={formData.group}
                      onChange={handleChange}
                      className="w-full h-[45px] outline-none bg-transparent text-gray-700 mt-[4px] px-[10px] py-[6px] border-[1px] border-gray-300 rounded-[5px]"
                    >
                      <option value="">Select Group</option>
                      {groups.map((group, index) => (
                        <option key={index} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                    {errors.group && <p className="text-red-500 text-sm mt-1">{errors.group}</p>}
                  </div>
                  
                  {/* Religion */}
                  <div className="w-[100%] lg:w-[50%]">
                    <label className="text-[15px] lg:text-[16px]">
                      Religion
                    </label>
                    <select
                      name="religion"
                      value={formData.religion}
                      onChange={handleChange}
                      className="w-full h-[45px] outline-none bg-transparent text-gray-700 mt-[4px] px-[10px] py-[6px] border-[1px] border-gray-300 rounded-[5px]"
                    >
                      <option value="">Select Religion</option>
                      {religions.map((religion, index) => (
                        <option key={index} value={religion}>
                          {religion}
                        </option>
                      ))}
                    </select>
                    {errors.religion && <p className="text-red-500 text-sm mt-1">{errors.religion}</p>}
                  </div>
                </div>

                <div className='w-full flex gap-3 lg:gap-[20px] flex-col md:flex-row mb-4'>
                  {/* Class */}
                  <div className="w-full md:w-[50%]">
                    <label className="text-[15px] lg:text-[16px]">
                      Class
                    </label>
                    <select
                      name="studentClass"
                      value={formData.studentClass}
                      onChange={handleChange}
                      className="w-full h-[45px] outline-none bg-transparent text-gray-700 mt-[4px] px-[10px] py-[6px] border-[1px] border-gray-300 rounded-[5px]"
                    >
                      <option value="">Select Class</option>
                      {classes.map((classItem) => (
                        <option key={classItem._id} value={classItem.className}>
                          {classItem.className}
                        </option>
                      ))}
                    </select>
                    {errors.studentClass && <p className="text-red-500 text-sm mt-1">{errors.studentClass}</p>}
                  </div>
              
    {/* Class Roll */}
                  <div className="w-full md:w-[50%]">
                    <label className="text-[15px] lg:text-[16px]">
                      Class Roll
                    </label>
                    <input
                      type="text"
                      name="classRoll"
                      value={formData.classRoll}
                      onChange={handleChange}
                      placeholder="Enter Class Roll Number"
                      className="w-full h-[45px] outline-none bg-transparent text-gray-700 mt-[4px] px-[10px] py-[6px] border-[1px] border-gray-300 rounded-[5px]"
                    />
                    {errors.classRoll && <p className="text-red-500 text-sm mt-1">{errors.classRoll}</p>}
                  </div>
                
                </div>

         
  <div className='w-full flex gap-3 lg:gap-[20px] flex-col md:flex-row mb-4'>
      <div className="w-full md:w-[50%]">
                    <label className="text-[15px] lg:text-[16px]">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter Password"
                        className="w-full h-[45px] outline-none bg-transparent text-gray-700 mt-[4px] px-[10px] py-[6px] border-[1px] border-gray-300 rounded-[5px]"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>
                  {/* Confirm Password */}
                  <div className="w-full md:w-[50%]">
                    <label className="text-[15px] lg:text-[16px]">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm Password"
                        className="w-full h-[45px] outline-none bg-transparent text-gray-700 mt-[4px] px-[10px] py-[6px] border-[1px] border-gray-300 rounded-[5px]"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>
  {/* Password */}
                
              
                </div>
                    {/* Email */}
                  <div className="w-full mb-2">
                    <label className="text-[15px] lg:text-[16px]">
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
                <div className="mb-4">
                  <label className="text-[15px] lg:text-[16px]">
                    Address
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter Address"
                    className="w-full h-[150px] outline-none bg-transparent text-gray-700 mt-[4px] px-[10px] py-[6px] border-[1px] border-gray-300 rounded-[5px]"
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                <div className="flex justify-start items-center gap-[10px]">
                  <button 
                    type="submit" 
                    className="bg-theme_color cursor-pointer text-white px-8 py-3 rounded-lg focus:outline-none transition duration-200"
                  >
                    Submit
                  </button>
                  <button 
                    type="button" 
                    className="bg-red-200 cursor-pointer text-red-500 px-8 py-3 rounded-lg hover:bg-red-300 focus:outline-none transition duration-200"
                    onClick={() => {
                      setFormData({
                        id: '',
                        name: '',
                        fatherName: '',
                        motherName: '',
                        gender: '',
                        birthdate: '',
                        education: '',
                        subject: '',
                        mobile: '',
                        email: '',
                        password: '',
                        confirmPassword: '',
                        classRoll: '',
                        studentClass: '',
                        section: '',
                        group: '',
                        religion: '',
                        profilePic: null,
                      });
                      setAddress("");
                      setPreview(null);
                      setErrors({});
                    }}
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

export default Newstudent;