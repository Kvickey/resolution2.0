import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/constants";
import ReusableTableFixed from "../components/ReusableTableFixed";
import useFetch from "../hooks/useFetch";
import ReusableTable from "../components/ReusableTable";
import LoadingSpinner from "../components/LoadingSpinner";
import ClearForm from "../components/Clearform";
import DatePicker from "react-datepicker";
import { Button, Form } from "react-bootstrap";
import { format } from "date-fns";
import { toast, ToastContainer } from "react-toastify";
import CustomStepper from "../components/CustomStepper";

const ThirdHearingNotice = () => {
  const {
    data: AcceptanceNotCreatedData,
    loading: loading1,
    error: error1,
    fetchData,
  } = useFetch();
  const [acceptanceNotCreatedLots, setAcceptanceNotCreatedLots] = useState([]);
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
  const [activeStep, setActiveStep] = useState(0);

  // for time setting starts
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [timeDifference, setTimeDifference] = useState(null);
  const [records, setRecords] = useState([]);
  const [distRecords, setDistRecords] = useState([]);
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
    const fetchAcceptanceNotCreatedLots = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/pendingAcc`);
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
  }, []);

  console.log(acceptanceNotCreatedLots);

  useEffect(() => {
    if (AcceptanceNotCreatedData.length > 0) {
      const updatedData = AcceptanceNotCreatedData.map((item, index) => {
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

      console.log(updatedData);
      setReceivedData(AcceptanceNotCreatedData);
      setGetData(updatedData);
      setShowTable(true);
      //   handleStepChange(1);
    }
  }, [AcceptanceNotCreatedData]);
  // Watch for changes in draftNotCreatedData

  console.log(getData);

  //   for the getting data of selected lot to create refernce Draft starts
  const handleRowAction = async (item) => {
    setSelectedLotNo(item.Lot_no);
    setSelectedClientID(item.Client_id);
    setSelectedProductID(item.Product_id);
    setSelectedArbitratorID(item.Arb_id);
    const url = `${API_BASE_URL}/api/RefLots?Lot_no=${item.Lot_no}&Client_id=${item.Client_id}&Product_id=${item.Product_id}&Arb_id=${item.Arb_id}`;
    setLoading(true);
    handleStepChange(1);
    try {
      await fetchData(url);
      setShowData(true);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  console.log(AcceptanceNotCreatedData);
  //   for the getting data of selected lot to create refernce Draft ends

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    // const getDate = date.toLocaleDateString('en-GB', options);
    const getDate = date.toLocaleDateString("en-US");
    // console.log(getDate); // Outputs in MM/dd/yyyy format
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

  const distributeRecords = () => {
    handleStepChange(2);
    if (
      !startTime ||
      !endTime ||
      !selectedDate ||
      timeDifference <= 0 ||
      AcceptanceNotCreatedData.length === 0
    ) {
      setErrorMessage("All fields are required and must be valid.");
      setDistRecords([]);
      return;
    }

    const totalRecords = AcceptanceNotCreatedData.length;
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
            ...AcceptanceNotCreatedData[recordIndex],
            Hearing_date: formattedDate,
            Hearing_time_From: formattedStartTime,
            Hearing_time_To: formattedEndTime,
            Video_link:
              "https://us05web.zoom.us/j/82064910816?pwd=irnBsMk470Z2Uws7dxxZri8jrhdUG3.1",
            Link_ID: "820 6491 0816",
            Password: "4ExYPe",
            // Acc_Date: new Date().toISOString().split("T")[0],
            No_of_cases: "1810",
            Rate: "1000",
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
            ...AcceptanceNotCreatedData[recordIndex],
            Hearing_date: formattedDate,
            Hearing_time_From: formattedStartTime,
            Hearing_time_To: formattedEndTime,
            Video_link:
              "https://us05web.zoom.us/j/82064910816?pwd=irnBsMk470Z2Uws7dxxZri8jrhdUG3.1",
            Link_ID: "820 6491 0816",
            Password: "4ExYPe",
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
          Hearing_date: formattedDate,
          Hearing_time_From: lastSlotStartTime,
          Hearing_time_To: lastSlotEndTime,
          Video_link:
            "https://us05web.zoom.us/j/82064910816?pwd=irnBsMk470Z2Uws7dxxZri8jrhdUG3.1",
          Link_ID: "820 6491 0816",
          Password: "4ExYPe",
          // Acc_Date: new Date().toISOString().split("T")[0],
          // No_of_cases: "1810",
          // Rate: "1000",
        });
      }
    }

    console.log(`Total Records Assigned: ${assignedRecordsCount}`);
    setDistRecords(distributed);
    setShowDistributed(true);
  };

  // console.log(distributedRecords);

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
      No_of_cases: "1810",
      Rate: "1000",
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
      console.log("Upload response:", result);
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
      console.log(pdfBlob);
      // Create a URL for the Blob
      const pdfUrl1 = URL.createObjectURL(pdfBlob);
      console.log(pdfUrl);
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
        `${API_BASE_URL}/api/SaveAccCase?Lot_no=${selectedLotNo}&Client_id=${selectedClientID}&Product_id=${selectedProductID}&Arb_id=${selectedArbitratorID}`
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
    "Assign Date and Time Slot",
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
        <div className="col-md-6">
          {/* {!showTable && !showData && (<h5>Generate Acceptance Letter</h5>)} */}
          {showTable && !showData && !showPDF && !clearForm && (
            <h5>Generate Acceptance Letter</h5>
          )}
          {showPDF && !clearForm && <h5>Upload Acceptance Letter</h5>}
        </div>

        {!showTable ? <div className="col-md-4"></div> : ""}
        <div className="col-md-4"> {!showTable ? "" : ""}</div>

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
            <button className="custBtn" onClick={handleSave}>
              Save
            </button>
          )}
        </div>
      </div>

      {!showTable && (
        <div className="row">
          <div className="col-md-12 mt-4">
            <ReusableTableFixed
              columns={columns}
              data={acceptanceNotCreatedLots.slice(startIndex, startIndex + 10)}
              currentPage={currentPage}
              totalPages={totalPages}
              displayedPages={displayedPages}
              handlePrevious={handlePrevious}
              handleNext={handleNext}
              setCurrentPage={setCurrentPage}
              handleRowAction={handleRowAction}
              startIndex={startIndex}
            />
          </div>
        </div>
      )}

      {/* to SAVE The date and time for cirtul meeting starts */}
      {showData && !showDistributed && (
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
      )}
      {/* to SAVE The date and time for cirtul meeting ends */}

      {showTable && !showPDF && !showDistributed && (
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

export default ThirdHearingNotice;
