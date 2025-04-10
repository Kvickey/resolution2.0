// src/components/Dashboard.js
import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Topbar from '../Componants/Topbar'
import { BrowserRouter as Router, Route,  Routes } from 'react-router-dom';
import Sidebar from './Sidebar';
import "./Topbar.css"
import Home from '../Arbitration/Home';
import LRN from '../Arbitration/LRN/LRN';
import ImportData from '../Arbitration/ImportData/ImportData';

const Dashboard = ({ user }) => {
  return (
    <div>
      <Topbar user={user} />
      <div style={{ display: 'flex', backgroundColor: 'lightgray' }}>
        <Sidebar />     
        <div style={{overflow:'auto'}}>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ImportData" element={<ImportData />} />
            <Route path="/LRN" element={<LRN/>} />
          </Routes>
       </div>  
         
      </div>
</div>
  );
};

export default Dashboard;
