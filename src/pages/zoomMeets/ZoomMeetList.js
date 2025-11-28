import React, { useEffect, useState } from "react";
import { useAuth } from "../../components/AuthProvider";
import { API_BASE_URL } from "../../utils/constants";
import "./ZoomMeetList.css";   // ← IMPORT CSS HERE

const ZoomMeetList = () => {
  const [arbId, setArbId] = useState("");
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    setArbId(user[0].Ref_id);
  }, [user]);

  useEffect(() => {
    const fetchMeetings = async () => {
      if (!arbId) return;
      try {
        const response = await fetch(`${API_BASE_URL}/api/Meetings?Arb_id=${arbId}`);
        if (!response.ok) throw new Error("Network error");

        const result = await response.json();
        setMeetings(Array.isArray(result) ? result : JSON.parse(result));
      } catch (err) {
        console.log(err);
      }
    };

    fetchMeetings();
  }, [arbId]);

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const dateObj = new Date(isoDate);
    if (isNaN(dateObj.getTime())) return "";

    const day = String(dateObj.getUTCDate()).padStart(2, "0");
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
    const year = dateObj.getUTCFullYear();
    return `${day}.${month}.${year}`;
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(meetings.length / itemsPerPage);
  const currentItems = meetings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleStartMeeting = (zoomLink) => {
    if (!zoomLink) {
      alert("No Zoom link available for this meeting!");
      return;
    }
    window.open(zoomLink, "_blank");
  };

  return (
    <div className="zoom-meet-container">
      <h3 className="title">Zoom Meetings</h3>

      <table className="zoom-meet-table">
        <thead>
          <tr>
            <th>Sr No</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>Zoom Link</th>
            <th>Start Meet</th>
          </tr>
        </thead>

        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((m, index) => (
              <tr key={m.Meeting_Id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{formatDate(m.Date)}</td>
                <td>{m.start_time}</td>
                <td>{m.Link}</td>
                <td>
                  <button
                    className="start-btn"
                    onClick={() => handleStartMeeting(m.Link)}
                  >
                    Start
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-data">No meetings found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination-container">
        <button
          className="pagination-btn"
          disabled={currentPage === 1}
          onClick={() => changePage(currentPage - 1)}
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`pagination-btn ${currentPage === i + 1 ? "active" : ""}`}
            onClick={() => changePage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="pagination-btn"
          disabled={currentPage === totalPages}
          onClick={() => changePage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ZoomMeetList;


// import React, { useEffect, useState } from "react";
// import { useAuth } from "../../components/AuthProvider";
// import { API_BASE_URL } from "../../utils/constants";
// import ReusableTable from "../../components/ReusableTable";

// const ZoomMeetList = () => {
//   const [arbId, setArbId] = useState("");
//   const { user, logout } = useAuth();
//   const [meetings, setMeetings] = useState([]);

//   useEffect(() => {
//     // console.log(user);
//     setArbId(user[0].Ref_id);
//   }, [user]);

//   //   console.log(arbId);

//   useEffect(() => {
//     const fetchMeetings = async () => {
//       if (!arbId) return;
//       try {
//         const response = await fetch(
//           `${API_BASE_URL}/api/Meetings?Arb_id=${arbId}`
//         );
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         const result = await response.json();
//         const parsedMeetings = Array.isArray(result)
//           ? result
//           : JSON.parse(result); // Ensure parsedArbitrators is an array
//         setMeetings(parsedMeetings);
//       } catch (error) {
//         // setError1(error.message);
//       }
//     };

//     fetchMeetings();
//   }, [arbId]);

//   console.log(meetings);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);

//   const totalItems = meetings.length;
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const currentItems = meetings.slice(startIndex, startIndex + itemsPerPage);
//   const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

//   return (
//     <div>
//       <ReusableTable
//         data={currentItems}
//         currentPage={currentPage}
//         pageNumbers={pageNumbers}
//         setCurrentPage={setCurrentPage}
//       />
//     </div>
//   );
// };

// export default ZoomMeetList;
