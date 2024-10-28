import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import '../App.css'; // For the spinning effect and styles

function IconLoader() {
  return (
    <div className="icon-loader-container">
      <FaSpinner className="spinner" size={50} />
    </div>
  );
}

export default IconLoader;