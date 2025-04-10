import React, { useState, useRef, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Form, Pagination } from "react-bootstrap";
import * as XLSX from "xlsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaWhatsapp } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import { FaRegMessage } from "react-icons/fa6";
import { FaPrint } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./Pages.css";
import "react-datepicker/dist/react-datepicker.css";
import { Alert } from "react-bootstrap";
import { format } from "date-fns";
import { API_BASE_URL } from "../utils/constants";
import LoadingSpinner from "../components/LoadingSpinner";
import ClearForm from "../components/Clearform";

const AcceptanceLetter = () => {
  const [data, setData] = useState([]);
  const [selectedClient, setSelectedClient] = useState([]); //the clients Data to populate dropdown
  const [selectedProduct, setSelectedProduct] = useState([]); //to add the product from the dropdown
  const [arbitrator, setArbitrator] = useState([]); //to add the product from the dropdown
  const [selectedProductID, setSelectedProductID] = useState(null);
  const [selectedClientID, setSelectedClientID] = useState(null);
  const [selectedLotNo, setSelectedLotNo] = useState(null);
  const [selectedArbitratorID, setSelectedArbitratorID] = useState(null);
  const [editing, setEditing] = useState({ id: null, field: null });
  // const [selectedDate, setSelectedDate] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [updatedData, setUpdatedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const inputContainerRef = useRef(null);
  const [showAssigned, setShowAssigned] = useState(false); // State variable
  const [click, setClick] = useState(false); // State variable
  const [pdfUrl, setPdfUrl] = useState(""); // State variable
  const [showData, setShowData] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [save, setSave] = useState(false);
  const [showPDF, setShowPDF] = useState(false);
  const [clearForm, setClearForm] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [date, setDate] = useState(new Date());
  const [responses, setResponses] = useState([]);
  const [whatsAppStatus, setWhatsAppStatus] = useState([]);

  // For Modal
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // for timeset
  // const [startTime, setStartTime] = useState("");
  // const [endTime, setEndTime] = useState("");
  // const [errorMessage, setErrorMessage] = useState("");
  // const [timeDifference, setTimeDifference] = useState(null);

  // for time setting
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [timeDifference, setTimeDifference] = useState(null);
  const [records, setRecords] = useState([]);
  const [distributedRecords, setDistributedRecords] = useState([]);

  // To  fetch Client Data(Bank Names)
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(
          // "http://88.135.73.195/api/Client"
          `${API_BASE_URL}/api/Client`
        );
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

  // API Call for Product data
  useEffect(() => {
    const fetchProduct = async () => {
      // setLoading(true);
      setError(null); // Reset error state
      try {
        const response = await fetch(
          // `http://88.135.73.195/api/products?client_id=${selectedClientID}`
          `${API_BASE_URL}/api/products?client_id=${selectedClientID}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        const parsedProducts = Array.isArray(result)
          ? result
          : JSON.parse(result); // Ensure parsedArbitrators is an array
        // console.log(parsedProducts);
        setSelectedProduct(parsedProducts); // Set products data
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [selectedClientID]);
  // }, []);

  // API Call for Arbitrator
  useEffect(() => {
    const fetchArbitrator = async () => {
      // setLoading(true);
      setError(null); // Reset error state
      try {
        const response = await fetch(
          // "http://88.135.73.195/api/arbitrator"
          `${API_BASE_URL}/api/arbitrator`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        const parsedArbitrators = Array.isArray(result)
          ? result
          : JSON.parse(result); // Ensure parsedArbitrators is an array
        // console.log(parsedArbitrators);
        setArbitrator(parsedArbitrators); // Set products data
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchArbitrator();
  }, []);

  // Logic to onChange Events

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

  console.log(selectedClientID);
  console.log(selectedProductID);
  console.log(selectedLotNo);
  console.log(selectedArbitratorID);

  // Logic to show the assigned lot data
  const handleShowData = async () => {
    // setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        // `http://88.135.73.195/api/RefLots?Lot_no=${selectedLotNo}&Client_id=${selectedClientID}&Product_id=${selectedProductID}&Arb_id=${selectedArbitratorID}`
        `${API_BASE_URL}/api/RefLots?Lot_no=${selectedLotNo}&Client_id=${selectedClientID}&Product_id=${selectedProductID}&Arb_id=${selectedArbitratorID}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      const parsedData = Array.isArray(result) ? result : JSON.parse(result);
      setData(parsedData);
      setTotalPages(Math.ceil(parsedData.length / itemsPerPage));
      setShowData(true);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // console.log(data.length);

  // To Save Data
  const handleSave = async () => {
    console.log("Final Data:", data);
    const dataToGenerateAL = distributedRecords.map((item) => ({
      Arb_Assign_id: item.assign_id,
      Hearing_date: item.Virtual_Hearing_Date,
      Hearing_time_from: item.Virtual_Hearing_Time_From,
      Hearing_time_to: item.Virtual_Hearing_Time_To,
      Video_link: item.Virtual_Hearing_Link,
      Link_id: item.Virtual_Hearing_Link_Meeting_ID,
      Password: item.Virtual_Hearing_Link_Passcode,
      Acc_date: new Date().toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      }),
      // Acc_date: new Date().toLocaleDateString("en-GB", {
      //   month: "2-digit",
      //   day: "2-digit",
      //   year: "numeric",
      // }),
      No_of_cases: "1810",
      Rate: "1000",
    }));
    console.log(dataToGenerateAL);
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/acc`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ case: dataToGenerateAL }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to upload data: ${response.status} ${response.statusText} - ${errorText}`
        );
      }
      const result = await response.json(); // Process the response
      console.log("Upload response:", result);
      toast.success("Data Uploaded Successfully", {
        position: toast.POSITION.BOTTOM_RIGHT,
        theme: "colored",
        autoClose: 1000,
      });
      setSave(true);
      // console.log(save);
    } catch (error) {
      console.error("Error uploading data:", error);
      // alert(`Error uploading data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // To Generate Acceptance Letters
  const handleGenerateAL = async () => {
    setLoading(true); // Start loading before fetching data
    try {
      // Fetch the PDF file from the API
      const response = await fetch(
        `${API_BASE_URL}/api/Accletter?Lot_no=${selectedLotNo}&Client_id=${selectedClientID}&Product_id=${selectedProductID}&Arb_id=${selectedArbitratorID}`
        // `${API_BASE_URL}/api/Accletter?Lot_no=${selectedLotNo}&Client_id=${selectedClientID}&Product_id=${selectedProductID}&Arb_id=${selectedArbitratorID}`
        // `http://88.135.73.195/api/Accletter?Lot_no=${selectedLotNo}&Client_id=${selectedClientID}&Product_id=${selectedProductID}&Arb_id=${selectedArbitratorID}``${API_BASE_URL}/api/Accletter?Lot_no=${selectedLotNo}&Client_id=${selectedClientID}&Product_id=${selectedProductID}&Arb_id=${selectedArbitratorID}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Convert the response to a Blob
      const pdfBlob = await response.blob();
      // Create a URL for the Blob
      const pdfUrl = URL.createObjectURL(pdfBlob);
      console.log(pdfUrl);
      // Set the PDF URL to the state
      setPdfUrl(pdfUrl);
      setShowPDF(true);
    } catch (error) {
      console.error("Error fetching and displaying the PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  // to upload the Acceptance letter to server
  const handleUploadAL = async () => {
    setLoading(true);
    console.log(selectedLotNo);
    try {
      const response = await fetch(
        // `http://88.135.73.195/api/SaveAccCase?Lot_no=${selectedLotNo}&Client_id=${selectedClientID}&Product_id=${selectedProductID}&Arb_id=${selectedArbitratorID}`
        `${API_BASE_URL}/api/SaveAccCase?Lot_no=${selectedLotNo}&Client_id=${selectedClientID}&Product_id=${selectedProductID}&Arb_id=${selectedArbitratorID}`
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to upload data: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const result = await response.json(); // Process the response
      console.log(result);
      setShowServices(true);
      setClearForm(true);
    } catch (error) {
      console.error("Error uploading data:", error);
      alert(`Error uploading data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

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

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    // const getDate = date.toLocaleDateString('en-GB', options);
    const getDate = date.toLocaleDateString("en-US");
    console.log(getDate); // Outputs in MM/dd/yyyy format

    // setSelectedDate(getDate);
    return;
  };

  // the logic of assigning time slot start here
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minutes = 0; minutes <= 30; minutes += 30) {
        const hour12 = hour % 12 === 0 ? 12 : hour % 12;
        const ampm = hour < 12 ? "AM" : "PM";
        const hourStr = hour12 < 10 ? `0${hour12}` : `${hour12}`;
        const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
        times.push(`${hourStr}:${minutesStr} ${ampm}`);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
    setErrorMessage("");
    setTimeDifference(null);
    setDistributedRecords([]);
  };

  const handleEndTimeChange = (e) => {
    const selectedEndTime = e.target.value;
    setEndTime(selectedEndTime);
    setErrorMessage("");

    if (startTime) {
      calculateTimeDifference(startTime, selectedEndTime);
    }
  };

  const parseTimeStringToDate = (timeString) => {
    const [time, modifier] = timeString.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    } else if (modifier === "AM" && hours === 12) {
      hours = 0;
    }
    return new Date(1970, 0, 1, hours, minutes);
  };

  const calculateTimeDifference = (start, end) => {
    const startDate = parseTimeStringToDate(start);
    const endDate = parseTimeStringToDate(end);

    if (endDate <= startDate) {
      setErrorMessage("The end time must be greater than the start time.");
      setTimeDifference(null);
      setDistributedRecords([]);
    } else {
      const differenceInMilliseconds = endDate - startDate;
      const differenceInMinutes = differenceInMilliseconds / (1000 * 60);
      const differenceInHours = differenceInMinutes / 60;
      console.log(differenceInHours);
      setTimeDifference(differenceInHours);
    }
  };

  const distributeRecords = () => {
    if (
      !startTime ||
      !endTime ||
      !selectedDate ||
      timeDifference <= 0 ||
      data.length === 0
    ) {
      setErrorMessage("All fields are required and must be valid.");
      setDistributedRecords([]);
      return;
    }

    const totalRecords = data.length;
    const fullHours = Math.floor(timeDifference); // Full hours
    const fractionalHour = timeDifference % 1; // Fractional part of the hour

    const recordsPerFullHour = Math.floor(
      totalRecords / (fullHours + fractionalHour)
    );
    const recordsForFractionalHour = Math.floor(
      recordsPerFullHour * fractionalHour
    );

    let assignedRecordsCount = 0; // Counter to track assigned records
    const distributed = [];
    let currentStartTime = parseTimeStringToDate(startTime);
    // const formattedDate = format(selectedDate, "MMM dd, yyyy");
    // const formattedDate = format(selectedDate, "dd/MM/yyyy");
    const formattedDate = format(selectedDate, "MM/dd/yyyy");

    for (let hour = 0; hour < fullHours; hour++) {
      const slotStartTime = new Date(currentStartTime.getTime());
      const slotEndTime = new Date(currentStartTime.getTime());
      slotEndTime.setHours(slotEndTime.getHours() + 1);

      for (let i = 0; i < recordsPerFullHour; i++) {
        const recordIndex = hour * recordsPerFullHour + i;
        if (recordIndex < totalRecords) {
          const formattedStartTime = format(slotStartTime, "hh:mm a");
          const formattedEndTime = format(slotEndTime, "hh:mm a");

          distributed.push({
            ...data[recordIndex],
            Virtual_Hearing_Date: formattedDate,
            Virtual_Hearing_Time_From: formattedStartTime,
            Virtual_Hearing_Time_To: formattedEndTime,
            Virtual_Hearing_Link:
              "https://us05web.zoom.us/j/82064910816?pwd=irnBsMk470Z2Uws7dxxZri8jrhdUG3.1",
            Virtual_Hearing_Link_Meeting_ID: "820 6491 0816",
            Virtual_Hearing_Link_Passcode: "4ExYPe",
            // Acc_Date: new Date().toISOString().split("T")[0],
            // No_of_cases: "1810",
            // Rate: "1000",
          });
          assignedRecordsCount++;
        }
      }
      currentStartTime.setHours(currentStartTime.getHours() + 1);
    }

    if (fractionalHour > 0) {
      const slotStartTime = new Date(currentStartTime.getTime());
      const slotEndTime = new Date(currentStartTime.getTime());
      slotEndTime.setMinutes(Math.floor(60 * fractionalHour));

      for (let i = 0; i < recordsForFractionalHour; i++) {
        const recordIndex = fullHours * recordsPerFullHour + i;
        if (recordIndex < totalRecords) {
          const formattedStartTime = format(slotStartTime, "hh:mm a");
          const formattedEndTime = format(slotEndTime, "hh:mm a");

          distributed.push({
            ...data[recordIndex],
            Virtual_Hearing_Date: formattedDate,
            Virtual_Hearing_Time_From: formattedStartTime,
            Virtual_Hearing_Time_To: formattedEndTime,
            Virtual_Hearing_Link:
              "https://us05web.zoom.us/j/82064910816?pwd=irnBsMk470Z2Uws7dxxZri8jrhdUG3.1",
            Virtual_Hearing_Link_Meeting_ID: "820 6491 0816",
            Virtual_Hearing_Link_Passcode: "4ExYPe",
            // Acc_Date: new Date().toISOString().split("T")[0],
            // No_of_cases: "1810",
            // Rate: "1000",
          });
          assignedRecordsCount++;
        }
      }
    }

    if (assignedRecordsCount < totalRecords) {
      const remainingRecordsCount = totalRecords - assignedRecordsCount;
      const lastSlotStartTime =
        distributed[distributed.length - 1]?.Virtual_Hearing_Time_From ||
        startTime;
      const lastSlotEndTime =
        distributed[distributed.length - 1]?.Virtual_Hearing_Time_To || endTime;

      for (let i = 0; i < remainingRecordsCount; i++) {
        const recordIndex = assignedRecordsCount + i;

        distributed.push({
          ...records[recordIndex],
          Virtual_Hearing_Date: formattedDate,
          Virtual_Hearing_Time_From: lastSlotStartTime,
          Virtual_Hearing_Time_To: lastSlotEndTime,
          Virtual_Hearing_Link:
            "https://us05web.zoom.us/j/82064910816?pwd=irnBsMk470Z2Uws7dxxZri8jrhdUG3.1",
          Virtual_Hearing_Link_Meeting_ID: "820 6491 0816",
          Virtual_Hearing_Link_Passcode: "4ExYPe",
          // Acc_Date: new Date().toISOString().split("T")[0],
          // No_of_cases: "1810",
          // Rate: "1000",
        });
      }
    }

    console.log(`Total Records Assigned: ${assignedRecordsCount}`);
    setDistributedRecords(distributed);
    setShowTable(true);
  };

  // console.log(distributedRecords);

  console.log(distributedRecords);

  // data to be displayed
  const datToBeDisplayed = distributedRecords.map((item) => {
    const {
      assign_id,
      Arbitrator_id,
      Case_id,
      UPLODED_DATE,
      SR_No,
      Virtual_Hearing_Date,
      Virtual_Hearing_Time_From,
      Virtual_Hearing_Time_To,
      Virtual_Hearing_Link,
      Virtual_Hearing_Link_Meeting_ID,
      Virtual_Hearing_Link_Passcode,
      ...rest
    } = item;
    return {
      Virtual_Hearing_Date,
      Virtual_Hearing_Time_From,
      Virtual_Hearing_Time_To,
      Virtual_Hearing_Link,
      Virtual_Hearing_Link_Meeting_ID,
      Virtual_Hearing_Link_Passcode,
      ...rest,
      assign_id,
      Arbitrator_id,
      Case_id,
      UPLODED_DATE,
      // Acc_Date: new Date().toISOString().split("T")[0],
      // Acc_Date: new Date().toLocaleDateString("en-GB"),
      Acc_date: new Date().toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      }),
      No_of_cases: "1810",
      Rate: "1000",
    };
  });

  // the logic of assigning time slot ends here

  return (
    <div className="container">
      {!clearForm && (
        <div className="row jusify-content-between mt-3">
          {!showTable && !showData && (
            <div className="col-md-6">
              <h4>Select A Lot</h4>
            </div>
          )}
          {!showTable && !save && !showPDF && showData && (
            <div className="col-md-6">
              <h4>Select Virtual Meeting Details</h4>
            </div>
          )}
          {showTable && !save && !showPDF && (
            <div className="col-md-6">
              <h4>Save Acceptance Letter</h4>
            </div>
          )}
          {save && !showPDF && (
            <div className="col-md-6">
              <h4>Generate Acceptance Letter</h4>
            </div>
          )}
          {showPDF && !showServices && (
            <div className="col-md-6">
              <h4>Upload Acceptance Letter</h4>
            </div>
          )}
          <div className="col-md-5 ">
            {showTable && !save && !showPDF && (
              <button className="custBtn" onClick={handleSave}>
                Save Acceptance Letter
              </button>
            )}
            {save && !showPDF && (
              <button className="custBtn" onClick={handleGenerateAL}>
                Generate Acceptance Letter
              </button>
            )}
            {showPDF && !showServices && (
              <button
                variant="success"
                onClick={handleUploadAL}
                className="custBtn me-3"
              >
                Upload Acceptance Letter
              </button>
            )}
          </div>
        </div>
      )}

      {/* Form to save the lots */}
      {!showData && (
        <div className="row align-items-center justify-content-evenly mt-3">
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
          <div className="col-md-2">
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
          <div className="col-md-2">
            <Form.Control
              type="number"
              className="custom_input"
              placeholder="Enter Lot No"
              onChange={handleLotNoChange}
            />
          </div>

          {/* To Get The arbitrator */}
          <div className="col-md-3">
            <Form.Select
              aria-label="Default select example"
              onChange={handleArbitratorChange}
              className="custom_input"
            >
              <option value="" selected>
                Choose Arbitrator
              </option>
              {arbitrator.map((item) => (
                <option key={item.Arb_id} value={item.Arb_id}>
                  {item.Arb_name}
                </option>
              ))}
            </Form.Select>
          </div>

          <div className="col-md-2">
            <Button className="custBtn" onClick={handleShowData}>
              Show Data
            </Button>
          </div>
        </div>
      )}

      {/* {!showTable && showData && !showPDF && ( */}
      <>
        {!showTable && !save && !showPDF && showData && (
          <>
            <div className="row mt-3">
              {/* the date picker */}
              <div className="col-md-3">
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  placeholderText="Select a date"
                  dateFormat="MM/dd/yyyy"
                  className="form-control custom_input" // Smaller size
                  id="datePicker"
                  style={{
                    width: "100%",
                    height: "calc(1.5em + .75rem + 2px)",
                    padding: ".375rem .75rem",
                    fontSize: "1rem",
                    borderRadius: ".25rem",
                    border: "1px solid #ced4da",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* The Start time Picker */}
              <div className="col-md-3">
                <Form.Control
                  as="select"
                  value={startTime}
                  onChange={handleStartTimeChange}
                >
                  <option value="">Select Start Time</option>
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </Form.Control>
              </div>

              {/* the end time picker */}
              <div className="col-md-3">
                <Form.Control
                  as="select"
                  value={endTime}
                  onChange={handleEndTimeChange}
                  disabled={!startTime}
                >
                  <option value="">Select end time</option>
                  {timeOptions.map((time, index) => (
                    <option key={index} value={time}>
                      {time}
                    </option>
                  ))}
                </Form.Control>
              </div>

              {/* button Goes here */}
              <div className="col-md-3">
                <Button className="custBtn" onClick={distributeRecords}>
                  Assign Time Slot
                </Button>
              </div>
            </div>
            <div className="row mt-3">
              <div className="table-container">
                <div className="table-wrapper">
                  {data.length > 0 ? (
                    <table className="responsive-table">
                      <thead>
                        <tr className="">
                          {Object.keys(data[0]).map((key, index) => (
                            <th key={index} className=" text-white">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((record, index) => (
                          <tr key={index} className="text-center">
                            {Object.values(record).map((value, index) => (
                              <td key={index}>{value}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p></p>
                  )}
                </div>
                {/* )} */}
                {showTable && !clearForm && (
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
          </>
        )}

        {/* {showTable && !save && !showPDF && ( */}
        {showTable && !showPDF && (
          <div className="table-container">
            <div className="table-wrapper">
              {distributedRecords.length > 0 ? (
                <table className="responsive-table">
                  <thead>
                    <tr className="">
                      {Object.keys(datToBeDisplayed[0]).map((key, index) => (
                        <th key={index} className=" text-white">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {datToBeDisplayed.map((record, index) => (
                      <tr key={index} className="text-center">
                        {Object.values(record).map((value, index) => (
                          <td key={index}>{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p></p>
              )}
            </div>
            {/* )} */}
            {showTable && !clearForm && (
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
        )}
      </>
      {/* )} */}

      {showPDF && (
        <div className="row">
          <div className="col-md-12 mt-3">
            {pdfUrl && (
              <iframe
                src={pdfUrl}
                style={{ width: "100%", height: "100vh" }}
                title="PDF Viewer"
              />
            )}
          </div>
        </div>
      )}

      {clearForm && (
        <div className="row">
          <div className="col-md-12 d-flex justify-content-center ">
            <ClearForm
              message="Acceptance Letter Created  Successfully!"
              redirectPath="/instdashboard"
            />
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default AcceptanceLetter;
