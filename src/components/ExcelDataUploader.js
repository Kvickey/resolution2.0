import React, { useEffect, useState, useRef } from "react";
// import LoadingSpinner from "./LoadingSpinner";
import ProgressBar from "./ProgressBar";

const ExcelDataUploader = ({
  excelData,
  bankId,
  selectedProductID,
  API_BASE_URL,
  onUploadComplete,
}) => {
  const [uploadStatus, setUploadStatus] = useState({ success: 0, failed: 0 });
  const [progress, setProgress] = useState(0);
  // const [loading, setLoading] = useState(true);

  const totalRecords = excelData.length;
  const uploadStarted = useRef(false);

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

  // Create a record object for the API
  const createRecordObject = (row, borrowerArray) => {
    return {
      Lot_no: row.Lot_No,
      Acc_no: row.ACC_NO,
      Reference_no: row.REFERENCE_NO,
      Cust_id: row.CUST_ID,
      Client_id: bankId,
      Product_id: selectedProductID,
      LRN_Date: row.LRN_date,
      LRN_ref_no: row.LRN_REFERENCE_NO,
      Uploaded_by: "Admin",
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
      Borrower: borrowerArray,
    };
  };

  useEffect(() => {
    const handleDataUpload = async () => {
      let prevAcc = null;
      let borrowerArray = [];
      let success = 0,
        failed = 0;

        if (bankId === "1"){
          for (let i = 0; i < excelData.length; i++) {
            const row = excelData[i];
            setProgress(Math.round(((i + 1) / totalRecords) * 100));
    
            if (row.ACC_NO !== prevAcc) {
              if (borrowerArray.length > 0) {
                const record = createRecordObject(excelData[i - 1], borrowerArray);
                // console.log(record);
                const isSuccess = await sendRowData(record);
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
        }else if(bankId === "2"){
          alert("hello")
        }
    

      setUploadStatus({ success, failed });
      // setLoading(false);

      if (onUploadComplete) {
        onUploadComplete();
      }
    };

    if (!uploadStarted.current) {
      uploadStarted.current = true;
      // setLoading(true);
      handleDataUpload();
    }
  }, [excelData, bankId, selectedProductID, API_BASE_URL]);

  // if (loading) return <LoadingSpinner />;

  return (
    <div>
      <p>
        Success: {uploadStatus.success} | Failed: {uploadStatus.failed}
      </p>
      <ProgressBar progress={progress} />
    </div>
  );
};

export default ExcelDataUploader;
