import React, { useState } from "react";
import CustomStepper from "../components/CustomStepper";
import { Form } from "react-bootstrap";

const SOC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [verifyData, setVerifyData] = useState(false);
  const [verifiedData, setVerifiedData] = useState(false);
  const [uploadPdf, setUploadPdf] = useState(false);
  const [pageInterval, setPageInterval] = useState(null);

  // Function to move to a specific step in Stepper Component
  const handleStepChange = (step) => {
    setActiveStep(step);
  };
  // For the customStepper ends Here

  // For the customStepper starts Here
  const steps = ["Select Excel", "Select PDF", "Upload PDF"];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
      setVerifyData(true);
    }
  };

  const handlePdfFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith(".pdf")) {
      setVerifyData(true);
    }
  };

  const handleVerify = () => {
    setVerifiedData(true);
  };

  const handlePageInterval = (e) =>{
    setPageInterval(e.target.value);
    setUploadPdf(true);
  }

  const handleUpload = () => {}

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
                onChange={handleFileUpload}
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

      {verifiedData && (
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
              style={{fontSize:"12px7"}}
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
    </div>
  );
};

export default SOC;
