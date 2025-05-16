import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/constants";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../components/AuthProvider";

const AccScheduledMeets = () => {
  const [scheduledMeets, setScheduledMeets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [arbId, setArbId] = useState("");
  const { user, logout } = useAuth();

  //   for pagination of reusable table starts
  const [searchTerm, setSearchTerm] = useState("");
  const rowsPerPage = 10;
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(scheduledMeets.length / 10); // Example calculation
  const displayedPages = Array.from({ length: totalPages }, (_, i) => i + 1); // Example pagination logic
  const startIndex = (currentPage - 1) * 10;
  // for pagination of

  useEffect(() => {
    console.log(user);
    setArbId(user[0].Ref_id);
  }, [user]);

  console.log(arbId);

  useEffect(() => {
    const fetchAccScheduledMeets = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/SheduledMeetings?Arb_id=${arbId}&Process_id=2`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const parsedNotServedLots = Array.isArray(result)
          ? result
          : JSON.parse(result); // Ensure parsedArbitrators is an array
        setScheduledMeets(parsedNotServedLots);
      } catch (error) {
        // setError1(error.message);
      }
    };

    fetchAccScheduledMeets();
  }, [arbId]);

  console.log(scheduledMeets);
  //   for the getting data of selected lot to create refernce Draft ends

  const searchFields = ["Arb_name", "Lots"];

  const filteredLots = scheduledMeets.filter((item) =>
    searchFields.some((key) =>
      item[key]?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredLots.slice(indexOfFirstRow, indexOfLastRow);

  // Loading Spinner Compenent
  if (loading) return <LoadingSpinner />;

  // for pagination of reusabletableFixed starts
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="container">
      <div className="row align-items-center">
        <div className="col-md-6">
          <h5>Acceptance Scheduled Meetings</h5>
        </div>

        <div className="col-md-6"></div>
      </div>

      <div className="row table-container mt-3">
        <div className="col-md-12 mx-auto table-wrapper">
          {/* Search Input */}
          <div className="mb-3 d-flex justify-content-start">
            <input
              type="text"
              placeholder="Search Lots..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // reset to first page on search
              }}
              className="form-control"
              style={{ maxWidth: "300px" }}
            />
          </div>

          {/* Table */}
          <table className="responsive-table my-3">
            <thead className="text-center">
              <tr className="table-info">
                <th scope="col" className="text-center">
                  Sr No
                </th>
                <th scope="col" className="text-center">
                  Lots
                </th>
                <th scope="col" className="text-center">
                  Hearing Date
                </th>
                <th scope="col" className="text-center">
                  Meeting Link
                </th>
                <th scope="col" className="text-center">
                  Meeting ID
                </th>
                <th scope="col" className="text-center">
                  Meeting Password
                </th>
                <th scope="col" className="text-center">
                  Acceptance Date
                </th>
              </tr>
            </thead>
            <tbody>
              {currentRows.length > 0 ? (
                currentRows.map((item, index) => (
                  <tr key={item.id}>
                    <td className="text-center">
                      {indexOfFirstRow + index + 1}
                    </td>
                    <td className="text-center">{item.Lots}</td>
                    <td className="text-center">
                      {item.Hearing_date
                        ? new Date(item.Hearing_date).toLocaleDateString(
                            "en-GB",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : ""}
                    </td>
                    <td className="text-center">{item.video_link}</td>
                    <td className="text-center">{item.Link_id}</td>
                    <td className="text-center">{item.Password}</td>
                    <td className="text-center">
                      {item.Acc_date
                        ? new Date(item.Acc_date).toLocaleDateString("en-GB", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : ""}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-muted">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="d-flex justify-content-center">
            <nav>
              <ul className="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                  <li
                    key={i + 1}
                    className={`page-item ${
                      currentPage === i + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccScheduledMeets;
