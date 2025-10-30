import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import * as XLSX from "xlsx";
import { API_BASE_URL } from "../../utils/constants";
import { useAuth } from "../../components/AuthProvider";
import ClearForm from "../../components/Clearform";
import ReusableTable from "../../components/ReusableTable";
import LoadingSpinner from "../../components/LoadingSpinner";

const GenerateAward = () => {
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [excelData, setExcelData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [verifiedData, setVerifiedData] = useState(false);
  const [errorExcel, setErrorExcel] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [save, setSave] = useState(false);
  const [showPDF, setShowPDF] = useState(false);
  const [upload, setUpload] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedLotNo, setSelectedLotNo] = useState([]);
  const [selectedClientID, setSelectedClientID] = useState([]);
  const [selectedProductID, setSelectedProductID] = useState([]);
  const { user, logout } = useAuth();
  const [arbId, setArbId] = useState("");
  const [clearForm, setClearForm] = useState(false);

  const itemsPerPage = 10; // change as needed

  // State for pagination
  const [currentPage1, setCurrentPage1] = useState(1);

  // Calculate indexes
  const indexOfLastItem = currentPage1 * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // ✅ Paginated extracted data from Excel Data
  const currentItems1 = excelData.slice(indexOfFirstItem, indexOfLastItem);

  // ✅ Page numbers based on total data length
  const pageNumbers1 = [];
  for (let i = 1; i <= Math.ceil(excelData.length / itemsPerPage); i++) {
    pageNumbers1.push(i);
  }

  useEffect(() => {
    // console.log(user);
    setArbId(user[0].Ref_id);
  }, [user]);

  // console.log(arbId);

  // For the customStepper starts Here
  const steps = [
    "Select Lot",
    "Select Zoom Meeting",
    "Save Acceptance",
    "Generate Acceptance",
    "Upload Acceptance",
  ];

  // Function to move to a specific step in Stepper Component
  const handleStepChange = (step) => {
    setActiveStep(step);
  };
  // For the customStepper ends Here

  const requiredColumns = [
    "first_Hearing_Traking_report",
    "second_Hearing_Traking_report",
    "third_Hearing_Traking_report",
    "Exparty",
    "Evidence",
    "Argument",
    "Award_Date",
    "Award_full_date",
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setError("");
    setFileName("");

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // ✅ Convert sheet to JSON (first row = headers)
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      if (jsonData.length === 0) {
        setError("Error: Excel file is empty.");
        return;
      }

      // ✅ Extract headers from the first row
      const headers = Object.keys(jsonData[0]);

      // ✅ Check if all required columns exist
      const missingColumns = requiredColumns.filter(
        (col) => !headers.includes(col)
      );

      if (missingColumns.length > 0) {
        setError(
          `Error: Missing required columns - ${missingColumns.join(", ")}`
        );
        setExcelData([]);
        return;
      }

      // ✅ Check for empty values in required columns
      const emptyCells = [];

      jsonData.forEach((row, rowIndex) => {
        requiredColumns.forEach((col) => {
          if (row[col] === "" || row[col] === null || row[col] === undefined) {
            emptyCells.push(`Row ${rowIndex + 2} - ${col}`); // +2 because Excel headers start at row 1
          }
        });
      });

      if (emptyCells.length > 0) {
        setError(
          `Error: The following required cells are empty:\n${emptyCells.join(
            "\n"
          )}`
        );
        setExcelData([]);
        return;
      }

      // ✅ If everything is valid
      setExcelData(jsonData);
      setFileName(file.name);
      setError("");
      alert("✅ File validated successfully!");
    };

    reader.readAsArrayBuffer(file);
  };

  // console.log(excelData);

  if (loading) return <LoadingSpinner />;



  const handleVerify = async () => {
    try {
      setLoading(true);
  
      let errorRows = [];
      let allSuccess = true;
  
      for (const row of excelData) {
        const referenceNo = row.REFERENCE_NO;
  
        const response = await fetch(`${API_BASE_URL}/api/ValidateExcel`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Reference_no: referenceNo }),
        });
  
        if (!response.ok) {
          allSuccess = false;
  
          let errorText = "";
          try {
            const err = await response.json();
            errorText = err.message || JSON.stringify(err);
          } catch {
            errorText = "Unknown error";
          }
  
          errorRows.push({
            REFERENCE_NO: referenceNo,
            ERROR_MESSAGE: errorText,
          });
  
        } else {
          const result = await response.json();
          row.Lot_no = result[0].Lot_no;
          row.Client_id = result[0].Client_id;
          row.Product_id = result[0].Product_id;
        }
      }
  
      if (!allSuccess) {
        const ws = XLSX.utils.json_to_sheet(errorRows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Errors");
  
        XLSX.writeFile(wb, "ValidationErrors.xlsx");
  
        setVerifiedData(false);
        setErrorExcel(true);
        alert("Validation completed with errors. Error Excel downloaded ✅");
      } else {
        setVerifiedData(true);
        alert("All Reference Numbers Verified Successfully ✅");
      }
  
    } catch (error) {
      console.error("Network / Server Issue:", error);
      setVerifiedData(false);
    } finally {
      setLoading(false);
    }
  };
  

  // const handleVerify = async () => {
  //   try {
  //     setLoading(true);

  //     for (const row of excelData) {
  //       const referenceNo = row.REFERENCE_NO;
  //       // console.log(referenceNo);
  //       // console.log(row);

  //       const response = await fetch(`${API_BASE_URL}/api/ValidateExcel`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ Reference_no: referenceNo }),
  //       });

  //       if (!response.ok) {
  //         const error = await response.json();
  //         console.error(`Error for REFERENCE_NO ${referenceNo}:`, error);
  //       } else {
  //         const result = await response.json();
  //         // console.log(result);
  //         setSelectedLotNo(result[0].Lot_no);
  //         setSelectedClientID(result[0].Client_id);
  //         setSelectedProductID(result[0].Product_id);
  //         // console.log(`Success for REFERENCE_NO ${referenceNo}:`, result);
  //       }
  //     }

  //     //  setHeaderError("");
  //     setVerifiedData(true);
  //   } catch (error) {
  //     console.error("Network or server error:", error);
  //     //  setHeaderError("Error sending data to server.");
  //     //  setVerifiedData(false);
  //   } finally {
  //     setLoading(false); // ✅ Correct placement
  //   }
  // };

  // console.log(selectedLotNo);
  // console.log(selectedClientID);
  // console.log(selectedProductID);

  const handleSave = async () => {
    try {
      setLoading(true);
      for (const row of excelData) {
        const referenceNo = row.REFERENCE_NO;
        console.log(referenceNo);
        console.log(row);

        const DataToSend = {
          Reference_no: row.REFERENCE_NO,
          Award_date: row.Award_Date,
          Award_full_date: row.Award_full_date,
          M_1st_Hearing_Traking_report: row.first_Hearing_Traking_report,
          M_2nd_Hearing_Traking_report: row.second_Hearing_Traking_report,
          M_3rd_Hearing_Traking_report: row.third_Hearing_Traking_report,
          Exparty: row.Exparty,
          Evidence: row.Evidence,
          Argument: row.Argument,
        };

        console.log(DataToSend);

        const response = await fetch(`${API_BASE_URL}/api/AwardData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(DataToSend),
        });

        if (!response.ok) {
          const error = await response.json();
          console.error(`Error for REFERENCE_NO ${referenceNo}:`, error);
        } else {
          const result = await response.json();
          // console.log(result);
          console.log(`Success for REFERENCE_NO ${referenceNo}:`, result);
          setSave(true);
        }
      }

      //  setHeaderError("");
      // setVerifiedData(true);
    } catch (error) {
      console.error("Network or server error:", error);
      //  setHeaderError("Error sending data to server.");
      //  setVerifiedData(false);
    } finally {
      setLoading(false); // ✅ Correct placement
    }
  };

  // for the generation of dearft function starts
  const handleGenerateAward = async () => {
    setLoading(true); // Start loading before fetching data
    try {
      // Fetch the PDF file from the API
      const response = await fetch(
        `${API_BASE_URL}/api/Awardletter?Lot_no=${selectedLotNo}&Client_id=${selectedClientID}&Product_id=${selectedProductID}&Arb_id=${arbId}`
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

  const handleUploadAward = async () => {
    setLoading(true); // Start loading before fetching data
    try {
      // Fetch the PDF file from the API
      const response = await fetch(
        `${API_BASE_URL}/api/SaveAwardCase?Lot_no=${selectedLotNo}&Client_id=${selectedClientID}&Product_id=${selectedProductID}&Arb_id=${arbId}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setClearForm(true);
    } catch (error) {
      console.error("Error in Uploading PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row align-items-center ">
        <div className="col-md-5">
          {/* {showTable && !showData && !showPDF && !clearForm && (
            <h5>Generate Acceptance Letter</h5>
          )}
          {showPDF && !clearForm && <h5>Upload Acceptance Letter</h5>} */}
          {!fileName && !verifiedData && (
            <div className="row">
              <h4>Generate Award</h4>
            </div>
          )}
          {showPDF && !clearForm && <h5>Upload Acceptance Letter</h5>}
        </div>

        <div className="col-md-5"></div>

        <div className="col-md-2">
          {fileName && !verifiedData && (
            <button
              className="custBtn"
              style={{ fontSize: "12px" }}
              onClick={handleVerify}
            >
              Verify
            </button>
          )}

          {verifiedData && !save && (
            <button className="custBtn" onClick={handleSave}>
              Save Award
            </button>
          )}

          {verifiedData && save && !showPDF && (
            <button className="custBtn" onClick={handleGenerateAward}>
              Generate Award
            </button>
          )}

          {showPDF && !clearForm && (
            <button className="custBtn" onClick={handleUploadAward}>
              Upload
            </button>
          )}
        </div>
      </div>

      {!fileName && !verifiedData && (
        <div className="row pt-2">
          <div className="col-md-3">
            <Form.Group>
              <Form.Control
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                className="custom-input"
                style={{ fontSize: "12px" }}
              />
            </Form.Group>
          </div>
          <div className="col-md-2">
            {/* {fileName && (
              <button
                className="custBtn"
                style={{ fontSize: "12px" }}
                onClick={handleVerify}
              >
                Verify
              </button>
            )} */}
          </div>
          <div className="col-md-5">
            {error && (
              <div
                style={{
                  color: "red",
                  background: "#ffe6e6",
                  padding: "10px",
                  borderRadius: "5px",
                }}
              >
                {error}
              </div>
            )}
          </div>
        </div>
      )}

      {fileName && !verifiedData && !save && !errorExcel && (
        <ReusableTable
          data={currentItems1}
          currentPage={currentPage1}
          pageNumbers={pageNumbers1}
          setCurrentPage={setCurrentPage1}
        />
      )}

      {verifiedData && !save && (
        <ReusableTable
          data={currentItems1}
          currentPage={currentPage1}
          pageNumbers={pageNumbers1}
          setCurrentPage={setCurrentPage1}
        />
      )}

      {verifiedData && save && !showPDF && (
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


      {errorExcel && (
        <div className="row">
          <div className="col-md-12 d-flex justify-content-center ">
            <ClearForm
              message="Error In the File Uploaded Successfully!"
              redirectPath="/arbdashboard"
            />
          </div>
        </div>
      )}


      {clearForm && (
        <div className="row">
          <div className="col-md-12 d-flex justify-content-center ">
            <ClearForm
              message="Award Letter Uploaded Successfully!"
              redirectPath="/arbdashboard"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateAward;
