import React, { useState } from "react";
import * as XLSX from "xlsx";
import { API_BASE_URL } from "../../utils/constants";
import ProgressBar from "../../components/ProgressBar";

const AxisPlBl = ({
  excelData,
  bankId,
  selectedProductID,
  setVerified,
  verified,
  setShowProgress,
  setProg,
  setTotalRecords,
  setClearForm,
  clearForm,
  showProgress,
  setActiveStep,
}) => {
  const [loading, setLoading] = useState(false);
  const [errorResponses, setErrorResponses] = useState([]);
  const [verifyProgress, setVerifyProgress] = useState(0);

  // ✅ Create Axis CV record
  const createRecordObject = (row, borrowerArray) => {
    return {
      Lot_no: row.Lot_No,
      Acc_no: borrowerArray[0]?.ACC_NO || row.ACC_NO,
      Reference_no: row.REFERENCE_NO,
      Cust_id: row.CUST_ID,
      Client_id: bankId,
      Product_id: selectedProductID,
      LRN_Date: row.LRN_date,
      Ref_date: row.Ref_date,
      LRN_ref_no: row.LRN_REFERENCE_NO,
      Uploaded_by: "Admin",
      LOC_Date: row.LOC_Date,
      TOSBALANCE: row.TOSBALANCE,
      TOSBALANCE_RS: row.TOSBALANCE_RS,
      FCR_DATE: row.FCR_DATE,
      Borrower: borrowerArray,
      Axis_Cv: {
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

  // ✅ Verify Button Handler
  const handleVerify = async () => {
    setLoading(true);
    setErrorResponses([]);
    setVerifyProgress(0);
    let borrowerArray = [];
    let prevAcc = null;

    for (let i = 0; i < excelData.length; i++) {
      const row = excelData[i];

      if (row.ACC_NO !== prevAcc) {
        if (borrowerArray.length > 0) {
          const record = createRecordObject(excelData[i - 1], borrowerArray);
          await verifyData(record, i - 1);
          setVerifyProgress((prev) => prev + 1);
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
          And_also_at: row.And_Also_At_address1,
          And_also_at2: row.And_Also_At_address2,
          And_also_at3: row.And_Also_At_address3,
          Work_add: row.Work_Address,
        });
      } else {
        borrowerArray.push({
          Type: "C",
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
    }

    if (borrowerArray.length > 0) {
      const lastRecord = createRecordObject(
        excelData[excelData.length - 1],
        borrowerArray
      );
      await verifyData(lastRecord, excelData.length - 1);
      setVerifyProgress((prev) => prev + 1);
    }

    if (errorResponses.length > 0) {
      setVerified(false); // do not show Upload button
    } else {
      setVerified(true);
      setActiveStep(2);
    }
    setLoading(false);
  };

  // ✅ Verify Data API
  const verifyData = async (record, rowIndex) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        setErrorResponses((prev) => [
          ...prev,
          {
            RowNo: rowIndex + 1,
            Reference_no: record.Reference_no,
            Acc_no: record.Acc_no,
            Cust_name: record.Borrower?.[0]?.Cust_name || "",
            // ErrorMessage: errorBody?.message || "Validation failed",
            ErrorMessage: JSON.stringify(errorBody),
          },
        ]);
        return false;
      }
      return true;
    } catch (error) {
      setErrorResponses((prev) => [
        ...prev,
        {
          RowNo: rowIndex + 1,
          Reference_no: record.Reference_no,
          Acc_no: record.Acc_no,
          Cust_name: record.Borrower?.[0]?.Cust_name || "",
          ErrorMessage: error.message,
        },
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

  // ✅ Upload Button Handler
  const handleDataUpload = async () => {
    setShowProgress(true);
    setProg(0);
    setTotalRecords(excelData.length);

    let borrowerArray = [];
    let prevRef = null;
    let seenAccNos = new Set();
    let prevRow = null;
    let success = 0,
      failed = 0;

    for (let i = 0; i < excelData.length; i++) {
      const row = excelData[i];

      // New reference number → finalize previous record
      if (row.REFERENCE_NO !== prevRef) {
        if (borrowerArray.length > 0 && prevRow) {
          const record = createRecordObject(prevRow, borrowerArray);
          const ok = await sendRowData(record);
          ok ? success++ : failed++;
          setProg((p) => p + 1);
        }

        borrowerArray = [];
        seenAccNos.clear();
        prevRef = row.REFERENCE_NO;
        prevRow = row;

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
        seenAccNos.add(row.ACC_NO);
      } else {
        if (!seenAccNos.has(row.ACC_NO)) {
          borrowerArray.push({
            Type: "C",
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
          seenAccNos.add(row.ACC_NO);
        }
      }

      prevRow = row;

      // last row → finalize
      if (i === excelData.length - 1 && borrowerArray.length > 0) {
        const record = createRecordObject(row, borrowerArray);
        const ok = await sendRowData(record);
        ok ? success++ : failed++;
        setProg((p) => p + 1);
      }
    }

    console.log(`✅ Uploaded: ${success}, ❌ Failed: ${failed}`);
    setClearForm(true);
  };

  // ✅ Download Error Excel
  const downloadErrorExcel = () => {
    if (errorResponses.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(errorResponses);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Errors");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "ErrorReport.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-3">
      {!loading && (
        <div className="d-flex gap-2 justify-content-end">
          {excelData.length > 0 && !verified && errorResponses.length === 0 && (
            <button
              className="custBtn"
              style={{ fontSize: "12px" }}
              onClick={handleVerify}
            >
              Verify
            </button>
          )}
          {errorResponses.length > 0 && (
            <button
              className="custBtn"
              style={{ fontSize: "12px" }}
              onClick={downloadErrorExcel}
            >
              Download Error Excel
            </button>
          )}
          {verified &&
            !clearForm &&
            !showProgress &&
            errorResponses.length === 0 && (
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
      {loading && (
        <ProgressBar
          progress={verifyProgress}
          total={excelData.length}
          show={loading && excelData.length > 0}
          label={`Verified ${verifyProgress} of ${excelData.length}`}
        />
      )}
      {/* {loading && <p>Verifying data...</p>} */}
    </div>
  );
};

export default AxisPlBl;
