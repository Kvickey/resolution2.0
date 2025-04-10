import React, { useEffect, useState } from "react";
import "./InstDashboardMain.css";
import LineChar from "../components/Linechar";
import { API_BASE_URL } from "../utils/constants";

const InstDashboardMain = () => {
  const [arbitrators, setArbitrators] = useState([]);
  useEffect(() => {
    const fetchArbitrators = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/arbitrator`);
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

    fetchArbitrators();
  }, []);
  // console.log(arbitrators);

  return (
    <>
      <div className="stats">
        <div className="statsItem p-2">
          <div className="statsTitle pregress ms-2"> 2</div>
          <div className="statsContainer pe-3">Unassigned Lots</div>
        </div>

        <div className="statsItem p-2">
          <div className="statsTitle pending ms-2"> 200 </div>
          <div className="statsContainer pe-3">Pending Cases</div>
        </div>

        <div className="statsItem p-2">
          <div className="statsTitle complete ms-2">500</div>
          <div className="statsContainer pe-3"> Cases Resolved this week </div>
        </div>
      </div>

      <div>
        <div className="dashboard-content">
          <div className="arb-panel">
            <div className="arb-header">
              <h4 className="pt-2">Arbitrators</h4>
            </div>
            <div className="arb-list">
              {arbitrators.map((item, index) => (
                <div className="list-item" key={index}>
                  <p>
                    {item.Arb_name} <span>185</span>
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

          <div className="chart-area">
            <div className="arb-header">
              <h4 className="pt-2">Case Tracker</h4>
            </div>
            <div className="chart-header mt-5">
              {/* <h2>Case Tracker</h2> */}
              <LineChar className="" />
            </div>
          </div>

          <div className="arb-panel">
            <div className="arb-header">
              <h4 className="pt-2">Pending Cases</h4>
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
