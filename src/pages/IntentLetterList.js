import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/constants";
import ReusableTableFixed from "../components/ReusableTableFixed";
import useFetch from "../hooks/useFetch";
import ReusableTable from "../components/ReusableTable";
import LoadingSpinner from "../components/LoadingSpinner";
import ClearForm from "../components/Clearform";
import CustomStepper from "../components/CustomStepper";

const IntentLetterList = () => {
  const {
    data: draftNotCreatedData,
    loading: loading1,
    error: error1,
    fetchData,
  } = useFetch();
  const [unassignedLots, setUnassignedLots] = useState([]);
  const [intentData, setIntentData] = useState([]);
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
  const [save, setSave] = useState(false);
  const [clearForm, setClearForm] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  //   for pagination of reusable table starts
  const [getData, setGetData] = useState([]);
  const [currentPage1, setCurrentPage1] = useState(1);
  const [itemsPerPage] = useState(10);

  const totalItems1 = getData.length;
  const totalPages1 = Math.ceil(totalItems1 / itemsPerPage);
  const startIndex1 = (currentPage1 - 1) * itemsPerPage;
  const currentItems1 = getData.slice(startIndex1, startIndex1 + itemsPerPage);
  const pageNumbers1 = Array.from({ length: totalPages1 }, (_, i) => i + 1);
  //   for pagination of reusable table ends
  // console.log(currentItems1);

  // for pagination of reusabletableFixed
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(unassignedLots.length / 10);
  const displayedPages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const startIndex = (currentPage - 1) * 10;

  // for pagination of reusabletableFixed

  useEffect(() => {
    const fetchUnassignedLots = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}//api/Lots`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const parsedNotServedLots = Array.isArray(result)
          ? result
          : JSON.parse(result); // Ensure parsedArbitrators is an array
        setUnassignedLots(parsedNotServedLots);
      } catch (error) {
        // setError1(error.message);
      }
    };

    fetchUnassignedLots();
  }, []);

  console.log(unassignedLots);

  useEffect(() => {
    if (intentData.length > 0) {
      const updatedData = intentData.map((item, index) => {
        const {
          SR_No,
          assign_id,
          Arbitrator_id,
          Case_id,
          UPLODED_DATE,
          Cust_name,
          Lot_no,
          ...rest
        } = item;
        return {
          SrNo: index + 1,
          Lot_no,
          Cust_name,
          ...rest,
        };
      });

      console.log(updatedData);
      setReceivedData(intentData);
      setGetData(updatedData);
      setShowTable(true);
      //   handleStepChange(1);
    }
  }, [intentData]); // Watch for changes in draftNotCreatedData

  //   console.log(getData);

  const handleRowAction = async (item) => {
    setSelectedLotNo(item.Lot_no);
    setSelectedClientID(item.Client_id);
    setSelectedProductID(item.Product_id);
    setSelectedArbitratorID(item.Arb_id);
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/Lots?Lot_no=${item.Lot_no}&Client_id=${item.Client_id}&Product_id=${item.Product_id}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      // console.log(result);
      handleStepChange(2);
      const parsedIntentData = Array.isArray(result)
        ? result
        : JSON.parse(result); // Ensure parsedArbitrators is an array
      setIntentData(parsedIntentData);
      setLoading(false);
    } catch (error) {
      // setError1(error.message);
    }
  };

  console.log(intentData);

  //   for the getting data of selected lot to create refernce Draft ends




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

  const columnsWithoutArbName = [
    { header: "Sr No", key: "Sr No" },
    { header: "Lots", key: "Lots" },
    // { header: "Arbitrator", key: "Arb_name" },
    { header: "Actions", key: "action" },
  ];
  // for pagination of reusabletableFixed ends

  // For the customStepper starts Here
  const steps = ["Select Lot", "View Data"];

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
          {!showTable ? <h5>Intent Done List</h5> : ""}
        </div>

        {!showTable ? <div className="col-md-4"></div> : ""}
        <div className="col-md-4"> {!showTable ? "" : ""}</div>

        <div className="col-md-2"></div>
      </div>

      {!showTable && (
        <div className="row">
          <div className="col-md-12 mt-4">
            <ReusableTableFixed
              columns={columnsWithoutArbName}
              data={unassignedLots.slice(startIndex, startIndex + 10)}
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
              message="Intent Appointment Letter Uploaded Successfully!"
              redirectPath="/instdashboard"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default IntentLetterList;
