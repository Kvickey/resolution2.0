import React, { useState } from "react";
import Topbar from "../components/Topbar";
import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../components/AuthProvider";
import { FaHome, FaUpload } from "react-icons/fa";
import { IoDocumentText } from "react-icons/io5";

const LawyerDashboard = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState("Dashboard");
  const [isOpen, setIsOpen] = useState(true);
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  const menuItems = [
    {
      name: "Dashboard",
      icon: <FaHome /> ,
      link: "/lawyerdashboard",
    },
    {
      name: "Upload SOC",
      icon: <FaUpload />,
      link: "/lawyerdashboard/uploadsoc",
    },
    {
      name: "Section 17 Application",
      icon: <IoDocumentText />,
      link: "/lawyerdashboard/section17application",
    },
  ];

  const handleMenuItemClick = (name) => {
    setSelectedMenuItem(name);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
       <Topbar isOpen={isOpen}/>
            <Sidebar menuItems={menuItems} user={user.User_name} onMenuItemClick={handleMenuItemClick} isOpen={isOpen} toggleSidebar={toggleSidebar}/>       
            <div className= {`${isOpen?"":"sideCollapse"} mainn-content p-3`}>           
            <Outlet />
            </div>
    </div>
  );
};

export default LawyerDashboard;
