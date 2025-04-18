import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/constants";
import ReusableTableFixed from "../components/ReusableTableFixed";
import useFetch from "../hooks/useFetch";
import ReusableTable from "../components/ReusableTable";
import LoadingSpinner from "../components/LoadingSpinner";
import ClearForm from "../components/Clearform";
import CustomStepper from "../components/CustomStepper";

const ReferenceDraftGenerate = () => {
  const {
    data: draftNotCreatedData,
    loading: loading1,
    error: error1,
    fetchData,
  } = useFetch();
  const [refNotCreatedLots, setRefNotCreatedLots] = useState([]);
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
  const [activeStep, setActiveStep] = useState(0);

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

  // for pagination of reusabletableFixed
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(refNotCreatedLots.length / 10); // Example calculation
  const displayedPages = Array.from({ length: totalPages }, (_, i) => i + 1); // Example pagination logic
  const startIndex = (currentPage - 1) * 10;

  // for pagination of reusabletableFixed

  useEffect(() => {
    const fetchRefNotCreatedLots = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/pendingRefLots`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const parsedNotServedLots = Array.isArray(result)
          ? result
          : JSON.parse(result); // Ensure parsedArbitrators is an array
        setRefNotCreatedLots(parsedNotServedLots);
      } catch (error) {
        // setError1(error.message);
      }
    };

    fetchRefNotCreatedLots();
  }, []);

  console.log(refNotCreatedLots);

  useEffect(() => {
    if (draftNotCreatedData.length > 0) {
      const updatedData = draftNotCreatedData.map((item, index) => {
        const {
          SR_No,
          assign_id,
          Arbitrator_id,
          Case_id,
          UPLODED_DATE,
          ...rest
        } = item;
        return {
          SrNo: index + 1,
          ...rest,
        };
      });

      console.log(updatedData);
      setReceivedData(draftNotCreatedData);
      setGetData(updatedData);
      setShowTable(true);
      //   handleStepChange(1);
    }
  }, [draftNotCreatedData]); // Watch for changes in draftNotCreatedData

  //   console.log(getData);

  //   for the getting data of selected lot to create refernce Draft starts

  const handleRowAction = async (item) => {
    console.log(item);
    setSelectedLotNo(item.Lot_no);
    setSelectedClientID(item.Client_id);
    setSelectedProductID(item.Product_id);
    setSelectedArbitratorID(item.Arb_id);
    const url = `${API_BASE_URL}/api/RefLots?Lot_no=${item.Lot_no}&Client_id=${item.Client_id}&Product_id=${item.Product_id}&Arb_id=${item.Arb_id}`;
    setLoading(true);
    try {
      await fetchData(url);
      handleStepChange(1);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  //   for the getting data of selected lot to create refernce Draft ends

  // for the generation of dearft function starts
  const handleGenerateDraft = async () => {
    setLoading(true); // Start loading before fetching data
    try {
      // Fetch the PDF file from the API
      const response = await fetch(
        `${API_BASE_URL}/api/Refletter?Lot_no=${selectedLotNo}&Client_id=${selectedClientID}&Product_id=${selectedProductID}&Arb_id=${selectedArbitratorID}`
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
      handleStepChange(2);
    } catch (error) {
      console.error("Error fetching and displaying the PDF:", error);
    } finally {
      setLoading(false);
    }
  };
  // for the generation of draft function ends

  //   function to upload the reference Drafts Starts Here
  const handleUploadDraft = async () => {
    setLoading(true);

    try {
      // First API call
      const firstResponse = await fetch(
        `${API_BASE_URL}/api/SaveRef?Lot_no=${selectedLotNo}&Client_id=${selectedClientID}&Product_id=${selectedProductID}&Arb_id=${selectedArbitratorID}`
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
        `${API_BASE_URL}/api/SaveRefCase?Lot_no=${selectedLotNo}&Client_id=${selectedClientID}&Product_id=${selectedProductID}&Arb_id=${selectedArbitratorID}`
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

  // const handleUploadDraft = async () => {
  //   setLoading(true);

  //   try {
  //     const response = await fetch(
  //       `${API_BASE_URL}/api/SaveRefCase?Lot_no=${selectedLotNo}&Client_id=${selectedClientID}&Product_id=${selectedProductID}&Arb_id=${selectedArbitratorID}`
  //     );

  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       throw new Error(
  //         `Failed to upload data: ${response.status} ${response.statusText} - ${errorText}`
  //       );
  //     }

  //     const result = await response.json(); // Process the response
  //     //   console.log(result);
  //     setClearForm(true);

  //       handleStepChange(3);
  //     //   handleStepChange(4);
  //   } catch (error) {
  //     console.error("Error uploading data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
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

  const columnsWithArbName = [
    { header: "Sr No", key: "Sr No" },
    { header: "Lots" , key: "Lots"},
    { header: "Arbitrator", key: "Arb_name" },
    { header: "Actions" , key: "action"},
  ];
  // for pagination of reusabletableFixed ends

  // For the customStepper starts Here
  const steps = [
    "Select Lot",
    "Generate Appointment Letter",
    "Upload Appointment Letter",
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

      <div className="row align-items-center">
        <div className="col-md-6">
          {!showTable ? <h5>Generate Appointment Letter</h5> : ""}
          {showTable && !showPDF && !clearForm && (
            <h5>Generate Appointment Letter</h5>
          )}
          {showPDF && !clearForm && <h5>Upload Appointment Letter</h5>}
        </div>

        {!showTable ? <div className="col-md-4"></div> : ""}
        <div className="col-md-4"> {!showTable ? "" : ""}</div>

        <div className="col-md-2">
          {showTable && !showPDF && !clearForm && (
            <button className="custBtn" onClick={handleGenerateDraft}>
              Generate
            </button>
          )}
          {showPDF && !clearForm && (
            <button className="custBtn" onClick={handleUploadDraft}>
              Upload
            </button>
          )}
        </div>
      </div>

      {!showTable && (
        <div className="row">
          <div className="col-md-12 mt-4">
            <ReusableTableFixed
              columns={columnsWithArbName}
              data={refNotCreatedLots.slice(startIndex, startIndex + 10)}
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

      {showTable && !showPDF && (
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
              message="Appointment Letter Uploaded Successfully!"
              redirectPath="/instdashboard"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferenceDraftGenerate;
