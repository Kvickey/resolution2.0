import React, { useState } from "react";
import CustomStepper from "../../components/CustomStepper";
import { Form } from "react-bootstrap";
import * as XLSX from "xlsx";
import { API_BASE_URL } from "../../utils/constants";
import LoadingSpinner from "../../components/LoadingSpinner";
import ClearForm from "../../components/Clearform";
import { formatDate } from "../../utils/FormatDate";
import { saveAs } from "file-saver";

const Sect17Application = () => {
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

  const downloadErrorExcel = (errorRows) => {
    if (!errorRows || errorRows.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(errorRows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Errors");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `Reference_Validation_Errors_${Date.now()}.xlsx`);
  };

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
      validations: [
        {
          type: "notEmpty",
          message: "Section 17 Application Date cannot be empty",
        },
      ],
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

    // ✅ Header validation
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

    setLoading(true);
    setHeaderError("");
    setVerifiedData(false);

    const errorRows = []; // 🔥 Collect errors

    try {
      for (const row of excelData) {
        const referenceNo = String(row.REFERENCE_NO || "").trim();

        try {
          const response = await fetch(`${API_BASE_URL}/api/ValidateSec17App`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ Reference_no: referenceNo }),
          });

          if (!response.ok) {
            let errorMsg = "Unknown server error";

            try {
              const error = await response.json();
              errorMsg = error?.message || JSON.stringify(error);
            } catch (_) {}

            errorRows.push({
              REFERENCE_NO: referenceNo,
              ERROR_MESSAGE: errorMsg,
              STATUS_CODE: response.status,
            });
          }
        } catch (networkError) {
          errorRows.push({
            REFERENCE_NO: referenceNo,
            ERROR_MESSAGE: "Network / Server not reachable",
            STATUS_CODE: "NETWORK_ERROR",
          });
        }
      }

      // ✅ Final decision
      if (errorRows.length > 0) {
        downloadErrorExcel(errorRows); // 🔥 Auto-download
        setHeaderError(
          "Some references failed validation. Error file downloaded."
        );
        setVerifiedData(false);
      } else {
        setVerifiedData(true);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setHeaderError("Unexpected error during verification.");
      setVerifiedData(false);
    } finally {
      setLoading(false);
    }
  };


  const handlePageInterval = (e) => {
    setPageInterval(e.target.value);
    setUploadPdf(true);
    handleStepChange(2);
  };

  // console.log(pageInterval);

  function convertExcelDate(serial) {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);
    return new Date(
      date_info.getFullYear(),
      date_info.getMonth(),
      date_info.getDate()
    );
  }

  
  const handleUpload = async () => {
    console.log(excelData);

    // const data = excelData.map((item) => ({
    //   Reference_no: item.REFERENCE_NO,
    //   Sec_17_app_date: item.Sec_17_app_date
    //     ? formatDate(convertExcelDate(item.Sec_17_app_date))
    //     : null, // ✅ IMPORTANT: send null instead of ""
    // }));

    const data = excelData.map((item) => {
      console.log("Original date:", item.Sec_17_app_date);

      // const converted = convertExcelDate(item.Sec_17_app_date);
      // console.log("Converted:", converted);

      // const formatted = formatDate(converted);
      // console.log("Formatted:", formatted);

      return {
        Reference_no: item.REFERENCE_NO,
        Sec_17_app_date: item.Sec_17_app_date,
      };
    });

    console.log(data);

    const formData = new FormData();

    if (!files) {
      alert("Please select a PDF file first.");
      return;
    }

    formData.append("file", files);
    formData.append("data", JSON.stringify(data));

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/UploadSEC17?PageInterval=${pageInterval}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error uploading:", errorText);
        setHeaderError("Upload failed. Please try again.");
        return; // ✅ STOP HERE
      }

      const result = await response.json();
      console.log("Upload successful:", result);

      // ✅ Move forward ONLY on success
      setHeaderError("");
      handleStepChange(3);
      setClearForm(true);
    } catch (error) {
      console.error("Network or server error:", error);
      setHeaderError("Error sending data to server.");
    } finally {
      setLoading(false);
    }
  };

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
              message="Section 17 Application Uploaded Sucessfully!"
              redirectPath="/lawyerdashboard"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Sect17Application;
