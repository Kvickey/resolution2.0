import React, { useEffect } from "react";
import { useState } from "react";
import { Pagination } from "react-bootstrap";
import LoadingSpinner from "../components/LoadingSpinner";
import { API_BASE_URL } from "../utils/constants";
import { toast, ToastContainer } from "react-toastify";
import { FaWhatsapp } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { FaMessage } from "react-icons/fa6";

const FifthHearingServices = () => {
  const [notServedLots, setNotServedLots] = useState([]);
  const [data, setData] = useState([]);
  const [showData, setShowData] = useState(false);
  const [waDone, setWaDone] = useState(false);
  const [mailDone, setMailDone] = useState(false);
  const [smsDone, setSMSDone] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotServedLots = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/notServed?s_id=2`);
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
  }, []);

  console.log(notServedLots);

  if (loading) return <LoadingSpinner />;

  const handleData = async (lot, arb_id) => {
    console.log(lot);
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/notServed?s_id=2&Lot_no=${lot}&arb_id=${arb_id}`
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

  console.log(data);

  const handleTransfer = () => {};

  const headers = data.length > 0 ? Object.keys(data[0]) : [];
  console.log(headers);

  const handleMail = async () => {
    const dataForMail = data.map((item) => ({
      Ref_no: item.Reference_no,
      Service_add: item.EMail_id,
      Service_type_id: 3,
      Service_id: item.Service_id,
      File_path: item.File_path,
      Process_id: 1,
    }));
    console.log(dataForMail);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/Services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataForMail),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to upload data: ${response.status} ${response.statusText} - ${errorText}`
        );
      }
      const result = await response.json();
      console.log("Upload response:", result);
      setMailDone(true);
      setTimeout(() => {
        toast.success("Mail Sent Successfully", {
          // position: toast.POSITION.BOTTOM_RIGHT,
          theme: "colored",
        });
      }, 50);
    } catch (error) {
      console.error("Error uploading data:", error);
      setTimeout(() => {
        toast.error(`Error: ${error.message}`, { theme: "colored" });
      }, 50);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsapp = async () => {
    console.log(data);
    const dataForWhatsapp = data.map((item) => ({
      Ref_no: item.Reference_no,
      Service_add: item.Mobile_no,
      Service_type_id: 2,
      Service_id: item.Service_id,
      File_path: item.File_path,
      Process_id: 1,
    }));
    console.log(dataForWhatsapp);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/Services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataForWhatsapp),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to upload data: ${response.status} ${response.statusText} - ${errorText}`
        );
      }
      const result = await response.json();
      console.log("Upload response:", result);
      setWaDone(true);
      setTimeout(() => {
        toast.success("Whatsapp Message Sent Successfully", {
          // position: toast.POSITION.BOTTOM_RIGHT,
          theme: "colored",
        });
      }, 50);
    } catch (error) {
      console.error("Error uploading data:", error);
      setTimeout(() => {
        toast.error(`Error: ${error.message}`, { theme: "colored" });
      }, 50);
    } finally {
      setLoading(false);
    }
  };


  const handleSMS = () => {};

  return (
    <div>
    {!showData && (
       <>
       <div>
       <h3>Fifth Hearing Services</h3>
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

    {showData && (
      <div className="mt-3">
        {/* <button
          className={`${
            waDone ? "disabledBtn" : "custBtn"
          }`}
          onClick={handleWhatsapp}
          disabled={waDone}
        >
          WhatsApp
        </button>

        <button
          className={`ms-3 ${
            mailDone ? "disabledBtn" : "custBtn"
          }`}
          onClick={handleMail}
          disabled={mailDone}
        >
          Mail
        </button>

        <button
          className={`ms-3 ${
            smsDone ? "disabledBtn" : "custBtn"
          }`}
          onClick={handleSMS}
          disabled={smsDone}
        >
          Message
        </button> */}
        <button
          className={`${
            // data[0].Wa_send_date !== 0
            // waDone
            waDone || data[0].Wa_send_date !== null
              ? "disabledBtn"
              : "custBtn"
            //  ( waDone || data[0].Wa_send_date !== 0) ? "disabledBtn" : "custBtn"
            //  ( waDone && data[0].Wa_send_date!==null) ? "disabledBtn" : "custBtn"
          } ms-3`}
          onClick={handleWhatsapp}
          disabled={waDone || data[0].Wa_send_date !== null}
        >
          <FaWhatsapp className="me-3" />
          WhatsApp
        </button>

        <button
          className={`ms-3 ${
            // mailDone ? "disabledBtn" : "custBtn"
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
          className={`ms-3 ${smsDone ? "disabledBtn" : "custBtn"}`}
          onClick={handleSMS}
          disabled={smsDone}
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

    {/* <button onClick={showToast}>Show Toast</button> */}

    <ToastContainer />
  </div>
  );
};

export default FifthHearingServices;

