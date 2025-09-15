import React, { useEffect, useState } from "react";
import "./InstDashboardMain.css";
import LineChar from "../components/Linechar";
import { API_BASE_URL } from "../utils/constants";

const InstDashboardMain = () => {
  
  const [dashboardCount, setDashboardCount] = useState([]);
  const [arbitrators, setArbitrators] = useState([]);
  const [len, setLen] = useState(false);
  useEffect(() => {
    const fetchDashboardCount = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/DashboardCount`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const parsedDashboardCount = Array.isArray(result)
        ? result
        : JSON.parse(result); // Ensure parsedArbitrators is an array
        // console.log(parsedDashboardCount);
        setDashboardCount(parsedDashboardCount);
      } catch (error) {
        // setError(error.message);
      }
    };
    
    const fetchArbitrators = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/ArbListWithCaseCount`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const parsedArbitrators = Array.isArray(result)
        ? result
        : JSON.parse(result); // Ensure parsedArbitrators is an array
        // console.log(parsedArbitrators);
        setArbitrators(parsedArbitrators);
      } catch (error) {
        // setError(error.message);
      }
    };
    
    fetchDashboardCount();
    fetchArbitrators();
  }, []);
  
  console.log("dashboardCount:", dashboardCount);
  if(dashboardCount.length > 0){
    setLen(true);
  }
  

  return (
    <>
      <div className="stats">
        <div className="statsItem p-2">
          {len ? (
          <><div className="statsTitle pregress ms-2">{dashboardCount[0].Unassigned_lots}</div>
          <div className="statsContainer pe-3" >Unassigned Lots</div></>          
          ) : ""}
        </div>

        <div className="statsItem p-2">
          {len ? (
          <>
          <div className="statsTitle pending ms-2">{dashboardCount[0].Pending_cases}</div>
          <div className="statsContainer pe-3">Pending Cases</div>
          </>          
          ) : ""}
        </div>

        <div className="statsItem p-2">
          {len ? (
          <>
          <div className="statsTitle complete ms-2">{dashboardCount[0].Resolved_cases}</div>
          <div className="statsContainer pe-3"> Cases Resolved this week </div>
          </>          
          ) : ""}
        </div>
      </div>

      <div>
        <div className="dashboard-content">
          <div className="arb-panel">
            <div className="arb-header">
              <h6 className="pt-2">Arbitrators</h6>
            </div>
            <div className="arb-list">
              {arbitrators.map((item, index) => (
                <div className="list-item" key={index}>
                  <p>
                    {item.Arb_name} <span>{item.Cases}</span>
                  </p>
                </div>
              ))}
              {/* {arbitrators.map((item, index) => (
                <div className="list-item" key={index}>
                  <p>
                    {item.Arb_name} <span>185</span>
                  </p>
                </div>
              ))} */}
            </div>
          </div>

          <div className="chart-area" style={{ display: "none" }}>
            <div className="arb-header">
              <h6 className="pt-2">Case Tracker</h6>
            </div>
            <div className="chart-header mt-5">
              {}
              <LineChar className="" />
            </div>
          </div>

          <div className="arb-panel" style={{ display: "none" }}>
            <div className="arb-header">
              <h6 className="pt-2">Pending Cases</h6>
            </div>
            <div className="arb-list">
              <div className="list-item">
                <p>
                  Reference Drafts <span>185</span>
                </p>
              </div>
              <div className="list-item">
                <p>
                  Arbitrator Assign <span>250</span>
                </p>
              </div>
              <div className="list-item">
                <p>
                  Acceptance Letter <span>110</span>
                </p>
              </div>
              <div className="list-item">
                <p>
                  SOC <span>163</span>
                </p>
              </div>
              <div className="list-item">
                <p>
                  Sec 17 Application <span>90</span>
                </p>
              </div>
              <div className="list-item">
                <p>
                  1st Hearing <span>34</span>
                </p>
              </div>
              <div className="list-item">
                <p>
                  2nd Hearing <span>24</span>
                </p>
              </div>
              <div className="list-item">
                <p>
                  Pursis <span>353</span>
                </p>
              </div>
              <div className="list-item">
                <p>
                  Award <span>2569</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InstDashboardMain;
