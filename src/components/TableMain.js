import React, { useState } from "react";
import { Pagination } from "react-bootstrap";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const TableMain = ({
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
  const [searchTerm, setSearchTerm] = useState("");
  const showArbName = columns.some((col) => col.key === "Arb_name");

  const filteredData = data.filter((item) => {
    const lotMatch = item.Lots?.toString().toLowerCase().includes(searchTerm.toLowerCase());
    const arbMatch = showArbName && item.Arb_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return lotMatch || arbMatch;
  });

  return (
    <div className="row table-container py-5">
      <div className="col-md-12 mx-auto table-wrapper">
        {/* Search Input */}
        <div className="mb-3 text-end">
          <input
            type="text"
            className="form-control w-25 d-inline-block"
            placeholder="Search by Lot No or Arbitrator"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

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
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={showArbName ? 5 : 4} className="text-center">
                  No data found.
                </td>
              </tr>
            ) : (
              filteredData.map((item, index) => (
                <tr key={item.id}>
                  <td className="text-center">{startIndex + index + 1}</td>
                  <td className="text-center">
                    {item.Uploded_date
                      ? new Date(item.Uploded_date).toLocaleDateString("en-GB", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : ""}
                  </td>
                  <td className="text-center">{item.Lots}</td>
                  {showArbName && <td className="text-left">{item.Arb_name}</td>}
                  <td className="text-center">
                    <button
                      onClick={() => handleRowAction(item)}
                      className="custBtn"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
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

export default TableMain;
