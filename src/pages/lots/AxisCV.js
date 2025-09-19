import React, { useState } from "react";
import { API_BASE_URL } from "../../utils/constants";

const AxisCV = ({
  excelData,
  bankId,
  selectedProductID,
  setVerified,
  verified,
  setShowProgress,
  setProg,
  setTotalRecords,
  setClearForm,
  setErrorResponses,
  clearForm,
  showProgress
}) => {
  const [loading, setLoading] = useState(false);

  // ✅ Create Axis CV record
  const createRecordObject = (row, borrowerArray) => {
    return {
      Lot_no: row.Lot_No,
      Acc_no: row.ACC_NO,
      Reference_no: row.REFERENCE_NO,
      Cust_id: row.CUST_ID,
      Client_id: bankId,
      Product_id: selectedProductID,
      LRN_Date: row.LRN_date,
      Ref_date: row.Ref_date,
      LRN_ref_no: row.LRN_REFERENCE_NO,
      Uploaded_by: "Admin",
      Borrower: borrowerArray,
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
  };

  // ✅ Verify Data API
  const verifyData = async (record) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        setErrorResponses((prev) => [...prev, errorBody]);
        return false;
      }
      return true;
    } catch (error) {
      setErrorResponses((prev) => [
        ...prev,
        { error: error.message, data: record },
      ]);
      return false;
    }
  };

  // ✅ Upload Data API
  const sendRowData = async (record) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/UploadData`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
      return response.ok;
    } catch (error) {
      console.error("Upload failed:", error);
      return false;
    }
  };

  // ✅ Verify Button Handler
  const handleVerify = async () => {
    setLoading(true);
    setErrorResponses([]);
    let borrowerArray = [];
    let prevAcc = null;

    for (let i = 0; i < excelData.length; i++) {
      const row = excelData[i];

      if (row.ACC_NO !== prevAcc) {
        if (borrowerArray.length > 0) {
          const record = createRecordObject(excelData[i - 1], borrowerArray);
          await verifyData(record);
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

    // Final record
    if (borrowerArray.length > 0) {
      const lastRecord = createRecordObject(
        excelData[excelData.length - 1],
        borrowerArray
      );
      await verifyData(lastRecord);
    }

    setVerified(true);
    setLoading(false);
  };

  // ✅ Upload Button Handler
  const handleDataUpload = async () => {
    setShowProgress(true);
    setProg(0);
    setTotalRecords(excelData.length);

    let borrowerArray = [];
    let prevAcc = null;
    let success = 0,
      failed = 0;

    for (let i = 0; i < excelData.length; i++) {
      const row = excelData[i];

      if (row.ACC_NO !== prevAcc) {
        if (borrowerArray.length > 0) {
          const record = createRecordObject(excelData[i - 1], borrowerArray);
          const ok = await sendRowData(record);
          ok ? success++ : failed++;
          setProg((p) => p + 1);
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

    // Final record
    if (borrowerArray.length > 0) {
      const lastRecord = createRecordObject(
        excelData[excelData.length - 1],
        borrowerArray
      );
      const ok = await sendRowData(lastRecord);
      ok ? success++ : failed++;
      setProg((p) => p + 1);
    }

    console.log(`✅ Uploaded: ${success}, ❌ Failed: ${failed}`);
    setClearForm(true);
  };

  return (
    <div className="mt-3">
      {!loading && (
        <div className="d-flex gap-2 justify-content-end">
          {excelData.length > 0 && !verified && (
            <button
              className="custBtn"
              style={{ fontSize: "12px" }}
              onClick={handleVerify}
            >
              Verify
            </button>
          )}
          {verified && !clearForm && !showProgress && (
            <button
              className="custBtn"
              style={{ fontSize: "12px" }}
              onClick={handleDataUpload}
            >
              Upload
            </button>
          )}
        </div>
      )}
      {loading && <p>Verifying data...</p>}
    </div>
  );
};

export default AxisCV;
