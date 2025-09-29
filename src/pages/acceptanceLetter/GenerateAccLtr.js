import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/constants";
import ReusableTableFixed from "../components/ReusableTableFixed";
import useFetch from "../hooks/useFetch";
import ReusableTable from "../components/ReusableTable";
import LoadingSpinner from "../components/LoadingSpinner";
import ClearForm from "../components/Clearform";
import DatePicker from "react-datepicker";
import { Button, Form, Modal, Pagination } from "react-bootstrap";
import { format } from "date-fns";
import { toast, ToastContainer } from "react-toastify";
import CustomStepper from "../components/CustomStepper";
import { useAuth } from "../components/AuthProvider";
import { generateTimeOptions } from '../utils/timeUtils';

const GenerateAccLtr = () => {
  const { user, logout } = useAuth();
  const [acceptanceNotCreatedLots, setAcceptanceNotCreatedLots] = useState([]);
  const [acceptanceNotCreatedData, setAcceptanceNotCreatedData] = useState([]);
  const [receivedData, setReceivedData] = useState([]);
  const [selectedLotNo, setSelectedLotNo] = useState([]);
  const [selectedClientID, setSelectedClientID] = useState([]);
  const [selectedProductID, setSelectedProductID] = useState([]);
  const [selectedArbitratorID, setSelectedArbitratorID] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [showPDF, setShowPDF] = useState(false);
  const [upload, setUpload] = useState(false);
  const [clearForm, setClearForm] = useState(false);
  const [showData, setShowData] = useState(false);
  const [showDistributed, setShowDistributed] = useState(false);
  const [save, setSave] = useState(false);
  const [zoomMeet, setZoomMeet] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [zoomResponse, setZoomResponse] = useState([]);
  const [meeting, setMeeting] = useState([]);
  const [joinUrl, setJoinUrl] = useState("");
  const [meetStartTime, setMeetStartTime] = useState("");
  const [zoomId, setZoomId] = useState("");
  const [password, setPassword] = useState("");
  const [meetingId, setMeetingId] = useState(null);
  const [arbId, setArbId] = useState("");
  const [rate, setRate] = useState(null);
  const [noOfCases, setNoOfCases] = useState(null);
  const [noOfAwardPassCases, setNoOfAwardPassCases] = useState(null);
  const [showSecondModal, setShowSecondModal] = useState(false);

  // for time setting starts
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [timeDifference, setTimeDifference] = useState(null);
  const [records, setRecords] = useState([]);
  const [distRecords, setDistRecords] = useState([]);
  const [accessTokenArray, setAccessTokenArray] = useState([]);
  const [accessToken, setAccessToken] = useState([]);
  const [refreshToken, setRefreshToken] = useState([]);
  // for time setting ends

  //   for pagination of reusable table starts
  const [getData, setGetData] = useState([]);
  const [currentPage1, setCurrentPage1] = useState(1); // Current page for ReusableTable
  const [itemsPerPage] = useState(10); // Number of items per page
  const totalItems1 = getData.length;
  const totalPages1 = Math.ceil(totalItems1 / itemsPerPage);
  const startIndex1 = (currentPage1 - 1) * itemsPerPage;
  const currentItems1 = getData.slice(startIndex1, startIndex1 + itemsPerPage);
  const pageNumbers1 = Array.from({ length: totalPages1 }, (_, i) => i + 1);
  //   for pagination of reusable table ends

  //   for pagination of reusable distributed items table starts
  const [currentPage2, setCurrentPage2] = useState(1); // Current page for ReusableTable
  const totalItems2 = distRecords.length;
  const totalPages2 = Math.ceil(totalItems2 / itemsPerPage);

  const startIndex2 = (currentPage2 - 1) * itemsPerPage;
  const currentItems2 = distRecords.slice(
    startIndex2,
    startIndex2 + itemsPerPage
  );

  const pageNumbers2 = Array.from({ length: totalPages2 }, (_, i) => i + 1);
  // console.log(totalItems2);
  // console.log(totalPages2);
  // console.log(startIndex2);
  // console.log(currentItems2);

  //   for pagination of reusable distributed items table ends

  // for pagination of reusabletableFixed
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(acceptanceNotCreatedLots.length / 10); // Example calculation
  const displayedPages = Array.from({ length: totalPages }, (_, i) => i + 1); // Example pagination logic
  const startIndex = (currentPage - 1) * 10;
  // for pagination of reusabletableFixed

  const [searchTerm, setSearchTerm] = useState("");
  const rowsPerPage = 10;
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    console.log(user);
    setArbId(user[0].Ref_id);
  }, [user]);

  console.log(arbId);

  // To get the access Meeting start here
  useEffect(() => {
    const fetchAccessToken = async () => {
      if (!arbId) return;
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/Meetings?Arb_id=${arbId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const parsedAccessTokenArray = Array.isArray(result)
          ? result
          : JSON.parse(result); // Ensure parsedArbitrators is an array
        setMeeting(parsedAccessTokenArray);
        // console.log(parsedAccessTokenArray);
      } catch (error) {
        // setError1(error.message);
      }
    };

    fetchAccessToken();
  }, [arbId]);

  console.log(meeting);

  // To get the access token start here
  useEffect(() => {
    const fetchAccessToken = async () => {
      if (!arbId) return;
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/ZoomAccess?Arb_id=${arbId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const parsedAccessTokenArray = Array.isArray(result)
          ? result
          : JSON.parse(result); // Ensure parsedArbitrators is an array
        setAccessTokenArray(parsedAccessTokenArray);
        setAccessToken(parsedAccessTokenArray.access_token);
        setRefreshToken(parsedAccessTokenArray.refresh_token);
      } catch (error) {
        // setError1(error.message);
      }
    };

    fetchAccessToken();
  }, [arbId]);

  // console.log(accessTokenArray);
  console.log(accessToken);
  console.log(refreshToken);
  // To get the access token start here

  useEffect(() => {
    const fetchAcceptanceNotCreatedLots = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/pendingAcc?Arb_id=${arbId}`
        );
        // const response = await fetch(`${API_BASE_URL}/api/pendingAcc?Arb_id=${item.Arb_id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const parsedNotServedLots = Array.isArray(result)
          ? result
          : JSON.parse(result); // Ensure parsedArbitrators is an array
        setAcceptanceNotCreatedLots(parsedNotServedLots);
      } catch (error) {
        // setError1(error.message);
      }
    };

    fetchAcceptanceNotCreatedLots();
  }, [arbId]);

  console.log(acceptanceNotCreatedLots);

  const searchFields = ["Arb_name", "Lots"];

  const filteredLots = acceptanceNotCreatedLots.filter((item) =>
    searchFields.some((key) =>
      item[key]?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredLots.slice(indexOfFirstRow, indexOfLastRow);

  useEffect(() => {
    if (acceptanceNotCreatedData.length > 0) {
      const updatedData = acceptanceNotCreatedData.map((item, index) => {
        const {
          SR_No,
          assign_id,
          Arbitrator_id,
          // Case_id,
          UPLODED_DATE,
          ...rest
        } = item;
        return {
          // SrNo: index + 1,
          ...rest,
        };
      });

      // console.log(updatedData);
      setReceivedData(acceptanceNotCreatedData);
      setGetData(updatedData);
      setShowTable(true);
      //   handleStepChange(1);
    }
  }, [acceptanceNotCreatedData]);
  // Watch for changes in draftNotCreatedData

  // console.log(getData);

  const handleRateChange = (e) => {
    setRate(e.target.value);
  };

  const handleNoOfCasesChange = (e) => {
    setNoOfCases(e.target.value);
  };

  const handleAwardPassCasesChange = (e) => {
    setNoOfAwardPassCases(e.target.value);
  };

  //   for the getting data of selected lot to create refernce Draft starts
  const handleRowAction = async (item) => {
    setSelectedLotNo(item.Lot_no);
    setSelectedClientID(item.Client_id);
    setSelectedProductID(item.Product_id);
    setSelectedArbitratorID(item.Arb_id);
    const url = `${API_BASE_URL}/api/RefLots?Lot_no=${item.Lot_no}&Client_id=${item.Client_id}&Product_id=${item.Product_id}&Arb_id=${arbId}`;
    setLoading(true);
    handleStepChange(1);
    try {
      // await fetchData(url);

      const response = await fetch(
        `${API_BASE_URL}/api/RefLots?Lot_no=${item.Lot_no}&Client_id=${item.Client_id}&Product_id=${item.Product_id}&Arb_id=${arbId}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      const parsedNotServedLots = Array.isArray(result)
        ? result
        : JSON.parse(result); // Ensure parsedArbitrators is an array
      console.log(parsedNotServedLots);
      setAcceptanceNotCreatedData(parsedNotServedLots);
      setShowData(true);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  console.log(acceptanceNotCreatedData);
  //   for the getting data of selected lot to create refernce Draft ends

  // console.log(rate);
  // console.log(noOfCases);

  // the logic of assigning time slot start here


  const timeOptions = generateTimeOptions();

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
    setErrorMessage("");
    setTimeDifference(null);
    setDistRecords([]);
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
      setDistRecords([]);
    } else {
      const differenceInMilliseconds = endDate - startDate;
      const differenceInMinutes = differenceInMilliseconds / (1000 * 60);
      const differenceInHours = differenceInMinutes / 60;
      console.log(differenceInHours);
      setTimeDifference(differenceInHours);
    }
  };

  // Function to format date and time together
  // const formatDateTime = (date, time) => {
  //   console.log(time);

  //   const [hour, minute] = time.match(/\d+/g).map(Number);

  //   let formattedHour = hour;
  //   if (time.includes("PM") && formattedHour !== 12) formattedHour += 12;
  //   if (time.includes("AM") && formattedHour === 12) formattedHour = 0;

  //   // Create a new Date object to prevent modifying the original date
  //   const newDate = new Date(date);

  //   // Set hours and minutes in local time
  //   newDate.setHours(formattedHour, minute, 0, 0);

  //   // Format the date and time manually in YYYY-MM-DDTHH:MM (local time)
  //   const year = newDate.getFullYear();
  //   const month = String(newDate.getMonth() + 1).padStart(2, "0");
  //   const day = String(newDate.getDate()).padStart(2, "0");
  //   const hours = String(newDate.getHours()).padStart(2, "0");
  //   const minutes = String(newDate.getMinutes()).padStart(2, "0");

  //   return `${year}-${month}-${day}T${hours}:${minutes}:${minutes}Z`;
  // };

  const distributeRecords = () => {
    handleStepChange(2);

    if (
      !startTime ||
      !endTime ||
      timeDifference <= 0 ||
      acceptanceNotCreatedData.length === 0
    ) {
      setErrorMessage("All fields are required and must be valid.");
      setDistRecords([]);
      return;
    }

    const totalRecords = acceptanceNotCreatedData.length;
    const totalSlots = Math.ceil((timeDifference * 60) / 60); // Total 1-hour or partial-hour slots

    const baseRecordsPerSlot = Math.floor(totalRecords / totalSlots);
    const extraRecords = totalRecords % totalSlots; // Remaining to distribute one-by-one

    let currentStartTime = parseTimeStringToDate(startTime);
    const formattedDate = format(meetStartTime, "MM/dd/yyyy");
    const distributed = [];

    let recordIndex = 0;

    for (let slot = 0; slot < totalSlots; slot++) {
      const slotStartTime = new Date(currentStartTime);
      const slotEndTime = new Date(currentStartTime);

      if (slot === totalSlots - 1 && timeDifference % 1 !== 0) {
        // If fractional last slot
        slotEndTime.setMinutes(
          slotEndTime.getMinutes() + Math.floor(60 * (timeDifference % 1))
        );
      } else {
        slotEndTime.setHours(slotEndTime.getHours() + 1);
      }

      // Distribute baseRecordsPerSlot + 1 if within extraRecords count
      const numRecords = baseRecordsPerSlot + (slot < extraRecords ? 1 : 0);

      for (let i = 0; i < numRecords && recordIndex < totalRecords; i++) {
        distributed.push({
          ...acceptanceNotCreatedData[recordIndex],
          Hearing_date: formattedDate,
          Hearing_time_From: format(slotStartTime, "hh:mm a"),
          Hearing_time_To: format(slotEndTime, "hh:mm a"),
          Video_link: joinUrl,
          Link_ID: zoomId,
          Password: password,
          No_of_cases: noOfCases,
          Rate: rate,
          Award_pass_cases:noOfAwardPassCases,
        });
        recordIndex++;
      }

      currentStartTime = new Date(slotEndTime);
    }

    setDistRecords(distributed);
    setShowDistributed(true);
  };

  console.log(distRecords);

  // TO Save the Records starts
  const handleSave = async () => {
    console.log(distRecords);
    const dataToGenerateAL = distRecords.map((item) => ({
      Case_id: item.Case_id,
      Hearing_date: item.Hearing_date,
      Hearing_time_from: item.Hearing_time_From,
      Hearing_time_to: item.Hearing_time_To,
      Video_link: item.Video_link,
      Link_id: item.Link_ID,
      Password: item.Password,
      No_of_cases: noOfCases,
      Rate: rate,
      Award_pass_cases:noOfAwardPassCases,
    }));
    console.log(dataToGenerateAL);
    handleStepChange(3);
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/acc`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToGenerateAL),
        // body: JSON.stringify({ case: dataToGenerateAL }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to upload data: ${response.status} ${response.statusText} - ${errorText}`
        );
      }
      const result = await response.json(); // Process the response
      // console.log("Upload response:", result);
      toast.success("Data Uploaded Successfully", {
        // position: toast.POSITION.BOTTOM_RIGHT,
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
  // TO Save the Records ends

  // for the generation of dearft function starts
  const handleGenerateAcceptance = async () => {
    setLoading(true); // Start loading before fetching data
    try {
      // Fetch the PDF file from the API
      const response = await fetch(
        `${API_BASE_URL}/api/Accletter?Lot_no=${selectedLotNo}&Client_id=${selectedClientID}&Product_id=${selectedProductID}&Arb_id=${selectedArbitratorID}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Convert the response to a Blob
      const pdfBlob = await response.blob();
      // console.log(pdfBlob);
      // Create a URL for the Blob
      const pdfUrl1 = URL.createObjectURL(pdfBlob);
      // console.log(pdfUrl);
      // Set the PDF URL to the state
      setPdfUrl(pdfUrl1);
      // setPdfUrl(pdfUrl);
      setShowPDF(true);
      setUpload(true);
      handleStepChange(4);
    } catch (error) {
      console.error("Error fetching and displaying the PDF:", error);
    } finally {
      setLoading(false);
    }
  };
  // for the generation of dearft function ends

  const handleUploadAcceptance = async () => {
    setLoading(true);
    try {
      // First API call
      const firstResponse = await fetch(
        `${API_BASE_URL}/api/SaveAccCase?Lot_no=${selectedLotNo}&Client_id=${selectedClientID}&Product_id=${selectedProductID}&Arb_id=${selectedArbitratorID}`
      );

      if (!firstResponse.ok) {
        const errorText = await firstResponse.text();
        throw new Error(
          `Failed to upload data to SaveRef: ${firstResponse.status} ${firstResponse.statusText} - ${errorText}`
        );
      }

      const firstResult = await firstResponse.json(); // Process the response if needed
      // console.log("First API call successful:", firstResult);

      // Second API call (only if the first call is successful)
      const secondResponse = await fetch(
        `${API_BASE_URL}/api/SaveAcc?Lot_no=${selectedLotNo}&Client_id=${selectedClientID}&Product_id=${selectedProductID}&Arb_id=${selectedArbitratorID}`
      );

      if (!secondResponse.ok) {
        const errorText = await secondResponse.text();
        throw new Error(
          `Failed to upload data to SaveRefCase: ${secondResponse.status} ${secondResponse.statusText} - ${errorText}`
        );
      }

      const secondResult = await secondResponse.json(); // Process the response if needed
      // console.log("Second API call successful:", secondResult);

      setClearForm(true);
      handleStepChange(3); // or handleStepChange(4) depending on your requirement
    } catch (error) {
      console.error("Error uploading data:", error);
    } finally {
      setLoading(false);
    }
  };
  //   function to upload the reference Drafts ends Here

  // Loading Spinner Compenent
  if (loading) return <LoadingSpinner />;

  // for pagination of reusabletableFixed starts
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

  // const columns = [
  //   { header: "Sr No" },
  //   { header: "Lots" },
  //   { header: "Arbitrator" },
  //   { header: "Actions" },
  // ];
  // for pagination of reusabletableFixed ends

  // For the customStepper starts Here
  const steps = [
    "Select Lot",
    "Create Zoom Meeting",
    "Save Acceptance",
    "Generate Acceptance",
    "Upload Acceptance",
  ];

  // Function to move to a specific step in Stepper Component
  const handleStepChange = (step) => {
    setActiveStep(step);
  };
  // For the customStepper ends Here

  const handleCloseSecondModal = () => {
    setShowSecondModal(false);
  };
  const handleShowSecondModal = () => setShowSecondModal(true);

  // Pagination For the Main Table Starts Here
  const headers = meeting.length > 0 ? Object.keys(meeting[0]) : [];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  //   const currentItems = 1;
  const currentItems = meeting.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages3 = Math.ceil(meeting.length / itemsPerPage);

  const totalPagesToShow = 5; // Maximum number of page buttons to show

  const generatePaginationItems = () => {
    const items = [];
    const pageWindow = 5;
    let startPage = Math.max(currentPage - Math.floor(pageWindow / 2), 1);
    let endPage = startPage + pageWindow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - pageWindow + 1, 1);
    }

    for (let number = startPage; number <= endPage; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => setCurrentPage(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    return items;
  };
  // Pagination For the Main Table Ends Here

  const handleSelectZoomMeet = () => {
    setShowSecondModal(true);
  };

  const handleSelect = (record) => {
    console.log(record);
    // you can do whatever you want with meetingId here
    setMeetingId(record.Meeting_id);
    setZoomId(record.Link_id);
    setPassword(record.Password);
    setMeetStartTime(record.Date);
    setJoinUrl(record.Link);
    setShowSecondModal(false);
    setZoomMeet(true);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <CustomStepper steps={steps} activeStep={activeStep} />
        </div>
      </div>

      <div className="row align-items-center ">
        <div className="col-md-5">
          {/* {!showTable && !showData && (<h5>Generate Acceptance Letter</h5>)} */}
          {showTable && !showData && !showPDF && !clearForm && (
            <h5>Generate Acceptance Letter</h5>
          )}
          {showPDF && !clearForm && <h5>Upload Acceptance Letter</h5>}
        </div>

        <div className="col-md-5"></div>

        <div className="col-md-2">
          {save && !showPDF && (
            // {showTable && !showData && !showPDF && !clearForm && (
            <button className="custBtn" onClick={handleGenerateAcceptance}>
              Generate
            </button>
          )}
          {showPDF && !clearForm && (
            <button className="custBtn" onClick={handleUploadAcceptance}>
              Upload
            </button>
          )}
          {distRecords.length > 0 && !save && (
            <>
              {/* <div className="col-md-3"></div> */}

              <div className="col-md-3">
                <button className="custBtn" onClick={handleSave}>
                  Save
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {!showTable && (
        <div className="row">
          <div className="col-md-12">
            <div className="row table-container mt-3">
              <div className="col-md-12 mx-auto table-wrapper">
                {/* Search Input */}
                <div className="d-flex justify-content-start">
                  <input
                    type="text"
                    placeholder="Search Lots..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1); // reset to first page on search
                    }}
                    className="form-control mb-2"
                    style={{ maxWidth: "300px", fontSize: '0.85rem' }}
                  />
                </div>

                {/* Table */}
                <table className="responsive-table mb-2">
                  <thead className="text-center">
                    <tr className="table-info">
                      <th scope="col" className="text-center">
                        Sr No
                      </th>

                      <th scope="col" className="text-center">
                        Assigned Date
                      </th>

                      <th scope="col" className="text-center">
                        Lots
                      </th>
                      {/* <th scope="col" className="text-center">
                        Arbitrator Name
                      </th> */}
                      <th scope="col" className="text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRows.length > 0 ? (
                      currentRows.map((item, index) => (
                        <tr key={item.id}>
                          <td className="text-center p-0">
                            {indexOfFirstRow + index + 1}
                          </td>
                          <td className="text-center p-0">
                            {item.Assign_date
                              ? new Date(item.Assign_date).toLocaleDateString(
                                  "en-GB",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )
                              : ""}
                          </td>
                          <td className="text-center p-0">{item.Lots}</td>
                          {/* <td className="text-center">{item.Arb_name}</td> */}
                          <td className="text-center py-2">
                            <button
                              onClick={() => handleRowAction(item)}
                              className="custBtn"
                            >
                              Show
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center text-muted">
                          No results found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="d-flex justify-content-center ">
                  <nav>
                    <ul className="pagination">
                      {Array.from({ length: totalPages }, (_, i) => (
                        <li
                          key={i + 1}
                          className={`page-item ${
                            currentPage === i + 1 ? "active" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(i + 1)}
                          >
                            {i + 1}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* to SAVE The date and time for cirtul meeting starts */}
      {showData && !showDistributed && !zoomMeet && (
        <div className="row mt-3">
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

          <div className="col-md-3"> </div>

          {/* button Goes here */}
          <div className="col-md-3">
            <Button className="custBtn" onClick={handleSelectZoomMeet}>
              Select Zoom Meet
            </Button>
          </div>
          {/* <div className="col-md-3">
            <Button className="custBtn" onClick={handleZoomMeet}>
              Select Zoom Meet
            </Button>
          </div> */}
        </div>
      )}
      {/* to SAVE The date and time for Virtul meeting ends */}

      {/*Modal starts here */}
      <Modal
        show={showSecondModal}
        onHide={handleCloseSecondModal}
        className="modal-xl"
      >
        <Modal.Header className="customModal" style={{ position: "relative" }}>
          <Modal.Title className="">Assign Second Hearing Date</Modal.Title>
          <Button
            style={{
              position: "absolute",
              right: "15px",
              color: "orange",
              backgroundColor: "transparent",
              border: "none",
              fontSize: "40px",
            }}
            aria-label="Close"
            onClick={handleCloseSecondModal}
          >
            &times;
          </Button>
        </Modal.Header>
        <Modal.Body>
          <div className="table-responsive">
            {currentItems.length > 0 && (
              <table className="table table-striped table-bordered table-hover mt-3 text-center">
                <thead>
                  <tr>
                    <th>Select</th> {/* <-- Added Select button header */}
                    {headers.map((header) => (
                      <th key={header}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item, index) => (
                    <tr
                      key={index}
                      style={{
                        maxHeight: "50px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      className="text-center custom_fz"
                    >
                      {/* Select Button */}
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleSelect(item)}
                        >
                          Select
                        </button>
                      </td>

                      {/* Table Data */}
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
        </Modal.Body>
      </Modal>
      {/*Modal ends here */}

      {zoomMeet && !showDistributed && (
        <>
          <div className="row my-3">
            <div className="col-md-3">
              <div className="">
                <Form.Control
                  type="number"
                  className="custom_input"
                  placeholder="Enter Rate"
                  onChange={handleRateChange}
                  value={rate}
                  style={{fontSize:"12px"}}
                />
              </div>
            </div>
            <div className="col-md-3">
              <Form.Control
                type="number"
                className="custom_input"
                placeholder="Ongoing Cases"
                onChange={handleNoOfCasesChange}
                value={noOfCases}
                style={{fontSize:"12px"}}
              />
            </div>
            <div className="col-md-3">
              <Form.Control
                type="number"
                className="custom_input"
                placeholder="Award Pass Cases"
                onChange={handleAwardPassCasesChange}
                value={noOfAwardPassCases}
                style={{fontSize:"12px"}}
              />
            </div>
            <div className="col-md-3">
              <Button className="custBtn" onClick={distributeRecords}>
                Assign
              </Button>
            </div>
          </div>
          <div className=" other-container">
            <div className="row">
              <div className="col-md-4"></div>
              <div className="col-md-4">
                <h4>Zoom Meeting Details</h4>
              </div>
              <div className="col-md-4"></div>
            </div>
            <div className="row ms-3 mt-2 mb-2">
              <div className="col-md-3">
                <h5>Zoom Join Url</h5>
              </div>
              <div className="col-md-9">
                <span>:&nbsp;&nbsp;&nbsp;{joinUrl}</span>
              </div>
            </div>
            <div className="row ms-3 mb-2">
              <div className="col-md-3">
                <h5>Zoom Meeting Id</h5>
              </div>
              <div className="col-md-5">
                <span>:&nbsp;&nbsp;&nbsp;{zoomId}</span>
              </div>
            </div>
            <div className="row ms-3 mb-2">
              <div className="col-md-3">
                <h5>Zoom Password</h5>
              </div>
              <div className="col-md-5">
                <span>:&nbsp;&nbsp;&nbsp;{password}</span>
              </div>
            </div>
            <div className="row ms-3 mb-2">
              <div className="col-md-3">
                <h5>Zoom Start Time</h5>
              </div>
              <div className="col-md-5">
                <span>:&nbsp;&nbsp;&nbsp;{meetStartTime}</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* {showTable && !showPDF && !showDistributed && ( */}
      {showTable && !showPDF && !showDistributed && !zoomMeet && (
        <ReusableTable
          data={currentItems1}
          currentPage={currentPage1}
          pageNumbers={pageNumbers1}
          setCurrentPage={setCurrentPage1}
        />
      )}

      {distRecords.length > 0 && !showPDF && (
        <ReusableTable
          data={currentItems2}
          currentPage={currentPage2}
          pageNumbers={pageNumbers2}
          setCurrentPage={setCurrentPage2}
        />
      )}

      {showPDF && !clearForm && (
        <div className="row mt-3">
          <div className="col-md-12">
            <iframe
              src={pdfUrl}
              style={{ width: "100%", height: "100vh" }}
              title="PDF Viewer"
            />
          </div>
        </div>
      )}

      {clearForm && (
        <div className="row">
          <div className="col-md-12 d-flex justify-content-center ">
            <ClearForm
              message="Acceptance Letter Created Successfully!"
              redirectPath="/arbdashboard"
            />
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default GenerateAccLtr;

