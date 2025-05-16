import React, { useEffect, useState } from "react";
import Pagination from "react-bootstrap/Pagination";
import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import "./ReusableTable.css";

const ReusableTable = ({
  data,
  currentPage,
  pageNumbers,
  setCurrentPage,
}) => {
  const [searchText, setSearchText] = useState("");
  const [tableData, setTableData] = useState(data);
  const [headers, setHeaders] = useState([]);
  const [newheaders, setNewHeader] = useState([]);

  // Header key mapping
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
    No_of_cases: "No Of Cases",
  };

  useEffect(() => {
    let tempheaders =
      data.length > 0 && typeof data[0] === "object"
        ? ["Sr No", ...Object.keys(data[0])]
        : [];
    let tempnewheaders = tempheaders.map((header) => newKeys[header] || header);
    setHeaders(tempheaders);
    setNewHeader(tempnewheaders);
    setTableData(data); // reset tableData when new data is passed
  }, [data]);

  // Search filtering logic
  useEffect(() => {
    let backupData = [...data];
    if (searchText !== "") {
      const filterHeaders = ["Cust_name", "Cust_id"];
      let filteredData = [];
      filterHeaders.forEach((header) => {
        const matches = backupData.filter(
          (row) =>
            row[header] &&
            row[header].toLowerCase().trim().replace(/\s+/g, "").includes(searchText)
        );
        filteredData = [...filteredData, ...matches];
      });

      // Remove duplicates
      const uniqueData = Array.from(new Set(filteredData.map(item => JSON.stringify(item)))).map(item => JSON.parse(item));
      setTableData(uniqueData);
    } else {
      setTableData(data);
    }
  }, [searchText, data]);

  // Pagination logic
  const totalPages = pageNumbers.length;
  const maxPagesToShow = 5;

  const startPage = Math.max(
    1,
    Math.min(currentPage - Math.floor(maxPagesToShow / 2), totalPages - maxPagesToShow + 1)
  );
  const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

  const displayedPages = pageNumbers.slice(startPage - 1, endPage);

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

  // Serial number starting index
  const SerialNumberStart = (currentPage - 1) * 10 + 1;

  return (
    <>
      <div className="table-container mt-3 pt-0">
        <div className="row justify-content-end w-100 mt-2">
          <div className="col-12 col-md-6 col-lg-4 mt-2">
            <div className="row border border-secondary-subtle rounded-pill onFocusBorder">
              <div className="col-11">
                <input
                  type="text"
                  placeholder="Search..."
                  className="form-control py-2 focus-ring focus-ring-light border-0"
                  onChange={(e) =>
                    setSearchText(e.target.value.toLowerCase().trim().replace(/\s+/g, ""))
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
                              header === "CUST_NAME" || header === "assignedArbitrator"
                                ? "left"
                                : "center",
                            whiteSpace: "nowrap",
                            wordBreak: "break-word",
                            padding: "5px 20px",
                          }}
                        >
                          {header === "Sr No"
                            ? SerialNumberStart + rowIndex
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
