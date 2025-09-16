import React, { useState } from "react";
import CustomStepper from "../components/CustomStepper";
import { Form } from "react-bootstrap";
import * as XLSX from "xlsx";
import { API_BASE_URL } from "../utils/constants";
import LoadingSpinner from "../components/LoadingSpinner";
import ClearForm from "../components/Clearform";

const SignedSec17Order = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [verifyData, setVerifyData] = useState(false);
  const [verifiedData, setVerifiedData] = useState(false);
  const [uploadPdf, setUploadPdf] = useState(false);
  const [pageInterval, setPageInterval] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [headerError, setHeaderError] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clearForm, setClearForm] = useState(false);

  // Function to move to a specific step in Stepper Component
  const handleStepChange = (step) => {
    setActiveStep(step);
  };
  // For the customStepper ends Here

  if (loading) return <LoadingSpinner />;

  // For the customStepper starts Here
  const steps = ["Select Excel", "Select PDF", "Upload PDF"];

  const MainHeaders = [
    {
      name: "SR_NO",
      validations: [
        { type: "notEmpty", message: "SR_NO cannot be empty" },
        { type: "number", message: "SR_NO must a number" },
      ],
    },
    {
      name: "REFERENCE_NO",
      validations: [
        { type: "notEmpty", message: "REFERENCE_NO cannot be empty" },
      ],
    },
    {
      name: "CUST_NAME",
      validations: [{ type: "notEmpty", message: "CUST_NAME cannot be empty" }],
    },
    {
      name: "Sec_17_app_date",
      validations: [{ type: "notEmpty", message: "Section 17 Application Date cannot be empty" }],
    },
  ];

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Get first worksheet
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];

        // Convert worksheet to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        setExcelData(jsonData);
        setVerifyData(true); // If needed for your app logic
      };
      reader.readAsArrayBuffer(file);
    }
  };
  console.log(excelData);

  const handlePdfFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith(".pdf")) {
      setFiles(file);
    }
  };

  const handleVerify = async () => {
    if (excelData.length === 0) {
      setHeaderError("No Excel data available.");
      return;
    }
    handleStepChange(1);

    // Step 1: Check headers
    const excelHeaders = Object.keys(excelData[0]);
    const expectedHeaders = MainHeaders.map((h) => h.name);

    const areHeadersMatching =
      excelHeaders.length === expectedHeaders.length &&
      excelHeaders.every((header, index) => header === expectedHeaders[index]);

    if (!areHeadersMatching) {
      setHeaderError(
        `Excel headers must exactly match required format and order: ${expectedHeaders.join(
          ", "
        )}`
      );
      setVerifiedData(false);
      return;
    }
    // Step 2: Send each REFERENCE_NO in a POST request
    try {
      setLoading(true);

      for (const row of excelData) {
        const referenceNo = row.REFERENCE_NO;

        const response = await fetch(`${API_BASE_URL}/api/ValidateRef`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reference_no: referenceNo }),
        });

        if (!response.ok) {
          const error = await response.json();
          console.error(`Error for REFERENCE_NO ${referenceNo}:`, error);
        } else {
          const result = await response.json();
          console.log(`Success for REFERENCE_NO ${referenceNo}:`, result);
        }
      }

      setHeaderError("");
      setVerifiedData(true);
    } catch (error) {
      console.error("Network or server error:", error);
      setHeaderError("Error sending data to server.");
      setVerifiedData(false);
    } finally {
      setLoading(false); // ✅ Correct placement
    }
  };

  // console.log(headerError);

  const handlePageInterval = (e) => {
    setPageInterval(e.target.value);
    setUploadPdf(true);
    handleStepChange(2);
  };

  // console.log(pageInterval);

  const handleUpload = async () => {
    const data = excelData.map((item) => ({
      Reference_no: item.REFERENCE_NO,
      Sec_17_app_date: item.Sec_17_app_date,
    }));

    const formData = new FormData();
    handleStepChange(2);
    // ✅ Make sure file exists
    if (!files) {
      alert("Please select a PDF file first.");
      return;
    }

    formData.append("file", files); // PDF file
    formData.append("data", JSON.stringify(data)); // JSON string

    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    try {
      setLoading(true); // ✅ Start loading

      const response = await fetch(
        `${API_BASE_URL}/api/UploadSEC17?PageInterval=${pageInterval}`,
        {
          method: "POST",
          // Do NOT set Content-Type manually when using FormData
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error("Error uploading:", error);
      } else {
        const result = await response.json();
        console.log("Upload successful:", result);
      }

      setHeaderError("");
      setVerifiedData(true);
      handleStepChange(3);
      setClearForm(true);
    } catch (error) {
      console.error("Network or server error:", error);
      setHeaderError("Error sending data to server.");
      setVerifiedData(false);
    } finally {
      setLoading(false); // ✅ Always stop loading
    }
  };

  // const handleUpload = async () => {
  //   const data = excelData.map((item) => ({
  //     Reference_no: item.REFERENCE_NO,
  //   }));

  //   // console.log(data);
  //   // console.log(files);

  //   const formData = new FormData();

  //   // Append your file
  //   formData.append("file", files);

  //   formData.append("data", JSON.stringify(data));

  //   for (let pair of formData.entries()) {
  //     console.log(`${pair[0]}:`, pair[1]);
  //   }

  //   try {
  //     const response = await fetch(
  //       `${API_BASE_URL}/api/UploadSOC?PageInterval=2`,
  //       {
  //         method: "POST",
  //         // headers: {
  //         //   "Content-Type": "multipart/form-data",
  //         // },
  //         body: formData,
  //       }
  //     );
  //     if (!response.ok) {
  //       const error = await response.json();
  //       console.error(`Error for REFERENCE_NO :`, error);
  //     } else {
  //       const result = await response.json();
  //       console.log(`Success for REFERENCE_NO :`, result);
  //     }

  //     // If all succeeded or completed
  //     setHeaderError("");
  //     setVerifiedData(true);
  //   } catch (error) {
  //     console.error("Network or server error:", error);
  //     setHeaderError("Error sending data to server.");
  //     setVerifiedData(false);
  //   }
  // };

  return (
    <div className="container">
      <div className="row mb-3">
        <div className="col-md-12">
          <CustomStepper steps={steps} activeStep={activeStep} />
        </div>
      </div>
      {!verifiedData && (
        <div className="row">
          <div className="col-md-2 pt-2" style={{ fontSize: "15px" }}>
            <label>Select Excel File</label>
          </div>
          <div className="col-md-4">
            <Form.Group>
              <Form.Control
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                className="custom_input"
                style={{ fontSize: "12px" }}
              />
            </Form.Group>
          </div>
          <div className="col-md-2">
            {verifyData && (
              <button className="custBtn" onClick={handleVerify}>
                Verify
              </button>
            )}
          </div>
          <div className="col-md-4"></div>
        </div>
      )}

      {verifiedData && !clearForm && (
        <div className="row">
          <div className="col-md-2 pt-2" style={{ fontSize: "15px" }}>
            <label>Select PDF File</label>
          </div>
          <div className="col-md-4">
            <Form.Group>
              <Form.Control
                type="file"
                accept=".pdf"
                onChange={handlePdfFileUpload}
                className="custom_input"
                style={{ fontSize: "12px" }}
              />
            </Form.Group>
          </div>
          <div className="col-md-4">
            <Form.Control
              type="number"
              className="custom_input"
              placeholder="Enter Page Interval"
              onChange={handlePageInterval}
              value={pageInterval}
              style={{ fontSize: "12px" }}
            />
          </div>
          <div className="col-md-2">
            {uploadPdf && (
              <button className="custBtn" onClick={handleUpload}>
                Upload
              </button>
            )}
          </div>
        </div>
      )}

      {clearForm && (
        <div className="row">
          <div className="col-md-12 d-flex justify-content-center ">
            <ClearForm
              message="SOC Uploaded Sucessfully!"
              redirectPath="/lawyerdashboard"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SignedSec17Order;





