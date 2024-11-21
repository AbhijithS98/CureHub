import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store.js';
import { setNotification } from '../../slices/globalSlices/notificationSlice.js';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const UserProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { userInfo } = useSelector((state: RootState) => state.userAuth);
  const dispatch = useDispatch();

  if (!userInfo) {
    dispatch(setNotification('You are not authorized. Please Login!'));
    return <Navigate to="/user/login" replace />;
  }

  return children;
};

export default UserProtectedRoute;
