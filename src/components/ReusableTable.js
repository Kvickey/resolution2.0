import React from "react";
import Pagination from "react-bootstrap/Pagination";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./ReusableTable.css";

const ReusableTable = ({ data, currentPage, pageNumbers, setCurrentPage }) => {
  // Use the keys of the first object in data as headers if data is an array of objects

  const headers = 
  data.length > 0 && typeof data[0] === "object"
    ? Object.keys(data[0])
    : [];
  // console.log(data);
  // console.log(headers);
  
  
  // Pagination logic to show only 5 buttons at a time
  const totalPages = pageNumbers.length;
  const maxPagesToShow = 5;

  const startPage = Math.max(
    1,
    Math.min(
      currentPage - Math.floor(maxPagesToShow / 2),
      totalPages - maxPagesToShow + 1
    )
  );
  const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

  const displayedPages = pageNumbers.slice(startPage - 1, endPage);

  // Handlers for arrow clicks
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
    <div className="table-container mt-3">
      <div className="table-wrapper">
        <table className="responsive-table my-3">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  style={{ textAlign: "center", padding: "5px 20px" }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="text-center custom_fz">
                {headers.map((header, cellIndex) => (
                  <td
                    key={cellIndex}
                    style={{
                      textAlign:
                        header === "CUST_NAME" ||
                        header === "assignedArbitrator"
                          ? "left"
                          : "center",
                      whiteSpace: "nowrap",
                      wordBreak: "break-word",
                      padding: "5px 20px",
                    }}
                  >
                    {row[header] ? row[header] : "Not provided"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pageNumbers.length > 1 && (
        <Pagination className="justify-content-center">
          <Pagination.Prev
            onClick={handlePrevious}
            disabled={currentPage === 1}
          >
            <FaChevronLeft />
          </Pagination.Prev>
          {displayedPages.map((number) => (
            <Pagination.Item
              key={number}
              active={number === currentPage}
              onClick={() => setCurrentPage(number)}
            >
              {number}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            <FaChevronRight />
          </Pagination.Next>
        </Pagination>
      )}
    </div>
  );
};

export default ReusableTable;
