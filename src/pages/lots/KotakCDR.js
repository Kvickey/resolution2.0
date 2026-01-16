import React, { useState } from "react";
import * as XLSX from "xlsx";
import { API_BASE_URL } from "../../utils/constants";
import ProgressBar from "../../components/ProgressBar";

/* ----------------------------------------
   SAFE VALUE HELPER
---------------------------------------- */
const v = (val) => (val === null || val === undefined ? "" : val);

const KotakCDR = ({
  excelData,
  bankId,
  selectedProductID,
  verified,
  setVerified,
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

  const formatToMMDDYYYY = (dateStr) => {
    if (!dateStr) return "";
    const [dd, mm, yyyy] = dateStr.split(".");
    return `${mm}/${dd}/${yyyy}`;
  };

  /* ----------------------------------------
     CREATE FINAL PAYLOAD (FULL CONTRACT)
  ---------------------------------------- */

  const createRecordObject = (row, borrowerArray) => {
    // console.log("Borrower Array:", borrowerArray);
    return {
      Lot_no: v(row.Lot_No),
      Acc_no: v(row.ACC_NO),
      Cust_id: v(row.CUST_ID),
      Reference_no: v(row.REFERENCE_NO),
      LRN_Date: formatToMMDDYYYY(v(row.LRN_date)),
      // LRN_Date: v(row.LRN_date),
      Ref_date: formatToMMDDYYYY(v(row.Ref_date)),
      LRN_ref_no: v(row.LRN_REFERENCE_NO),
      Client_id: v(bankId),
      Product_id: v(selectedProductID),
      LOC_Date: formatToMMDDYYYY(v(row.LOC_Date)),
      TOSBALANCE: v(row.TOSBALANCE),
      TOSBALANCE_RS: v(row.TOSBALANCE_RS),
      FCR_DATE: formatToMMDDYYYY(v(row.FCR_DATE)),
      Uploaded_by: "Admin",

      Borrower: borrowerArray.map((b) => ({
        Type: v(b.Type),
        Cust_name: v(b.Cust_name),
        Mobile_no: v(b.Mobile_no),
        Work_mobile_no: v(b.Work_mobile_no),
        Email_id: v(b.Email_id),
        Comm_add: v(b.Comm_add),
        And_also_at: v(b.And_also_at),
        And_also_at2: v(b.And_also_at2),
        And_also_at3: v(b.And_also_at3),
        Work_add: v(b.Work_add),
      })),

      axis_loan: {
        product: v(row.PRODUCT),
        accno: v(row.ACC_NO),
        bankName: "Axis Bank",
        accountNumber: v(row.BANK_Account_Number),
        bankHolderName: v(row.Bank_Holder_Name),
        ifscCode: v(row.IFSC_code),
        bankAddress: v(row.Bank_Address),
        lawFirm: v(row.LAW_FIRM),
        allocType: v(row.ALLOC_TYPE),
        name: v(row.CUST_NAME),
        zone: v(row.ZONE),
        ourRegion: v(row.REGION),
        state: v(row.STATE),
        branchRacName: v(row.BRANCH_RAC_NAME),
        finalCity: v(row.FINAL_CITY),
        registration: v(row.REGISTRATION_NO),
        engineNumber: v(row.ENGINE_NO),
        chassisNumber: v(row.CHASSIS_NO),
        model1: v(row.MODEL_1),
        model2: v(row.MODEL_2),
        manufacturer: v(row.MANUFACTURER),
        dealer: v(row.DEALER),
        interestRate: v(row.INTEREST_RATE),
        bucket: v(row.BUCKET),
        disbursementAmount: v(row.DISBURSEMENT_AMOUNT),
        disbursementAmountWords: v(row.DISB_AMOUNT_IN_WORDS),
        disbursementDate: v(row.DISBURSEMENT_DATE),
        disbursalStatus: v(row.DISBURSAL_STATUS),
        tenure: v(row.TENURE),
        emiAmount: v(row.EMI_AMT),
        emiStartDate: v(row.EMI_START_DATE),
        principleOutstanding: v(row.TOSBALANCE),
        rsBalance: v(row.TOSBALANCE_RS),
        balanceInWords: v(row.TOSBALANCE_RS),
        interest: v(row.INTEREST),
        fcrAmountInRs: v(row.FORCLOSER_AMT_ROUNDUP),
        fcrAmountInWords: v(row.FORCLOSER_AMT_IN_WORDS),
        dateOfNpa: v(row.NPA_DATE),
        accountStatus: v(row.ACCOUNT_STATUS),
        fatherName: v(row.FATHER_NAME),
        healthCode: v(row.HEALTH_CODE),
        linkage: v(row.LINKAGE),
        drawingPower: v(row.DRAWING_POWER),
        sanctionRefNum: v(row.SANCTION_REF_NO),
      },
    };
  };

  /* ----------------------------------------
     VERIFY API
  ---------------------------------------- */
  const verifyData = async (record, rowIndex) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/Validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });

      if (!res.ok) {
        const err = await res.json();
        setErrorResponses((p) => [
          ...p,
          {
            RowNo: rowIndex + 1,
            Reference_no: record.Reference_no,
            Acc_no: record.Acc_no,
            Cust_name: record.Borrower?.[0]?.Cust_name || "",
            ErrorMessage: JSON.stringify(err),
          },
        ]);
        return false;
      }
      return true;
    } catch (e) {
      setErrorResponses((p) => [
        ...p,
        {
          RowNo: rowIndex + 1,
          Reference_no: record.Reference_no,
          Acc_no: record.Acc_no,
          Cust_name: record.Borrower?.[0]?.Cust_name || "",
          ErrorMessage: e.message,
        },
      ]);
      return false;
    }
  };

  /* ----------------------------------------
     VERIFY HANDLER
  ---------------------------------------- */
  const handleVerify = async () => {
    setLoading(true);
    setErrorResponses([]);
    setVerifyProgress(0);

    let borrowers = [];
    let prevRef = null;

    for (let i = 0; i < excelData.length; i++) {
      const row = excelData[i];

      if (row.REFERENCE_NO !== prevRef && borrowers.length) {
        await verifyData(
          createRecordObject(excelData[i - 1], borrowers),
          i - 1
        );
        setVerifyProgress((p) => p + 1);
        borrowers = [];
      }

      prevRef = row.REFERENCE_NO;

      borrowers.push({
        Type: borrowers.length === 0 ? "B" : "C",
        Cust_name: row.CUST_NAME,
        Mobile_no: row.Mobile_no,
        Work_mobile_no: row.WORK_MOBILE_2,
        Email_id: row.E_MAIL_ID,
        Comm_add: row.Communication_address,
        And_also_at: row.And_Also_At_address1,
        And_also_at2: row.And_Also_At_address2,
        And_also_at3: row.And_Also_At_address3,
        Work_add: row.work_Address,
      });

      if (i === excelData.length - 1) {
        await verifyData(createRecordObject(row, borrowers), i);
        setVerifyProgress((p) => p + 1);
      }
    }

    setVerified(errorResponses.length === 0);
    if (errorResponses.length === 0) setActiveStep(2);
    setLoading(false);
  };

  /* ----------------------------------------
     UPLOAD HANDLER
  ---------------------------------------- */
  const handleUpload = async () => {
    setShowProgress(true);
    setProg(0);
    setTotalRecords(excelData.length);

    let borrowers = [];
    let prevRef = null;
    let prevRow = null;

    for (let i = 0; i < excelData.length; i++) {
      const row = excelData[i];

      if (row.REFERENCE_NO !== prevRef && borrowers.length) {
        await fetch(`${API_BASE_URL}/api/UploadData`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(createRecordObject(prevRow, borrowers)),
        });
        setProg((p) => p + 1);
        borrowers = [];
      }

      prevRef = row.REFERENCE_NO;
      prevRow = row;

      borrowers.push({
        Type: borrowers.length === 0 ? "B" : "C",
        Cust_name: row.CUST_NAME,
        Mobile_no: row.Mobile_no,
        Work_mobile_no: row.WORK_MOBILE_2,
        Email_id: row.E_MAIL_ID,
        Comm_add: row.Communication_address,
        And_also_at: row.And_Also_At_address1,
        And_also_at2: row.And_Also_At_address2,
        And_also_at3: row.And_Also_At_address3,
        Work_add: row.work_Address,
      });

      if (i === excelData.length - 1) {
        await fetch(`${API_BASE_URL}/api/UploadData`, {   
          headers: { "Content-Type": "application/json" }, 
        });
        setProg((p) => p + 1);
      }
    }

    setClearForm(true);
  };

  /* ----------------------------------------
     UI
  ---------------------------------------- */
  return (
    <div className="mt-3">
      {!loading && (
        <div className="d-flex justify-content-end gap-2">
          {!verified && (
            <button className="custBtn" onClick={handleVerify}>
              Verify
            </button>
          )}
          {verified && !clearForm && !showProgress && (
            <button className="custBtn" onClick={handleUpload}>
              Upload
            </button>
          )}
        </div>
      )}

      {loading && (
        <ProgressBar
          progress={verifyProgress}
          total={excelData.length}
          show
          label={`Verified ${verifyProgress} of ${excelData.length}`}
        />
      )}
    </div>
  );
};

export default KotakCDR;
