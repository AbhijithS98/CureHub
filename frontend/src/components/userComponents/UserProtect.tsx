import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store.js';


interface ProtectedRouteProps {
  children: JSX.Element;
}

const UserProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { userInfo } = useSelector((state: RootState) => state.userAuth);
  const errMsg = 'You are not authorized. Please login'
  if (!userInfo) {
    return <Navigate to={`/user/login?message=${encodeURIComponent(errMsg)}`} />;
  }

  return children;
};

export default UserProtectedRoute;
