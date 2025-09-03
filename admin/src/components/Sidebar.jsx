import React, { useState, useEffect } from 'react';
import { FaHome } from 'react-icons/fa';
import { FiChevronRight } from 'react-icons/fi';
import { HiOutlineCalendar } from 'react-icons/hi';
import { PiStudent } from 'react-icons/pi';
import { MdOutlinePausePresentation } from "react-icons/md";
import { LiaChalkboardTeacherSolid } from 'react-icons/lia';
import { NavLink, useLocation } from 'react-router-dom';
import { LuClipboardList } from "react-icons/lu";
import { LuClipboardPen } from "react-icons/lu";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { TfiLayoutSliderAlt } from "react-icons/tfi";
import { RiMessage2Line } from "react-icons/ri";
const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState('');

  useEffect(() => {
    // Automatically open the menu based on current route
    if (location.pathname.startsWith('/teachers')) {
      setOpenMenu('teachers');
    } else if (location.pathname.startsWith('/students')) {
      setOpenMenu('students');
    } else if (location.pathname.startsWith('/exam')) {
      setOpenMenu('exan');
    } else if (location.pathname.startsWith('/routine')) {
      setOpenMenu('routine');
    } else if (location.pathname.startsWith('/lesson')) {
      setOpenMenu('lessons');
    } 
     else if (location.pathname.startsWith('/banners')) {
      setOpenMenu('banners');
    }     else if (location.pathname.startsWith('/class-section')) {
      setOpenMenu('class');
    }      else if (location.pathname.startsWith('/class-section')) {
      setOpenMenu('class');
    }      else if (location.pathname.startsWith('/notice')) {
      setOpenMenu('notice');
    }   else {
      setOpenMenu('');
    }
  }, [location.pathname]);

  const handleToggle = (menu) => {
    setOpenMenu(prev => (prev === menu ? '' : menu));
  };

  const isActive = (menu) => openMenu === menu;

  return (
    <aside
      className={`transition-all duration-300 fixed w-[70%] md:w-[30%] lg:w-[25%] xl:w-[18%]  border-r-[1px] border-gray-200 bg-white shadow-sm p-4 pt-[12vh] text-sm h-full z-[999] ${
        isOpen ? 'top-0 left-0' : 'top-0 left-[-120%]'
      }`}
    >
      {/* Dashboard */}
      <div className="mb-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center justify-between w-full px-3 py-2 text-[15px] lg:text-[16px] hover:text-[#0A92FA] cursor-pointer rounded-r-lg border-l-4 transition duration-200 ${
              isActive
                ? 'bg-indigo-50 text-[#0A92FA] border-[#0A92FA] font-medium'
                : 'text-gray-700 border-transparent'
            }`
          }
        >
          <span className="flex items-center gap-2">
            <IoHomeOutline className="text-[15px]" />
            Dashboard
          </span>
        </NavLink>
      </div>
   {/* Teachers */}
      <div className="mb-2">
        <div
          onClick={() => handleToggle('class')}
          className={`flex items-center justify-between w-full px-3 py-2 text-[15px] lg:text-[16px] hover:text-[#0A92FA] cursor-pointer rounded-r-lg border-l-4 transition duration-200 ${
            isActive('class')
              ? 'bg-indigo-50 text-[#0A92FA] border-[#0A92FA] font-medium'
              : 'text-gray-700 border-transparent '
          }`}
        >
          <span className="flex items-center gap-2">
            <LiaChalkboardTeacherSolid className="text-[15px]" />
            Class & Section
          </span>
          <FiChevronRight
            className={`transition-transform duration-300 ${isActive('class') ? 'rotate-90' : ''}`}
          />
        </div>
        <div
          className={`ml-4 overflow-hidden transition-all duration-300 ${isActive('class') ? 'max-h-60' : 'max-h-0'}`}
        >
          <NavLink
            to="/class-section/new-class"
            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-[#0A92FA]"
          >
            New Class
          </NavLink>
          <NavLink
            to="/class-section/class"
            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-[#0A92FA]"
          >
            Class List
          </NavLink>
            <NavLink
            to="/class-section/new-section"
            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-[#0A92FA]"
          >
            New Section
          </NavLink>
          <NavLink
            to="/class-section/section"
            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-[#0A92FA]"
          >
            Section List
          </NavLink>
              <NavLink
            to="/class-section/new-exam-name"
            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-[#0A92FA]"
          >
           New Exam Name
          </NavLink>
          <NavLink
            to="/class-section/exam-name-list"
            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-[#0A92FA]"
          >
           Exam Name
          </NavLink>
        </div>
      </div>

      {/* Teachers */}
      <div className="mb-2">
        <div
          onClick={() => handleToggle('teachers')}
          className={`flex items-center justify-between w-full px-3 py-2 text-[15px] lg:text-[16px] hover:text-[#0A92FA] cursor-pointer rounded-r-lg border-l-4 transition duration-200 ${
            isActive('teachers')
              ? 'bg-indigo-50 text-[#0A92FA] border-[#0A92FA] font-medium'
              : 'text-gray-700 border-transparent '
          }`}
        >
          <span className="flex items-center gap-2">
            <LiaChalkboardTeacherSolid className="text-[15px]" />
            Teachers
          </span>
          <FiChevronRight
            className={`transition-transform duration-300 ${isActive('teachers') ? 'rotate-90' : ''}`}
          />
        </div>
        <div
          className={`ml-4 overflow-hidden transition-all duration-300 ${isActive('teachers') ? 'max-h-40' : 'max-h-0'}`}
        >
          <NavLink
            to="/teachers/new-teacher"
            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-[#0A92FA]"
          >
            New Teacher
          </NavLink>
          <NavLink
            to="/teachers/teachers"
            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-[#0A92FA]"
          >
            List Teachers
          </NavLink>
        </div>
      </div>

      {/* Students */}
      <div className="mb-2">
        <div
          onClick={() => handleToggle('students')}
          className={`flex items-center justify-between w-full px-3 py-2 text-[15px] lg:text-[16px] cursor-pointer hover:text-[#0A92FA] rounded-r-lg border-l-4 transition duration-200 ${
            isActive('students')
              ? 'bg-indigo-50 text-[#0A92FA] border-[#0A92FA] font-medium'
              : 'text-gray-700 border-transparent '
          }`}
        >
          <span className="flex items-center gap-2">
            <PiStudent className="text-[15px]" />
            Students
          </span>
          <FiChevronRight
            className={`transition-transform duration-300 ${isActive('students') ? 'rotate-90' : ''}`}
          />
        </div>
        <div
          className={`ml-4 overflow-hidden transition-all duration-300 ${isActive('students') ? 'max-h-40' : 'max-h-0'}`}
        >
          <NavLink
            to="/students/new-student"
            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-[#0A92FA]"
          >
            New Student
          </NavLink>
          <NavLink
            to="/students/students"
            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-[#0A92FA]"
          >
            List Students
          </NavLink>
        </div>
      </div>
      <div className="mb-2">
        <div
          onClick={() => handleToggle('routine')}
          className={`flex items-center justify-between w-full px-3 py-2 text-[15px] lg:text-[16px] cursor-pointer hover:text-[#0A92FA] rounded-r-lg border-l-4 transition duration-200 ${
            isActive('routine')
              ? 'bg-indigo-50 text-[#0A92FA] border-[#0A92FA] font-medium'
              : 'text-gray-700 border-transparent '
          }`}
        >
          <span className="flex items-center gap-2">
            <LuClipboardList className="text-[15px]" />
            Routine 
          </span>
          <FiChevronRight
            className={`transition-transform duration-300 ${isActive('routine') ? 'rotate-90' : ''}`}
          />
        </div>
        <div
          className={`ml-4 overflow-hidden transition-all duration-300 ${isActive('routine') ? 'max-h-40' : 'max-h-0'}`}
        >
          <NavLink
            to="/routine/new-routine"
            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-[#0A92FA]"
          >
            New Class Routine
          </NavLink>
          <NavLink
            to="/routine/routine"
            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-[#0A92FA]"
          >
            Routine List
          </NavLink>
               <NavLink
            to="/routine/new-exam"
            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-[#0A92FA]"
          >
            New Exam Routine
          </NavLink>
          <NavLink
            to="/routine/exam"
            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-[#0A92FA]"
          >
            Exam Routine List
          </NavLink>
        </div>
      </div>
            {/* <div className="mb-2">
        <div
          onClick={() => handleToggle('exam')}
          className={`flex items-center justify-between w-full px-3 py-2 text-[15px] lg:text-[16px] cursor-pointer hover:text-[#0A92FA] rounded-r-lg border-l-4 transition duration-200 ${
            isActive('exam')
              ? 'bg-indigo-50 text-[#0A92FA] border-[#0A92FA] font-medium'
              : 'text-gray-700 border-transparent '
          }`}
        >
          <span className="flex items-center gap-2">
            <LuClipboardPen className="text-[15px]" />
            Exam
          </span>
          <FiChevronRight
            className={`transition-transform duration-300 ${isActive('exam') ? 'rotate-90' : ''}`}
          />
        </div>
        <div
          className={`ml-4 overflow-hidden transition-all duration-300 ${isActive('exam') ? 'max-h-40' : 'max-h-0'}`}
        >
          <NavLink
            to="/exam/new-exam"
            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-[#0A92FA]"
          >
            New Exams
          </NavLink>
          <NavLink
            to="/exam/exam"
            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-[#0A92FA]"
          >
            Exam List
          </NavLink>
        </div>
      </div> */}
          {/* Daily Lesson */}
                <div className="mb-2">
        <div
          onClick={() => handleToggle('lessons')}
          className={`flex items-center justify-between w-full px-3 py-2 text-[15px] lg:text-[16px] cursor-pointer hover:text-[#0A92FA] rounded-r-lg border-l-4 transition duration-200 ${
            isActive('lessons')
              ? 'bg-indigo-50 text-[#0A92FA] border-[#0A92FA] font-medium'
              : 'text-gray-700 border-transparent '
          }`}
        >
          <span className="flex items-center gap-2">
            <HiOutlineCalendar className="text-[15px]" />
               Daily Lessons
          </span>
          <FiChevronRight
            className={`transition-transform duration-300 ${isActive('lessons') ? 'rotate-90' : ''}`}
          />
        </div>
        <div
          className={`ml-4 overflow-hidden transition-all duration-300 ${isActive('lessons') ? 'max-h-40' : 'max-h-0'}`}
        >
          <NavLink
            to="/lesson/new-lesson"
            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-[#0A92FA]"
          >
            New Lesson
          </NavLink>
          <NavLink
            to="/lesson/lesson"
            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-[#0A92FA]"
          >
            Lessons List
          </NavLink>
        </div>
      </div>
      {/* Attendance */}
      <div className="mb-2">
        <NavLink
          to="/attendance/attendance"
          className={({ isActive }) =>
            `flex items-center justify-between w-full px-3 py-2 text-[15px] lg:text-[16px] cursor-pointer hover:text-[#0A92FA] rounded-r-lg border-l-4 transition duration-200 ${
              isActive
                ? 'bg-indigo-50 text-[#0A92FA] border-[#0A92FA] font-medium'
                : 'text-gray-700 border-transparent '
            }`
          }
        >
          <span className="flex items-center gap-2">
            <MdOutlinePausePresentation className="text-[15px]" />
            Attendance
          </span>
        </NavLink>
      </div>
    {/* <div className="mb-2">
        <NavLink
          to="/notification"
          className={({ isActive }) =>
            `flex items-center justify-between w-full px-3 py-2 text-[15px] lg:text-[16px] cursor-pointer hover:text-[#0A92FA] rounded-r-lg border-l-4 transition duration-200 ${
              isActive
                ? 'bg-indigo-50 text-[#0A92FA] border-[#0A92FA] font-medium'
                : 'text-gray-700 border-transparent '
            }`
          }
        >
          <span className="flex items-center gap-2">
            <MdOutlineNotificationsActive className="text-[15px]" />
            Notification
          </span>
        </NavLink>
      </div> */}
  
          <div className="mb-2">
        <div
          onClick={() => handleToggle('banners')}
          className={`flex items-center justify-between w-full px-3 py-2 text-[15px] lg:text-[16px] cursor-pointer hover:text-[#0A92FA] rounded-r-lg border-l-4 transition duration-200 ${
            isActive('lessons')
              ? 'bg-indigo-50 text-[#0A92FA] border-[#0A92FA] font-medium'
              : 'text-gray-700 border-transparent '
          }`}
        >
          <span className="flex items-center gap-2">
            <TfiLayoutSliderAlt className="text-[15px]" />
               Banners
          </span>
          <FiChevronRight
            className={`transition-transform duration-300 ${isActive('banners') ? 'rotate-90' : ''}`}
          />
        </div>
        <div
          className={`ml-4 overflow-hidden transition-all duration-300 ${isActive('banners') ? 'max-h-40' : 'max-h-0'}`}
        >
          <NavLink
            to="/banners/post-banner"
            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-[#0A92FA]"
          >
            New Banner
          </NavLink>
          <NavLink
            to="/banners/all-banners"
            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-[#0A92FA]"
          >
            Banner List
          </NavLink>
        </div>
      </div>
      
          <div className="mb-2">
        <div
          onClick={() => handleToggle('notice')}
          className={`flex items-center justify-between w-full px-3 py-2 text-[15px] lg:text-[16px] cursor-pointer hover:text-[#0A92FA] rounded-r-lg border-l-4 transition duration-200 ${
            isActive('lessons')
              ? 'bg-indigo-50 text-[#0A92FA] border-[#0A92FA] font-medium'
              : 'text-gray-700 border-transparent '
          }`}
        >
          <span className="flex items-center gap-2">
            <RiMessage2Line className="text-[15px]" />
               Notice
          </span>
          <FiChevronRight
            className={`transition-transform duration-300 ${isActive('notice') ? 'rotate-90' : ''}`}
          />
        </div>
        <div
          className={`ml-4 overflow-hidden transition-all duration-300 ${isActive('notice') ? 'max-h-40' : 'max-h-0'}`}
        >
          <NavLink
            to="/notice/send-notice"
            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-[#0A92FA]"
          >
            Send Notice
          </NavLink>
          <NavLink
            to="/notice/all-notices"
            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-[#0A92FA]"
          >
            Notice List
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
