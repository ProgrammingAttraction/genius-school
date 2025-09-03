import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Newteacher from './pages/Newteacher'
import Teachers from './pages/Teachers'
import Newstudent from './pages/Newstudent'
import Students from './pages/Students'
import Attendance from './pages/Attendance'
import Newroutine from './pages/Newroutine'
import Routine from './pages/Routine'
import Newexam from './pages/Newexam'
import Exam from './pages/Exam'
import Newlesson from './pages/Newlesson'
import Lesson from './pages/Lesson'
import Newclass from './pages/Newclass'
import NewSection from './pages/Newsection'
import Sectionlist from './pages/Sectionlist'
import Classlist from './pages/Classlist'
import Viewstudent from './components/student/Viewstudent'
import Viewteacher from './components/teacher/Viewteacher'
import Notificationform from './pages/Notificationform'
import ProtectedRoute from './pages/ProtectedRoute '
import Newexamname from './pages/examname/Newexamname'
import Examnamelist from './pages/examname/Examnamelist'
import Classstudent from './components/classes/Classstudent'
import Postbanner from './components/banner/Postbanner'
import Allbanners from './components/banner/Allbanners'
import Sendnotice from './components/notice/Sendnotice'
import Allnotices from './components/notice/Allnotices'


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/admin-login" element={<Login />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/teachers/new-teacher" element={<ProtectedRoute><Newteacher /></ProtectedRoute>} />
        <Route path="/teachers/teachers" element={<ProtectedRoute><Teachers /></ProtectedRoute>} />
        <Route path="/teachers/view-teacher/:id" element={<ProtectedRoute><Viewteacher /></ProtectedRoute>} />
        <Route path="/students/new-student" element={<ProtectedRoute><Newstudent /></ProtectedRoute>} />
        <Route path="/students/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
        <Route path="/students/view-student/:id" element={<ProtectedRoute><Viewstudent /></ProtectedRoute>} />
        <Route path="/attendance/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
        <Route path="/routine/new-routine" element={<ProtectedRoute><Newroutine /></ProtectedRoute>} />
        <Route path="/routine/routine" element={<ProtectedRoute><Routine /></ProtectedRoute>} />
        <Route path="/routine/new-exam" element={<ProtectedRoute><Newexam /></ProtectedRoute>} />
        <Route path="/routine/exam" element={<ProtectedRoute><Exam /></ProtectedRoute>} />
        <Route path="/lesson/new-lesson" element={<ProtectedRoute><Newlesson /></ProtectedRoute>} />
        <Route path="/lesson/lesson" element={<ProtectedRoute><Lesson /></ProtectedRoute>} />
        <Route path="/class-section/new-class" element={<ProtectedRoute><Newclass /></ProtectedRoute>} />
        <Route path="/class-section/new-section" element={<ProtectedRoute><NewSection /></ProtectedRoute>} />
        <Route path="/class-section/section" element={<ProtectedRoute><Sectionlist /></ProtectedRoute>} />
        <Route path="/class-section/class" element={<ProtectedRoute><Classlist /></ProtectedRoute>} />
        <Route path="/class-section/class/:id" element={<ProtectedRoute><Classstudent /></ProtectedRoute>} />
        <Route path="/banners/post-banner" element={<ProtectedRoute><Postbanner /></ProtectedRoute>} />
        <Route path="/banners/all-banners" element={<ProtectedRoute><Allbanners /></ProtectedRoute>} />
        <Route path="/notice/send-notice" element={<ProtectedRoute><Sendnotice /></ProtectedRoute>} />
        <Route path="/notice/all-notices" element={<ProtectedRoute><Allnotices /></ProtectedRoute>} />

        {/* <Route path="/notification" element={<ProtectedRoute><Notificationform /></ProtectedRoute>} /> */}
        {/* ----------------------------------new-exam-------------------------------------------- */}
        <Route path="/class-section/new-exam-name" element={<ProtectedRoute><Newexamname /></ProtectedRoute>} />
        <Route path="/class-section/exam-name-list" element={<ProtectedRoute><Examnamelist /></ProtectedRoute>} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
