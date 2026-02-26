import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../utils/constants";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { FaCheckCircle, FaFilePdf } from "react-icons/fa";
import { TbMinusVertical } from "react-icons/tb";
import "./CaseTrackCasewise1.css";

const CaseTrackCasewise1 = () => {
  const [refNo, setRefNo] = useState("");
  const [data, setData] = useState([]);
  const [clearForm, setClearForm] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [customer, setCustomer] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      const filtered = data.filter((item) => item.Type === "B");
      setCustomer(filtered);
    } else {
      setCustomer([]); // optional safety
    }
  }, [data]);

  const handleOpenPDF = (url) => {
    setPdfUrl(url);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setPdfUrl("");
  };

  const selectedStage = [
    {
      stage_id: 1,
      stage_name: "Upload Date",
    },
    {
      stage_id: 2,
      stage_name: "Arbitrator Assigned",
    },
    {
      stage_id: 3,
      stage_name: "Appointment",
    },
    {
      stage_id: 4,
      stage_name: "Acceptance ",
    },
    {
      stage_id: 5,
      stage_name: "SOC",
    },
    {
      stage_id: 6,
      stage_name: "Sec 17 Application ",
    },
    {
      stage_id: 7,
      stage_name: "Sec 17 Order/ First Hearing",
    },
    {
      stage_id: 8,
      stage_name: "Second Hearing",
    },
    {
      stage_id: 9,
      stage_name: "Final Hearing",
    },
    {
      stage_id: 10,
      stage_name: "Pursis",
    },
    {
      stage_id: 11,
      stage_name: "Award",
    },
  ];

  useEffect(() => {
    const fetchRefInfo = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/Case?Ref_no=${refNo}`
        );
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to upload data: ${response.status} ${response.statusText} - ${errorText}`
          );
        }
        const result = await response.json();
        const parsedData = Array.isArray(result) ? result : JSON.parse(result);
        console.log(result);
        setData(parsedData);
      } catch (error) {
        console.error("Error uploading data:", error);
        alert(`Error uploading data: ${error.message}`);
      }
    };

    if (refNo) {
      fetchRefInfo();
    }
  }, [refNo]);

  const handleRefNoChange = (event) => {
    setReferenceNumber(event.target.value);
  };
  console.log(referenceNumber);

  const handleClick = () => {
    setRefNo(referenceNumber);
  };

  console.log(data);
  // const customer = data?.filter((data) => data.Type === "B");

  console.log(customer[0]?.Reference_no);

  const hasCustomer = customer.length > 0;

  const formatDate = (dateTimeString) => {
    const dateString = dateTimeString.split("T")[0];
    const [year, month, day] = dateString.split("-");
    return `${month}/${day}/${year}`;
  };

  // const CaseRow = ({ label, dateValue, folder, hasPdf = true }) => {
  //   const fileUrl =
  //     folder && `${API_BASE_URL}/Content/Cases/${folder}/${refNo}.pdf`;

  //   return (
  //     <div className="row mx-auto align-items-center mb-2">
  //       <div className="col-md-1 d-flex align-items-center justify-content-center">
  //         <FaCheckCircle
  //           className={`fs-5 ${dateValue ? "text-success" : "text-secondary"}`}
  //         />
  //       </div>

  //       {/* PDF Column stays always */}
  //       <div className="col-md-1 d-flex align-items-center justify-content-center">
  //         {dateValue && hasPdf && (
  //           <div
  //             className="pdf-card w-100"
  //             onClick={() => handleOpenPDF(fileUrl)}
  //           >
  //             <FaFilePdf className="pdf-icon" />
  //           </div>
  //         )}
  //       </div>

  //       <div className="col-md-3 fw-semibold d-flex align-items-center">
  //         {label}
  //       </div>

  //       <div className="col-md-4 d-flex align-items-center">
  //         {dateValue ? formatDate(dateValue) : "N/A"}
  //       </div>
  //     </div>
  //   );
  // };

  const CaseRow = ({ label, dateValue, folder, hasPdf = true }) => {
    const fileUrl =
      folder && `${API_BASE_URL}/Content/Cases/${folder}/${refNo}.pdf`;

    return (
      <div className="case-row">
        {/* Timeline Indicator */}
        <div className="timeline-col">
          <div
            className={`timeline-dot ${
              dateValue ? "active-dot" : "inactive-dot"
            }`}
          />
          <div className="timeline-line" />
        </div>

        {/* Content Section */}
        <div className="case-content">
          <div className="case-header-inline">
            <div className="case-col case-label">{label}</div>

            <div className="case-col case-doc">
              {hasPdf && dateValue && (
                <div
                  className="pdf-inline-btn"
                  onClick={() => handleOpenPDF(fileUrl)}
                >
                  <FaFilePdf />
                  <span>Document</span>
                </div>
              )}
            </div>

            <div className="case-col case-date">
              {dateValue ? formatDate(dateValue) : "Pending"}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      {!clearForm && (
        <div className="row align-items-center">
          <div className="col-md-5">
            <h4 className="my-3 ms-4">Case Tracking By Refrence No</h4>
          </div>
          <div className="col-md-2"></div>
          <div className="col-md-3"></div>
        </div>
      )}

      {/* {!show && ( */}
      {!clearForm && (
        <div className="row  ms-3">
          <div className="col-md-5">
            <Form.Control
              type="text"
              className="custom_input"
              placeholder="Enter Reference No"
              onChange={handleRefNoChange}
            />
          </div>
          <div className="col-md-2 ms-3">
            <button
              className=" btn btn-primary px-5 getDataBtn"
              onClick={handleClick}
            >
              Show
            </button>
          </div>
          <div className="col-md-4">
            {customer[0]?.Is_terminate === "1" ? (
              <p className="text-danger fw-bold">
                Case is Terminated on -
                {formatDate(customer[0].Termination_date)}
              </p>
            ) : null}
          </div>
        </div>
      )}

      <div className="row mt-3 ">
        <div className="col-md-6 customCard1 ">
          <h5 className="text-center customHeader">Customer Information</h5>
          <div className="row my-1 ps-3">
            <div className="col-md-5">
              <label>Reference No</label>
            </div>
            <div className="col-md-6">{customer[0]?.Reference_no}</div>
          </div>

          <div className="row my-1 ps-3">
            <div className="col-md-5">
              <label>Customer Name</label>
            </div>
            <div className="col-md-6">{customer[0]?.Cust_name}</div>
          </div>

          <div className="row my-1 ps-3">
            <div className="col-md-5">
              <label>Customer Id</label>
            </div>
            <div className="col-md-6">{customer[0]?.Cust_id}</div>
          </div>

          <div className="row my-1 ps-3">
            <div className="col-md-5">
              <label>Lot No</label>
            </div>
            <div className="col-md-6">{customer[0]?.Lot_no}</div>
          </div>

          <div className="row my-1 ps-3">
            <div className="col-md-5">
              <label>Account No</label>
            </div>
            <div className="col-md-6">{customer[0]?.Acc_no}</div>
          </div>

          <div className="row my-1 ps-3">
            <div className="col-md-5">
              <label>Mobile No</label>
            </div>
            <div className="col-md-6">{customer[0]?.Mobile_no}</div>
          </div>

          <div className="row my-1 ps-3">
            <div className="col-md-5">
              <label>Email</label>
            </div>
            <div className="col-md-6">{customer[0]?.Email_id}</div>
          </div>

          <div className="row my-1 ps-3">
            <div className="col-md-5">
              <label>Client</label>
            </div>
            <div className="col-md-6">{customer[0]?.client_name}</div>
          </div>

          <div className="row my-1 ps-3">
            <div className="col-md-5">
              <label>Product</label>
            </div>
            <div className="col-md-6">{customer[0]?.Product_name}</div>
          </div>
        </div>

        <div className="col-md-6 customCard p-3">
          <h5 className="text-center customHeader mb-4">Details Of Case</h5>

          <CaseRow
            label="Uploaded Date"
            dateValue={customer[0]?.Uploaded_date}
            hasPdf={false}
          />

          <CaseRow
            label="Appointment "
            dateValue={customer[0]?.Ref_date}
            folder="Ref"
          />

          <CaseRow
            label="Acceptance Date"
            dateValue={customer[0]?.Acc_date}
            folder="Acc"
          />

          <CaseRow
            label="SOC Date"
            dateValue={customer[0]?.Soc_date}
            folder="SOC"
          />

          <CaseRow
            label="Sec 17 Application"
            dateValue={customer[0]?.Sec_17_app_date}
            folder="SEC_17_App"
          />

          <CaseRow
            label="Sec 17 Order"
            dateValue={customer[0]?.Sec_17_order_date}
            folder="SEC_17_Order"
          />

          <CaseRow
            label="First Hearing"
            dateValue={customer[0]?.First_hearing_date}
            folder="Acc"
          />

          <CaseRow
            label="Second Hearing"
            dateValue={customer[0]?.Second_hearing_date}
            folder="SecondHearing"
          />

          <CaseRow
            label="Third Hearing"
            dateValue={customer[0]?.third_hearing_date}
            folder="ThirdHearing"
          />

          <CaseRow
            label="Award Pass Date"
            dateValue={customer[0]?.Award_date}
            folder="AwardPass"
          />
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Document Preview</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ height: "80vh" }}>
          {pdfUrl && (
            <iframe
              src={pdfUrl}
              title="PDF Viewer"
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          )}
        </Modal.Body>
      </Modal>

      {/* {clearForm && (
        <div className="row">
          <div className="col-md-12 d-flex justify-content-center ">
            <ClearForm
              message="Case Terminated Successfully!"
              redirectPath="/arbdashboard"
            />
          </div>
        </div>
      )} */}
    </div>
  );
};

export default CaseTrackCasewise1;
