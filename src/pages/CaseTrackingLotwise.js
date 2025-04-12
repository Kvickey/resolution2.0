import React, { useEffect, useState } from "react";
<<<<<<< HEAD
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
=======
import { API_BASE_URL as url } from "../utils/constants";
import LoadingSpinner from "../components/LoadingSpinner";
import ReusableTable from "../components/ReusableTable";

const CaseTrackingLotWise = () => {
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [lotData, setLotData] = useState([]);
  const [currentPage2, setCurrentPage2] = useState(1);
  const [formData, setFormData] = useState({
    Client_id: "",
    Product_id: "",
    Lot_no: "",
  });

  const fetchData = async (endpoint) => {
    try {
      const response = await fetch(url + "/api/" + endpoint);
      const result = await response.json();
      const data = Array.isArray(result) ? result : JSON.parse(result);
      if (data) return data;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }

    return [];
  };
  useEffect(() => {
    const getClients = async () => {
      const data = await fetchData("Client");
      setClients(data);
    };
    getClients();
  }, []);
  useEffect(() => {
    if (formData.Client_id) {
      const getProducts = async () => {
        const data = await fetchData(
          "products?client_id=" + formData.Client_id
        );
        setProducts(data);
      };
      getProducts();
    }
  }, [formData.Client_id]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    setFormData((preValue) => ({ ...preValue, [name]: value }));
  };
  const inputValidation = () => {
    if (
      formData.Client_id === "" ||
      formData.Product_id === "" ||
      formData.Lot_no === ""
    )
      return false;
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputValidation()) {
      const data = await fetchData("Lot?Lot_no=" + formData.Lot_no);
      setLotData(data);
    }
  };


  // Table Logic
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage2 * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems2 = lotData.slice(indexOfFirstItem, indexOfLastItem);

  // calculate total page numbers
  const pageNumbers2 = Array.from(
    { length: Math.ceil(tableData.length / itemsPerPage) },
    (_, i) => i + 1
  );

  if (loading) return <LoadingSpinner />;
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="row my-2 gap-4 px-md-3">
          <div className="col-md col-12">
            <select
              class="form-select custom_input"
              aria-label="Default select example"
              value={formData.Client_id}
              name="Client_id"
              onChange={handleChange}
            >
              <option value="">Choose a Bank</option>
              {clients &&
                clients.map((item) => (
                  <option value={item.Client_id} key={item.Client_id}>
                    {item.client_name}
                  </option>
                ))}
            </select>
          </div>
          <div className="col-md col-12">
            <select
              class="form-select custom_input"
              aria-label="Default select example"
              value={formData.Product_id}
              name="Product_id"
              onChange={handleChange}
            >
              <option value="">Choose a Product</option>
              {products &&
                products.map((item) => (
                  <option value={item.Product_id} key={item.Product_id}>
                    {item.Product_name}
                  </option>
                ))}
            </select>
          </div>
          <div className="col-md col-12">
            <input
              type="number"
              className="form-control custom_input"
              placeholder="Enter Lot Number..."
              name="Lot_no"
              value={formData.Lot_no}
              onChange={(e)=> e.target.value > 0 && handleChange(e)}
            />
          </div>
          <div className="col-md col-12">
            <button className="custBtn">Show Data</button>
          </div>
        </div>
      </form>
      {lotData.length !== 0 && (
        <div className="row">
          <div className="col-md-12">
            <ReusableTable
              data={currentItems2}
              currentPage={currentPage2}
              pageNumbers={pageNumbers2}
              setCurrentPage={setCurrentPage2}
            />
          </div>
        </div>
      )}
    </div>
>>>>>>> 2c4fe60b29fd020fe8324f0e27aaf204184ac134
  );
};

export default CaseTrackingLotWise;


// import React, { useState } from "react";

// const CaseTrackingLotWise = () => {
//   const [meetingDetails, setMeetingDetails] = useState({
//     topic: "",
//     start_time: "",
//     duration: "",
//     agenda: "",
//   });

//   // Replace with your actual Zoom OAuth access token during testing
//   const accessToken =
//  "eyJzdiI6IjAwMDAwMiIsImFsZyI6IkhTNTEyIiwidiI6IjIuMCIsImtpZCI6IjZkNmFiMmYyLTFkYWItNGZkZi1iMDRlLWIxODA3MDU4NTI3ZSJ9.eyJ2ZXIiOjEwLCJhdWlkIjoiYTYyYTg4NWUxMTkyNzFkMWM5NmU4ZGQ4NzllY2I2MGE0MDZmOTMzNjE2MmM2MjY0NGFkMmVjY2UwNDIwNGIxNSIsImNvZGUiOiJxRG5MNzBwOEFtdTFWSERGMFowU2hhMG1ESjNoUzJlcmciLCJpc3MiOiJ6bTpjaWQ6RnB4TEVCSGJSVWlQdnFhTWNOWGx6ZyIsImdubyI6MCwidHlwZSI6MCwidGlkIjowLCJhdWQiOiJodHRwczovL29hdXRoLnpvb20udXMiLCJ1aWQiOiJTNnZlRjZDZFN2R28yNG1FUnQ3WjRnIiwibmJmIjoxNzM5NDM4NTA0LCJleHAiOjE3Mzk0NDIxMDQsImlhdCI6MTczOTQzODUwNCwiYWlkIjoiSmZHYjdzSjVTOUd5dWE4TndWWTVyQSJ9.PN8kAIS_CETKWpuPEeOwhWS5tNCpMiRkdA7k5Sw5AhaR3aHbTbN0eMZ4BrbQfGVj0fEhNcVG9IfYisHIvEWqzQ"


//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setMeetingDetails({ ...meetingDetails, [name]: value });
//   };

//   const createZoomMeeting = async () => {
//     if (!accessToken) {
//       alert("Access token is missing. Please configure it.");
//       return;
//     }

//     try {
//       const response = await fetch("https://api.zoom.us/v2", {
//         method: "POST",
//         headers: {
//           'Authorization': `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           meetingDetails,
//         }),
//       });

//       if (!response) {
//         alert("Request sent, but no response .");
//         return;
//       }

//       console.log(
//         "Response sent, but you won't see detailed response due to 'no-cors'."
//       );
//     } catch (error) {
//       console.error("Error creating Zoom meeting:", error);
//     }
//   };

//   return (
//     <div>
//       <h2>Create Zoom Meeting</h2>
//       <form>
//         <div>
//           <label>Topic: </label>
//           <input
//             type="text"
//             name="topic"
//             value={meetingDetails.topic}
//             onChange={handleInputChange}
//           />
//         </div>
//         <div>
//           <label>Start Time: </label>
//           <input
//             type="datetime-local"
//             name="start_time"
//             value={meetingDetails.start_time}
//             onChange={handleInputChange}
//           />
//         </div>
//         <div>
//           <label>Duration (in minutes): </label>
//           <input
//             type="number"
//             name="duration"
//             value={meetingDetails.duration}
//             onChange={handleInputChange}
//           />
//         </div>
//         <div>
//           <label>Agenda: </label>
//           <input
//             type="text"
//             name="agenda"
//             value={meetingDetails.agenda}
//             onChange={handleInputChange}
//           />
//         </div>
//         <button type="button" onClick={createZoomMeeting}>
//           Create Meeting
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CaseTrackingLotWise;
