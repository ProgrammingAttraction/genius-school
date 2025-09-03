import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import toast, { Toaster } from "react-hot-toast";

const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
const base_url = import.meta.env.VITE_API_KEY_Base_URL;

const Newlesson = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [classes, setClasses] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const admin_info=JSON.parse(localStorage.getItem("genius_amin"))

  const [entries, setEntries] = useState([
    {
      day: '',
      date: '',
      className: '',
      subjectName: '',
      teacherName: '',
      topicCovered: '',
      homework: '',
      note: '',
      createdBy:admin_info.name,
      teacher_id:admin_info._id
    }
  ]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Fetch classes from API
  const fetchData = async () => {
    try {
      const classesRes = await axios.get(`${base_url}/auth/all-classes`);
      setClasses(classesRes.data.data);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
      toast.error('Failed to load classes data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    entries.forEach((entry, index) => {
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
      if (!entry.teacherName) {
        newErrors[`teacherName_${index}`] = 'Teacher is required';
        isValid = false;
      }
      if (!entry.topicCovered) {
        newErrors[`topicCovered_${index}`] = 'Topic covered is required';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...entries];
    updated[index][name] = value;
    setEntries(updated);
    
    // Clear error when field is changed
    if (errors[`${name}_${index}`]) {
      const newErrors = {...errors};
      delete newErrors[`${name}_${index}`];
      setErrors(newErrors);
    }
  };

  const addEntry = () => {
    setEntries([...entries, {
      day: '',
      date: '',
      className: '',
      subjectName: '',
      teacherName: '',
      topicCovered: '',
      homework: '',
      note: ''
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
      // Format data for backend
      const formattedEntries = entries.map(entry => ({
        ...entry,
        date: new Date(entry.date).toISOString()
      }));

      const response = await axios.post(`${base_url}/api/admin/daily-diary`, { 
        entries: formattedEntries 
      });

      if (response.data.success) {
        toast.success(response.data.message);
        // Reset form after successful submission
        setEntries([{
          day: '',
          date: '',
          className: '',
          subjectName: '',
          teacherName: '',
          topicCovered: '',
          homework: '',
          note: ''
        }]);
      }else{
        toast.error(response.data.message);

      }
    } catch (err) {
      console.error('Error saving diary entries:', err);
      
      let errorMessage = 'Error saving diary entries. Please try again.';
      
      if (err.response) {
        // Handle backend validation errors
        if (err.response.status === 400 && err.response.data.errors) {
          const backendErrors = err.response.data.errors;
          
          const newErrors = {};
          backendErrors.forEach(errorObj => {
            Object.entries(errorObj.errors).forEach(([field, message]) => {
              newErrors[`${field}_${errorObj.index}`] = message;
            });
          });
          
          setErrors(newErrors);
          errorMessage = 'Please correct the highlighted fields';
        } 
        else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeEntry = (index) => {
    if (entries.length <= 1) return;
    const updated = entries.filter((_, i) => i !== index);
    setEntries(updated);
    
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
            <h2 className="text-xl font-semibold mb-4">Daily Diary</h2>
            <div className="text-sm text-[#6c757d] mb-[20px]">
              Home <span className="mx-1 text-theme_color">›</span>{' '}
              <span className="text-theme_color font-medium">New Daily Diary Entry</span>
            </div>

            <form onSubmit={handleSubmit}>
              {entries.map((entry, index) => (
                <div key={index} className="mb-6 pb-6 border-b border-gray-200 relative">
                  {entries.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEntry(index)}
                      className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                    >
                      × Remove
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Day */}
                    <div>
                      <label className="block font-medium mb-1">Day</label>
                      <select
                        name="day"
                        value={entry.day}
                        onChange={(e) => handleChange(index, e)}
                        className={`w-full border px-3 py-2 border-gray-300 rounded ${errors[`day_${index}`] ? 'border-red-500' : ''}`}
                        required
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
                        required
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
                        required
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
                        required
                      />
                      {errors[`subjectName_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`subjectName_${index}`]}</p>}
                    </div>

                    {/* Teacher Name */}
                    <div>
                      <label className="block font-medium mb-1">Teacher Name</label>
                      <input
                        type="text"
                        name="teacherName"
                        value={entry.teacherName}
                        onChange={(e) => handleChange(index, e)}
                        className={`w-full border px-3 py-2 rounded border-gray-300 ${errors[`teacherName_${index}`] ? 'border-red-500' : ''}`}
                        placeholder="Enter teacher name"
                        required
                      />
                      {errors[`teacherName_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`teacherName_${index}`]}</p>}
                    </div>

                    {/* Topic Covered */}
                    <div className="col-span-3">
                      <label className="block font-medium mb-1">Class Work</label>
                      <textarea
                        name="topicCovered"
                        value={entry.topicCovered}
                        onChange={(e) => handleChange(index, e)}
                        className={`w-full border px-3 py-2 rounded border-gray-300 ${errors[`topicCovered_${index}`] ? 'border-red-500' : ''}`}
                        placeholder="Describe the topic covered in class"
                        rows="2"
                        required
                      />
                      {errors[`topicCovered_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`topicCovered_${index}`]}</p>}
                    </div>

                    {/* Homework */}
                    <div className="col-span-3">
                      <label className="block font-medium mb-1">Homework</label>
                      <textarea
                        name="homework"
                        value={entry.homework}
                        onChange={(e) => handleChange(index, e)}
                        className="w-full border px-3 py-2 rounded border-gray-300"
                        placeholder="Describe the homework assigned"
                        rows="2"
                      />
                    </div>

                    {/* Note */}
                    <div className="col-span-3">
                      <label className="block font-medium mb-1">Note</label>
                      <textarea
                        name="note"
                        value={entry.note}
                        onChange={(e) => handleChange(index, e)}
                        className="w-full border px-3 py-2 rounded border-gray-300"
                        placeholder="Any additional notes"
                        rows="2"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Add More Button */}
              <button
                type="button"
                onClick={addEntry}
                className="bg-[#0fb9b1] text-white text-[15px] px-4 font-nunito py-2 rounded font-semibold mb-4"
              >
                Add Another Entry
              </button>

              {/* Submit */}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-theme_color text-white font-semibold px-6 py-2 rounded-md disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Diary Entries'}
                </button>
                <button
                  type="button"
                  onClick={() => setEntries([{
                    day: '',
                    date: '',
                    className: '',
                    subjectName: '',
                    teacherName: '',
                    topicCovered: '',
                    homework: '',
                    note: ''
                  }])}
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

export default Newlesson;