import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa'; // Success icon
import './Clearform.css'; // Import styles if using external CSS

const ClearForm = ({ message = "Payment Successful!", redirectPath = "/home" }) => {
  const navigate = useNavigate();

  // Set up the timer to redirect after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(redirectPath); // Navigate to the specified path
    }, 5000); // 3 seconds delay before redirection

    return () => clearTimeout(timer); // Clean up the timer on component unmount
  }, [navigate, redirectPath]);

  return (
    <div className="payment-container">

      <div className="circular-button">
        <FaCheckCircle className="success-icon" />
      </div>

      <div className="success-message">
        {message}
      </div>

      <canvas className="confetti-canvas"></canvas>
    </div>
  );
};

export default ClearForm;
