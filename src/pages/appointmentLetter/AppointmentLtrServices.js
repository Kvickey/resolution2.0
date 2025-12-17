import React, { useEffect } from "react";
import { useState } from "react";
import { Pagination } from "react-bootstrap";
import LoadingSpinner from "../../components/LoadingSpinner";
import { API_BASE_URL } from "../../utils/constants";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaWhatsapp } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { FaMessage } from "react-icons/fa6";
import { ProgressBar } from "react-bootstrap";

const AppointmentLtrServices = () => {
  const [notServedLots, setNotServedLots] = useState([]);
  const [data, setData] = useState([]);
  const [showData, setShowData] = useState(false);
  const [waDone, setWaDone] = useState(false);
  const [mailDone, setMailDone] = useState(false);
  const [smsDone, setSMSDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [progressText, setProgressText] = useState("");
  const [progress, setProgress] = useState(0); // 0 to 100

  useEffect(() => {
    const fetchNotServedLots = async () => {
      try {
        setLoading1(true); // 🟡 Start loading

        const response = await fetch(`${API_BASE_URL}/api/notServed?s_id=1`);
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
      } finally {
        setLoading1(false); // 🟢 Stop loading
      }
    };

    fetchNotServedLots();
  }, []);

  // useEffect(() => {
  //   const fetchNotServedLots = async () => {
  //     try {
  //       const response = await fetch(`${API_BASE_URL}/api/notServed?s_id=1`);
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       const result = await response.json();
  //       const parsedNotServedLots = Array.isArray(result)
  //         ? result
  //         : JSON.parse(result);
  //       console.log(parsedNotServedLots);
  //       setNotServedLots(parsedNotServedLots);
  //     } catch (error) {
  //       console.error("Error fetching not served lots:", error);
  //     }
  //   };

  //   fetchNotServedLots();
  // }, []);

  console.log(notServedLots);

  // Pagination logicStarts Here
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = notServedLots.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(notServedLots.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Pagination logic ends Here

  // if (loading) return <LoadingSpinner />;

  // console.log(progressText);

  const handleData = async (lot, arb_id) => {
    console.log(lot);
    console.log(arb_id);
    setLoading(true);
    const url = `${API_BASE_URL}/api/notServed?s_id=1&Lot_no=${lot}&arb_id=${arb_id}`;
    console.log(url);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/notServed?s_id=1&Lot_no=${lot}&arb_id=${arb_id}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      console.log(result);
      // const parsedUnassignedData = JSON.parse(result);
      const parsedUnassignedData = Array.isArray(result)
        ? result
        : JSON.parse(result);
      console.log(parsedUnassignedData);
      const updatedData = parsedUnassignedData.map((item, index) => {
        const { UPLODED_DATE, SR_No, LOT_NO, ...rest } = item;
        return {
          Serial_No: index + 1,
          ...rest,
        };
      });
      setData(updatedData);
      setShowData(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      setTimeout(() => {
        toast.error(`Error: ${error.message}`, { theme: "colored" });
      }, 50);
    } finally {
      setLoading(false);
    }
  };

  // console.log(data[0].Wa_send_date);

  console.log(data);

  const headers = data.length > 0 ? Object.keys(data[0]) : [];
  console.log(headers);

  // const handleMail = async () => {
  //   const dataForMail = data.map((item) => ({
  //     Ref_no: item.Reference_no,
  //     Service_add: item.EMail_id,
  //     Service_type_id: 3,
  //     Service_id: item.Service_id,
  //     File_path: item.File_path,
  //     Process_id: 1,
  //   }));
  //   console.log(dataForMail);
  //   setLoading(true);
  //   try {
  //     const response = await fetch(`${API_BASE_URL}/api/Services`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(dataForMail),
  //     });
  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       throw new Error(
  //         `Failed to upload data: ${response.status} ${response.statusText} - ${errorText}`
  //       );
  //     }
  //     const result = await response.json();
  //     console.log("Upload response:", result);
  //     setMailDone(true);
  //     setTimeout(() => {
  //       toast.success("Mail Sent Successfully", {
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

  // const handleMail = async () => {
  //   setLoading(true);
  //   setProgress(0);
  //   setProgressText("");

  //   const total = data.length;

  //   try {
  //     for (let i = 0; i < total; i++) {
  //       const item = data[i];

  //       // Update UI: Sending X of Y
  //       setProgressText(`Sending ${i + 1} of ${total}`);

  //       // Progress %
  //       const percent = Math.round(((i + 1) / total) * 100);
  //       setProgress(percent);

  //       // Single payload
  //       const payload = {
  //         Ref_no: item.Reference_no,
  //         Service_add: item.EMail_id ?? "",
  //         Service_type_id: 3,
  //         Service_id: item.Service_id ?? 0,
  //         File_path: item.File_path ?? "",
  //         Process_id: 1,
  //       };

  //       console.log("Sending:", payload);

  //       // API Call (ONE BY ONE)
  //       const response = await fetch(`${API_BASE_URL}/api/OneService`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           // Add Auth here if needed:
  //           // Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //         body: JSON.stringify(payload),
  //       });

  //       if (!response.ok) {
  //         const err = await response.text();
  //         throw new Error(
  //           `Failed on record ${i + 1}: ${response.status} ${
  //             response.statusText
  //           }\n${err}`
  //         );
  //       }

  //       const result = await response.json();
  //       console.log("Response:", result);
  //     }

  //     // All done
  //     setMailDone(true);

  //     toast.success("All mails sent successfully!", {
  //       theme: "colored",
  //     });
  //   } catch (error) {
  //     console.error("Error:", error);
  //     toast.error(error.message, { theme: "colored" });
  //   } finally {
  //     // Reset loader
  //     setLoading(false);

  //     // Optional reset
  //     setTimeout(() => {
  //       setProgress(0);
  //       setProgressText("");
  //     }, 500);
  //   }
  // };

  const handleMail = async () => {
    setLoading(true);
    setProgress(0); // progress = current record number
    setProgressText(""); // text "Sending X of Y"
    const total = data.length;

    try {
      for (let i = 0; i < total; i++) {
        const item = data[i];

        // UI update
        const current = i + 1;
        setProgress(current); // <--- IMPORTANT (your progress bar uses progress & total)
        setProgressText(`Sending ${current} of ${total}`);

        const payload = {
          Ref_no: item.Reference_no,
          Service_add: item.EMail_id,
          Service_type_id: 3,
          Service_id: item.Service_id,
          File_path: item.File_path,
          Process_id: 1,
        };

        console.log("Sending:", payload);

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
            `Failed on record ${current}: ${response.status} ${response.statusText}\n${err}`
          );
        }

        const result = await response.json();
        console.log("Response:", result);
      }
      // FINISHED
      setMailDone(true);
      toast.success("All mails sent successfully!", { theme: "colored" });
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message, { theme: "colored" });
    } finally {
      setLoading(false);

      // Optional auto-reset
      setTimeout(() => {
        setProgress(0);
        setProgressText("");
      }, 100);
    }
  };

  const handleWhatsapp = async () => {
    setLoading(true);
    setProgress(0);
    setProgressText("");

    const total = data.length;

    try {
      for (let i = 0; i < total; i++) {
        const item = data[i];

        // UI update
        const current = i + 1;
        setProgress(current);
        setProgressText(`Sending ${current} of ${total}`);

        const payload = {
          Ref_no: item.Reference_no,
          Service_add: item.Mobile_no ?? "",
          Service_type_id: 2,
          Service_id: item.Service_id ?? 0,
          File_path: item.File_path ?? "",
          Process_id: 1,
        };

        console.log("WhatsApp Sending:", payload);

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
            `WhatsApp failed on record ${current}: ${response.status} ${response.statusText}\n${err}`
          );
        }

        const result = await response.json();
        console.log("WhatsApp Response:", result);
      }

      setWaDone(true);
      toast.success("All WhatsApp messages sent successfully!", {
        theme: "colored",
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message, { theme: "colored" });
    } finally {
      setLoading(false);

      setTimeout(() => {
        setProgress(0);
        setProgressText("");
      }, 100);
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
  //     Process_id: 1,
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

  // const handleSMS = async () => {
  //   // console.log(data);
  //   // alert("Cliced");
  //   const dataForSMS = data.map((item) => ({
  //     Ref_no: item.Reference_no,
  //     Service_add: item.Mobile_no,
  //     Service_type_id: 1,
  //     Service_id: item.Service_id,
  //     File_path: item.File_path,
  //     Process_id: 1,
  //   }));
  //   console.log(dataForSMS);
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
  //     console.log("Upload response:", result);
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

    const total = data.length;

    try {
      for (let i = 0; i < total; i++) {
        const item = data[i];

        // UI update
        const current = i + 1;
        setProgress(current);
        setProgressText(`Sending ${current} of ${total}`);

        const payload = {
          Ref_no: item.Reference_no,
          Service_add: item.Mobile_no ?? "",
          Service_type_id: 1,
          Service_id: item.Service_id ?? 0,
          File_path: item.File_path ?? "",
          Process_id: 1,
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

        const result = await response.json();
        console.log("SMS Response:", result);
      }

      setSMSDone(true);
      toast.success("All SMS sent successfully!", { theme: "colored" });
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message, { theme: "colored" });
    } finally {
      setLoading(false);

      setTimeout(() => {
        setProgress(0);
        setProgressText("");
      }, 100);
    }
  };

  return (
    <div>
      {!showData && (
        <>
          <div>
            <h3>Appointment Letter Services</h3>
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
                  {loading1 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        <p>Loading...</p>
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((item, index) => (
                      <tr key={item.id}>
                        <td className="text-center">
                          {indexOfFirstItem + index + 1}
                        </td>
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
                    ))
                  )}
                </tbody>
                {/* <tbody>
                    {currentItems.map((item, index) => (
                      <tr key={item.id}>
                        <td className="text-center">
                          {indexOfFirstItem + index + 1}
                        </td>
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
                  </tbody> */}
              </table>
            </div>
          </div>
        </>
      )}

      {showData && !loading && (
        <div className="mt-3">
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

          <button
            className={`${
              smsDone || data[0].Sms_send_date !== null
                ? "disabledBtn"
                : "custBtn"
            } ms-3`}
            onClick={handleSMS}
            // disabled={smsDone}
          >
            <FaMessage className="me-3" />
            Message
          </button>

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
        <div style={{ width: "300px", marginTop: "10px" }}>
          <p style={{ fontWeight: "bold", color: "#172639" }}>{progressText}</p>

          {/* <ProgressBar now={progress} label={`${progress}%`} /> */}
        </div>
      )}

      {/* Pagination Controls Starts Here */}
      {showData && !loading && (
        <div className="d-flex justify-content-center mt-3">
          <Pagination>
            <Pagination.Prev
              onClick={() =>
                currentPage > 1 && handlePageChange(currentPage - 1)
              }
              disabled={currentPage === 1}
            />
            {Array.from({ length: totalPages }, (_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === currentPage}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() =>
                currentPage < totalPages && handlePageChange(currentPage + 1)
              }
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      )}
      {/* Pagination Controls Ends Here */}

      <ToastContainer />
    </div>
  );
};

export default AppointmentLtrServices;
