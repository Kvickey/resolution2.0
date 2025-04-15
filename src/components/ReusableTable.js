import React, { useEffect, useState } from "react";
import Pagination from "react-bootstrap/Pagination";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./ReusableTable.css";
import { FaSearch } from "react-icons/fa";

const ReusableTable = ({
  data = [],
  currentPage,
  pageNumbers,
  setCurrentPage,
}) => {
  // Use the keys of the first object in data as headers if data is an array of objects
  const [searchText, setSearchText] = useState("");
  const [tableData, setTableData] = useState(data);
  let [headers, setHeaders] = useState([]);
  let [newheaders, setNewHeader] = useState([]);

  // Used to make Some Columns in the start 

  useEffect(() => {
    let tempheaders =
      data.length > 0 && typeof data[0] === "object"
        ? ["Sr", ...Object.keys(data[0])]
        : [];
    let tempnewheaders = tempheaders.map((header) => newKeys[header] || header);
    setHeaders(tempheaders);
    setNewHeader(tempnewheaders);
  }, [data]);
  let SerialNumber = 1;
  // Rename Keys to show in the table Headers 

  const newKeys = {
    Case_id: "Case Id",
    Lot_no: "Lot No",
    Acc_no: "Account No",
    Reference_no: "Reference No",
    Cust_id: "Customer Id",
    Client_id: "Client Id",
    client_name: "Client Name",
    Product_id: "Product Id",
    Product_name: "Product Name",
    Type: "Type",
    Cust_name: "Customer Name",
    Mobile_no: "Mobile No",
    Work_mobile_no: "Office Mobile No",
    Email_id: "Email Id",
    Comm_add: "Address",
    And_also_at: "And Also At",
    And_also_at2: "And Also At 2",
    And_also_at3: "And Also At 3",
    Work_add: "Work Address",
    LRN_Date: "LRN Date",
    LRN_ref_no: "LRN Referrence No",
    Uploaded_date: "Uploaded Date",
    Uploaded_by: "Uploaded By",
    Arb_id: "Arbitrator Id",
    Arb_name: "Arbitrator Name",
    Assign_date: "Assign Date",
    Ref_date: "Referrence Date",
    Acc_date: "Acc Date",
    Soc_date: "Soc Date",
    Sec_17_app_date: "Sec 17 app Date",
    First_hearing_date: "First Hearing Date",
    Sec_17_order_date: "Sec 17 order date",
    Second_hearing_date: "Second hearing date",
    third_hearing_date: "Third hearing date",
    Fourth_hearing_date: "Fourth hearing date",
    Fifth_hearing_date: "Fifth hearing date",
    Award_date: "Award Date",
    Status: "Status",
    Is_terminate: "Is Terminate",
    Stage_id: "Stage Id",
    Remark: "Remark",
    Termination_date: "Termination Date",
    No_of_cases:"No Of Cases",
  };

  // Filtering Logic Search box

  useEffect(() => {
    let backupData = data;
    if (searchText !== "") {
      let filterHeaders = ["Cust_name", "Cust_id"];
      const filterFunction = (columnName) => {
        const filteredData = backupData.filter((row) =>
         row[columnName] && row[columnName]
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "")
            .includes(searchText)
        );
        return filteredData;
      };
      let filteredData = [];
      filterHeaders.forEach((header) => {
        const filterArray = filterFunction(header);
        filteredData = [...filteredData, ...filterArray];
      });
      backupData = filteredData;
    }
    setTableData(backupData);
  }, [searchText]);

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
    <>
      <div className="table-container mt-3 pt-0">
        <div className="row justify-content-end w-100 mt-2">
          <div className="col-12 col-md-6 col-lg-4 ">
            <div className="row border border-secondary-subtle rounded-pill onFocusBorder">
              <div className="col-11 ">
                <input
                  type="text"
                  placeholder="Search..."
                  className="form-control py-2  focus-ring focus-ring-light border-0"
                  onChange={(e) =>
                    setSearchText(
                      e.target.value.toLowerCase().trim().replace(/\s+/g, "")
                    )
                  }
                  value={searchText}
                />
              </div>
              <div className="col-1 p-0">
                <div className="row h-100 justify-content-center align-items-center">
                  <div className="col p-0" style={{ color: "#c1c1c1" }}>
                    <FaSearch />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="table-wrapper">
          <table className="responsive-table my-3">
            <thead>
              <tr>
                {newheaders &&
                  newheaders.map((header, index) => (
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
              {tableData &&
                tableData.map((row, rowIndex) => (
                  <tr key={rowIndex} className="text-center custom_fz">
                    {headers &&
                      headers.map((header, cellIndex) => (
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
                          {header === "Sr"
                            ? SerialNumber++
                            : row[header]
                            ? row[header]
                            : "Not provided"}
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
    </>
  );
};

export default ReusableTable;
