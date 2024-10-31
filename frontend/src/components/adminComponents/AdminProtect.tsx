  import React from 'react';
  import { Navigate, Outlet } from 'react-router-dom';
  import { useSelector } from 'react-redux';
  import { RootState } from '../../store.js'; 


  const AdminProtectedRoute: React.FC = () => {
    const { adminInfo } = useSelector((state: RootState) => state.adminAuth);

    if (!adminInfo) {
      return <Navigate to="/admin/login" />;
    }
  
    return <Outlet />;
  };

  export default AdminProtectedRoute;
