import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store.js';
import { toast } from 'react-toastify';
import { clearNotification } from '../slices/globalSlices/notificationSlice';

const NotificationHandler: React.FC = () => {
  const { message } = useSelector((state: RootState) => state.notification);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("runninggggggggggggggggg");
    
    if (message) {
      console.log("running notfcn handler");
      
      toast.error(message);
      dispatch(clearNotification());
    }
  }, [message]);

  return null;
};

export default NotificationHandler;
