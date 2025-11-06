import React, { useEffect, useState } from "react";
import { Form, Table } from "react-bootstrap";
import VerticalStepper from "../VerticalStepper";
import StepperComponent from "../../components/StepperComponent";
import { API_BASE_URL } from "../../utils/constants";
import { Box, Stepper, Step, StepLabel, Typography } from "@mui/material";
import DatePicker from "react-datepicker";
import { FaCheckCircle } from "react-icons/fa";
import { TbMinusVertical } from "react-icons/tb";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEye } from "react-icons/fa";
import ClearForm from "../../components/Clearform";

const CaseTrackingCaseWise = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [refNo, setRefNo] = useState("");
  const [data, setData] = useState([]);
  const [activeStep, setActiveStep] = React.useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formattedDate, setFormattedDate] = useState(null);
  const [selectedStageID, setSelectedStageID] = useState(null);
  const [reason, setReason] = useState(null);
  const [terminate, setTerminate] = useState(false);
  const [clearForm, setClearForm] = useState(false);

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

  const handleReason = (event) => {
    setReason(event.target.value);
  };

  const handleClick = () => {
    setRefNo(referenceNumber);
  };

  console.log(data);

  console.log(refNo);

  const customer = data.filter((data) => data.Type === "B");

  console.log(customer);

  const hasCustomer = customer.length > 0;

  useEffect(() => {
    if (hasCustomer && customer[0].Termination_date !== null) {
      setTerminate(true);
    } else {
      setTerminate(false);
    }
  }, [customer]);

  // console.log(terminate);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setFormattedDate(date ? date.toLocaleDateString("en-US") : "");
    // setFormattedDate(date ? date.toLocaleDateString("en-GB") : "");
  };

  console.log(formattedDate);

  const formatDate = (dateTimeString) => {
    const dateString = dateTimeString.split("T")[0];
    const [year, month, day] = dateString.split("-");
    return `${month}/${day}/${year}`;
  };

  // const handleProductChange = () => {};
  const handleStageChange = (e) => {
    const selectedID = e.target.value;
    setSelectedStageID(selectedID);
  };

  console.log(selectedStageID);
  console.log(reason);

  const handleTerminate = async () => {
    const dataTotransfer = {
      Case_id: customer[0].Case_id,
      Remark: reason,
      Stage_id: selectedStageID,
      Termination_date: formattedDate,
    };
    console.log(dataTotransfer);

    try {
      const response = await fetch(`${API_BASE_URL}/api/Terminate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataTotransfer),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to upload data: ${response.status} - ${errorText}`
        );
      }

      const result = await response.json();
      setClearForm(true);
    } catch (error) {
      console.error("Error uploading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPDF = (pdfUrl) => {
    console.log("handleOpenPDF called with URL:", pdfUrl);
    window.open(pdfUrl, "_blank");
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      View PDF
    </Tooltip>
  );

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
          <div className="col-md-4">
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

      {customer.length > 0 && !clearForm && (
        <div className="row mt-5">
          <div className="col-md-11 mx-auto">
            <div className="row">
              <div className="col-md-6 customCard1 ">
                <h5 className="text-center customHeader">
                  Customer Information
                </h5>
                <div className="row my-1 ps-3">
                  <div className="col-md-5">
                    <label>Refrence No</label>
                  </div>
                  <div className="col-md-6">{customer[0].Reference_no}</div>
                </div>

                <div className="row my-1 ps-3">
                  <div className="col-md-5">
                    <label>Customer Name</label>
                  </div>
                  <div className="col-md-6">{customer[0].Cust_name}</div>
                </div>

                <div className="row my-1 ps-3">
                  <div className="col-md-5">
                    <label>Customer Id</label>
                  </div>
                  <div className="col-md-6">{customer[0].Cust_id}</div>
                </div>

                <div className="row my-1 ps-3">
                  <div className="col-md-5">
                    <label>Lot No</label>
                  </div>
                  <div className="col-md-6">{customer[0].Lot_no}</div>
                </div>

                <div className="row my-1 ps-3">
                  <div className="col-md-5">
                    <label>Account No</label>
                  </div>
                  <div className="col-md-6">{customer[0].Acc_no}</div>
                </div>

                <div className="row my-1 ps-3">
                  <div className="col-md-5">
                    <label>Mobile No</label>
                  </div>
                  <div className="col-md-6">{customer[0].Mobile_no}</div>
                </div>

                <div className="row my-1 ps-3">
                  <div className="col-md-5">
                    <label>Email</label>
                  </div>
                  <div className="col-md-6">{customer[0].Email_id}</div>
                </div>

                <div className="row my-1 ps-3">
                  <div className="col-md-5">
                    <label>Client</label>
                  </div>
                  <div className="col-md-6">{customer[0].client_name}</div>
                </div>

                <div className="row my-1 ps-3">
                  <div className="col-md-5">
                    <label>Product</label>
                  </div>
                  <div className="col-md-6">{customer[0].Product_name}</div>
                </div>
              </div>

              <div className="col-md-1"></div>

              <div className="col-md-5 customCard p-3">
                <h5 className="text-center customHeader"> Details Of Case </h5>
                <div className="row mx-auto">
                  <div className="col-md-6 text-end">Uploaded Date</div>
                  <div className="col-md-1">
                    {customer[0].Uploaded_date ? (
                      <>
                        <FaCheckCircle className="fs-4 text-success" />
                      </>
                    ) : (
                      <FaCheckCircle className="fs-4 text-secondary" />
                    )}
                  </div>
                  <div className="col-md-5 ps-4">
                    {customer[0].Uploaded_date ? (
                      <>{formatDate(customer[0].Uploaded_date)}</>
                    ) : (
                      "N/A"
                    )}
                  </div>
                </div>
                <div className="row mx-auto">
                  <div className="col-md-6"></div>
                  <div className="col-md-1">
                    <TbMinusVertical className="fs-4 text-success" />
                  </div>
                  <div className="col-md-5"> </div>
                </div>

                <div className="row mx-auto">
                  <div className="col-md-6 text-end">Appointment Date</div>
                  <div className="col-md-1">
                    {customer[0].Ref_date ? (
                      <>
                        <FaCheckCircle className="fs-4 text-success" />
                      </>
                    ) : (
                      <FaCheckCircle className="fs-4 text-secondary" />
                    )}
                  </div>
                  <div className="col-md-5 ps-4">
                    {customer[0].Ref_date ? (
                      <>
                        {formatDate(customer[0].Ref_date)}
                        <a
                          href="#"
                          onClick={() =>
                            handleOpenPDF(
                              `${API_BASE_URL}/Content/Cases/Ref/${refNo}.pdf`
                            )
                          }
                          className="customAnchor"
                        >
                          <OverlayTrigger
                            placement="top"
                            overlay={renderTooltip}
                          >
                            <span className="ms-3">
                              <FaEye style={{ cursor: "pointer" }} />
                            </span>
                          </OverlayTrigger>
                        </a>
                      </>
                    ) : (
                      "N/A"
                    )}
                  </div>
                </div>
                <div className="row mx-auto">
                  <div className="col-md-6"></div>
                  <div className="col-md-1">
                    <TbMinusVertical className="fs-4 text-success" />
                  </div>
                  <div className="col-md-5"> </div>
                </div>

                <div className="row mx-auto">
                  <div className="col-md-6 text-end">Acceptance Date</div>
                  <div className="col-md-1">
                    {customer[0].Acc_date ? (
                      <>
                        <FaCheckCircle className="fs-4 text-success" />
                      </>
                    ) : (
                      <FaCheckCircle className="fs-4 text-secondary" />
                    )}
                  </div>
                  <div className="col-md-5 ps-4">
                    {customer[0].Acc_date ? (
                      // <OverlayTrigger placement="top" overlay={renderTooltip}>
                      <>
                        {formatDate(customer[0].Acc_date)}
                        <a
                          href="#"
                          onClick={() =>
                            handleOpenPDF(
                              `${API_BASE_URL}/Content/Cases/Acc/${refNo}.pdf`
                            )
                          }
                          className="customAnchor"
                        >
                          <OverlayTrigger
                            placement="top"
                            overlay={renderTooltip}
                          >
                            <span className="ms-3">
                              <FaEye style={{ cursor: "pointer" }} />
                            </span>
                          </OverlayTrigger>
                        </a>
                      </>
                    ) : (
                      // </OverlayTrigger>
                      // <>{formatDate(customer[0].Acc_date)}</>
                      "N/A"
                    )}
                  </div>
                </div>
                <div className="row mx-auto">
                  <div className="col-md-6"></div>
                  <div className="col-md-1">
                    <TbMinusVertical className="fs-4 text-success" />
                  </div>
                  <div className="col-md-5"> </div>
                </div>

                <div className="row mx-auto">
                  <div className="col-md-6 text-end">SOC Date</div>
                  <div className="col-md-1">
                    {customer[0].Soc_date ? (
                      <>
                        <FaCheckCircle className="fs-4 text-success" />
                      </>
                    ) : (
                      <FaCheckCircle className="fs-4 text-secondary" />
                    )}
                  </div>
                  <div className="col-md-5 ps-4">
                    {customer[0].Soc_date ? (
                      <>
                        {formatDate(customer[0].Soc_date)}
                        <a
                          href="#"
                          onClick={() =>
                            handleOpenPDF(
                              `${API_BASE_URL}/Content/Cases/Soc/${refNo}.pdf`
                            )
                          }
                          className="customAnchor"
                        >
                          <OverlayTrigger
                            placement="top"
                            overlay={renderTooltip}
                          >
                            <span className="ms-3">
                              <FaEye style={{ cursor: "pointer" }} />
                            </span>
                          </OverlayTrigger>
                        </a>
                      </>
                    ) : (
                      // <>{formatDate(customer[0].Soc_date)}</>
                      "N/A"
                    )}
                  </div>
                </div>
                <div className="row mx-auto">
                  <div className="col-md-6"></div>
                  <div className="col-md-1">
                    <TbMinusVertical className="fs-4 text-success" />
                  </div>
                  <div className="col-md-5"> </div>
                </div>

                <div className="row mx-auto">
                  <div className="col-md-6 text-end">Sec 17 Application</div>
                  <div className="col-md-1">
                    {customer[0].Sec_17_app_date ? (
                      <>
                        <FaCheckCircle className="fs-4 text-success" />
                      </>
                    ) : (
                      <FaCheckCircle className="fs-4 text-secondary" />
                    )}
                  </div>
                  <div className="col-md-5 ps-4">
                    {customer[0].Sec_17_app_date ? (
                      <>
                        {formatDate(customer[0].Sec_17_app_date)}
                        <a
                          href="#"
                          onClick={() =>
                            handleOpenPDF(
                              `${API_BASE_URL}/Content/Cases/SEC_17_App/${refNo}.pdf`
                            )
                          }
                          className="customAnchor"
                        >
                          <OverlayTrigger
                            placement="top"
                            overlay={renderTooltip}
                          >
                            <span className="ms-3">
                              <FaEye style={{ cursor: "pointer" }} />
                            </span>
                          </OverlayTrigger>
                        </a>
                      </>
                    ) : (
                      // <>{customer[0].Sec_17_app_date}</>
                      "N/A"
                    )}
                  </div>
                </div>

                <div className="row mx-auto">
                  <div className="col-md-6"></div>
                  <div className="col-md-1">
                    <TbMinusVertical className="fs-4 text-success" />
                  </div>
                  <div className="col-md-5"> </div>
                </div>

                <div className="row mx-auto">
                  <div className="col-md-6 text-end">First Hearing</div>
                  <div className="col-md-1">
                    {customer[0].First_hearing_date ? (
                      <>
                        <FaCheckCircle className="fs-4 text-success" />
                      </>
                    ) : (
                      <FaCheckCircle className="fs-4 text-secondary" />
                    )}
                  </div>

                  <div className="col-md-5 ps-4">
                    {customer[0].First_hearing_date ? (
                      <>
                        {formatDate(customer[0].First_hearing_date)}
                        <a
                          href="#"
                          onClick={() =>
                            handleOpenPDF(
                              `${API_BASE_URL}/Content/Cases/SecondHearing/${refNo}.pdf`
                            )
                          }
                          className="customAnchor"
                        >
                          <OverlayTrigger
                            placement="top"
                            overlay={renderTooltip}
                          >
                            <span className="ms-3">
                              <FaEye style={{ cursor: "pointer" }} />
                            </span>
                          </OverlayTrigger>
                        </a>
                      </>
                    ) : (
                      // <>{formatDate(customer[0].Soc_date)}</>
                      "N/A"
                    )}
                  </div>
                </div>
                <div className="row mx-auto">
                  <div className="col-md-6"></div>
                  <div className="col-md-1">
                    <TbMinusVertical className="fs-4 text-success" />
                  </div>
                  <div className="col-md-5"> </div>
                </div>

                <div className="row mx-auto">
                  <div className="col-md-6 text-end">Second Hearing</div>
                  <div className="col-md-1">
                    {customer[0].Second_hearing_date ? (
                      <>
                        <FaCheckCircle className="fs-4 text-success" />
                      </>
                    ) : (
                      <FaCheckCircle className="fs-4 text-secondary" />
                    )}
                  </div>
                  <div className="col-md-5 ps-4">
                    {customer[0].Second_hearing_date ? (
                      <>
                        {formatDate(customer[0].Second_hearing_date)}
                        <a
                          href="#"
                          onClick={() =>
                            handleOpenPDF(
                              `${API_BASE_URL}/Content/Cases/ThirdHearing/${refNo}.pdf`
                            )
                          }
                          className="customAnchor"
                        >
                          <OverlayTrigger
                            placement="top"
                            overlay={renderTooltip}
                          >
                            <span className="ms-3">
                              <FaEye style={{ cursor: "pointer" }} />
                            </span>
                          </OverlayTrigger>
                        </a>
                      </>
                    ) : (
                      // <>{formatDate(customer[0].Soc_date)}</>
                      "N/A"
                    )}
                  </div>
                </div>

                <div className="row mx-auto">
                  <div className="col-md-6"></div>
                  <div className="col-md-1">
                    <TbMinusVertical className="fs-4 text-success" />
                  </div>
                  <div className="col-md-5"> </div>
                </div>

                {/* Third Hearing Date */}
                <div className="row mx-auto">
                  <div className="col-md-6 text-end">Third Hearing</div>
                  <div className="col-md-1">
                    {customer[0].third_hearing_date ? (
                      <>
                        <FaCheckCircle className="fs-4 text-success" />
                      </>
                    ) : (
                      <FaCheckCircle className="fs-4 text-secondary" />
                    )}
                  </div>
                  <div className="col-md-5 ps-4">
                    {customer[0].third_hearing_date ? (
                      <>
                        {formatDate(customer[0].third_hearing_date)}
                        <a
                          href="#"
                          onClick={() =>
                            handleOpenPDF(
                              `${API_BASE_URL}/Content/Cases/Soc/${refNo}.pdf`
                            )
                          }
                          className="customAnchor"
                        >
                          <OverlayTrigger
                            placement="top"
                            overlay={renderTooltip}
                          >
                            <span className="ms-3">
                              <FaEye style={{ cursor: "pointer" }} />
                            </span>
                          </OverlayTrigger>
                        </a>
                      </>
                    ) : (
                      // <>{formatDate(customer[0].Soc_date)}</>
                      "N/A"
                    )}
                  </div>
                </div>
                <div className="row mx-auto">
                  <div className="col-md-6"></div>
                  <div className="col-md-1">
                    <TbMinusVertical className="fs-4 text-success" />
                  </div>
                  <div className="col-md-5"> </div>
                </div>

                {/* Award Pass */}
                <div className="row mx-auto mb-3">
                  <div className="col-md-6 text-end">Award Pass Date</div>
                  <div className="col-md-1">
                    {customer[0].Award_date ? (
                      <>
                        <FaCheckCircle className="fs-4 text-success" />
                      </>
                    ) : (
                      <FaCheckCircle className="fs-4 text-secondary" />
                    )}
                  </div>
                  <div className="col-md-5 ps-4">
                    {customer[0].Award_date ? (
                      <>
                        {formatDate(customer[0].Award_date)}
                        <a
                          href="#"
                          onClick={() =>
                            handleOpenPDF(
                              `${API_BASE_URL}/Content/Cases/Soc/${refNo}.pdf`
                            )
                          }
                          className="customAnchor"
                        >
                          <OverlayTrigger
                            placement="top"
                            overlay={renderTooltip}
                          >
                            <span className="ms-3">
                              <FaEye style={{ cursor: "pointer" }} />
                            </span>
                          </OverlayTrigger>
                        </a>
                      </>
                    ) : (
                      // <>{formatDate(customer[0].Soc_date)}</>
                      "N/A"
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {clearForm && (
        <div className="row">
          <div className="col-md-12 d-flex justify-content-center ">
            <ClearForm
              message="Case Terminated Successfully!"
              redirectPath="/arbdashboard"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseTrackingCaseWise;


