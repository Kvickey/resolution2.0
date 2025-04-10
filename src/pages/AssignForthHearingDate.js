import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { API_BASE_URL } from "../utils/constants";
import { Pagination } from "react-bootstrap";
import LoadingSpinner from "../components/LoadingSpinner";
import "./AssignSecondHearingDate.css";

const AssignForthHearingDate = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [formattedDate, setFormattedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false); // Single select all checkbox
  const [secondDate, setSecondDate] = useState(false);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setFormattedDate(date ? date.toLocaleDateString("en-US") : "");
  };

  const handleAppointments = async () => {
    const dataAppointments = { Hearing_date: formattedDate };
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/GetOppforSecondHearing`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataAppointments),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to upload data: ${response.status} - ${errorText}`
        );
      }

      const result = await response.json();
      const parsedData = Array.isArray(result) ? result : JSON.parse(result);
      const updatedData = parsedData.map((item,index)=>{
        const {Cust_name,Acc_id,Case_id,Reference_No,...rest}=item
        return{
          Case_id,
          Reference_No,
          Cust_name,
          ...rest
        }
      })
      setData(updatedData);
      setTotalPages(Math.ceil(updatedData.length / itemsPerPage));
      setSecondDate(true);
    } catch (error) {
      console.error("Error uploading data:", error);
    } finally {
      setLoading(false);
    }
  };
  console.log(data);

  const handleForthHearing = async () => {
    if (!selectedDate) {
      alert("Please select a second hearing date");
      return;
    }
  
    // Format the selected date for the API
    const formattedSecondDate = selectedDate.toLocaleDateString("en-US");
  
    // Create the array of objects to send in the API request
    const payload = selectedRows.map((row) => ({
      Case_id: row.Case_id,
      Second_hearing_date: formattedSecondDate,
    }));

    console.log(payload);
  
    try {
      const response = await fetch(`${API_BASE_URL}/api/AssignSecond_date`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to set second hearing date: ${response.status} - ${errorText}`);
      }
  
      alert("Second hearing dates successfully assigned");
    } catch (error) {
      console.error("Error setting second hearing date:", error);
      alert("Error setting second hearing date. Please try again.");
    }
  };

  const headers = data.length > 0 ? Object.keys(data[0]) : [];
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedRows(data); // Select all across all pages
    } else {
      setSelectedRows([]); // Deselect all
    }
  };

  const handleRowSelection = (row) => {
    const isSelected = selectedRows.includes(row);
    setSelectedRows((prevSelected) =>
      isSelected
        ? prevSelected.filter((r) => r !== row)
        : [...prevSelected, row]
    );
  };

  useEffect(() => {
    setTotalPages(Math.ceil(data.length / itemsPerPage));
  }, [data, itemsPerPage]);

  const generatePaginationItems = () => {
    const pageItems = [];
    const maxPaginationButtons = 5;

    let startPage = Math.max(
      currentPage - Math.floor(maxPaginationButtons / 2),
      1
    );
    let endPage = Math.min(startPage + maxPaginationButtons - 1, totalPages);

    if (endPage - startPage + 1 < maxPaginationButtons) {
      startPage = Math.max(endPage - maxPaginationButtons + 1, 1);
    }

    if (startPage > 1) {
      pageItems.push(
        <Pagination.Item key="start" onClick={() => setCurrentPage(1)}>
          1
        </Pagination.Item>
      );
      if (startPage > 2) {
        pageItems.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageItems.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageItems.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
      }
      pageItems.push(
        <Pagination.Item key="end" onClick={() => setCurrentPage(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }

    return pageItems;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container">
      <div className="row my-2">
        <div className="col-md-5">
          <h4>Assign Forth Hearing Date</h4>
        </div>
      </div>
      <div className="row d-flex align-items-center">
        {!secondDate && (
          <>
            <div className="col-md-3">
              <label htmlFor="datePicker">Select Third Hearing Date</label>
            </div>
            <div className="col-md-3">
              <DatePicker
                id="datePicker"
                selected={selectedDate}
                onChange={handleDateChange}
                placeholderText="Select a date"
                dateFormat="MM/dd/yyyy"
                className="form-control date-picker-sm"
              />
            </div>
            <div className="col-md-3">
              <button className="custBtn" onClick={handleAppointments}>
                Get Data
              </button>
            </div>
          </>
        )}
        {secondDate && (
          <>
            <div className="col-md-3">
              <label htmlFor="datePicker">Select Forth Hearing Date</label>
            </div>
            <div className="col-md-3">
              <DatePicker
                id="datePicker"
                selected={selectedDate}
                onChange={handleDateChange}
                placeholderText="Select a date"
                dateFormat="MM/dd/yyyy"
                className="form-control date-picker-sm"
              />
            </div>
            <div className="col-md-3">
              <button className="custBtn" onClick={handleForthHearing}>
                Set Date
              </button>
            </div>
          </>
        )}
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="table-responsive">
            {data.length > 0 && (
              <table className="table table-striped table-bordered table-hover mt-3 text-center no-wrap-table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                      />
                      {/* <label>Select All Across All Pages</label> */}
                    </th>
                    {headers.map((header) => (
                      <th key={header}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item, index) => (
                    <tr key={index} className="text-center custom_fz">
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(item)}
                          onChange={() => handleRowSelection(item)}
                        />
                      </td>
                      {headers.map((header) => (
                        <td key={header}>{item[header]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {totalPages > 1 && (
            <Pagination className="justify-content-center custom-pagination">
              <Pagination.Prev
                onClick={() =>
                  setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
                }
                disabled={currentPage === 1}
              />
              {generatePaginationItems()}
              <Pagination.Next
                onClick={() =>
                  setCurrentPage((prev) =>
                    prev < totalPages ? prev + 1 : prev
                  )
                }
                disabled={currentPage === totalPages}
              />
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignForthHearingDate;
