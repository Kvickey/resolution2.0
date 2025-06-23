import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/constants";
import { useAuth } from "../components/AuthProvider";
import ClearForm from "../components/Clearform";

const KotakCCUpload = (Data, bankId, selectedProductID, isDataPresent) => {
  const [totalRecords, setTotalRecords] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const [clientID, setClientID] = useState(null);
  const [productID, setProductID] = useState(null);
  const [errorResponses, setErrorResponses] = useState([]);
  const [verified, setVerified] = useState(false);
  const [dataPre, setDataPre] = useState(false);
  const [progress, setProgress] = useState(null);
  const [prog, setProg] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [clearForm, setClearForm] = useState(false);
  const { user, logout } = useAuth();

   console.log(Data.isDataPresent);

  useEffect(() => {
    setExcelData(Data.excelData);
    setClientID(Data.bankId);
    setProductID(Data.selectedProductID);
    if (Data.isDataPresent) {
      setDataPre(true);
    }
  }, [Data]);

  // console.log(Data);

  // console.log(excelData.length)
  console.log(isDataPresent);

  const handleVerify = async () => {
    // console.log("Clicked");

    setTotalRecords(excelData.length);
    // console.log("Excel Data:", excelData);

    if (!excelData || excelData.length === 0) {
      console.warn("No records found in Excel data.");
      return;
    }

    for (let i = 0; i < excelData.length; i++) {
      const row = excelData[i];

      // Call createRecordObject for each row
      const record = createRecordObject(row);
      console.log("Created Record:", record);
      const isSuccess = await verifyData(record);

      // You can add additional logic here if needed (e.g., API call)
    }
  };

  const createRecordObject = (row, borrowerArray, kotakCdrArray) => {
    // console.log("called");

    if (!row) return null;

    const result = {
      Lot_no: row.Lot_No,
      Acc_no: row.ACC_NO,
      Reference_no: row.REFERENCE_NO,
      Cust_id: row.CUST_ID,
      Client_id: clientID,
      Product_id: productID,
      Uploaded_by: user[0].User_name,
      LRN_date: row.LRN_date,
      Ref_date:row.Ref_date,
      Borrower: [
        {
          Type: "B",
          Cust_name: row.CUST_NAME,
          Mobile_no: row.Mobile_no,
          Work_mobile_no: row.WORK_MOBILE_2,
          Email_id: row.E_MAIL_ID,
          Comm_add: row.Communication_address,
          And_also_at: row.And_Also_At_address1,
          And_also_at2: row.And_Also_At_address2,
          And_also_at3: row.And_Also_At_address3,
        },
      ],
      kotak_CC: [
        {
          Card_no: row.Card_no,
          Concate: row.Concate,
          Region: row.Region,
          State: row.State,
          NRR: row.NRR,
          CRN: row.CRN,
          Credit_Limit: row.Credit_Limit,
          LRN_amt: row.LRN_amt,
          LRN_Amt_roundup: row.LRN_Amt_roundup,
          LRN_amt_in_rupees: row.LRN_amt_in_rupees,
          Current_bal: row.Current_bal,
          Current_bal_roundup: row.Current_bal_roundup,
          Current_bal_in_rupeess: row.Current_bal_in_rupeess,
          Bal_date: row.Bal_date,
          MAD: row.MAD,
          Promo: row.Promo,
          CM_name: row.CM_name,
          CM_Contact: row.CM_Contact,
        },
      ],
    };

    console.log(result);

    return result;
  };

  const verifyData = async (rowData) => {
    // console.log("Verify Data called");

    try {
      const response = await fetch(`${API_BASE_URL}/api/Validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rowData),
      });

      const responseBody = await response.json();
      // console.log(responseBody);

      if (!response.ok) {
        setErrorResponses((prev) => [...prev, responseBody]); // append to error state
      }
      setVerified(true);
      return response.ok;
    } catch (error) {
      console.error("Error sending data:", error);
      setErrorResponses((prev) => [
        ...prev,
        { error: error.message, data: rowData },
      ]);
      return false;
    }
  };

  // console.log(errorResponses);
  // console.log(verified);

  const handleDataUpload = async () => {
    setShowProgress(true);
    for (let i = 0; i < excelData.length; i++) {
      const row = excelData[i];
      setTotalRecords(excelData.length);
      setProgress(Math.round(((i + 1) / totalRecords) * 100));
      // Call createRecordObject for each row
      const record = createRecordObject(row);
      // console.log("Created Record:", record);
      const isSuccess = await sendRowData(record);
      setProg((prevProg) => prevProg + 1);
      // You can add additional logic here if needed (e.g., API call)
    }
    setClearForm(true);
  };

  // Function to send Data row by row starts  here
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
  // Function to send Data row by row starts  here

  return (
    <div className="conatiner">
      <div className="row mt-2">
        <div className="col-md-12">
          {!clearForm && showProgress && (
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
      <div className="row">
        <div className="col-md-8"></div>
        {/* {!verified &&  ( */}
         {/* {!verified && isDataPresent && ( */}
         {dataPre && (
          <div className="col-md-4">
            <button
              className="custBtn"
              onClick={handleVerify}
              style={{ fontSize: "12px" }}
            >
              Verify
            </button>
          </div>
        )}
        {verified && !clearForm && (
          <div className="col-md-4">
            <button
              className="custBtn"
              onClick={handleDataUpload}
              style={{ fontSize: "12px" }}
            >
              Upload
            </button>
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
    </div>
  );
};

export default KotakCCUpload;
