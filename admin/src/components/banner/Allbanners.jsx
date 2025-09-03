import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';

const Allbanners = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const base_url = import.meta.env.VITE_API_KEY_Base_URL;
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Fetch all banners
  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${base_url}/api/admin/all-banners`);
      setBanners(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch banners');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        await axios.delete(`${base_url}/api/admin/delete-banner/${id}`);
        toast.success('Banner deleted successfully!');
        fetchBanners();
      }
    } catch (error) {
      toast.error('Failed to delete banner');
    }
  };

  return (
    <section className="font-nunito bg-[#f4f6f9] min-h-screen">
      <Header toggleSidebar={toggleSidebar} />
      <Toaster/>
      <div className="flex pt-[10vh] min-h-[90vh]">
        <Sidebar isOpen={isSidebarOpen} />

        <main className={`transition-all duration-300 flex-1 p-6 ${isSidebarOpen ? 'md:ml-[30%] lg:ml-[25%] xl:ml-[18%]' : 'ml-0'}`}>
          <div className="mb-4 text-gray-700 text-sm">
            <h1 className="text-xl font-semibold text-[#212529] mb-1">All Banners</h1>
            <div className="text-sm text-[#6c757d]">
              Home <span className="mx-1 text-theme_color">›</span> <span className="text-theme_color font-medium">Banners</span>
            </div>
          </div>

          <div className="bg-white p-6">
            {isLoading ? (
              <div className="text-center py-4">Loading banners...</div>
            ) : banners.length === 0 ? (
              <div className="text-center py-4">No banners found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50 text-[13px] lg:text-[14px] text-[#495057]">
                      <th className="px-6 py-3 text-left  text-gray-500 uppercase tracking-wider">Image</th>
                      <th className="px-6 py-3 text-left text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left  text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left  text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {banners.map((banner) => (
                      <tr key={banner._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img 
                            src={`${base_url}/images/${banner.imageUrl}`} 
                            alt={banner.title} 
                            className="h-12 w-20 object-cover rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{banner.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">{banner.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(banner.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="">
                            <button 
                              onClick={() => handleDelete(banner._id)}
                              className="text-white bg-red-600 px-[10px] py-[8px] rounded-[5px] cursor-pointer"
                            >
                              <FaTrash className="inline " />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </section>
  );
};

export default Allbanners;