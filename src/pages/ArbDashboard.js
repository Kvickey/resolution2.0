import React, { useState } from 'react'
import { Outlet } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import CommonTopbar from '../components/Topbar';
import { useAuth } from '../components/AuthProvider';
import { FaHome ,FaHandshake} from "react-icons/fa";
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


const ArbDashboard = () => {

    const [selectedMenuItem, setSelectedMenuItem] = useState('Dashboard');
    const [isOpen, setIsOpen] = useState(true);
    const { user } = useAuth();

    if (!user) {
      return <Navigate to="/" />;
    }

    const menuItems = [
        {
            name: 'Dashboard',
            icon: <FaHome /> , 
            link: '/arbdashboard',
        },
        {
            name: 'Arbitrator',
            icon: <GiThorHammer />,
            link: '/arbdashboard/section17order',
        },
        {
            name: 'Acceptance Letter',
            icon: <FaHandshake />,
            submenu: [
                { name: 'Generate AL', link: '/arbdashboard/acceptletter/generate_al', icon: <RiAiGenerate /> },
                { name: 'Services', link: '/arbdashboard/acceptletter/services', icon: <RiCustomerService2Line /> },
                { name: 'Reports', link: '/arbdashboard/acceptletter/reports', icon: <TbReportAnalytics /> },
            ]
        },
        {
            name: 'Section 17 Order',
            icon: <GiThorHammer />,
            link: '/arbdashboard/section17order',
        },
        {
            name: 'First Hearing',
            icon: <FaVideo />,
            submenu: [
                { name: 'First Hearing', link: '/arbdashboard/firstHearing/first_Hearing', icon: <FaFileVideo /> },
                { name: 'Second Hearing Notice', link: '/arbdashboard/firstHearing/createSecondHearingNotice', icon: <IoDocumentTextOutline /> },
                { name: 'Second Hearing Services', link: '/arbdashboard/firstHearing/secondHearingNoticeServices', icon: <TiMessages /> },
                { name: 'Second Hearing Reports', link: '/arbdashboard/firstHearing/secondHearingNoticeReports', icon: <TbReportAnalytics /> },
            ]
        },
        {
            name: 'Second Hearing',
            icon: <FaVideo />,
            submenu: [
                { name: 'Second Hearing', link: '/arbdashboard/secondHearing/second_Hearing', icon: <FaFileVideo /> },
                { name: 'Third Hearing Notice', link: '/arbdashboard/secondHearing/createThirdHearingNotice', icon: <IoDocumentTextOutline />  },
                { name: 'Third Hearing Services', link: '/arbdashboard/secondHearing/thirdHearingNoticeServices', icon: <TiMessages /> },
                { name: 'Third Hearing Reports', link: '/arbdashboard/secondHearing/thirdHearingNoticeReports', icon: <TbReportAnalytics /> },
            ]
        },
        {
            name: 'Third Hearing',
            icon: <FaVideo />,
            submenu: [
                { name: 'Third Hearing', link: '/arbdashboard/thirdHearing/third_Hearing', icon: <FaFileVideo /> },
                { name: 'Forth Hearing Notice', link: '/arbdashboard/thirdHearing/createForthHearingNotice', icon: <IoDocumentTextOutline />  },
                { name: 'Forth Hearing Services', link: '/arbdashboard/thirdHearing/forthHearingNoticeServices', icon: <TiMessages /> },
                { name: 'Forth Hearing Reports', link: '/arbdashboard/thirdHearing/forthHearingNoticeReports', icon: <TbReportAnalytics /> },
            ]
        },
        {
            name: 'Forth Hearing',
            icon: <FaVideo />,
            submenu: [
                { name: 'Forth Hearing', link: '/arbdashboard/forthHearing/forth_Hearing', icon: <FaFileVideo /> },
                { name: 'Fifth Hearing Notice', link: '/arbdashboard/forthHearing/createFifthHearingNotice', icon: <IoDocumentTextOutline />  },
                { name: 'Fifth Hearing Services', link: '/arbdashboard/forthHearing/fifthHearingNoticeServices', icon: <TiMessages /> },
                { name: 'Fifth Hearing Reports', link: '/arbdashboard/forthHearing/fifthHearingNoticeReports', icon: <TbReportAnalytics /> },
            ]
        },
        {
            name: 'Fifth Hearing',
            icon: <FaVideo />,
            submenu: [
                { name: 'Fifth Hearing', link: '/arbdashboard/fifthHearing/fifth_Hearing', icon: <RiAiGenerate /> },
            ]
        },
        {
            name: 'Award Pass',
            icon: <GoNote />,
            link: '/arbdashboard/awardPass',
        },
        {
            name: 'Terminate',
            icon: <AiFillStop /> ,
            link: '/arbdashboard/terminate',
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
            <CommonTopbar isOpen={isOpen}/>
            <Sidebar menuItems={menuItems} user={user.User_name} onMenuItemClick={handleMenuItemClick} isOpen={isOpen} toggleSidebar={toggleSidebar}/>       
            <div className= {`${isOpen?"":"sideCollapse"} mainn-content p-3`}>           
            <Outlet />
            </div>
        </div>
    )
}

export default ArbDashboard
