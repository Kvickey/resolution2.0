import React from "react";
import { Pagination } from "react-bootstrap";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ReusableTableFixed = ({
  columns,
  data,
  currentPage,
  totalPages,
  displayedPages,
  handlePrevious,
  handleNext,
  setCurrentPage,
  handleRowAction,
  startIndex,
}) => {
  const showArbName = columns.some((col) => col.key === "Arb_name");

  return (
    <div className="row table-container">
      <div className="col-md-12 mx-auto table-wrapper">
        <table className="responsive-table">
          <thead className="text-center">
            <tr className="table-info">
              <th className="text-center">Sr No</th>
              <th className="text-center">Uploaded Date</th>
              <th className="text-center">Lot No</th>
              {showArbName && <th className="text-left">Arbitrator Name</th>}
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id}>
                <td className="text-center p-0">{startIndex + index + 1}</td>
                <td className="text-center p-0">
                  {item.Uploded_date
                    ? new Date(item.Uploded_date).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : ""}
                </td>
                <td className="text-center p-0">{item.Lots}</td>
                {showArbName && <td className="text-left">{item.Arb_name}</td>}
                <td className="text-center p-1">
                  <button
                    onClick={() => handleRowAction(item)}
                    className="custBtn"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <Pagination className="justify-content-center mt-3">
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
    </div>
  );
};

export default ReusableTableFixed;
