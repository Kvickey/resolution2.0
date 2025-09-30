import React, { useEffect, useState } from "react";
import "./ArbDashboardMain.css";
import { API_BASE_URL } from "../../../utils/constants";
import { useAuth } from "../../../components/AuthProvider";

const ArbDashboardMain = () => {
  const [count, setCount] = useState([]);
  const [arbId, setArbId] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    // console.log(user);
    setArbId(user[0].Ref_id);
  }, [user]);

  // console.log(arbId);

  useEffect(() => {
    const fetchDashboardCount = async () => {
      if (!arbId) return;
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/DashboardCount?Arb_id=${arbId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const parsedCount = Array.isArray(result) ? result : JSON.parse(result); // Ensure parsedArbitrators is an array
        setCount(parsedCount);
      } catch (error) {
        // setError1(error.message);
      }
    };

    fetchDashboardCount();
  }, [arbId]);

  console.log(count);

  return (
    <>
      {/* <h2>ArbDashboard Main Page</h2> */}
      <div className="stats1">
        <div className="statsItem1">
          {/* <div className="statsTitle1 progress1">100</div> */}
          {count.length > 0 ? (
            <div className="statsTitle1 progress1">
              {count[0].Assigned_lots}
            </div>
          ) : (
            <div className="statsContainer pe-3">Loading…</div>
          )}
          <div className="statsContainer1">Assigned Lots</div>
        </div>

        <div className="statsItem1">
          {count.length > 0 ? (
            <div className="statsTitle1 pending1">
              {count[0].Pending_cases}
            </div>
          ) : (
            <div className="statsContainer pe-3">Loading…</div>
          )}
          <div className="statsContainer1">Pending Cases</div>
        </div>

        <div className="statsItem1">
          {count.length > 0 ? (
            <div className="statsTitle1 complete1">
              {count[0].Resolved_cases}
            </div>
          ) : (
            <div className="statsContainer pe-3">Loading…</div>
          )}

          <div className="statsContainer1"> Resolved Cases </div>
        </div>
      </div>
    </>
  );
};

export default ArbDashboardMain;
