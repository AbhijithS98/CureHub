import { Spinner } from "react-bootstrap";
import React from "react";  

const Loader: React.FC = () => {
  return (
    <Spinner
      animation="border"
      role="status"
      style={{
        width: '50px',
        height: '50px',
        margin: 'auto',
        display: 'block',
        color: 'blue',
      }}
    >
    </Spinner>
  );
};

export default Loader;