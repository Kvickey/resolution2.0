import React, { useEffect, useState } from "react";
import "./InstDashboardMain.css";
import LineChar from "../../../components/Linechar";
import { API_BASE_URL } from "../../../utils/constants";

const InstDashboardMain = () => {
  const [dashboardCount, setDashboardCount] = useState([]);
  const [arbitrators, setArbitrators] = useState([]);

  const [pendinglots, setPendinglots] = useState([]);

  const len = Array.isArray(dashboardCount) && dashboardCount.length > 0;

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchJsonAsArray = async (url) => {
      const resp = await fetch(url, { signal });
      if (!resp.ok)
        throw new Error(`Network response was not ok (${resp.status})`);
      const json = await resp.json();

      if (Array.isArray(json)) return json;
      if (!json) return [];
      if (Array.isArray(json.data)) return json.data;
      if (Array.isArray(json.result)) return json.result;
      // fallback: wrap single object into array
      return [json];
    };

    (async () => {
      try {
        const [counts, arbs] = await Promise.all([
          fetchJsonAsArray(`${API_BASE_URL}/api/DashboardCount`),
          fetchJsonAsArray(`${API_BASE_URL}/api/ArbListWithCaseCount`),
        ]);
        setDashboardCount(counts);
        setArbitrators(arbs);
      } catch (err) {
        if (err.name !== "AbortError") console.error("Fetch error:", err);
      }
    })();

    return () => controller.abort();
  }, []);

  // console.log("dashboardCount:", dashboardCount);

  useEffect(() => {
    const fetchPendingLots = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/arbitrator`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const parsedPendingLots = Array.isArray(result)
          ? result
          : JSON.parse(result); // Ensure parsedArbitrators is an array
        // console.log(parsedArbitrators);
        setPendinglots(parsedPendingLots);
      } catch (error) {
        // setError(error.message);
      }
    };

    fetchPendingLots();
  }, []);
  // console.log(arbitrators);

  return (
    <>
      <div className="stats">
        <div className="statsItem p-2">
          {len && dashboardCount[0] ? (
            <>
              <div className="statsTitle pregress ms-2">
                {dashboardCount[0]?.Unassigned_lots ?? 0}
              </div>
              <div className="statsContainer pe-3">Unassigned Lots</div>
            </>
          ) : (
            <div className="statsContainer pe-3">Loading…</div>
          )}
        </div>

        <div className="statsItem p-2">
          {len && dashboardCount[0] ? (
            <>
              <div className="statsTitle pending ms-2">
                {dashboardCount[0]?.Pending_cases ?? 0}
              </div>
              <div className="statsContainer pe-3">Pending Cases</div>
            </>
          ) : (
            <div className="statsContainer pe-3">Loading…</div>
          )}
        </div>

        <div className="statsItem p-2">
          {len && dashboardCount[0] ? (
            <>
              <div className="statsTitle complete ms-2">
                {dashboardCount[0]?.Resolved_cases ?? 0}
              </div>
              <div className="statsContainer pe-3">
                Cases Resolved this week
              </div>
            </>
          ) : (
            <div className="statsContainer pe-3">Loading…</div>
          )}
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
