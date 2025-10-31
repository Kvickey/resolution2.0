import React, { useState } from "react";
import Topbar from "../../../components/Topbar";
import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import { useAuth } from "../../../components/AuthProvider";
import { FaUpload } from "react-icons/fa";
import { IoDocumentText } from "react-icons/io5";
import { RiAiGenerate } from "react-icons/ri";
import { RiCustomerService2Line } from "react-icons/ri";
import { TbReportAnalytics } from "react-icons/tb";
import { FaHome ,FaHandshake} from "react-icons/fa";

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
      icon: <FaHome />,
      link: "/lawyerdashboard",
    },
    // {
    //   name: "Upload SOC",
    //   icon: <FaUpload />,
    //   link: "/lawyerdashboard/uploadsoc",
    // },
    {
      name: "SOC",
      icon: <FaHandshake />,
      submenu: [
        {
          name: "Upload SOC",
          link: "/lawyerdashboard/soc/generatesoc",
          icon: <RiAiGenerate />,
        },
        {
          name: "Services",
          link: "/lawyerdashboard/soc/services",
          icon: <RiCustomerService2Line />,
        },
        {
          name: "Reports",
          link: "/lawyerdashboard/soc/reports",
          icon: <TbReportAnalytics />,
        },
        // {
        //   name: "SOC Data",
        //   link: "/lawyerdashboard/soc/list",
        //   icon: <TbReportAnalytics />,
        // },
      ],
    },
    {
      name: "Section 17 Appl",
      icon: <FaHandshake />,
      submenu: [
        {
          name: "Upload Sec17 Appl",
          link: "/lawyerdashboard/section17application/generatesection17application",
          icon: <RiAiGenerate />,
        },
        {
          name: "Services",
          link: "/lawyerdashboard/section17application/services",
          icon: <RiCustomerService2Line />,
        },
        {
          name: "Reports",
          link: "/lawyerdashboard/section17application/reports",
          icon: <TbReportAnalytics />,
        },
        // {
        //   name: "Section 17 App Data",
        //   link: "/lawyerdashboard/section17application/list",
        //   icon: <TbReportAnalytics />,
        // },
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
    <div>
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

export default LawyerDashboard;
