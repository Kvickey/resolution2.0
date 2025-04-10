import React from "react";
import HashLoader from "react-spinners/HashLoader";
import "./LoadingSpinner.css"; // Import custom CSS

const LoadingSpinner = () => {
  return (
    <div className="loading-overlay">
      <div className="spinner-container">
        <HashLoader color="#FFA500" size={60} />
        <div className="loading-text">Loading...</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
