import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/constants";
import ReusableTableFixed from "../components/ReusableTableFixed";
import useFetch from "../hooks/useFetch";
import CustomStepper from "../components/CustomStepper";
import ReusableTable from "../components/ReusableTable";
import LoadingSpinner from "../components/LoadingSpinner";
import DatePicker from "react-datepicker";
import ClearForm from "../components/Clearform";

const SOC = () => {
  const [sec17NotCreatedLots, setSec17NotCreatedLots] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLotNo, setSelectedLotNo] = useState([]);
  const [selectedClientID, setSelectedClientID] = useState([]);
  const [selectedProductID, setSelectedProductID] = useState([]);
  const [selectedArbitratorID, setSelectedArbitratorID] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [theDate, setTheDate] = useState([]);
  const {
    data: SOCNotCreatedData,
    loading: loading1,
    error: error1,
    fetchData,
  } = useFetch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showData, setShowData] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [save, setSave] = useState(false);
  const [showPDF, setShowPDF] = useState(false);
  const [upload, setUpload] = useState(false);
  const [clearForm, setClearForm] = useState(false);

  useEffect(() => {
    const fetchSec17NotCreatedLots = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/pendingSec17app`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const parsedNotServedLots = Array.isArray(result)
          ? result
          : JSON.parse(result); // Ensure parsedArbitrators is an array
        setSec17NotCreatedLots(parsedNotServedLots);
        setLoading(false);
      } catch (error) {
        // setError1(error.message);
      }
    };

    fetchSec17NotCreatedLots();
  }, []);

  console.log(sec17NotCreatedLots);

  // for reusableTable Fixed starts
  const columns = [
    { header: "Sr No" },
    { header: "Lots" },
    { header: "Arbitrator" },
    { header: "Actions" },
  ];
  // for pagination of reusabletableFixed
  const totalPages = Math.ceil(sec17NotCreatedLots.length / 10); // Example calculation
  const displayedPages = Array.from({ length: totalPages }, (_, i) => i + 1); // Example pagination logic
  const startIndex = (currentPage - 1) * 10;
  // for pagination of reusabletableFixed

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
  // for reusableTable Fixed ends

  // For the customStepper starts Here
  const steps = ["Select Lot", "Save Section 17 Application", "Generate Section 17 Application", "Upload Section 17 Application"];

  // Function to move to a specific step in Stepper Component
  const handleStepChange = (step) => {
    setActiveStep(step);
  };
  // For the customStepper ends Here

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

  // console.log(SOCNotCreatedData);
  //   for the getting data of selected lot to create refernce Draft ends

  //   for pagination of reusable table starts
  const [currentPage1, setCurrentPage1] = useState(1); // Current page for ReusableTable
  const [itemsPerPage] = useState(10); // Number of items per page
  const totalItems1 = SOCNotCreatedData.length;
  const totalPages1 = Math.ceil(totalItems1 / itemsPerPage);
  const startIndex1 = (currentPage1 - 1) * itemsPerPage;
  const currentItems1 = SOCNotCreatedData.slice(
    startIndex1,
    startIndex1 + itemsPerPage
  );
  const pageNumbers1 = Array.from({ length: totalPages1 }, (_, i) => i + 1);
  //   for pagination of reusable table ends

  if (loading) return <LoadingSpinner />;

  // Date Change function Starts Here
  const handleDateChange = (date) => {
    // Check if the input is a valid Date object
    if (date && date instanceof Date && !isNaN(date)) {
      // Format the date to "dd/MM/yyyy"
      // const formattedDate = date.toLocaleDateString("en-GB"); // 'en-GB' outputs date as DD/MM/YYYY
      const formattedDate = date.toLocaleDateString("en-US"); // 'en-US' outputs date as MM/DD/YYYY
      setSelectedDate(date); // Set the actual Date object for the DatePicker
      console.log("Selected Date:", formattedDate); // For debugging, show the formatted date
      setTheDate(formattedDate);
    } else {
      console.error("Invalid date:", date);
      setSelectedDate(null); // Reset if the date is invalid
    }
  };
  // Date Change function Ends Here

  console.log(theDate);

  // TO Save the SOC Records  with Date starts
  const handleSaveSec17app = async () => {
    console.log(SOCNotCreatedData);
    const dataToGenerateSOC = SOCNotCreatedData.map((item) => ({
      Case_id: item.Case_id,
      Sec_17_app_date: theDate,
    }));
    console.log(dataToGenerateSOC);
    handleStepChange(2);
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/Sec17appSave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToGenerateSOC),
        // body: JSON.stringify({ case: dataToGenerateAL }),
      });
      if (!response.ok) {
        // console.log(response);
        const errorText = await response.text();
        throw new Error(
          `Failed to upload data: ${response.status} ${response.statusText} - ${errorText}`
        );
      }
      console.log(response);
      const result = await response.json(); // Process the response
      console.log("Upload response:", result);
      // toast.success("Data Uploaded Successfully", {
      //   // position: toast.POSITION.BOTTOM_RIGHT,
      //   theme: "colored",
      //   autoClose: 1000,
      // });
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

  // for the generation of SOC function starts
  const handleGenerateSec17app = async () => {
    setLoading(true);
    try {
      // Fetch the PDF file from the API
      const response = await fetch(
        `${API_BASE_URL}/api/Sec17appletter?Lot_no=${selectedLotNo}&Client_id=${selectedClientID}&Product_id=${selectedProductID}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Convert the response to a Blob
      const pdfBlob = await response.blob();
      console.log(pdfBlob);
      // Create a URL for the Blob
      const pdfUrl = URL.createObjectURL(pdfBlob);
      // Set the PDF URL to the state
      setPdfUrl(pdfUrl);
      // setPdfUrl(pdfUrl);
      setShowPDF(true);
      setUpload(true);
      handleStepChange(3);
    } catch (error) {
      console.error("Error fetching and displaying the PDF:", error);
    } finally {
      setLoading(false);
    }
  };
  // for the generation of dearft function ends

  const handleUploadSec17app = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/SaveSec17appCase?Lot_no=${selectedLotNo}&Client_id=${selectedClientID}&Product_id=${selectedProductID}&Arb_id=${selectedArbitratorID}`
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
        handleStepChange(4);
    } catch (error) {
      console.error("Error uploading data:", error);
    } finally {
      setLoading(false);
    }
  };
  //   function to upload the reference Drafts ends Here

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12 mb-3">
          <CustomStepper steps={steps} activeStep={activeStep} />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          {!SOCNotCreatedData.length > 0 && <h5> Select Lot </h5>}
        </div>
        <div className="col-md-4"></div>
        <div className="col-md-2"></div>
      </div>

      {!showData && (
        <div className="row">
          <div className="col-md-12 mt-3">
            <ReusableTableFixed
              columns={columns}
              data={sec17NotCreatedLots.slice(startIndex, startIndex + 10)}
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

      {showData && (
        <div className="row">
          <div className="col-md-6">
            {!save && (
              <DatePicker
                selected={selectedDate} // Set the selected date
                onChange={handleDateChange}
                placeholderText="Select a date"
                dateFormat="dd/MM/yyyy" // Use dd/MM/yyyy format
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
            )}
          </div>
          <div className="col-md-4"></div>
          <div className="col-md-2">
            {!save && (
              <button className="custBtn" onClick={handleSaveSec17app}>
                Save SEC 17
              </button>
            )}
            {save && !showPDF && !clearForm && (
              <button className="custBtn" onClick={handleGenerateSec17app}>
                Generate
              </button>
            )}
            {showPDF && !clearForm && (
              <button className="custBtn" onClick={handleUploadSec17app}>
                Upload
              </button>
            )}
          </div>
        </div>
      )}

      {showData && !showPDF && !clearForm && (
        <div className="row">
          <div className="col-md-12 mt-3">
            <ReusableTable
              data={currentItems1}
              currentPage={currentPage1}
              pageNumbers={pageNumbers1}
              setCurrentPage={setCurrentPage1}
            />
          </div>
        </div>
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
              message="Section 17 Application Uploaded Successfully!"
              redirectPath="/lawyerdashboard"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SOC;
