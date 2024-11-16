import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store.js'; 


interface ProtectedRouteProps {
  children: JSX.Element;
}

const UserProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { userInfo } = useSelector((state: RootState) => state.userAuth);
  
  return userInfo ? (
    children
  ) : (
    <Navigate
      to="/user/login"
      state={{ message: 'You are not authorized. Please Login!' }}
      replace
    />
  );
};

export default UserProtectedRoute;
