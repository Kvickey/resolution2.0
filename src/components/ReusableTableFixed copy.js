import React from 'react';
import { Pagination } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

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
  startIndex
}) => {
  console.log(columns);
  console.log(data);
  const showArbName = columns.some(col => col.key === "Arb_name");
  return (
    <div className="row table-container py-5">
      <div className="col-md-12 mx-auto table-wrapper">
        <table className="responsive-table">
          <thead className="text-center">
            <tr className="table-info">
              {columns.map((col, index) => (
                <th key={index} scope="col" className="text-center">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="">
            {data.map((item, index) => (
              <tr key={item.id}>
                <td className="text-center">
                  {startIndex + index + 1}
                </td>
                <td className="text-center">{item.Lot_no}</td>
                {/* <td className="text-left">{item.Arb_name}</td> */}
                <td className="text-left">{item.Arb_name}</td>
                {/* {showArbName && <td className="text-left">{item.Arb_name}</td>} */}
                <td className="text-center">
                  <button
                    onClick={() => handleRowAction(item)}
                    variant="success"
                    className="custBtn"
                  >
                    Generate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <Pagination className="justify-content-center mt-3">
            {/* Left Arrow */}
            <Pagination.Prev
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              <FaChevronLeft />
            </Pagination.Prev>

            {/* Page Number Buttons */}
            {displayedPages.map((number) => (
              <Pagination.Item
                key={number}
                active={number === currentPage}
                onClick={() => setCurrentPage(number)}
              >
                {number}
              </Pagination.Item>
            ))}

            {/* Right Arrow */}
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
