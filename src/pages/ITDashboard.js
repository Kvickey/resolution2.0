import React, { useState } from "react";
import Topbar from "../components/Topbar";
import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../components/AuthProvider";
import { FaHome, FaUpload } from "react-icons/fa";
import { IoDocumentText } from "react-icons/io5";

const ITDashboard = () => {
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
      link: "/itdashboard",
    },
    {
      name: "Arbitrator Info",
      icon: <FaUpload />,
      link: "/itdashboard/arbitrators",
    },
    {
      name: "Bank Info",
      icon: <IoDocumentText />,
      link: "/itdashboard/bankinfo",
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

export default ITDashboard;