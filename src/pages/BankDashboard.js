import React, { useState } from "react";
import "./Pages.css";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Button, Form } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import { FaHome } from "react-icons/fa";
import { LuGanttChartSquare } from "react-icons/lu";
import { BsPersonCheck } from "react-icons/bs";
import { GrGroup } from "react-icons/gr";

const BnkDashboard = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState("Dashboard");
  const [isOpen, setIsOpen] = useState(true);
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  const menuItems = [
    {
      name: "Dashboard",
      icon: <FaHome />,
      link: "/bankdashboard",
    },

    {
      name: "Case Tracking",
      icon: <LuGanttChartSquare />,
      submenu: [
        {
          name: "Lotwise",
          link: "/bankdashboard/casetracking/lotwise",
          icon: <GrGroup />,
        },
        {
          name: "Casewise",
          link: "/bankdashboard/casetracking/casewise",
          icon: <BsPersonCheck />,
        },
      ],
    },
  ];

  const handleMenuItemClick = (name) => {
    setSelectedMenuItem(name);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="main-div">
      <Topbar isOpen={isOpen} />
      <Sidebar
        menuItems={menuItems}
        user={user.User_name}
        onMenuItemClick={handleMenuItemClick}
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
      />
      <div className={`${isOpen ? "" : "sideCollapse"} mainn-content p-3`}>
        <Outlet />
      </div>
    </div>
  );
};

export default BnkDashboard;
