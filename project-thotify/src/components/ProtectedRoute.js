import React, { useContext } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Routes, Route, Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (currentUser) return children;
  else if (!currentUser) return <Navigate to="/login" />;
  else return null;
};

export default ProtectedRoute;
