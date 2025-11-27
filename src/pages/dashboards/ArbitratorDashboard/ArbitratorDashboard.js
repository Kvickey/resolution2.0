import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { FaHome, FaHandshake } from "react-icons/fa";
import { GiThorHammer } from "react-icons/gi";
import { GoNote } from "react-icons/go";
import { FaVideo, FaFileVideo } from "react-icons/fa";
import { RiAiGenerate } from "react-icons/ri";
import { RiCustomerService2Line } from "react-icons/ri";
import { TbReportAnalytics } from "react-icons/tb";
import { BsCalendar2Date } from "react-icons/bs";
import { AiFillStop } from "react-icons/ai";
import { IoDocumentTextOutline } from "react-icons/io5";
import { TiMessages } from "react-icons/ti";
import { useAuth } from "../../../components/AuthProvider";
import Sidebar from "../../../components/Sidebar";
import CommonTopbar from "../../../components/Topbar";

const ArbitratorDashboard = () => {
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
      link: "/arbdashboard",
    },
    // {
    //   name: "Zoom Meetings",
    //   icon: <FaHome />,
    //   link: "/arbdashboard/zoommeetings",
    // },
    {
      name: "Zoom Meetings",
      icon: <FaHandshake />,
      submenu: [
        {
          name: "Schedule Meet",
          link: "/arbdashboard/zoommeetings",
          icon: <RiAiGenerate />,
        },
        {
          name: "Meeting List",
          link: "/arbdashboard/zoommeetlist",
          icon: <RiCustomerService2Line />,
        },
      ],
    },
    {
      name: "Acceptance Letter",
      icon: <FaHandshake />,
      submenu: [
        {
          name: "Generate AL",
          link: "/arbdashboard/acceptletter/generate_al",
          icon: <RiAiGenerate />,
        },
        // { name: 'Upload AL', link: '/arbdashboard/acceptletter/signedaccupload', icon: <RiAiGenerate /> },
        {
          name: "Services",
          link: "/arbdashboard/acceptletter/services",
          icon: <RiCustomerService2Line />,
        },
        {
          name: "Reports",
          link: "/arbdashboard/acceptletter/reports",
          icon: <TbReportAnalytics />,
        },
        // { name: 'Scheduled Mettings', link: '/arbdashboard/acceptletter/list', icon: <TbReportAnalytics /> },
      ],
    },
    // {
    //     name: 'Section 17 Order',
    //     icon: <GiThorHammer />,
    //     link: '/arbdashboard/section17order',
    // },
    {
      name: "Section 17 Order",
      icon: <FaHandshake />,
      submenu: [
        {
          name: "Generate Sec 17 Order",
          link: "/arbdashboard/section17order/generatesection17order",
          icon: <RiAiGenerate />,
        },
        // { name: 'Upload Sec 17 Order', link: '/arbdashboard/section17order/signedsec17order', icon: <RiAiGenerate /> },
        {
          name: "Services",
          link: "/arbdashboard/section17order/services",
          icon: <RiCustomerService2Line />,
        },
        {
          name: "Reports",
          link: "/arbdashboard/section17order/reports",
          icon: <TbReportAnalytics />,
        },
        // { name: 'Section 17 Orders', link: '/arbdashboard/section17order/list', icon: <TbReportAnalytics /> },
      ],
    },
    {
      name: "First Hearing",
      icon: <FaVideo />,
      submenu: [
        {
          name: "First Hearing",
          link: "/arbdashboard/firstHearing/first_Hearing",
          icon: <FaFileVideo />,
        },
        {
          name: "Second Hearing Notice",
          link: "/arbdashboard/firstHearing/createSecondHearingNotice",
          icon: <IoDocumentTextOutline />,
        },
        {
          name: "Second Hearing Services",
          link: "/arbdashboard/firstHearing/secondHearingNoticeServices",
          icon: <TiMessages />,
        },
        {
          name: "Second Hearing Reports",
          link: "/arbdashboard/firstHearing/secondHearingNoticeReports",
          icon: <TbReportAnalytics />,
        },
      ],
    },
    {
      name: "Second Hearing",
      icon: <FaVideo />,
      submenu: [
        {
          name: "Second Hearing",
          link: "/arbdashboard/secondHearing/second_Hearing",
          icon: <FaFileVideo />,
        },
        {
          name: "Third Hearing Notice",
          link: "/arbdashboard/secondHearing/createThirdHearingNotice",
          icon: <IoDocumentTextOutline />,
        },
        {
          name: "Third Hearing Services",
          link: "/arbdashboard/secondHearing/thirdHearingNoticeServices",
          icon: <TiMessages />,
        },
        {
          name: "Third Hearing Reports",
          link: "/arbdashboard/secondHearing/thirdHearingNoticeReports",
          icon: <TbReportAnalytics />,
        },
      ],
    },
    {
      name: "Third Hearing",
      icon: <FaVideo />,
      submenu: [
        {
          name: "Third Hearing",
          link: "/arbdashboard/thirdHearing/third_Hearing",
          icon: <FaFileVideo />,
        },
      ],
    },
    {
      name: "Award Pass",
      icon: <FaHandshake />,
      submenu: [
        {
          name: "Generate Award",
          link: "/arbdashboard/awardPass/lotwise",
          icon: <RiAiGenerate />,
        },
        {
          name: "Award Services",
          link: "/arbdashboard/awardPass/awardservice",
          icon: <TiMessages />,
        },
        {
          name: "Award Reports",
          link: "/arbdashboard/awardPass/awardreport",
          icon: <TbReportAnalytics />,
        },
      ],
    },
    {
      name: "Terminate",
      icon: <AiFillStop />,
      link: "/arbdashboard/terminate",
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
      <CommonTopbar isOpen={isOpen} />
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

export default ArbitratorDashboard;
