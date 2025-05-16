import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/constants";
import ReusableTableFixed from "../components/ReusableTableFixed";
import useFetch from "../hooks/useFetch";
import CustomStepper from "../components/CustomStepper";
import ReusableTable from "../components/ReusableTable";
import LoadingSpinner from "../components/LoadingSpinner";
import DatePicker from "react-datepicker";
import { useAuth } from "../components/AuthProvider";

const Section17Order = () => {
  const [sec17OrderNotCreatedLots, setSec17OrderNotCreatedLots] = useState([]);
  const [sec17OrderNotCreatedData, setSec17OrderNotCreatedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLotNo, setSelectedLotNo] = useState([]);
  const [selectedClientID, setSelectedClientID] = useState([]);
  const [selectedProductID, setSelectedProductID] = useState([]);
  const [selectedArbitratorID, setSelectedArbitratorID] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [theDate, setTheDate] = useState([]);
  const {
    data: Sec17OrderNotCreatedData,
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
  const { user, logout } = useAuth();
  const [arbId, setArbId] = useState(null);
  const [receivedData, setReceivedData] = useState([]);
  const [getData, setGetData] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const rowsPerPage = 10;
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    // console.log(user);
    setArbId(user[0].Ref_id);
  }, [user]);

  console.log(arbId);

  useEffect(() => {
    const fetchSec17OrderNotCreatedLots = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/pendingSec17Order?Arb_id=${arbId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const parsedNotServedLots = Array.isArray(result)
          ? result
          : JSON.parse(result);
        setSec17OrderNotCreatedLots(parsedNotServedLots);
      } catch (error) {
        // Optional: setError1(error.message);
        console.error("Error fetching Sec17 Order Not Created Lots:", error);
      } finally {
        setLoading(false);
      }
    };

    if (arbId !== null && arbId !== undefined) {
      fetchSec17OrderNotCreatedLots();
    }
  }, [arbId]);

  // console.log(sec17OrderNotCreatedLots);

  const searchFields = ["Arb_name", "Lots"];

  const filteredLots = sec17OrderNotCreatedLots.filter((item) =>
    searchFields.some((key) =>
      item[key]?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredLots.slice(indexOfFirstRow, indexOfLastRow);

  useEffect(() => {
    if (sec17OrderNotCreatedLots.length > 0) {
      const updatedData = sec17OrderNotCreatedLots.map((item, index) => {
        const {
          SR_No,
          assign_id,
          Arbitrator_id,
          Case_id,
          UPLODED_DATE,
          ...rest
        } = item;
        return {
          // SrNo: index + 1,
          ...rest,
        };
      });

      console.log(updatedData);
      setReceivedData(sec17OrderNotCreatedLots);
      setGetData(updatedData);
      setShowTable(true);
      //   handleStepChange(1);
    }
  }, [sec17OrderNotCreatedLots]); // Watch for changes in draftNotCreatedData

  // for reusableTable Fixed starts
  const columns = [
    { header: "Sr No" },
    { header: "Lots" },
    { header: "Arbitrator" },
    { header: "Actions" },
  ];
  // for pagination of reusabletableFixed
  const totalPages = Math.ceil(setSec17OrderNotCreatedLots.length / 10); // Example calculation
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
  const steps = [
    "Select Lot",
    "Save Section 17 Order",
    "Generate Section 17 Order",
    "Upload Section 17 Order",
  ];

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
      // const url = `${API_BASE_URL}/api/Sec17appletter?Lot_no=${item.Lot_no}&Client_id=${item.Client_id}&Product_id=${item.Product_id}`;
      setLoading(true);
      handleStepChange(1);
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/pendingSec17Order?Lot_no=${item.Lot_no}&Client_id=${item.Client_id}&Product_id=${item.Product_id}&Arb_id=${item.Arb_id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const parsedNotSec17Lots = Array.isArray(result)
          ? result
          : JSON.parse(result); // Ensure parsedArbitrators is an array
        setSec17OrderNotCreatedData(parsedNotSec17Lots);
        setLoading(false);
        setShowData(true);
      } catch (error) {
        // setError1(error.message);
      }
    };
  
    // console.log(sec17OrderNotCreatedData);
  

  //   for pagination of reusable table starts
  const [currentPage1, setCurrentPage1] = useState(1); // Current page for ReusableTable
  const [itemsPerPage] = useState(10); // Number of items per page
  const totalItems1 = sec17OrderNotCreatedData.length;
  const totalPages1 = Math.ceil(totalItems1 / itemsPerPage);
  const startIndex1 = (currentPage1 - 1) * itemsPerPage;
  const currentItems1 = sec17OrderNotCreatedData.slice(
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
  const handleSaveSec17Order = async () => {
    console.log(sec17OrderNotCreatedData);
    const dataToGenerateSOC = sec17OrderNotCreatedData.map((item) => ({
      Case_id: item.Case_id,
      Sec_17_order_date: theDate,
    }));
    console.log(dataToGenerateSOC);
    handleStepChange(2);
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/Sec17OrderSave`, {
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
  const handleGenerateSec17Order = async () => {
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

  const handleUploadSec17Order = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/SaveRefCase?Lot_no=${selectedLotNo}&Client_id=${selectedClientID}&Product_id=${selectedProductID}&Arb_id=${selectedArbitratorID}`
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
      handleStepChange(3);
      //   handleStepChange(4);
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

      {/* <div className="row">
        <div className="col-md-6">
          {!Sec17OrderNotCreatedData.length > 0 && !showData && <h5> Select Lot </h5>}
        </div>
        <div className="col-md-4"></div>
        <div className="col-md-2"></div>
      </div> */}

      {!showData && (
        // <div className="row">
        //   <div className="col-md-12 mt-3">
        //     <ReusableTableFixed
        //       columns={columns}
        //       data={sec17OrderNotCreatedLots.slice(startIndex, startIndex + 10)}
        //       currentPage={currentPage}
        //       totalPages={totalPages}
        //       displayedPages={displayedPages}
        //       handlePrevious={handlePrevious}
        //       handleNext={handleNext}
        //       setCurrentPage={setCurrentPage}
        //       handleRowAction={handleRowAction}
        //       startIndex={startIndex}
        //     />
        //   </div>
        // </div>
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

                  {/* <th scope="col" className="text-center">
                    Assigned Date
                  </th> */}

                  <th scope="col" className="text-center">
                    Lots
                  </th>
                  <th scope="col" className="text-center">
                    Arbitrator Name
                  </th>
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
                      {/* <td className="text-center">
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
                      </td> */}
                      <td className="text-center">{item.Lots}</td>
                      <td className="text-center">{item.Arb_name}</td>
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
              <button className="custBtn" onClick={handleSaveSec17Order}>
                Save
              </button>
            )}
            {save && !showPDF && (
              <button className="custBtn" onClick={handleGenerateSec17Order}>
                Generate
              </button>
            )}
            {showPDF && (
              <button className="custBtn" onClick={handleGenerateSec17Order}>
                Upload
              </button>
            )}
          </div>
        </div>
      )}

      {showData && (
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
    </div>
  );
};

export default Section17Order;
