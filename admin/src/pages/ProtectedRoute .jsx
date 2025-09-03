// components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("genius_amin");
  return isAuthenticated ? children : <Navigate to="/admin-login" />;
};

export default ProtectedRoute;
