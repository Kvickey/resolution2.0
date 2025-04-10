import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { API_BASE_URL } from "../utils/constants";
import ExcelFileUpload from "../components/ExcelFileUpload";
import ReusableTable from "../components/ReusableTable";
import "../pages/UploadExcel.css";
import ExcelDataUploader from "../components/ExcelDataUploader";
import ClearForm from "../components/Clearform";
import LoadingSpinner from "../components/LoadingSpinner";
import CustomStepper from "../components/CustomStepper";
import ProgressBar from "../components/ProgressBar";

const UploadExcel = () => {
  const [bank, setBank] = useState([]);
  const [bankId, setBankId] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [selectedProductID, setSelectedProductID] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shouldUpload, setShouldUpload] = useState(false);
  const [error, setError] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10; // Set to 10 records per page
  const [errorCount, setErrorCount] = useState(0);
  const [errorExcelBlob, setErrorExcelBlob] = useState(null);
  const [clearForm, setClearForm] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [prog, setProg] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [uploadStatus, setUploadStatus] = useState({ success: 0, failed: 0 });

  // To fetch Banks Data
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/Client`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const parsedBank = Array.isArray(result) ? result : JSON.parse(result);
        setBank(parsedBank);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchClient();
  }, []);

  console.log(bankId);
  console.log(selectedProductID);

  const handleBankChange = (e) => {
    const selectedID = e.target.value;
    setBankId(selectedID);
  };

  useEffect(() => {
    const fetchData = async () => {
      // setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/products?client_id=${bankId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        const products = Array.isArray(result) ? result : JSON.parse(result);
        // console.log(products);
        setSelectedProduct(products); // Set products data
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bankId]);

  const handleProductChange = (e) => {
    const selectedID = e.target.value;
    setSelectedProductID(selectedID);
  };

  // For the customStepper starts Here

  const steps = ["Select Excel", "Upload Excel"];

  // Function to move to a specific step in Stepper Component
  const handleStepChange = (step) => {
    setActiveStep(step);
  };
  // For the customStepper ends Here

  // For progress Bar handling STarts here
  const handleUploadProgress = (progressValue) => {
    setProgress(progressValue);
  };
  // For progress Bar handling ends here

  const handleFileUpload = () => {};

  const handleFileChange = (data) => {
    const updatedData = data.map((item, index) => {
      const { SR_NO, ...rest } = item;
      return {
        SrNo: index + 1,
        ...rest,
      };
    });
    setExcelData(updatedData);
    setTotalRecords(excelData.length);
    handleStepChange(1);
  };
  // console.log(excelData);

  const handleErrorFileGenerated = (errorFile) => {
    // Store the error Excel Blob in state
    setErrorExcelBlob(errorFile);
  };

  const handleErrorCount = (count) => {
    // Handle the error count as needed, e.g., updating state
    setErrorCount(count);
  };

  // console.log(errorCount);

  const downloadErrorExcel = (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    if (errorExcelBlob) {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(errorExcelBlob);
      link.download = "validation_errors.xlsx";
      link.click();
      window.location.reload();
    }
  };

  const handleUpload = () => {
    setShouldUpload(true); // Trigger the upload process
  };

  // if (loading) return <LoadingSpinner />;

  // For Pagination

  // Calculate the total number of pages
  const totalPages = Math.ceil(excelData.length / rowsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Calculate the starting and ending index of the rows for the current page
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = excelData.slice(startIndex, startIndex + rowsPerPage);

  // console.log(currentRows);
  // const h1 = currentRows[0];
  // console.log(h1);

  // Pagination logic for showing only 5 buttons at a time
  const maxPagesToShow = 5;
  const startPage = Math.max(
    1,
    Math.min(
      currentPage - Math.floor(maxPagesToShow / 2),
      totalPages - maxPagesToShow + 1
    )
  );
  const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);
  const displayedPages = pageNumbers.slice(startPage - 1, endPage);

  // Handlers for pagination
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

  const handleFormClear = () => {
    setClearForm(true); // Set a flag to clear the form
    console.log("Form cleared!");
  };

  // For Excel Upload Starts here
  // Create a record object for the API
  const createRecordObject = (row, borrowerArray, kotakCdrArray) => {
    console.log(row);
    console.log(borrowerArray);
    console.log(bankId);
    // Common properties for both branchId "1" and "2"
    const commonData = {
      Lot_no: row.Lot_No,
      Acc_no: row.ACC_NO,
      Reference_no: row.REFERENCE_NO,
      Cust_id: row.CUST_ID,
      Client_id: bankId,
      Product_id: selectedProductID,
      LRN_Date: row.LRN_date,
      LRN_ref_no: row.LRN_REFERENCE_NO,
      Uploaded_by: "Admin",
      Borrower: borrowerArray,
    };

    if (bankId === "1") {
      return {
        ...commonData,
        Axis_cv: {
          Product: row.PRODUCT,
          Registration_no: row.REGISTRATION_NO,
          Engine_no: row.ENGINE_NUMBER,
          Chessi_no: row.CHASSIS_NUMBER,
          Model_1: row.MODEL1,
          Model_2: row.MODEL2,
          Manufacture: row.MANUFACTURER,
          Dealer: row.DEALER,
          Interest_rate: row.INTEREST_RATE,
          Disburstment_amt: row.DISBURSEMENT_AMOUNT,
          Disbustment_amt_in_word: row.DISB_AMOUNT_IN_WORDS,
          Disburstmet_date: row.DISBURSEMENT_DATE,
          Tenure: row.TENURE,
          EMI_amount: row.EMI_AMT,
          Emi_start_date: row.EMI_START_DATE,
          Foreclosure_amt: row.FORCLOSER_AMT_ROUNDUP,
          Foreclosure_amt_in_word: row.FORCLOSER_AMT_IN_WORDS,
          Loan_start_date: row.LOAN_START_DATE,
          Work_final_city: row.WORK_FINAL_CITY,
          Branch_RAC_name: row.BRANCH_RAC_NAME,
          Final_city: row.FINAL_CITY,
          State: row.STATE,
        },
      };
    } else if (bankId === "2") {
      return {
        ...commonData,
        Kotak_cdr:
          kotakCdrArray.length > 0
            ? [kotakCdrArray[kotakCdrArray.length - 1]]
            : [],
        // Kotak_cdr: [
        //   {
        //     Loan_Acc_no: row.Loan_Acc_No,
        //     Product: row.Product,
        //     Aggrement_date: row.Aggrement_Date,
        //     Aggrement_value: row.Aggrement_Value,
        //     Total_Value: row.Total_Aggrement_Value,
        //     Download_date: row.Download_date,
        //     FR_amount: row.FR_Amount,
        //     Total_outstading_amount: row.Total_Outstanding_Amount,
        //     CM_Name: row.COLLECTION_MANAGER_NAME,
        //     CM_Email_id: row.Collection_Manager_Email_Id,
        //     CM_No: row.COLLECTION_MANAGER_NO,
        //   },
        // ],
      };
    }
  };

  // console.log(createRecordObject);
  // console.log(bankId);

  //   const createRecordObject = (row, borrowerArray,branchId) => {
  //     return {
  //       Lot_no: row.Lot_No,
  //       Acc_no: row.ACC_NO,
  //       Reference_no: row.REFERENCE_NO,
  //       Cust_id: row.CUST_ID,
  //       Client_id: bankId,
  //       Product_id: selectedProductID,
  //       LRN_Date: row.LRN_date,
  //       LRN_ref_no: row.LRN_REFERENCE_NO,
  //       Uploaded_by: "Admin",
  //       Axis_cv: {
  //         Product: row.PRODUCT,
  //         Registration_no: row.REGISTRATION_NO,
  //         Engine_no: row.ENGINE_NUMBER,
  //         Chessi_no: row.CHASSIS_NUMBER,
  //         Model_1: row.MODEL1,
  //         Model_2: row.MODEL2,
  //         Manufacture: row.MANUFACTURER,
  //         Dealer: row.DEALER,
  //         Interest_rate: row.INTEREST_RATE,
  //         Disburstment_amt: row.DISBURSEMENT_AMOUNT,
  //         Disbustment_amt_in_word: row.DISB_AMOUNT_IN_WORDS,
  //         Disburstmet_date: row.DISBURSEMENT_DATE,
  //         Tenure: row.TENURE,
  //         EMI_amount: row.EMI_AMT,
  //         Emi_start_date: row.EMI_START_DATE,
  //         Foreclosure_amt: row.FORCLOSER_AMT_ROUNDUP,
  //         Foreclosure_amt_in_word: row.FORCLOSER_AMT_IN_WORDS,
  //         Loan_start_date: row.LOAN_START_DATE,
  //         Work_final_city: row.WORK_FINAL_CITY,
  //         Branch_RAC_name: row.BRANCH_RAC_NAME,
  //         Final_city: row.FINAL_CITY,
  //         State: row.STATE,
  //       },
  //       Borrower: borrowerArray,
  //     };
  //   };

  const sendRowData = async (rowData) => {
    console.log(rowData);
    try {
      const response = await fetch(`${API_BASE_URL}/api/UploadData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rowData),
      });
      return response.ok;
    } catch (error) {
      console.error("Error sending data:", error);
      return false;
    }
  };

  // console.log(prog);

  // setTotalRecords(excelData.length) ;

  // const handleDataUpload = async () => {
  //   setShowProgress(true);

  //   handleStepChange(2);
  //   let prevAcc = null;
  //   let borrowerArray = [];
  //   let success = 0,
  //     failed = 0;

  //   for (let i = 0; i < excelData.length; i++) {
  //     const row = excelData[i];
  //     const totalRecord = excelData.length;
  //     setTotalRecords(excelData.length);
  //     setProgress(Math.round(((i + 1) / totalRecords) * 100));

  //     if (row.ACC_NO !== prevAcc) {
  //       if (borrowerArray.length > 0) {
  //         const record = createRecordObject(excelData[i - 1], borrowerArray);
  //         const isSuccess = await sendRowData(record);
  //         setProg((prevProg) => prevProg + 1);
  //         isSuccess ? success++ : failed++;
  //       }
  //       borrowerArray = [];
  //       prevAcc = row.ACC_NO;

  //       borrowerArray.push({
  //         Type: "B",
  //         Cust_name: row.CUST_NAME,
  //         Mobile_no: row.Mobile_no,
  //         Work_mobile_no: row.WORK_MOBILE_2,
  //         Email_id: row.E_MAIL_ID,
  //         Comm_add: row.Communication_address,
  //       });
  //     } else {
  //       borrowerArray.push({
  //         Type: "C",
  //         Cust_name: row.CUST_NAME,
  //         Mobile_no: row.Mobile_no,
  //         Work_mobile_no: row.WORK_MOBILE_2,
  //         Email_id: row.E_MAIL_ID,
  //         Comm_add: row.Communication_address,
  //       });
  //     }
  //   }

  //   if (borrowerArray.length > 0) {
  //     const lastRecord = createRecordObject(
  //       excelData[excelData.length - 1],
  //       borrowerArray
  //     );
  //     const isSuccess = await sendRowData(lastRecord);
  //     isSuccess ? success++ : failed++;
  //   }

  //   setUploadStatus({ success, failed });
  //   setClearForm(true);
  //   setLoading(false);

  //   // if (onUploadComplete) {
  //   //   onUploadComplete();
  //   // }
  // };
  const handleDataUpload = async () => {
    setShowProgress(true);

    handleStepChange(2);
    let prevAcc = null;
    let prevRef = null;
    let borrowerArray = [];
    let kotakCdrArray = [];
    let success = 0,
      failed = 0;

    if (bankId === "1") {
      for (let i = 0; i < excelData.length; i++) {
        const row = excelData[i];
        const totalRecord = excelData.length;
        setTotalRecords(excelData.length);
        setProgress(Math.round(((i + 1) / totalRecords) * 100));

        if (row.ACC_NO !== prevAcc) {
          if (borrowerArray.length > 0) {
            const record = createRecordObject(excelData[i - 1], borrowerArray);
            const isSuccess = await sendRowData(record);
            setProg((prevProg) => prevProg + 1);
            isSuccess ? success++ : failed++;
          }
          borrowerArray = [];
          prevAcc = row.ACC_NO;

          borrowerArray.push({
            Type: "B",
            Cust_name: row.CUST_NAME,
            Mobile_no: row.Mobile_no,
            Work_mobile_no: row.WORK_MOBILE_2,
            Email_id: row.E_MAIL_ID,
            Comm_add: row.Communication_address,
          });
        } else {
          borrowerArray.push({
            Type: "C",
            Cust_name: row.CUST_NAME,
            Mobile_no: row.Mobile_no,
            Work_mobile_no: row.WORK_MOBILE_2,
            Email_id: row.E_MAIL_ID,
            Comm_add: row.Communication_address,
          });
        }
      }

      if (borrowerArray.length > 0) {
        const lastRecord = createRecordObject(
          excelData[excelData.length - 1],
          borrowerArray
        );
        const isSuccess = await sendRowData(lastRecord);
        isSuccess ? success++ : failed++;
      }

      setUploadStatus({ success, failed });
      setClearForm(true);
      setLoading(false);
    } else if (bankId === "2") {
      let prevRef = null;
      let borrowerArray = [];
      let kotakCdrArray = [];
      let finalRecords = [];

      for (let i = 0; i < excelData.length; i++) {
        const row = excelData[i];
        const nextRow = excelData[i + 1]; // Get next row (undefined if last row)
        const totalRecord = excelData.length;

        setTotalRecords(totalRecord);
        setProgress(Math.round(((i + 1) / totalRecord) * 100));

        // If it's a new REFERENCE_NO, finalize previous record
        if (row.REFERENCE_NO !== prevRef) {
          if (borrowerArray.length > 0) {
            // Finalize and send previous record
            const record = {
              Lot_no: row.Lot_No,
              Acc_no: kotakCdrArray[0]?.Loan_Acc_no || "",
              Reference_no: prevRef,
              Cust_id: row.CUST_ID,
              Client_id: bankId,
              Product_id: selectedProductID,
              Uploaded_by: "Admin",
              Borrower: borrowerArray, // Only one borrower entry
              Kotak_Cdrs: kotakCdrArray,
            };

            console.log(record);
            const isSuccess = await sendRowData(record);
            setProg((prevProg) => prevProg + 1);
            finalRecords.push(record);
          }

          // Reset for new reference
          borrowerArray = [];
          kotakCdrArray = [];
          prevRef = row.REFERENCE_NO;

          // **Add Borrower Only Once (First Row for REFERENCE_NO)**
          borrowerArray.push({
            Type: "B",
            Cust_name: row.CUST_NAME,
            Mobile_no: row.Mobile_no,
            Work_mobile_no: row.WORK_MOBILE_2,
            Email_id: row.E_MAIL_ID,
            Comm_add: row.Communication_address,
            And_also_at: row.And_Also_At_address1,
            And_also_at2: row.And_Also_At_address2,
            And_also_at3: row.And_Also_At_address3,
            Work_add: row.Work_Address,
          });
        }

        // Add loan details to Kotak_cdr
        kotakCdrArray.push({
          Loan_Acc_no: row.Loan_Acc_No,
          Product: row.Product,
          Aggrement_date: row.Aggrement_Date,
          Aggrement_value: row.Aggrement_Value,
          Total_Value: row.Total_Aggrement_Value,
          Download_date: row.Download_date,
          FR_amount: row.FR_Amount,
          Total_outstading_amount: row.Total_Outstanding_Amount,
          CM_Name: row.COLLECTION_MANAGER_NAME,
          CM_Email_id: row.Collection_Manager_Email_Id,
          CM_No: row.COLLECTION_MANAGER_NO,
        });

        // **At the last row, ensure we send the final record**
        if (i === excelData.length - 1) {
          const lastRecord = {
            Lot_no: row.Lot_No,
            Acc_no: kotakCdrArray[0]?.Loan_Acc_no || "",
            Reference_no: row.REFERENCE_NO,
            Cust_id: row.CUST_ID,
            Client_id: bankId,
            Product_id: selectedProductID,
            Uploaded_by: "Admin",
            Borrower: borrowerArray,
            Kotak_cdr: kotakCdrArray,
          };
          // console.log(lastRecord);
          await sendRowData(lastRecord);
          finalRecords.push(lastRecord);
        }
      }

      console.log("Final Records:", finalRecords);

      // Send the last batch after the loop ends
      // if (borrowerArray.length > 0) {
      //   const lastRecord = createRecordObject(
      //     excelData[excelData.length - 1],
      //     borrowerArray,
      //     kotakCdrArray
      //   );
      //   console.log("Final Record Sent:", lastRecord);
      //   const isSuccess = await sendRowData(lastRecord);
      //   setProg((prevProg) => prevProg + 1);
      // }

      // setUploadStatus({ success, failed });
      setClearForm(true);
      // setLoading(false);
    }

    // if (onUploadComplete) {
    //   onUploadComplete();
    // }
  };
  // For Excel Upload ends here

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <CustomStepper steps={steps} activeStep={activeStep} />
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          {excelData.length > 0 && !clearForm && showProgress && (
            <>
              <div className="progress-container">
                <p className="progress-text">
                  {prog}/{totalRecords} records uploaded
                </p>
                <div className="progress-bar-background mt-3">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${(prog / totalRecords) * 100}%`,
                    }}
                  >
                    {Math.round((prog / totalRecords) * 100)}%
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="row align-items-center mb-3">
        <div className="col-md-6">
          {/* {excelData.length == 0 ? (
            <h4>Select An Excel File</h4>
          ) : (
            <h4>Upload A File</h4>
          )} */}
          {/* {excelData.length == 0 && !clearform && <h4>Select An Excel File</h4>} */}
          {excelData.length > 0 && !showProgress && (
            <h4>Select An Excel File</h4>
          )}
        </div>
        <div className="col-md-4"></div>
        <div className="col-md-1">
          {/* {excelData.length > 0 ? (
            <button className="custBtn" onClick={handleUpload}>
              Upload
            </button>
          ) : (
            ""
          )} */}
          {excelData.length > 0 && !clearForm && !showProgress && (
            <button className="custBtn" onClick={handleDataUpload}>
              Upload
            </button>
          )}
        </div>
        <div className="col-md-1"></div>
      </div>

      {excelData.length == 0 ? (
        <div className="row justify-content-center align-items-center">
          <div className="col-md-4 mb-3">
            <Form.Select
              aria-label="Default select example"
              onChange={handleBankChange}
              className="custom_input"
              required
            >
              <option value="" disabled selected>
                Choose a Bank
              </option>
              {bank.map((item) => (
                <option key={item.Client_id} value={item.Client_id}>
                  {item.client_name}
                </option>
              ))}
            </Form.Select>
          </div>

          <div className="col-md-4 mb-3">
            <Form.Select
              aria-label="Default select example"
              onChange={handleProductChange}
              className="custom_input"
              required
            >
              <option value="" disabled selected>
                Choose a Product
              </option>
              {selectedProduct.map((item) => (
                <option key={item.Product_id} value={item.Product_id}>
                  {item.Product_name}
                </option>
              ))}
            </Form.Select>
          </div>

          <div className="col-md-4 mb-3">
            {bankId && selectedProductID ? (
              // <ExcelFileUpload onFileChange={handleFileChange} />
              <ExcelFileUpload
                onFileChange={handleFileChange}
                onErrorFileGenerated={handleErrorFileGenerated}
                onErrorCount={handleErrorCount}
                bankId={bankId}
              />
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        ""
      )}

      {errorExcelBlob && (
        <div className="row">
          <div className="col-md-4">
            <p className="text-danger text-center fw-bold">
              Total Errors: {errorCount}
            </p>
          </div>
          <div className="col-md-4">
            <p className="text-danger ms-3">
              To get more details and download excel
            </p>
          </div>
          <div className="col-md-4">
            <a
              href="#"
              onClick={downloadErrorExcel}
              disabled={!errorExcelBlob}
              className="ps-5 custom_anchor text-danger fw-bold"
            >
              Download Error Excel Here
            </a>
          </div>
        </div>
      )}

      {/* {excelData.length == 0 && clearForm ? (
        ""
      ) : (
        <div className="row">
          <div className="col-md-12">
            <ReusableTable
              data={currentRows}
              currentPage={currentPage}
              pageNumbers={pageNumbers}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
      )} */}

      {excelData.length > 0 && !showProgress && !clearForm && (
        <div className="row">
          <div className="col-md-12">
            <ReusableTable
              data={currentRows}
              currentPage={currentPage}
              pageNumbers={pageNumbers}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
      )}

      {shouldUpload && !clearForm && (
        <div className="row">
          <div className="col-md-10">
            <ExcelDataUploader
              excelData={excelData}
              bankId={bankId}
              selectedProductID={selectedProductID}
              API_BASE_URL={API_BASE_URL}
              onUploadProgress={handleUploadProgress} // pass progress handler
              // onUploadComplete={handleFormClear} // clear form after upload
            />
          </div>
        </div>
      )}

      {clearForm && (
        <div className="row">
          <div className="col-md-12 d-flex justify-content-center ">
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

export default UploadExcel;
