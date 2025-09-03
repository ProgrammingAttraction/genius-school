import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import {
  FaUser, FaPhone, FaEnvelope,
  FaHome, FaSchool, FaChalkboardTeacher, FaIdCard,
  FaCalendarAlt, FaVenusMars, FaMars, FaVenus,
  FaIdBadge, FaUserTie, FaFileAlt
} from 'react-icons/fa';
import { IoMdTime } from 'react-icons/io';
import { useParams } from 'react-router-dom';

const ViewTeacher = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const base_url = import.meta.env.VITE_API_KEY_Base_URL;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await axios.get(`${base_url}/api/admin/teacher/${id}`);
        setTeacher(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch teacher data');
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <section className="font-nunito h-screen">
        <Header toggleSidebar={toggleSidebar} />
        <div className="flex pt-[10vh] h-[90vh]">
          <Sidebar isOpen={isSidebarOpen} />
          <main className={`transition-all duration-300 flex-1 p-4 overflow-y-auto h-[90vh] ${isSidebarOpen ? 'ml-[13%]' : 'ml-0'}`}>
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </main>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="font-nunito h-screen">
        <Header toggleSidebar={toggleSidebar} />
        <div className="flex pt-[10vh] h-[90vh]">
          <Sidebar isOpen={isSidebarOpen} />
          <main className={`transition-all duration-300 flex-1 p-4 overflow-y-auto h-[90vh] ${isSidebarOpen ? 'ml-[13%]' : 'ml-0'}`}>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error! </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          </main>
        </div>
      </section>
    );
  }

  if (!teacher) return null;

  return (
    <section className="font-nunito h-screen bg-gray-50">
      <Header toggleSidebar={toggleSidebar} />

      <div className="flex pt-[10vh] h-[90vh]">
        <Sidebar isOpen={isSidebarOpen} />

        <main className={`transition-all duration-300 flex-1 p-6 overflow-y-auto h-[90vh] ${isSidebarOpen ? 'ml-[13%]' : 'ml-0'}`}>
          <div className="max-w-7xl mx-auto">
            {/* Profile Header */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <div className="md:flex">
                <div className="md:flex-shrink-0 p-6 flex justify-center">
                  <div className="relative">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200">
                      {teacher.profilePic ? (
                        <img
                          src={`${base_url}/images/${teacher.profilePic}`}
                          alt={teacher.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                          <FaUserTie className="text-blue-600 text-5xl" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-6 md:p-8 flex-1">
                  <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold">Faculty Member</div>
                  <h1 className="mt-1 text-2xl font-bold text-gray-900">{teacher.name}</h1>
                  <p className="mt-2 text-gray-600">{teacher.subject} Teacher</p>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <FaIdCard className="mr-1 text-blue-500" />
                      <span>ID: {teacher.id}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FaSchool className="mr-1 text-blue-500" />
                      <span>{teacher.education}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Personal Information */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                      <FaUser className="mr-2 text-blue-500" />
                      Personal Information
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InfoCard 
                        icon={<FaUser className="text-blue-500" />}
                        title="Father's Name"
                        value={teacher.fatherName}
                      />
                      <InfoCard 
                        icon={<FaUser className="text-blue-500" />}
                        title="Mother's Name"
                        value={teacher.motherName}
                      />
                      <InfoCard 
                        icon={teacher.gender.toLowerCase() === 'male' ? 
                          <FaMars className="text-blue-500" /> : 
                          <FaVenus className="text-pink-500" />}
                        title="Gender"
                        value={teacher.gender}
                      />
                      <InfoCard 
                        icon={<FaEnvelope className="text-blue-500" />}
                        title="Email"
                        value={teacher.email}
                      />
                      <InfoCard 
                        icon={<FaPhone className="text-blue-500" />}
                        title="Mobile"
                        value={teacher.mobile}
                      />
                      <InfoCard 
                        icon={<FaUserTie className="text-blue-500" />}
                        title="Emergency Contact"
                        value={teacher.emergencyContact}
                      />
                      <InfoCard 
                        icon={<FaHome className="text-blue-500" />}
                        title="Address"
                        value={teacher.address}
                        spanFull
                      />
                    </div>
                  </div>
                </div>

                {/* Identification Information */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                      <FaIdBadge className="mr-2 text-blue-500" />
                      Identification
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InfoCard 
                        icon={<FaFileAlt className="text-blue-500" />}
                        title="NID Number"
                        value={teacher.nidNumber}
                      />
                      {teacher.nidPhoto && (
                        <div className="flex items-start">
                          <div className="mt-1 mr-4">
                            <FaFileAlt className="text-blue-500" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">NID Photo</h4>
                            <a 
                              href={`${base_url}/images/${teacher.nidPhoto}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View Document
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                      <FaChalkboardTeacher className="mr-2 text-blue-500" />
                      Professional Details
                    </h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <InfoCard 
                      icon={<FaChalkboardTeacher className="text-blue-500" />}
                      title="Subject"
                      value={teacher.subject}
                    />
                    <InfoCard 
                      icon={<FaSchool className="text-blue-500" />}
                      title="Education"
                      value={teacher.education}
                    />
                    <InfoCard 
                      icon={<FaCalendarAlt className="text-blue-500" />}
                      title="Joined On"
                      value={formatDate(teacher.createdAt)}
                    />
                    <InfoCard 
                      icon={<IoMdTime className="text-blue-500 text-xl" />}
                      title="Last Updated"
                      value={formatDateTime(teacher.updatedAt)}
                    />
                  </div>
                </div>

                {/* System Information */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                      <FaIdCard className="mr-2 text-blue-500" />
                      System Information
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-gray-600 space-y-2">
                      <p><span className="font-medium">Record ID:</span> {teacher._id.$oid}</p>
                      <p><span className="font-medium">Created:</span> {formatDateTime(teacher.createdAt)}</p>
                      <p><span className="font-medium">Last Updated:</span> {formatDateTime(teacher.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};

// Reusable InfoCard component
const InfoCard = ({ icon, title, value, spanFull = false }) => (
  <div className={`flex items-start ${spanFull ? 'md:col-span-2' : ''}`}>
    <div className="mt-1 mr-4">
      {icon}
    </div>
    <div>
      <h4 className="text-sm font-medium text-gray-500">{title}</h4>
      <p className="text-gray-800">{value || 'N/A'}</p>
    </div>
  </div>
);

export default ViewTeacher;