import React, { useState, useRef, useEffect } from 'react';
import { HiOutlineMenuAlt2 } from 'react-icons/hi';
import { FiSettings } from 'react-icons/fi';
import { FiUser, FiLogOut } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import genius_logo from "../assets/genius.png"
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import toast,{Toaster} from "react-hot-toast"
const Header = ({ toggleSidebar }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
const navigate = useNavigate();
// -------------------logout-funtion---------------------
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, logout",
    }).then((result) => {
      if (result.isConfirmed) {
        // Remove localStorage data
        localStorage.removeItem('genius_amin');
        localStorage.removeItem('token');

        // Optional: show a success message
        toast.success("You have been logged out.");

        // Redirect to /admin-login after a short delay
        setTimeout(() => {
          navigate("/admin-login");
        }, 1000);
      }
    });
  };

  return (
    <header className='w-full h-[10vh] fixed top-0 left-0 bg-white z-[1000] px-[20px] font-nunito py-[10px] flex justify-between items-center shadow-sm border-b border-gray-200'>
     <Toaster/>
      {/* Left Side Logo + Menu */}
      <div className="logo flex justify-start items-center gap-[20px] w-full">
        <NavLink to="/dashboard" className='md:flex justify-start items-center gap-[5px] hidden md:w-[30%] lg:w-[25%] xl:w-[18%]'>
          <img className='w-[40px] h-[40px]' src={genius_logo} alt="logo" />
          <h2 className='text-[30px] uppercase font-[700] text-theme_color'>GPCISAC</h2>
        </NavLink>
        <div className="menu text-[25px] cursor-pointer" onClick={toggleSidebar}>
          <HiOutlineMenuAlt2 />
        </div>
      </div>

      {/* Right Side - Settings & Admin */}
      <div className="relative flex items-center gap-4" ref={dropdownRef}>
        <button className="text-[22px] text-gray-700 hover:text-[#0A92FA] transition duration-200">
          <FiSettings />
        </button>

        {/* Profile Pic */}
        <img
          onClick={() => setDropdownVisible(!dropdownVisible)}
          className="w-[40px] h-[40px]  rounded-full cursor-pointer"
          src="https://www.radiustheme.com/demo/html/psdboss/akkhor/akkhor/img/figure/admin.jpg"
          alt="admin"
        />

{/* Dropdown */}
{dropdownVisible && (
  <div className="absolute top-[55px] right-0 bg-white shadow-lg border border-gray-200 rounded-lg w-[200px] z-50">
    <ul className="flex flex-col py-2 text-[15px] text-gray-700">
      <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition cursor-pointer">
        <FiUser className="text-[18px]" />
        <span>Profile</span>
      </li>
      <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition cursor-pointer">
        <FiSettings className="text-[18px]" />
        <span>Settings</span>
      </li>
      <li onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 transition cursor-pointer text-red-600">
        <FiLogOut className="text-[18px]" />
        <span>Logout</span>
      </li>
    </ul>
  </div>
)}

      </div>
    </header>
  );
};

export default Header;
