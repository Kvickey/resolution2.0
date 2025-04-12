import React, { useState } from "react";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import "./Pages.css";
import { Form } from "react-bootstrap";
// import AssignArbitrator from "../Componants/AssignArbitrator";
import { Outlet } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import { Navigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { MdUploadFile, MdAssignmentTurnedIn } from "react-icons/md";
import { RiDraftLine } from "react-icons/ri";
import { IoCreate } from "react-icons/io5";
import { TbReport } from "react-icons/tb";
import { RiCustomerService2Line } from "react-icons/ri";

const InstDashboard = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState("Resolution");
  const [isOpen, setIsOpen] = useState(true);

  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  } else {
    // console.log(user.User_name);
  }

  const menuItems = [
    {
      name: "Dashboard",
      icon: <FaHome />, 
      link: "/instdashboard",
    },
    {
      name: "Arbitrator",
      icon: <FaHome />, 
      link: "/instdashboard/arbitrator",
    },
    {
      name: "Upload A Lot",
      icon: <MdUploadFile />,
      link: "/instdashboard/uploadalot",
    },
    {
      name: "Intent Letter",
      icon: <RiDraftLine />,
      submenu: [
        {
          name: "Generate Intent Letter",
          link: "/instdashboard/intentletter/generateintentletter",
          icon: <IoCreate />,
        },
        {
          name: "Services",
          link: "/instdashboard/intentletter/ilservices",
          icon: <RiCustomerService2Line />,
        },
        {
          name: "Reports",
          link: "/instdashboard/intentletter/ilreports",
          icon: <TbReport />,
        },
      ],
    },
    {
      name: "Assign Arbitrator",
      icon: <MdAssignmentTurnedIn />,
      submenu: [
        {
          name: "By Intent",
          link: "/instdashboard/assignArb/byintent",
          icon: <IoCreate />,
        },
        {
          name: "By System",
          link: "/instdashboard/assignArb/bysystem",
          icon: <RiCustomerService2Line />,
        },
      ],
    },
    {
      name: "Appointment Letter",
      icon: <RiDraftLine />,
      submenu: [
        {
          name: "Generate Appointment",
          link: "/instdashboard/referencedraft/generate-rd",
          icon: <IoCreate />,
        },
        {
          name: "Services",
          link: "/instdashboard/referencedraft/services",
          icon: <RiCustomerService2Line />,
        },
        {
          name: "Reports",
          link: "/instdashboard/referencedraft/reports",
          icon: <TbReport />,
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
      {/* Sidebar */}
      <Sidebar
        className="sidebar"
        menuItems={menuItems}
        user={user.User_name}
        onMenuItemClick={handleMenuItemClick}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Topbar */}
      <Topbar className="topbar" isOpen={isOpen} />

      {/* Main content */}
      <div className={`${isOpen ? "" : "sideCollapse"} mainn-content`}>
        <Outlet user={user.User_name} />
      </div>
    </div>
    // <div className="main-div">
    //   <Topbar isOpen={isOpen} />
    //   <Sidebar
    //     menuItems={menuItems}
    //     user={user.User_name}
    //     onMenuItemClick={handleMenuItemClick}
    //     isOpen={isOpen}
    //     setIsOpen={setIsOpen}
    //     toggleSidebar={toggleSidebar}
    //   />
    //   <div className={`${isOpen ? "" : "sideCollapse"} mainn-content p-3`}>
    //     <Outlet user={user.User_name}/>
    //   </div>
    // </div>
  );
};

export default InstDashboard;
