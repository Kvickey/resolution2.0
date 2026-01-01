import React, { useEffect } from "react";
import { useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { API_BASE_URL } from "../../utils/constants";
import { toast, ToastContainer } from "react-toastify";
import { FaWhatsapp } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { FaMessage } from "react-icons/fa6";
import { useAuth } from "../../components/AuthProvider";
import { Container, Row, Col } from "react-bootstrap";

const ThirdHearingService = () => {
  const [notServedLots, setNotServedLots] = useState([]);
  const [data, setData] = useState([]);
  const [showData, setShowData] = useState(false);
  const [waDone, setWaDone] = useState(false);
  const [mailDone, setMailDone] = useState(false);
  const [smsDone, setSMSDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [arb_id, setArb_id] = useState("");
  const [progressText, setProgressText] = useState("");
  const [progress, setProgress] = useState(0); // 0 to 100
  const [total, setTotal] = useState(0);

  useEffect(() => {
    console.log(user);
    setArb_id(user[0].Ref_id);
  }, [user]);

  // console.log(arb_id);

  useEffect(() => {
    if (!arb_id) return;
    const fetchNotServedLots = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/notServed?s_id=7&arb_id=${arb_id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const parsedNotServedLots = Array.isArray(result)
          ? result
          : JSON.parse(result);
        console.log(parsedNotServedLots);
        setNotServedLots(parsedNotServedLots);
      } catch (error) {
        console.error("Error fetching not served lots:", error);
      }
    };

    fetchNotServedLots();
  }, [arb_id]);

  console.log(notServedLots);

  // if (loading) return <LoadingSpinner />;

  const handleData = async (lot) => {
    console.log(lot);
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/notServed?s_id=7&Lot_no=${lot}&arb_id=${arb_id}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      const parsedNotServedLotsData = Array.isArray(result)
        ? result
        : JSON.parse(result);
      // const parsedUnassignedData = JSON.parse(result);
      // console.log(parsedUnassignedData);
      const updatedData = parsedNotServedLotsData.map((item, index) => {
        const { UPLODED_DATE, SR_No, Case_id, LOT_NO, ...rest } = item;
        return {
          Serial_No: index + 1,
          ...rest,
          Case_id,
        };
      });
      setData(updatedData);
      setShowData(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // console.log(data);

  const headers = data.length > 0 ? Object.keys(data[0]) : [];
  // console.log(headers);

  // const handleMail = async () => {
  //   setLoading(true);
  //   setProgress(0); // progress = current record number
  //   setProgressText(""); // text "Sending X of Y"
  //   const total = data.length;

  //   try {
  //     for (let i = 0; i < total; i++) {
  //       const item = data[i];

  //       // UI update
  //       const current = i + 1;
  //       setProgress(current); // <--- IMPORTANT (your progress bar uses progress & total)
  //       setProgressText(`Sending ${current} of ${total}`);

  //       const payload = {
  //         Ref_no: item.Reference_no,
  //         Service_add: item.EMail_id,
  //         Service_type_id: 3,
  //         Service_id: item.Service_id,
  //         File_path: item.File_path,
  //         Process_id: 7,
  //       };

  //       console.log("Sending:", payload);

  //       const response = await fetch(`${API_BASE_URL}/api/OneService`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(payload),
  //       });

  //       if (!response.ok) {
  //         const err = await response.text();
  //         throw new Error(
  //           `Failed on record ${current}: ${response.status} ${response.statusText}\n${err}`
  //         );
  //       }

  //       const result = await response.json();
  //       console.log("Response:", result);
  //     }
  //     // FINISHED
  //     setMailDone(true);
  //     toast.success("All mails sent successfully!", { theme: "colored" });
  //   } catch (error) {
  //     console.error("Error:", error);
  //     toast.error(error.message, { theme: "colored" });
  //   } finally {
  //     setLoading(false);

  //     // Optional auto-reset
  //     setTimeout(() => {
  //       setProgress(0);
  //       setProgressText("");
  //     }, 100);
  //   }
  // };
  const handleMail = async () => {
    setLoading(true);
    setProgress(0);
    setProgressText("");

    const totalCount = data.length; // local
    setTotal(totalCount); // 👈 save to state

    try {
      for (let i = 0; i < totalCount; i++) {
        const item = data[i];

        const current = i + 1;
        setProgress(current);
        setProgressText(`Sending ${current} of ${totalCount}`);

        const payload = {
          Ref_no: item.Reference_no,
          Service_add: item.EMail_id,
          Service_type_id: 3,
          Service_id: item.Service_id,
          File_path: item.File_path,
          Process_id: 7,
        };

        const response = await fetch(`${API_BASE_URL}/api/OneService`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const err = await response.text();
          throw new Error(
            `Failed on record ${current}: ${response.status} ${response.statusText}\n${err}`
          );
        }

        await response.json();
      }

      setMailDone(true);
      toast.success("All mails sent successfully!", { theme: "colored" });
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message, { theme: "colored" });
    } finally {
      setLoading(false);

      setTimeout(() => {
        setProgress(0);
        setProgressText("");
        setTotal(0); // 👈 reset
      }, 200);
    }
  };

  // const handleWhatsapp = async () => {
  //   console.log(data);
  //   const dataForWhatsapp = data.map((item) => ({
  //     Ref_no: item.Reference_no,
  //     Service_add: item.Mobile_no,
  //     Service_type_id: 2,
  //     Service_id: item.Service_id,
  //     File_path: item.File_path,
  //     Process_id: 7,
  //   }));
  //   console.log(dataForWhatsapp);
  //   setLoading(true);
  //   try {
  //     const response = await fetch(`${API_BASE_URL}/api/Services`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(dataForWhatsapp),
  //     });
  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       throw new Error(
  //         `Failed to upload data: ${response.status} ${response.statusText} - ${errorText}`
  //       );
  //     }
  //     const result = await response.json();
  //     console.log("Upload response:", result);
  //     setWaDone(true);
  //     setTimeout(() => {
  //       toast.success("Whatsapp Message Sent Successfully", {
  //         // position: toast.POSITION.BOTTOM_RIGHT,
  //         theme: "colored",
  //       });
  //     }, 50);
  //   } catch (error) {
  //     console.error("Error uploading data:", error);
  //     setTimeout(() => {
  //       toast.error(`Error: ${error.message}`, { theme: "colored" });
  //     }, 50);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleWhatsapp = async () => {
    setLoading(true);
    setProgress(0);
    setProgressText("");

    const totalCount = data.length;
    setTotal(totalCount);

    try {
      for (let i = 0; i < totalCount; i++) {
        const item = data[i];
        const current = i + 1;

        setProgress(current);
        setProgressText(`Sending ${current} of ${totalCount}`);

        const payload = {
          Ref_no: item.Reference_no,
          Service_add: item.Mobile_no ?? "",
          Service_type_id: 2,
          Service_id: item.Service_id ?? 0,
          File_path: item.File_path ?? "",
          Process_id: 7,
        };

        const response = await fetch(`${API_BASE_URL}/api/OneService`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const err = await response.text();
          throw new Error(
            `WhatsApp failed on record ${current}: ${response.status} ${response.statusText}\n${err}`
          );
        }

        await response.json();
      }

      setWaDone(true);
      toast.success("All WhatsApp messages sent successfully!", {
        theme: "colored",
      });
    } catch (error) {
      console.error(error);
      toast.error(error.message, { theme: "colored" });
    } finally {
      setLoading(false);

      setTimeout(() => {
        setProgress(0);
        setProgressText("");
        setTotal(0);
      }, 100);
    }
  };

  // const handleSMS = async () => {
  //   // console.log(data);
  //   const dataForSMS = data.map((item) => ({
  //     Ref_no: item.Reference_no,
  //     Service_add: item.Mobile_no,
  //     Service_type_id: 1,
  //     Service_id: item.Service_id,
  //     File_path: item.File_path,
  //     Process_id: 7,
  //   }));
  //   // console.log(dataForSMS);
  //   setLoading(true);
  //   try {
  //     const response = await fetch(`${API_BASE_URL}/api/Services`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(dataForSMS),
  //     });
  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       throw new Error(
  //         `Failed to upload data: ${response.status} ${response.statusText} - ${errorText}`
  //       );
  //     }
  //     const result = await response.json();
  //     // console.log("Upload response:", result);
  //     setSMSDone(true);
  //     setTimeout(() => {
  //       toast.success("SMS Sent Successfully", {
  //         // position: toast.POSITION.BOTTOM_RIGHT,
  //         theme: "colored",
  //       });
  //     }, 50);
  //   } catch (error) {
  //     console.error("Error uploading data:", error);
  //     setTimeout(() => {
  //       toast.error(`Error: ${error.message}`, { theme: "colored" });
  //     }, 50);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSMS = async () => {
    setLoading(true);
    setProgress(0);
    setProgressText("");

    const totalCount = data.length; // save total to state
    setTotal(totalCount);

    try {
      for (let i = 0; i < totalCount; i++) {
        const item = data[i];
        const current = i + 1;

        // Update progress UI
        setProgress(current);
        setProgressText(`Sending ${current} of ${totalCount}`);

        const payload = {
          Ref_no: item.Reference_no,
          Service_add: item.Mobile_no ?? "",
          Service_type_id: 1, // SMS type
          Service_id: item.Service_id ?? 0,
          File_path: item.File_path ?? "",
          Process_id: 7,
        };

        console.log("SMS Sending:", payload);

        const response = await fetch(`${API_BASE_URL}/api/OneService`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const err = await response.text();
          throw new Error(
            `SMS failed on record ${current}: ${response.status} ${response.statusText}\n${err}`
          );
        }

        await response.json();
        console.log("SMS Response:", item.Reference_no);
      }

      setSMSDone(true);
      toast.success("All SMS sent successfully!", { theme: "colored" });
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message, { theme: "colored" });
    } finally {
      setLoading(false);

      // Reset progress and total after a short delay
      setTimeout(() => {
        setProgress(0);
        setProgressText("");
        setTotal(0);
      }, 100);
    }
  };

  return (
    <div>
      {!showData && (
        <>
          <div>
            <h3>Third Hearing Services</h3>
          </div>
          <div className="row table-container mt-3">
            <div className="col-md-12 mx-auto table-wrapper">
              <table className="responsive-table">
                <thead className="text-center">
                  <tr className="table-info">
                    <th scope="col" className="text-center">
                      Sr No
                    </th>
                    <th scope="col" className="text-center">
                      Lots
                    </th>
                    <th scope="col" className="text-center">
                      Arbitrator
                    </th>
                    <th scope="col" className="text-center">
                      Services
                    </th>
                    <th scope="col" className="text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {notServedLots.map((item, index) => (
                    <tr key={item.id}>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-center">{item.Lots}</td>
                      <td className="text-center">{item.Arb_name}</td>
                      <td className="text-center">
                        <span>
                          <span className="p-3 border rounded-start-4">
                            {item.Wa_send_date === 0 ? (
                              <FaWhatsapp
                                style={{ color: "Red", fontSize: "25px" }}
                              />
                            ) : (
                              <FaWhatsapp
                                style={{ color: "Green", fontSize: "25px" }}
                              />
                            )}
                          </span>
                          <span className="p-3 border">
                            {item.Mail_send_date === 0 ? (
                              <IoMdMail
                                style={{ color: "Red", fontSize: "25px" }}
                              />
                            ) : (
                              <IoMdMail
                                style={{ color: "green", fontSize: "25px" }}
                              />
                            )}
                          </span>
                          <span className="p-3 border rounded-end-4">
                            {item.Sms_send_date === 0 ? (
                              <FaMessage
                                style={{ color: "Red", fontSize: "25px" }}
                              />
                            ) : (
                              <FaMessage
                                style={{ color: "Green", fontSize: "25px" }}
                              />
                            )}
                          </span>
                        </span>
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() => handleData(item.Lots, item.Arb_id)}
                          variant="success"
                          className="custBtn"
                        >
                          Show Data
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {showData && !loading && (
        <div className="mt-3">
          {/* For Whatsapp Service */}
          <button
            className={`${
              waDone || data[0].Wa_send_date !== null
                ? "disabledBtn"
                : "custBtn"
            } ms-3`}
            onClick={handleWhatsapp}
            disabled={waDone || data[0].Wa_send_date !== null}
          >
            <FaWhatsapp className="me-3" />
            WhatsApp
          </button>

          {/* For Mail Service */}
          <button
            className={`ms-3 ${
              mailDone || data[0].Mail_send_date !== null
                ? "disabledBtn"
                : "custBtn"
            }`}
            onClick={handleMail}
            disabled={mailDone}
          >
            <IoMdMail className="me-3" />
            Mail
          </button>

          {/* For SMS Service */}
          <button
            className={`ms-3 ${
              smsDone || data[0].Sms_send_date !== null
                ? "disabledBtn"
                : "custBtn"
            }`}
            onClick={handleSMS}
            disabled={smsDone}
          >
            <FaMessage className="me-3" />
            Message
          </button>

          {/* For Showing the Data for service */}
          <div className="table-container mt-3">
            <div className="table-wrapper">
              <table className="responsive-table">
                <thead>
                  <tr>
                    {headers.map((header) => (
                      <th key={header}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index}>
                      {headers.map((header) => (
                        <td key={header}>{item[header]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <Row className="justify-content-center mt-4">
          <Col xs={12} className="d-flex justify-content-center">
            <div
              style={{
                width: "80%", // responsive width
                maxWidth: "900px", // upper limit
                padding: "16px",
                borderRadius: "12px",
                background: "#fff",
                boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
              }}
            >
              <p
                style={{
                  marginBottom: "10px",
                  fontWeight: 600,
                  color: "#172639",
                  textAlign: "center",
                }}
              >
                {progressText || `Processing ${progress} of ${total}`}
              </p>

              <div
                style={{
                  width: "100%",
                  height: "14px",
                  backgroundColor: "#e9ecef",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: total
                      ? `${Math.round((progress / total) * 100)}%`
                      : "0%",
                    height: "100%",
                    backgroundColor: "#EAA637",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>
          </Col>
        </Row>
      )}

      <ToastContainer />
    </div>
  );
};

export default ThirdHearingService;
