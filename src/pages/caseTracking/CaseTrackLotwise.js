import React, { useEffect, useState } from "react";
import { Button, Form, Pagination } from "react-bootstrap";
// import "../../uploadexcel.css";
import { toast, ToastContainer } from "react-toastify";
import { API_BASE_URL } from "../../utils/constants";

const CaseTrackingLotWise = () => {
  const [data, setData] = useState([]);
  const [selectedClient, setSelectedClient] = useState([]); //the clients Data to populate dropdown
  const [selectedProduct, setSelectedProduct] = useState([]); //to add the product from the dropdown
  const [arbitrator, setArbitrator] = useState([]); //to add the product from the dropdown
  const [whatsappStatus, setWhatsappStatus] = useState([]); //to add the product from the dropdown
  const [error, setError] = useState(null);
  const [error1, setError1] = useState(null);
  const [error2, setError2] = useState(null);
  const [selectedProductID, setSelectedProductID] = useState(null);
  const [selectedClientID, setSelectedClientID] = useState(null);
  const [selectedLotNo, setSelectedLotNo] = useState(null);
  const [selectedArbitratorID, setSelectedArbitratorID] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [status, setStatus] = useState(false);
  const [showPDF, setShowPDF] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  // const [totalPages, setTotalPages] = useState(0);

  // To fetch Clients DaTA
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/Client`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const parsedClient = Array.isArray(result)
          ? result
          : JSON.parse(result); // Ensure parsedArbitrators is an array
        // console.log(parsedClient);
        setSelectedClient(parsedClient);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // console.log(selectedClient);

  // API Call for Product data
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null); // Reset error state
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/products?client_id=${selectedClientID}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        const parsedProducts = Array.isArray(result)
          ? result
          : JSON.parse(result); // Ensure parsedArbitrators is an array
        console.log(parsedProducts);
        setSelectedProduct(parsedProducts); // Set products data
      } catch (error) {
        setError1(error);
      } finally {
        setLoading1(false);
      }
    };

    fetchProduct();
  }, [selectedClientID]);

  // API Call for Arbitrator
  useEffect(() => {
    const fetchArbitrator = async () => {
      setLoading(true);
      setError(null); // Reset error state
      try {
        const response = await fetch(
          "http://arb.resolutionexperts.in/api/arbitrator"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        const parsedArbitrators = Array.isArray(result)
          ? result
          : JSON.parse(result); // Ensure parsedArbitrators is an array
        console.log(parsedArbitrators);
        setArbitrator(parsedArbitrators); // Set products data
      } catch (error) {
        setError1(error);
      } finally {
        setLoading(false);
      }
    };

    fetchArbitrator();
  }, []);

  console.log(arbitrator);

  // OnChange Events

  const handleSelectChange = (e) => {
    const selectedID = e.target.value;
    setSelectedClientID(selectedID);
  };

  const handleProductChange = (e) => {
    const selectedID = e.target.value;
    setSelectedProductID(selectedID);
  };

  const handleArbitratorChange = (e) => {
    const selectedID = e.target.value;
    setSelectedArbitratorID(selectedID);
  };

  const handleLotNoChange = (e) => {
    const selectedID = e.target.value;
    setSelectedLotNo(selectedID);
  };

  // console.log(selectedProductID);
  // console.log(selectedClientID);
  // console.log(selectedLotNo);
  // console.log(selectedArbitratorID);

  // Show Data Logic Goes here
  const handleData = async () => {
    setLoading(true); // Start loading before fetching data
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/Lot?Lot_no=${selectedLotNo}&Client_id=${selectedClientID}&Product_id=${selectedProductID}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      const parsedData = Array.isArray(result) ? result : JSON.parse(result);
      // const updatedData = parsedData.map((item) => {
      //   const { CUST_NAME, REFERENCE_NO, ...rest } = item;
      //   return {
      //     CUST_NAME,
      //     REFERENCE_NO,
      //     // ...rest,
      //   };
      // });
      // console.log(updatedData);
      setData(parsedData);
      // setData(updatedData);
      // setTotalPages(Math.ceil(parsedData.length / itemsPerPage));
      // setTotalPages(Math.ceil(updatedData.length / itemsPerPage));
      // setShowTable(true);
      // handleStepChange(1)
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  console.log(data);

  const formatDate = (dateTimeString) => {
    const dateString = dateTimeString.split("T")[0];
    const [year, month, day] = dateString.split("-");
    return `${month}/${day}/${year}`;
  };

  const handleOpenPDF = (fileUrl) => {
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  const dataToBeDisplayed = data.map((item) => ({
    CUST_NAME: item.Cust_name,
    REFERENCE_NO: item.Reference_no,

    Appointment_Letter:
      item.Ref_date &&
      item.Ref_date !== "01/01/0001" &&
      item.Ref_date !== "0001-01-01T00:00:00" ? (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleOpenPDF(
              `${API_BASE_URL}/Content/Cases/Ref/${item.Reference_no}.pdf`
            );
          }}
        >
          {formatDate(item.Ref_date)}
        </a>
      ) : (
        "N/A"
      ),

    // Appointment_Letter: item.Ref_date ? (
    //   <a
    //     href="#"
    //     onClick={(e) => {
    //       e.preventDefault();
    //       handleOpenPDF(
    //         `${API_BASE_URL}/Content/Cases/Ref/${item.Reference_no}.pdf`
    //       );
    //     }}
    //   >
    //     {formatDate(item.Ref_date)}
    //   </a>
    // ) : (
    //   "N/A"
    // ),

    Acceptance_Letter: item.Acc_date ? (
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          handleOpenPDF(
            `${API_BASE_URL}/Content/Cases/Acc/${item.Reference_no}.pdf`
          );
        }}
      >
        {formatDate(item.Acc_date)}
      </a>
    ) : (
      "N/A"
    ),

    First_Hearing: item.First_hearing_date ? (
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          handleOpenPDF(
            `${API_BASE_URL}/Content/Cases/FirstHearing/${item.Reference_no}.pdf`
          );
        }}
      >
        {formatDate(item.First_hearing_date)}
      </a>
    ) : (
      "N/A"
    ),

    Second_Hearing: item.Second_hearing_date ? (
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          handleOpenPDF(
            `${API_BASE_URL}/Content/Cases/SecondHearing/${item.Reference_no}.pdf`
          );
        }}
      >
        {formatDate(item.Second_hearing_date)}
      </a>
    ) : (
      "N/A"
    ),

    Third_Hearing: item.third_hearing_date ? (
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          handleOpenPDF(
            `${API_BASE_URL}/Content/Cases/ThirdHearing/${item.Reference_no}.pdf`
          );
        }}
      >
        {formatDate(item.third_hearing_date)}
      </a>
    ) : (
      "N/A"
    ),

    SOC: item.Soc_date ? (
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          handleOpenPDF(
            `${API_BASE_URL}/Content/Cases/SOC/${item.Reference_no}.pdf`
          );
        }}
      >
        {formatDate(item.Soc_date)}
      </a>
    ) : (
      "N/A"
    ),

    Section17_Application: item.Sec_17_app_date ? (
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          handleOpenPDF(
            `${API_BASE_URL}/Content/Cases/SEC_17_App/${item.Reference_no}.pdf`
          );
        }}
      >
        {formatDate(item.Sec_17_app_date)}
      </a>
    ) : (
      "N/A"
    ),

    Section17_Order: item.Sec_17_order_date ? (
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          handleOpenPDF(
            `${API_BASE_URL}/Content/Cases/SEC_17_Order/${item.Reference_no}.pdf`
          );
        }}
      >
        {formatDate(item.Sec_17_order_date)}
      </a>
    ) : (
      "N/A"
    ),

    Award_Pass: item.Award_date ? (
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          handleOpenPDF(
            `${API_BASE_URL}/Content/Cases/AwardPass/${item.Reference_no}.pdf`
          );
        }}
      >
        {formatDate(item.Award_date)}
      </a>
    ) : (
      "N/A"
    ),

    Terminate: item.Termination_date ? (
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          handleOpenPDF(
            `${API_BASE_URL}/Content/Cases/Terminate/${item.Reference_no}.pdf`
          );
        }}
      >
        {formatDate(item.Termination_date)}
      </a>
    ) : (
      "N/A"
    ),
  }));

  dataToBeDisplayed.forEach((item, index) => {
    item.Sr_No = index + 1;
  });

  const updatedData = dataToBeDisplayed.map((item) => {
    const { Sr_No, ...rest } = item;
    return {
      Sr_No,
      ...rest,
    };
  });

  console.log(updatedData);
  const headers = updatedData.length > 0 ? Object.keys(updatedData[0]) : [];
  console.log(headers);
  // console.log(data);
  // const headers = data.length > 0 ? Object.keys(data[0]) : [];
  // console.log(headers);

  // Logic For Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = updatedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  // const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPagesToShow = 5; // Maximum number of page buttons to show

  const generatePaginationItems = () => {
    const pageItems = [];
    let startPage = Math.max(1, currentPage - Math.floor(totalPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + totalPagesToShow - 1);

    if (endPage - startPage + 1 < totalPagesToShow) {
      startPage = Math.max(1, endPage - totalPagesToShow + 1);
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
    return pageItems;
  };

  return (
    <>
      <div className="container">
        {/* Top Lable */}
        <div className="row">
          {/* {!clearForm && ( */}
          <div className="col-md-6">
            <h4 className="my-3 ms-4">Case Tracking Lotwise</h4>
          </div>
          {/* )} */}
        </div>

        <div className="row align-items-center justify-content-evenly">
          {/* To Select The Client Bank */}

          <div className="col-md-3">
            <Form.Select
              aria-label="Default select example"
              onChange={handleSelectChange}
              className="custom_input"
            >
              <option value="" selected>
                Choose a Bank
              </option>
              {selectedClient.map((item) => (
                <option key={item.Client_id} value={item.Client_id}>
                  {item.client_name}
                </option>
              ))}
            </Form.Select>
          </div>

          {/* To Select The pRoduct Of the Bank */}
          <div className="col-md-3">
            <Form.Select
              aria-label="Default select example"
              onChange={handleProductChange}
              className="custom_input"
            >
              <option value="" selected>
                Choose a Product
              </option>
              {selectedProduct.map((item) => (
                <option key={item.Product_id} value={item.Product_id}>
                  {item.Product_name}
                </option>
              ))}
            </Form.Select>
          </div>

          {/* To enter the Lot No */}
          <div className="col-md-3">
            <Form.Control
              type="number"
              className="custom_input"
              placeholder="Enter Lot No"
              onChange={handleLotNoChange}
            />
          </div>

          {/* For Button */}
          <div className="col-md-2">
            <Button className="btn btn-primary getDataBtn" onClick={handleData}>
              Track
            </Button>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 mt-3">
            <div className="table-responsive">
              {dataToBeDisplayed.length > 0 && (
                <table
                  className="table  table-bordered table-hover mt-3 text-center"
                  style={{ tableLayout: "auto" }}
                >
                  {/* // Allow automatic column width adjustment */}
                  <thead
                    className=""
                    style={{
                      backgroundColor: "#ffc107",
                      color: "#172639",
                      // border: "0.5px solid #1a2a38",
                    }}
                  >
                    <tr className=" ">
                      {headers.map((header) => (
                        <td
                          key={header}
                          style={{
                            // backgroundColor: "#ffc107",
                            // backgroundColor: "#172639",
                            backgroundColor: "#ff6f0f",
                            // color: "#ffc107",
                            color: "#ffffff",
                            // border: "0.5px solid #ffffff",
                          }}
                        >
                          {header}
                        </td>
                        // <th key={header} style={{ backgroundColor: "#172639", color: "#ffc107" }}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item, index) => (
                      <tr
                        key={index}
                        className="text-center custom_fz table-info"
                        // className="text-center custom_fz table-success"
                      >
                        {headers.map((header) => (
                          <td
                            key={header}
                            style={{
                              backgroundColor:
                                "#f4f4f4" /* Very light gray for body */,
                              color: "#172639" /* Dark navy for body text */,
                              maxHeight: "50px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              // border: "0.5px solid #1a2a38", /* Dark navy border for body rows */
                              textAlign:
                                header === "CUST_NAME" ? "left" : "center", // Align 'ID' column to the left
                            }}
                          >
                            {item[header]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {totalPages > 1 && (
              <Pagination className="justify-content-center">
                <Pagination.Prev
                  onClick={() =>
                    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
                  }
                />
                {generatePaginationItems()}
                <Pagination.Next
                  onClick={() =>
                    setCurrentPage((prev) =>
                      prev < totalPages ? prev + 1 : prev
                    )
                  }
                />
              </Pagination>
            )}
          </div>
        </div>

        <ToastContainer />
      </div>
    </>
  );
};

export default CaseTrackingLotWise;
