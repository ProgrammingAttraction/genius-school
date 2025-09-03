import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { FaUserPlus } from 'react-icons/fa';
import axios from 'axios';
import toast,{Toaster} from 'react-hot-toast';

const Notificationform = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [students, setStudents] = useState([]);
    const base_url = import.meta.env.VITE_API_KEY_Base_URL;
  
  const [formData, setFormData] = useState({
    studentId: '',
    title: '',
    message: '',
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    // Fetch students (replace with your backend endpoint)
    axios.get(`${base_url}/api/admin/students`)
      .then(res => setStudents(res.data.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(`${base_url}/api/admin/notification`, formData);
      toast.success('Notification sent!');
      setFormData({ studentId: '', title: '', message: '' });
    } catch (error) {
      toast.error('Failed to send notification');
    }
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
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FaUserPlus /> Send Notification
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
         <div>
  <label className="block font-medium">Select Student</label>
  <select
    name="studentId"
    value={formData.studentId}
    onChange={handleChange}
    className="w-full border p-2 rounded"
    required
  >
    <option value="">-- Select Student --</option>
    <option value="all">All Students</option>
    {students.map(student => (
      <option key={student._id} value={student._id}>
        {student.name}
      </option>
    ))}
  </select>
</div>


              <div>
                <label className="block font-medium">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-medium">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  rows="4"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
              >
                Send Notification
              </button>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
};

export default Notificationform;
