import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/genius.png";

const Login = () => {
  const base_url = import.meta.env.VITE_API_KEY_Base_URL;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState({ email: false, password: false });

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("genius_amin");
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFocus = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await axios.post(`${base_url}/auth/admin-login`, formData);
      const { success, message, token, admin } = res.data;

      if (success) {
        toast.success('Login successful! Redirecting...');
        localStorage.setItem('genius_amin', JSON.stringify(admin));
        localStorage.setItem('token', token);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        toast.error(message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-nunito flex items-center justify-center bg-[#f7faff] p-4">
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: '8px',
            background: '#333',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          },
        }}
      />
      
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 w-full max-w-md relative overflow-hidden">
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 z-10 bg-white/90 flex items-center justify-center rounded-xl backdrop-blur-[2px]">
            <div className="loader"></div>
          </div>
        )}

        {/* Logo and header */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4">
            <img
              src={logo}
              alt="Logo"
              className="w-20 h-20 rounded-full object-cover"
            />
          </div>
          <h2 className="text-center text-theme_color font-bold text-[16px] mb-1">
            জিনিয়াস প্রি-ক্যাডেট ইন্টাঃ স্কুল এন্ড কলেজ 
          </h2>
          <p className="text-gray-600 text-sm">Admin Dashboard Login</p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <input
              type="text"
              name="email"
              placeholder=" "
              value={formData.email}
              onChange={handleChange}
              onFocus={() => handleFocus('email')}
              onBlur={() => handleBlur('email')}
              className={`w-full px-4 py-3 border ${
                errors.email ? 'border-red-400' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 ${
                errors.email ? 'focus:ring-red-300' : 'focus:ring-theme_color'
              } peer transition-colors duration-200`}
              disabled={loading}
            />
            <label 
              className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                isFocused.email || formData.email 
                  ? '-top-2.5 text-xs text-theme_color bg-white px-1'
                  : 'top-3.5 text-gray-500'
              } ${errors.email ? '!text-red-500' : ''}`}
            >
              Email Address
            </label>
            {errors.email && (
              <p className="mt-1 text-xs text-red-500 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.email}
              </p>
            )}
          </div>

          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder=" "
              value={formData.password}
              onChange={handleChange}
              onFocus={() => handleFocus('password')}
              onBlur={() => handleBlur('password')}
              className={`w-full px-4 py-3 border ${
                errors.password ? 'border-red-400' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 ${
                errors.password ? 'focus:ring-red-300' : 'focus:ring-theme_color'
              } peer transition-colors duration-200`}
              disabled={loading}
            />
            <label 
              className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                isFocused.password || formData.password 
                  ? '-top-2.5 text-xs text-theme_color bg-white px-1'
                  : 'top-3.5 text-gray-500'
              } ${errors.password ? '!text-red-500' : ''}`}
            >
              Password
            </label>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.password}
              </p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className={`w-full bg-theme_color text-white cursor-pointer font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity duration-200 shadow-md ${
                loading ? 'opacity-80 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </span>
              ) : (
                'SIGN IN'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* CSS Styles */}
      <style>{`
        .loader {
          border: 3px solid rgba(209, 213, 219, 0.3);
          border-top: 3px solid #1946c4;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Login;