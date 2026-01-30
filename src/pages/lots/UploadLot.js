import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { API_BASE_URL } from "../../utils/constants";
import ExcelFileUpload from "../../components/ExcelFileUpload";
import ReusableTable from "../../components/ReusableTable";
import ClearForm from "../../components/Clearform";
import CustomStepper from "../../components/CustomStepper";
// import ProgressBar from "../../components/ProgressBar";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

// Product-specific components
import AxisCV from "./AxisCV";
import AxisBlPl from "./AxisPlBl";
import KotakCDR from "./KotakCDR";
import KotakCC from "./KotakCC";

const UploadLot = () => {
  // Bank & Product state
  const [banks, setBanks] = useState([]);
  const [bankId, setBankId] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProductID, setSelectedProductID] = useState(null);
  const [isDataPresent, setIsDataPresent] = useState(false);

  // Excel Data
  const [excelData, setExcelData] = useState([]);
  const [errorResponses, setErrorResponses] = useState([]);
  const [errorExcelBlob, setErrorExcelBlob] = useState(null);
  const [errorCount, setErrorCount] = useState(0);

  // UI State
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [prog, setProg] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [clearForm, setClearForm] = useState(false);
  const [verified, setVerified] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  const [validationErrors, setValidationErrors] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // 1️⃣ Fetch Banks
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/Client`);
        const result = await response.json();
        setBanks(Array.isArray(result) ? result : JSON.parse(result));
      } catch (error) {
        console.error("Error fetching banks:", error);
      }
    };
    fetchBanks();
  }, []);

  // 2️⃣ Fetch Products when bank changes
  useEffect(() => {
    if (!bankId) return;
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/products?client_id=${bankId}`
        );
        const result = await response.json();
        const parsed = Array.isArray(result) ? result : JSON.parse(result);
        setProducts(parsed);
        setSelectedProductID(parsed[0]?.Product_id || null);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [bankId]);

  // console.log(selectedProductID);
  // console.log(bankId);
  
  

  // 3️⃣ Handlers
  const handleBankChange = (e) => setBankId(e.target.value);
  const handleProductChange = (e) => setSelectedProductID(e.target.value);

  const handleFileChange = (data) => {
    const updatedData = data.map(({ SR_NO, ...rest }) => rest);
    setExcelData(updatedData);
    setTotalRecords(updatedData.length);
    setActiveStep(1);
  };

  const handleErrorFileGenerated = (errorFile) => setErrorExcelBlob(errorFile);
  const handleErrorCount = (count) => setErrorCount(count);
  const handleStepChange = (step) => setActiveStep(step);
  const handleUploadProgress = (value) => setProgress(value);

  const downloadErrorExcel = (e) => {
    e.preventDefault();
    if (!errorExcelBlob) return;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(errorExcelBlob);
    link.download = "validation_errors.xlsx";
    link.click();
    window.location.reload();
  };

  // 4️⃣ Pagination setup
  const totalPages = Math.ceil(excelData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = excelData.slice(startIndex, startIndex + rowsPerPage);

  // 5️⃣ Product component mapping
  const productComponents = {
    "1-1": AxisCV, // bankId=1, productId=1
    "1-4": AxisBlPl, // bankId=1, productId=4
    // "1-5": AxisBlPl, // bankId=1, productId=5
    "2-2": KotakCDR, // bankId=2, productId=2
    "2-3": KotakCC, // bankId=2, productId=3
  };
  const key = `${bankId}-${selectedProductID}`;
  const ProductComponent = productComponents[key];

  return (
    <div className="container">
      {/* Stepper */}
      <div className="row">
        <div className="col-md-12">
          <CustomStepper
            steps={["Select Excel", "Verify Data", "Upload Excel"]}
            activeStep={activeStep}
          />
        </div>
      </div>

      {/* Progress bar */}
      {excelData.length > 0 && showProgress && !clearForm && (
        <div className="row mt-2">
          <div className="col-md-12">
            <div className="progress-container">
              <p className="progress-text">
                {prog}/{totalRecords} records uploaded
              </p>
              <div className="progress-bar-background mt-3">
                <div
                  className="progress-bar"
                  style={{ width: `${(prog / totalRecords) * 100}%` }}
                >
                  {Math.round((prog / totalRecords) * 100)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bank & Product Selection */}
      {excelData.length === 0 && (
        <div className="row justify-content-center align-items-center mt-3">
          <div className="col-md-4">
            <Form.Select
              onChange={handleBankChange}
              className="custom_input"
              style={{ fontSize: "12px" }}
            >
              <option value="" disabled selected>
                Choose a Bank
              </option>
              {banks.map((item) => (
                <option key={item.Client_id} value={item.Client_id}>
                  {item.client_name}
                </option>
              ))}
            </Form.Select>
          </div>

          <div className="col-md-4">
            <Form.Select
              onChange={handleProductChange}
              className="custom_input"
              style={{ fontSize: "12px" }}
              value={selectedProductID}
            >
              <option value="" disabled>
                Choose a Product
              </option>
              {products.map((item) => (
                <option key={item.Product_id} value={item.Product_id}>
                  {item.Product_name}
                </option>
              ))}
            </Form.Select>
          </div>

          <div className="col-md-4">
            {ProductComponent ? (
              <ExcelFileUpload
                onFileChange={handleFileChange}
                onErrorFileGenerated={handleErrorFileGenerated}
                onErrorCount={handleErrorCount}
                bankId={bankId}
                selectedProductID={selectedProductID}
                setIsDataPresent={setIsDataPresent}
                validationErrors={validationErrors}
                setValidationErrors={setValidationErrors}
              />
            ) : (
              <p style={{ color: "red" }}>Please select a valid product</p>
            )}
          </div>
        </div>
      )}

      {/* Error handling */}
      {errorExcelBlob && (
        <div className="row">
          <div className="col-md-4 text-danger fw-bold">
            Total Errors: {errorCount}
          </div>
          <div className="col-md-4 text-danger">
            To get more details download excel
          </div>
          <div className="col-md-4">
            <a
              href="#"
              onClick={downloadErrorExcel}
              className="ps-5 custom_anchor text-danger fw-bold"
            >
              Download Error Excel Here
            </a>
          </div>
        </div>
      )}

      {/* Product specific Upload Component */}
      {ProductComponent && (
        <ProductComponent
          excelData={excelData}
          bankId={bankId}
          selectedProductID={selectedProductID}
          setVerified={setVerified}
          verified={verified}
          setShowProgress={setShowProgress}
          setProg={setProg}
          setTotalRecords={setTotalRecords}
          setClearForm={setClearForm}
          setErrorResponses={setErrorResponses}
          clearForm={clearForm}
          showProgress={showProgress}
          setActiveStep={setActiveStep}
        />
      )}
      
      {/* Table after verification */}
      {!errorResponses.length &&
        verified &&
        excelData.length > 0 &&
        !showProgress &&
        !clearForm && (
          <ReusableTable
            data={currentRows}
            currentPage={currentPage}
            pageNumbers={[...Array(totalPages)].map((_, i) => i + 1)}
            setCurrentPage={setCurrentPage}
          />
        )}

      {/* Success Message */}
      {clearForm && (
        <div className="row">
          <div className="col-md-12 d-flex justify-content-center">
            <ClearForm
              message="Data Uploaded Successfully!"
              redirectPath="/instdashboard"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadLot;
