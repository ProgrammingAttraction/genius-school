import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { FaChevronDown } from 'react-icons/fa';
import axios from 'axios';
import toast, { Toaster } from "react-hot-toast";

const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
const base_url = import.meta.env.VITE_API_KEY_Base_URL;

const Newexam = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [classes, setClasses] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const admin_info = JSON.parse(localStorage.getItem("genius_amin"));

  const [examRoutine, setExamRoutine] = useState([
    {
      examType: '',
      day: '',
      date: '',
      timeStart: '',
      timeEnd: '',
      subjectName: '',
      className: '',
      roomNumber: '',
      supervisor: '',
      createdBy: admin_info?.name,
      teacher_id: admin_info?._id,
    }
  ]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Fetch classes and exam types from API
  const fetchData = async () => {
    try {
      const [classesRes, examTypesRes] = await Promise.all([
        axios.get(`${base_url}/auth/all-classes`),
        axios.get(`${base_url}/api/admin/exam-name`)
      ]);
      
      setClasses(classesRes.data.data);
      setExamTypes(examTypesRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    examRoutine.forEach((entry, index) => {
      if (!entry.examType) {
        newErrors[`examType_${index}`] = 'Exam type is required';
        isValid = false;
      }
      if (!entry.day) {
        newErrors[`day_${index}`] = 'Day is required';
        isValid = false;
      }
      if (!entry.date) {
        newErrors[`date_${index}`] = 'Date is required';
        isValid = false;
      }
      if (!entry.className) {
        newErrors[`className_${index}`] = 'Class is required';
        isValid = false;
      }
      if (!entry.subjectName) {
        newErrors[`subjectName_${index}`] = 'Subject is required';
        isValid = false;
      }
      if (!entry.timeStart) {
        newErrors[`timeStart_${index}`] = 'Start time is required';
        isValid = false;
      }
      if (!entry.timeEnd) {
        newErrors[`timeEnd_${index}`] = 'End time is required';
        isValid = false;
      }
      if (!entry.roomNumber) {
        newErrors[`roomNumber_${index}`] = 'Room number is required';
        isValid = false;
      }
      if (!entry.supervisor) {
        newErrors[`supervisor_${index}`] = 'Supervisor is required';
        isValid = false;
      }
      if (entry.timeStart && entry.timeEnd && entry.timeStart >= entry.timeEnd) {
        newErrors[`timeRange_${index}`] = 'End time must be after start time';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...examRoutine];
    updated[index][name] = value;
    setExamRoutine(updated);
    
    // Clear error when field is changed
    if (errors[`${name}_${index}`]) {
      const newErrors = {...errors};
      delete newErrors[`${name}_${index}`];
      setErrors(newErrors);
    }
  };

  const addExam = () => {
    setExamRoutine([...examRoutine, {
      examType: '',
      day: '',
      date: '',
      timeStart: '',
      timeEnd: '',
      subjectName: '',
      className: '',
      roomNumber: '',
      supervisor: '',
      createdBy: admin_info?.name,
      teacher_id: admin_info?._id,
    }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill all required fields correctly');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(`${base_url}/api/admin/new-exam-routine`, { examRoutine });
      if (response.data.success) {
        setSubmitSuccess(true);
        toast.success(response.data.message);
        // Reset form after successful submission
        setExamRoutine([{
          examType: '',
          day: '',
          date: '',
          timeStart: '',
          timeEnd: '',
          subjectName: '',
          className: '',
          roomNumber: '',
          supervisor: '',
          createdBy: admin_info?.name,
          teacher_id: admin_info?._id,
        }]);
        
        setTimeout(() => setSubmitSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error saving exam routine:', err);
      let errorMessage = 'Error saving exam routine. Please try again.';
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeExam = (index) => {
    if (examRoutine.length <= 1) return;
    const updated = examRoutine.filter((_, i) => i !== index);
    setExamRoutine(updated);
    
    // Clean up related errors
    const newErrors = {...errors};
    Object.keys(newErrors).forEach(key => {
      if (key.endsWith(`_${index}`)) {
        delete newErrors[key];
      }
    });
    setErrors(newErrors);
  };

  return (
    <section className="font-nunito h-screen">
      <Header toggleSidebar={toggleSidebar} />
      <Toaster/>
      <div className="flex pt-[10vh] h-[90vh]">
        <Sidebar isOpen={isSidebarOpen} />
        <main className={`transition-all duration-300 flex-1 p-4 overflow-y-auto h-[90vh] ${isSidebarOpen ? 'md:ml-[30%] lg:ml-[25%] xl:ml-[18%]' : 'ml-0'}`}>
          <div className="bg-white border border-gray-200 p-6 w-full mt-6">
            <h2 className="text-xl font-semibold mb-4">Add Exam Routine</h2>
            <div className="text-sm text-[#6c757d] mb-[20px]">
              Home <span className="mx-1 text-theme_color">›</span>{' '}
              <span className="text-theme_color font-medium">New Exam Routine</span>
            </div>

            <form onSubmit={handleSubmit}>
              {examRoutine.map((entry, index) => (
                <div key={index} className="mb-6 pb-6 border-b border-gray-200 relative">
                  {examRoutine.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExam(index)}
                      className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                    >
                      × Remove
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Exam Type */}
                    <div>
                      <label className="block font-medium mb-1">Exam Type</label>
                      <select
                        name="examType"
                        value={entry.examType}
                        onChange={(e) => handleChange(index, e)}
                        className={`w-full border px-3 py-2 border-gray-300 rounded ${errors[`examType_${index}`] ? 'border-red-500' : ''}`}
                      >
                        <option value="">Select Exam Type</option>
                        {examTypes.map((exam) => (
                          <option key={exam._id} value={exam.name}>{exam.name}</option>
                        ))}
                      </select>
                      {errors[`examType_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`examType_${index}`]}</p>}
                    </div>

                    {/* Day */}
                    <div>
                      <label className="block font-medium mb-1">Day</label>
                      <select
                        name="day"
                        value={entry.day}
                        onChange={(e) => handleChange(index, e)}
                        className={`w-full border px-3 py-2 border-gray-300 rounded ${errors[`day_${index}`] ? 'border-red-500' : ''}`}
                      >
                        <option value="">Select Day</option>
                        {days.map((day) => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                      {errors[`day_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`day_${index}`]}</p>}
                    </div>

                    {/* Date */}
                    <div>
                      <label className="block font-medium mb-1">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={entry.date}
                        onChange={(e) => handleChange(index, e)}
                        className={`w-full border px-3 py-2 rounded border-gray-300 ${errors[`date_${index}`] ? 'border-red-500' : ''}`}
                      />
                      {errors[`date_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`date_${index}`]}</p>}
                    </div>

                    {/* Class */}
                    <div>
                      <label className="block font-medium mb-1">Class</label>
                      <select
                        name="className"
                        value={entry.className}
                        onChange={(e) => handleChange(index, e)}
                        className={`w-full border px-3 py-2 rounded border-gray-300 ${errors[`className_${index}`] ? 'border-red-500' : ''}`}
                      >
                        <option value="">Select Class</option>
                        {classes.map((cls) => (
                          <option key={cls._id} value={cls.className}>{cls.className}</option>
                        ))}
                      </select>
                      {errors[`className_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`className_${index}`]}</p>}
                    </div>

                    {/* Subject Name */}
                    <div>
                      <label className="block font-medium mb-1">Subject Name</label>
                      <input
                        type="text"
                        name="subjectName"
                        value={entry.subjectName}
                        onChange={(e) => handleChange(index, e)}
                        className={`w-full border px-3 py-2 rounded border-gray-300 ${errors[`subjectName_${index}`] ? 'border-red-500' : ''}`}
                        placeholder="Enter subject name"
                      />
                      {errors[`subjectName_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`subjectName_${index}`]}</p>}
                    </div>

                    {/* Room Number */}
                    <div>
                      <label className="block font-medium mb-1">Room Number</label>
                      <input
                        type="text"
                        name="roomNumber"
                        value={entry.roomNumber}
                        onChange={(e) => handleChange(index, e)}
                        className={`w-full border px-3 py-2 rounded border-gray-300 ${errors[`roomNumber_${index}`] ? 'border-red-500' : ''}`}
                        placeholder="Room 101"
                      />
                      {errors[`roomNumber_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`roomNumber_${index}`]}</p>}
                    </div>

                    {/* Supervisor */}
                    <div>
                      <label className="block font-medium mb-1">Supervisor</label>
                      <input
                        type="text"
                        name="supervisor"
                        value={entry.supervisor}
                        onChange={(e) => handleChange(index, e)}
                        className={`w-full border px-3 py-2 rounded border-gray-300 ${errors[`supervisor_${index}`] ? 'border-red-500' : ''}`}
                        placeholder="Teacher's name"
                      />
                      {errors[`supervisor_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`supervisor_${index}`]}</p>}
                    </div>

                    {/* Time Range */}
                    <div className="flex space-x-2 col-span-2">
                      <div className='w-[50%]'>
                        <label className="block font-medium mb-1">Start Time</label>
                        <input
                          type="time"
                          name="timeStart"
                          value={entry.timeStart}
                          onChange={(e) => handleChange(index, e)}
                          className={`w-full border px-3 py-2 rounded border-gray-300 ${errors[`timeStart_${index}`] || errors[`timeRange_${index}`] ? 'border-red-500' : ''}`}
                        />
                        {errors[`timeStart_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`timeStart_${index}`]}</p>}
                      </div>
                      <div className='w-[50%]'>
                        <label className="block font-medium mb-1">End Time</label>
                        <input
                          type="time"
                          name="timeEnd"
                          value={entry.timeEnd}
                          onChange={(e) => handleChange(index, e)}
                          className={`w-full border px-3 py-2 rounded border-gray-300 ${errors[`timeEnd_${index}`] || errors[`timeRange_${index}`] ? 'border-red-500' : ''}`}
                        />
                        {errors[`timeEnd_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`timeEnd_${index}`]}</p>}
                      </div>
                    </div>
                    {errors[`timeRange_${index}`] && <p className="text-red-500 text-sm mt-1 col-span-full">{errors[`timeRange_${index}`]}</p>}
                  </div>
                </div>
              ))}

              {/* Add More Button */}
              <button
                type="button"
                onClick={addExam}
                className="bg-[#0fb9b1] text-white text-[15px] px-4 font-nunito py-2 rounded font-semibold mb-4"
              >
                Add Another Exam
              </button>

              {/* Submit */}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-theme_color text-white font-semibold px-6 py-2 rounded-md disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Exam Routine'}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setExamRoutine([{
                      examType: '',
                      day: '',
                      date: '',
                      timeStart: '',
                      timeEnd: '',
                      subjectName: '',
                      className: '',
                      roomNumber: '',
                      supervisor: '',
                      createdBy: admin_info?.name,
                      teacher_id: admin_info?._id,
                    }])
                  }
                  className="bg-blue-900 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded-md"
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

export default Newexam;