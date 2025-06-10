import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/constants";
import ReusableTable from "../components/ReusableTable";
import LoadingSpinner from "../components/LoadingSpinner";
import ClearForm from "../components/Clearform";
import { Button, Form } from "react-bootstrap";
import { format } from "date-fns";
import { toast, ToastContainer } from "react-toastify";
import CustomStepper from "../components/CustomStepper";
import { useAuth } from "../components/AuthProvider";

const SecondHearingNotice = () => {
  const { user, logout } = useAuth();
  const [acceptanceNotCreatedLots, setAcceptanceNotCreatedLots] = useState([]);
  const [dataForSecondHearing, setDataForSecondHearing] = useState([]);
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
  const [joinUrl, setJoinUrl] = useState("");
  const [zoomId, setZoomId] = useState("");
  const [password, setPassword] = useState("");
  const [meetStartTime, setMeetStartTime] = useState("");
  const [arbId, setArbId] = useState("");
  const [rate, setRate] = useState(null);
  const [noOfCases, setNoOfCases] = useState(null);

  // for time setting starts
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [secondHearingDate, setSecondHearingDate] = useState(null);
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
  const [searchTerm, setSearchTerm] = useState("");
  const rowsPerPage = 10;
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  //   for pagination of reusable table ends

  //   for pagination of reusable distributed items table starts
  const [currentPage2, setCurrentPage2] = useState(1); // Current page for ReusableTable
  const totalItems2 = distRecords.length;
  const totalPages2 = Math.ceil(totalItems1 / itemsPerPage);
  const startIndex2 = (currentPage1 - 1) * itemsPerPage;
  const currentItems2 = distRecords.slice(
    startIndex1,
    startIndex1 + itemsPerPage
  );
  const pageNumbers2 = Array.from({ length: totalPages1 }, (_, i) => i + 1);
  //   for pagination of reusable distributed items table ends

  // for pagination of reusabletableFixed
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(acceptanceNotCreatedLots.length / 10); // Example calculation
  const displayedPages = Array.from({ length: totalPages }, (_, i) => i + 1); // Example pagination logic
  const startIndex = (currentPage - 1) * 10;
  // for pagination of reusabletableFixed

  useEffect(() => {
    console.log(user);
    setArbId(user[0].Ref_id);
  }, [user]);

  console.log(arbId);

  useEffect(() => {
    const fetchLotsForSecondHearing = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/HearingData?&Arb_id=${arbId}&Meeting_no=1`
        );
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

    fetchLotsForSecondHearing();
  }, [arbId]);

  console.log(acceptanceNotCreatedLots);
  const searchFields = ["Lot_no"]; // match actual key names

  const filteredLots = acceptanceNotCreatedLots.filter((item) =>
    searchFields.some((key) =>
      item[key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  console.log(filteredLots);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredLots.slice(indexOfFirstRow, indexOfLastRow);

  useEffect(() => {
    if (dataForSecondHearing.length > 0) {
      const updatedData = dataForSecondHearing.map((item, index) => {
        const {
          SR_No,
          assign_id,
          Arbitrator_id,
          // Case_id,
          UPLODED_DATE,
          ...rest
        } = item;
        return {
          SrNo: index + 1,
          ...rest,
        };
      });

      // console.log(updatedData);
      setReceivedData(dataForSecondHearing);
      setGetData(updatedData);
      setShowTable(true);
      //   handleStepChange(1);
    }
  }, [dataForSecondHearing]);
  // Watch for changes in draftNotCreatedData

  console.log(getData);

  const handleRateChange = (e) => {
    setRate(e.target.value);
  };

  const handleNoOfCasesChange = (e) => {
    setNoOfCases(e.target.value);
  };

  //   for the getting data of selected lot to create refernce Draft starts
  const handleRowAction = async (item) => {
    console.log(item);
    setLoading(true);
    setSelectedLotNo(item.Lot_no);
    setSecondHearingDate(item.Second_Hearing_date);
    handleStepChange(1);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/HearingData?&Arb_id=${arbId}&Meeting_no=1&Lot_no=${item.Lot_no}&SH_date=${item.Second_Hearing_date}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setLoading(false);
      const result = await response.json();
      const parsedNotServedLots = Array.isArray(result)
        ? result
        : JSON.parse(result); // Ensure parsedArbitrators is an array
      setShowData(true);
      setDataForSecondHearing(parsedNotServedLots);
      setSelectedClientID(parsedNotServedLots[0].Client_id);
      setSelectedProductID(parsedNotServedLots[0].Product_id);
    } catch (error) {
      // setError1(error.message);
    }
    // try {
    //   await fetchData(url);
    //   setShowData(true);
    // } catch (error) {
    //   setError(error);
    // } finally {
    //   setLoading(false);
    // }
  };

  console.log(dataForSecondHearing);
  console.log(selectedLotNo);
  console.log(selectedClientID);
  console.log(selectedProductID);
  console.log(arbId);

  //   for the getting data of selected lot to create refernce Draft ends
  // console.log(rate);
  // console.log(noOfCases);

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
  const formatDateTime = (date, time) => {
    const [hour, minute] = time.match(/\d+/g).map(Number);

    let formattedHour = hour;
    if (time.includes("PM") && formattedHour !== 12) formattedHour += 12;
    if (time.includes("AM") && formattedHour === 12) formattedHour = 0;

    // Create a new Date object to prevent modifying the original date
    const newDate = new Date(date);

    // Set hours and minutes in local time
    newDate.setHours(formattedHour, minute, 0, 0);

    // Format the date and time manually in YYYY-MM-DDTHH:MM (local time)
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, "0");
    const day = String(newDate.getDate()).padStart(2, "0");
    const hours = String(newDate.getHours()).padStart(2, "0");
    const minutes = String(newDate.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleZoomMeet = async () => {
    // console.log(selectedDate);
    // console.log(startTime);
    const formattedDateTime = formatDateTime(selectedDate, startTime);
    // console.log(formattedDateTime);
    const dataToGenerateZoomMeet = {
      accessToken: accessToken,
      refreshToken: refreshToken,
      topic: "Zoom Meeting",
      start_time: formattedDateTime,
      duration: "720",
      agenda: "The Resolution Metting for dispute resolving",
    };
    console.log(dataToGenerateZoomMeet);
    handleStepChange(3);
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/Zoom`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToGenerateZoomMeet),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to upload data: ${response.status} ${response.statusText} - ${errorText}`
        );
      }
      const result = await response.json(); // Process the response
      // console.log("Upload response:", result);
      setZoomResponse(result);
      toast.success("Data Uploaded Successfully", {
        // position: toast.POSITION.BOTTOM_RIGHT,
        theme: "colored",
        autoClose: 1000,
      });
      setZoomMeet(true);
      // console.log(save);
    } catch (error) {
      console.error("Error uploading data:", error);
      // alert(`Error uploading data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // console.log("Updated zoomResponse:", zoomResponse);
    let parsedResponse;

    if (typeof zoomResponse === "string") {
      try {
        parsedResponse = JSON.parse(zoomResponse);
        console.log("Parsed Response:", parsedResponse);
      } catch (error) {
        console.error("Error parsing zoomResponse:", error);
        return;
      }
    } else if (zoomResponse && typeof zoomResponse === "object") {
      parsedResponse = zoomResponse;
    } else {
      console.log("zoomResponse is undefined or not an object!");
      return;
    }
    setZoomId(parsedResponse.id);
    setPassword(parsedResponse.password);
    setMeetStartTime(parsedResponse.start_time);
    if (parsedResponse?.join_url) {
      console.log("Join URL:", parsedResponse.join_url);
      setJoinUrl(parsedResponse.join_url); // Store join_url in state
    } else {
      console.log("join_url not found in parsed response!");
    }
  }, [zoomResponse]);

  // console.log(joinUrl);
  // console.log(zoomId);
  // console.log(password);
  // console.log(meetStartTime);

  const distributeRecords = () => {
    console.log(noOfCases);
    handleStepChange(2);
    if (
      !startTime ||
      !endTime ||
      !selectedDate ||
      timeDifference <= 0 ||
      dataForSecondHearing.length === 0
    ) {
      setErrorMessage("All fields are required and must be valid.");
      setDistRecords([]);
      return;
    }

    const totalRecords = dataForSecondHearing.length;
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
            ...dataForSecondHearing[recordIndex],
            Hearing_date: formattedDate,
            Hearing_time_From: formattedStartTime,
            Hearing_time_To: formattedEndTime,
            Video_link: joinUrl,
            Link_ID: zoomId,
            Password: password,
            // Acc_Date: new Date().toISOString().split("T")[0],
            No_of_cases: noOfCases,
            Rate: rate,
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
            ...dataForSecondHearing[recordIndex],
            Hearing_date: formattedDate,
            Hearing_time_From: formattedStartTime,
            Hearing_time_To: formattedEndTime,
            Video_link: joinUrl,
            Link_ID: zoomId,
            Password: password,
            // Acc_Date: new Date().toISOString().split("T")[0],
            No_of_cases: noOfCases,
            Rate: rate,
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
          Hearing_date: formattedDate,
          Hearing_time_From: lastSlotStartTime,
          Hearing_time_To: lastSlotEndTime,
          Video_link: joinUrl,
          Link_ID: zoomId,
          Password: password,
          // Acc_Date: new Date().toISOString().split("T")[0],
          No_of_cases: noOfCases,
          Rate: rate,
        });
      }
    }

    // console.log(`Total Records Assigned: ${assignedRecordsCount}`);
    setDistRecords(distributed);
    setShowDistributed(true);
  };

  // console.log(distributedRecords);

  console.log(distRecords);



  // for the generation of dearft function starts
  const handleGenerateAcceptance = async () => {
    setLoading(true); // Start loading before fetching data
    try {
      // Fetch the PDF file from the API
      const response = await fetch(
        `${API_BASE_URL}/api/SecondHearingletter?Lot_no=${selectedLotNo}&Client_id=${selectedClientID}&Product_id=${selectedProductID}&Arb_id=${arbId}&Meeting_no=1&SH_date=${secondHearingDate}`
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

  //   function to upload the reference Drafts Starts Here
  const handleUploadAcceptance = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/SaveSHLetterCase?Lot_no=${selectedLotNo}&Client_id=${selectedClientID}&Product_id=${selectedProductID}&Arb_id=${arbId}&Meeting_no=1&SH_date=${secondHearingDate}`
        // `${API_BASE_URL}/api/SaveAccCase?Lot_no=${selectedLotNo}&Client_id=${selectedClientID}&Product_id=${selectedProductID}&Arb_id=${arbId}`
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to upload data: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const result = await response.json(); // Process the response
      //   console.log(result);
      setClearForm(true);
      handleStepChange(5);
    } catch (error) {
      console.error("Error uploading data:", error);
      alert(`Error uploading data: ${error.message}`);
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

  const columns = [
    { header: "Sr No" },
    { header: "Lots" },
    { header: "Arbitrator" },
    { header: "Actions" },
  ];
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

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12 mb-3">
          <CustomStepper steps={steps} activeStep={activeStep} />
        </div>
      </div>

      <div className="row align-items-center ">
        <div className="col-md-5">
          {/* {!showTable && !showData && (<h5>Generate Acceptance Letter</h5>)} */}
          {showTable && !showData && !showPDF && !clearForm && (
            <h5>Generate Second Hearing Notice</h5>
          )}
          {showPDF && !clearForm && <h5>Upload Second Hearing Notice</h5>}
          {zoomMeet && !showDistributed && (
            <div className="">
              {/* <label>Enter Rate</label> */}
              <Form.Control
                type="number"
                className="custom_input"
                placeholder="Enter Rate"
                onChange={handleRateChange}
                value={rate}
              />
            </div>
          )}
        </div>

        <div className="col-md-5">
          {zoomMeet && !showDistributed && (
            <div className="">
              {/* <label>Enter No Of Cases</label> */}
              <Form.Control
                type="number"
                className="custom_input"
                placeholder="Enter No Of Cases"
                onChange={handleNoOfCasesChange}
                value={noOfCases}
              />
            </div>
          )}
        </div>

        <div className="col-md-2">
          {/* {save && !showPDF && (
            // {showTable && !showData && !showPDF && !clearForm && (
           
          )} */}
          {showPDF && !clearForm && (
            <button className="custBtn" onClick={handleUploadAcceptance}>
              Upload
            </button>
          )}
          {/* {distRecords.length > 0 && !save && (
            <>

              <div className="col-md-3">
                <button className="custBtn" onClick={handleSave}>
                  Save
                </button>
              </div>
            </>
          )} */}
        </div>
      </div>

      {!showTable && (
        <div className="row">
          <div className="col-md-12 mt-4">
           
            <div className="row table-container mt-3">
              <div className="col-md-12 mx-auto table-wrapper">
                {/* Search Input */}
                <div className="mb-3 d-flex justify-content-start">
                  <input
                    type="text"
                    placeholder="Search Lots..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1); // reset to first page on search
                    }}
                    className="form-control"
                    style={{ maxWidth: "300px" }}
                  />
                </div>

                {/* Table */}
                <table className="responsive-table my-3">
                  <thead className="text-center">
                    <tr className="table-info">
                      <th scope="col" className="text-center">
                        Sr No
                      </th>

                      <th scope="col" className="text-center">
                        First Hearing Date
                      </th>

                      <th scope="col" className="text-center">
                        Lot No
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
                          <td className="text-center">
                            {indexOfFirstRow + index + 1}
                          </td>
                          <td className="text-center">
                            {item.First_hearing_date}
                            {/* {item.First_hearing_date
                              ? new Date(item.Assign_date).toLocaleDateString(
                                  "en-GB",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )
                              : ""} */}
                          </td>
                          <td className="text-center">{item.Lot_no}</td>
                          {/* <td className="text-center">{item.Arb_name}</td> */}
                          <td className="text-center">
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
                <div className="d-flex justify-content-center">
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
      {showData && !showDistributed && !zoomMeet && !showPDF && (
        <div className="col-md-3">
          <button className="custBtn" onClick={handleGenerateAcceptance}>
            Generate
          </button>
        </div>
      )}
      {/* to SAVE The date and time for Virtul meeting ends */}

      {/* {showTable && !showPDF && !showDistributed && ( */}
      {showTable && !showPDF && !showDistributed && !zoomMeet && (
        <ReusableTable
          data={currentItems1}
          currentPage={currentPage1}
          pageNumbers={pageNumbers1}
          setCurrentPage={setCurrentPage1}
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
              message="Second Hearing Notice Created Successfully!"
              redirectPath="/arbdashboard"
            />
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default SecondHearingNotice;
