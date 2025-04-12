// import React, { useState } from "react";

// // Helper function to get the OAuth access token
// const getAccessToken = async (code) => {
//   const clientId = "bEwBBb_UTZKYSoVHnqmOGA";  // Replace with your Client ID
//   const clientSecret = "4aVavCV6xkDL08cfGERjGwvT6l1yx4cA";  // Replace with your Client Secret
//   const redirectUri = "http://localhost";  // Replace with your redirect URI

//   try {
//     const response = await fetch('https://zoom.us/oauth/token', {
//       method: 'POST',
//       headers: {
//         'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`),
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       body: new URLSearchParams({
//         grant_type: 'authorization_code',
//         code: code,
//         redirect_uri: redirectUri,
//       }),
//     });

//     const data = await response.json();
//     return data.access_token; // Return the access token
//   } catch (error) {
//     console.error("Error getting access token:", error);
//   }
// };

// const CaseTrackingLotWise = () => {
//   const [meetingData, setMeetingData] = useState({
//     topic: "Team Sync Meeting",
//     start_time: "2025-02-10T15:00:00Z",
//     duration: 60,
//     agenda: "Monthly updates",
//   });

//   const [meetingResponse, setMeetingResponse] = useState(null);
//   const [authCode, setAuthCode] = useState("");  // Store authorization code here

//   // Handle the OAuth authorization flow
//   const handleOAuthRedirect = () => {
//     const clientId = "bEwBBb_UTZKYSoVHnqmOGA";  // Replace with your Client ID
//     const redirectUri = "4aVavCV6xkDL08cfGERjGwvT6l1yx4cA";  // Replace with your redirect URI
//     const authorizationUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
    
//     // Redirect user to the OAuth URL
//     window.location.href = authorizationUrl;
//   };

//   // Get the authorization code from URL and retrieve access token
//   React.useEffect(() => {
//     const queryParams = new URLSearchParams(window.location.search);
//     const code = queryParams.get("code"); // Get code from URL query parameters

//     if (code && !authCode) {
//       setAuthCode(code); // Save the code for later use
//     }
//   }, []);

//   // Schedule the Zoom meeting after getting the access token
//   const handleScheduleMeeting = async () => {
//     if (!authCode) {
//       alert("Authorization code is missing!");
//       return;
//     }

//     const accessToken = await getAccessToken(authCode);

//     if (!accessToken) {
//       alert("Failed to get access token.");
//       return;
//     }

//     try {
//       const response = await fetch("https://api.zoom.us/v2/users/me/meetings", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(meetingData),
//       });

//       if (!response.ok) {
//         throw new Error(`Error: ${response.statusText}`);
//       }

//       const data = await response.json();
//       setMeetingResponse(data);
//       alert("Meeting Scheduled Successfully!");
//     } catch (error) {
//       console.error("Error scheduling meeting:", error);
//       alert("Error scheduling the meeting.");
//     }
//   };

//   return (
//     <div style={{ padding: "2rem" }}>
//       <h2>Schedule a Zoom Meeting</h2>

//       <div>
//         <label>
//           Meeting Topic:
//           <input
//             type="text"
//             value={meetingData.topic}
//             onChange={(e) =>
//               setMeetingData({ ...meetingData, topic: e.target.value })
//             }
//           />
//         </label>
//       </div>

//       <div>
//         <label>
//           Start Time (UTC):
//           <input
//             type="datetime-local"
//             value={meetingData.start_time.slice(0, 16)}
//             onChange={(e) =>
//               setMeetingData({
//                 ...meetingData,
//                 start_time: `${e.target.value}:00Z`,
//               })
//             }
//           />
//         </label>
//       </div>

//       <div>
//         <label>
//           Duration (in minutes):
//           <input
//             type="number"
//             value={meetingData.duration}
//             onChange={(e) =>
//               setMeetingData({ ...meetingData, duration: parseInt(e.target.value) })
//             }
//           />
//         </label>
//       </div>

//       <div>
//         <label>
//           Agenda:
//           <textarea
//             value={meetingData.agenda}
//             onChange={(e) =>
//               setMeetingData({ ...meetingData, agenda: e.target.value })
//             }
//           />
//         </label>
//       </div>

//       <button onClick={handleScheduleMeeting}>Schedule Meeting</button>
//       <button onClick={handleOAuthRedirect}>Authorize with Zoom</button>

//       {meetingResponse && (
//         <div style={{ marginTop: "1rem" }}>
//           <h3>Meeting Details</h3>
//           <p><strong>Meeting ID:</strong> {meetingResponse.id}</p>
//           <p>
//             <strong>Join URL:</strong>{" "}
//             <a href={meetingResponse.join_url}>{meetingResponse.join_url}</a>
//           </p>
//           <p>
//             <strong>Start URL:</strong>{" "}
//             <a href={meetingResponse.start_url}>{meetingResponse.start_url}</a>
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CaseTrackingLotWise;



// export default CaseTrackingLotWise;

import React, { useEffect, useState } from "react";
import { Button, Form, Pagination } from "react-bootstrap";
import "./UploadExcel.css";
import { toast, ToastContainer } from "react-toastify";
import { API_BASE_URL } from "../utils/constants";
import ReusableTable from "../components/ReusableTable";

const CaseTrackingLotWise = () => {
  const [data, setData] = useState([]);
  const [bank, setBank] = useState([]);
  const [bankId, setBankId] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [selectedProductID, setSelectedProductID] = useState(null);
  const [arbitrator, setArbitrator] = useState([]); //to add the product from the dropdown
  const [whatsappStatus, setWhatsappStatus] = useState([]); //to add the product from the dropdown
  const [error, setError] = useState(null);
  const [error1, setError1] = useState(null);
  const [error2, setError2] = useState(null);
  const [selectedLotNo, setSelectedLotNo] = useState(null);
  const [selectedArbitratorID, setSelectedArbitratorID] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [dataPerPage] = useState(10);

  // To fetch Clients DaTA
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/Client`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const parsedBank = Array.isArray(result) ? result : JSON.parse(result);
        setBank(parsedBank);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchClient();
  }, []);

  console.log(bank);

  const handleBankChange = (e) => {
    const selectedID = e.target.value;
    setBankId(selectedID);
  };

  useEffect(() => {
    const fetchData = async () => {
      // setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/products?client_id=${bankId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        const products = Array.isArray(result) ? result : JSON.parse(result);
        // console.log(products);
        setSelectedProduct(products); // Set products data
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bankId]);

  const handleProductChange = (e) => {
    const selectedID = e.target.value;
    setSelectedProductID(selectedID);
  };

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

  const handleLotNoChange = (e) => {
    const selectedID = e.target.value;
    setSelectedLotNo(selectedID);
  };

  // console.log(selectedProductID);
  // console.log(bankId);
  // console.log(selectedLotNo);
  // console.log(selectedArbitratorID);

  const formatDate = (dateTimeString) => {
    // if (!dateTimeString) {
    //   return "Invalid Date";
    // }

    const dateString = dateTimeString.split("T")[0];
    const [year, month, day] = dateString.split("-");
    return `${month}/${day}/${year}`;
    // return `${day}/${month}/${year}`;
  };

  const handleOpenPDF = (pdfUrl) => {
    console.log("handleOpenPDF called with URL:", pdfUrl);
    window.open(pdfUrl, "_blank");
  };

  // Show Data Logic Goes here
  const handleData = async () => {
    setLoading(true); // Start loading before fetching data
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/Lot?Lot_no=${selectedLotNo}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      const parsedData = Array.isArray(result) ? result : JSON.parse(result);
      console.log(parsedData);
      // const updatedData = parsedData.map((item) => {
      //   const { CUST_NAME, REFERENCE_NO } = item;
      //   return {
      //     CUST_NAME,
      //     REFERENCE_NO,
      //   };
      // });
      console.log(updatedData);
      // setData(parsedData);
      setData(parsedData);
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
  // Data To Be Dispalyed
  const dataToBeDisplayed = data.map((item) => ({
    CUST_NAME: item.Cust_name,
    REFERENCE_NO: item.Reference_no,
    Reference_Letter: (
      <>
        {item.Ref_date ? (
          <a
            onClick={() =>
              handleOpenPDF(
                `https://api.resolutionexperts.in/Content/Cases/Ref/axis/${item.Reference_no}.pdf`
              )
            }
            className="customAnchor1"
          >
            {formatDate(item.Ref_date)}
          </a>
        ) : (
          "-"
        )}
      </>
    ),
    Acceptance_Letter: (
      <>
        {item.Acc_date ? (
          <a
            onClick={() =>
              handleOpenPDF(
                `https://api.resolutionexperts.in/Content/Cases/Acc/${item.Reference_no}.pdf`
              )
            }
            className="customAnchor1"
          >
            {formatDate(item.Acc_date)}
          </a>
        ) : (
          "-"
        )}
      </>
    ),
    SOC: (
      <>
        {item.Soc_date ? (
          <a
            onClick={() =>
              handleOpenPDF(
                `https://api.resolutionexperts.in/Content/Cases/SOC/${item.Reference_no}.pdf`
              )
            }
            className="customAnchor1"
          >
            {formatDate(item.Soc_date)}
          </a>
        ) : (
          "-"
        )}
      </>
    ),
    Section17_Application: (
      <>
        {item.Sec_17_app_date ? (
          <a
            onClick={() =>
              handleOpenPDF(
                `https://api.resolutionexperts.in/Content/Cases/SEC_17_App/${item.Reference_no}.pdf`
              )
            }
            className="customAnchor1"
          >
            {formatDate(item.Sec_17_app_date)}
          </a>
        ) : (
          "-"
        )}
      </>
    ),
    // Section17_Order: "Pending",
    Section17_Order: (
      <>
      {item.Sec_17_order_date ? (
        <a
          onClick={() =>
            handleOpenPDF(
              `https://api.resolutionexperts.in/Content/Cases/SEC_17_App/${item.Reference_no}.pdf`
            )
          }
          className="customAnchor1"
        >
          {formatDate(item.Sec_17_order_date)}
        </a>
      ) : (
        "-"
      )}
    </>
      // <a
      //   href="https://your-link.com/soc"
      //   target="_blank"
      //   rel="noopener noreferrer"
      // >
      //   {item.Sec_17_order_date}
      // </a>
    ),
    // Second_Hearing: "Pending",
    Second_Hearing: (
      <>
      {item.Second_hearing_date ? (
        <a
          onClick={() =>
            handleOpenPDF(
              `https://api.resolutionexperts.in/Content/Cases/SEC_17_App/${item.Reference_no}.pdf`
            )
          }
          className="customAnchor1"
        >
          {formatDate(item.Second_hearing_date)}
        </a>
      ) : (
        "-"
      )}
    </>
      // <a
      //   href="https://your-link.com/soc"
      //   target="_blank"
      //   rel="noopener noreferrer"
      // >
      //   {item.Second_hearing_date}
      // </a>
    ),
    // Pursis: "Pending",
    third_hearing_date: (
      <>
      {item.third_hearing_date ? (
        <a
          onClick={() =>
            handleOpenPDF(
              `https://api.resolutionexperts.in/Content/Cases/SEC_17_App/${item.Reference_no}.pdf`
            )
          }
          className="customAnchor1"
        >
          {formatDate(item.third_hearing_date)}
        </a>
      ) : (
        "-"
      )}
    </>
      // <a
      //   href="https://your-link.com/soc"
      //   target="_blank"
      //   rel="noopener noreferrer"
      // >
      //   {item.third_hearing_date}
      // </a>
    ),
    Fourth_hearing_date: (
      <>
      {item.Fourth_hearing_date ? (
        <a
          onClick={() =>
            handleOpenPDF(
              `https://api.resolutionexperts.in/Content/Cases/SEC_17_App/${item.Reference_no}.pdf`
            )
          }
          className="customAnchor1"
        >
          {formatDate(item.Fourth_hearing_date)}
        </a>
      ) : (
        "-"
      )}
    </>
      // <a
      //   href="https://your-link.com/soc"
      //   target="_blank"
      //   rel="noopener noreferrer"
      // >
      //   {item.Fourth_hearing_date}
      // </a>
    ),
    Fifth_hearing_date: (
      <>
      {item.Fifth_hearing_date ? (
        <a
          onClick={() =>
            handleOpenPDF(
              `https://api.resolutionexperts.in/Content/Cases/SEC_17_App/${item.Reference_no}.pdf`
            )
          }
          className="customAnchor1"
        >
          {formatDate(item.Fifth_hearing_date)}
        </a>
      ) : (
        "-"
      )}
    </>
      // <a
      //   href="https://your-link.com/soc"
      //   target="_blank"
      //   rel="noopener noreferrer"
      // >
      //   {item.Fifth_hearing_date}
      // </a>
    ),
    Award_date: (
      <>
      {item.Award_date ? (
        <a
          onClick={() =>
            handleOpenPDF(
              `https://api.resolutionexperts.in/Content/Cases/SEC_17_App/${item.Reference_no}.pdf`
            )
          }
          className="customAnchor1"
        >
          {formatDate(item.Award_date)}
        </a>
      ) : (
        "-"
      )}
    </>
      // <a
      //   href="https://your-link.com/soc"
      //   target="_blank"
      //   rel="noopener noreferrer"
      // >
      //   {item.Award_date}
      // </a>
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

  // Logic For Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = updatedData.slice(indexOfFirstItem, indexOfLastItem);
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

  // Calculate total number of pages
  const pageNumbers = Array.from(
    { length: Math.ceil(updatedData.length / dataPerPage) },
    (_, i) => i + 1
  );

  // Get current page data
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = updatedData.slice(indexOfFirstData, indexOfLastData);

  // Function to change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h4 className="my-3 ms-4">Case Tracking Lotwise</h4>
          </div>
        </div>

        <div className="row align-items-center justify-content-evenly">
          {/* To Select The Client Bank */}
          <div className="col-md-3">
            <Form.Select
              aria-label="Default select example"
              onChange={handleBankChange}
              className="custom_input"
            >
              <option value="" selected>
                Choose a Bank
              </option>
              {bank.map((item) => (
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
          <div className="col-md-12">
            {currentData.length > 0 && (
              <ReusableTable
                data={currentData}
                currentPage={currentPage}
                pageNumbers={pageNumbers}
                setCurrentPage={setCurrentPage}
              />
            )}
          </div>
        </div>

        <ToastContainer />
      </div>
    </>
  );
};

export default CaseTrackingLotWise;
