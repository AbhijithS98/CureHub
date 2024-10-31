import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store.js'; 

interface ProtectedRouteProps {
  children: JSX.Element;
}

const DoctorProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { doctorInfo } = useSelector((state: RootState) => state.doctorAuth);
  return doctorInfo ? children : <Navigate to="/doctor/login" replace />;
};

export default DoctorProtectedRoute;
