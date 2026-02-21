import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../utils/constants";
import { Form } from "react-bootstrap";
import * as XLSX from "xlsx";
import { useAuth } from "../../components/AuthProvider";
import "../ReferenceDraftReports.css";

const ServiceReports = () => {
  const [data, setData] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedClientID, setSelectedClientID] = useState("");
  const [selectedProductID, setSelectedProductID] = useState("");
  const [selectedLotNo, setSelectedLotNo] = useState("");
  const [processType, setProcessType] = useState("");
  const [processId, setProcessId] = useState(null);
  const [arbId, setArbId] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Set Arbitrator ID
  useEffect(() => {
    if (user && user.length > 0) {
      setArbId(user[0].Ref_id);
    }
  }, [user]);

  // Fetch Clients
  useEffect(() => {
    const fetchClients = async () => {
      const res = await fetch(`${API_BASE_URL}/api/Client`);
      const result = await res.json();
      setClients(Array.isArray(result) ? result : JSON.parse(result));
    };
    fetchClients();
  }, []);

  // Fetch Products
  useEffect(() => {
    if (!selectedClientID) return;

    const fetchProducts = async () => {
      const res = await fetch(
        `${API_BASE_URL}/api/products?client_id=${selectedClientID}`
      );
      const result = await res.json();
      setProducts(Array.isArray(result) ? result : JSON.parse(result));
    };
    fetchProducts();
  }, [selectedClientID]);

  // Process Mapping
  const processMapping = {
    "Appointment Letter": 1,
    "Acceptance Letter": 2,
    "SOC": 3,
    "Section 17 Application": 4,
    "Section 17 Order": 5,
    "Second Hearing": 6,
    "Third Hearing":7,
    "Award Pass":8
  };

  const handleProcessChange = (e) => {
    const value = e.target.value;
    setProcessType(value);
    setProcessId(processMapping[value]);
  };

  const handleData = async () => {
    if (
      !selectedClientID ||
      !selectedProductID ||
      !selectedLotNo ||
      !processId
    ) {
      alert("Please select all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/ServiceData?Lot_no=${selectedLotNo}&Client_id=${selectedClientID}&Product_id=${selectedProductID}&Process_id=${processId}&Arb_id=${arbId}`
      );

      const result = await response.json();
      const parsed = Array.isArray(result) ? result : JSON.parse(result);
      setData(parsed);
      setShowTable(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Service_Report");
    XLSX.writeFile(workbook, `${processType} Service Report.xlsx`);
  };

  return (
    <div className="container">
      <h3 className="ps-3 pt-3">Service Reports</h3>

      {/* Filters */}
      <div className="row align-items-center justify-content-evenly my-3">
        {/* Client */}
        <div className="col-md-3">
          <Form.Select onChange={(e) => setSelectedClientID(e.target.value)}>
            <option value="">Choose Bank</option>
            {clients.map((item) => (
              <option key={item.Client_id} value={item.Client_id}>
                {item.client_name}
              </option>
            ))}
          </Form.Select>
        </div>

        {/* Product */}
        <div className="col-md-3">
          <Form.Select onChange={(e) => setSelectedProductID(e.target.value)}>
            <option value="">Choose Product</option>
            {products.map((item) => (
              <option key={item.Product_id} value={item.Product_id}>
                {item.Product_name}
              </option>
            ))}
          </Form.Select>
        </div>

        {/* Lot No */}
        <div className="col-md-2">
          <Form.Control
            type="number"
            placeholder="Enter Lot No"
            onChange={(e) => setSelectedLotNo(e.target.value)}
          />
        </div>

        {/* Process Type */}
        <div className="col-md-2">
          <Form.Select onChange={handleProcessChange}>
            <option value="">Select Process</option>
            {Object.keys(processMapping).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </Form.Select>
        </div>

        {/* Button */}
        <div className="col-md-2">
          <button className="custBtn" onClick={handleData}>
            {loading ? "Loading..." : "Show Data"}
          </button>
        </div>
      </div>

      {/* Export */}
      {showTable && data.length > 0 && (
        <div className="text-end mb-3">
          <button className="custBtn" onClick={exportToExcel}>
            Export Report
          </button>
        </div>
      )}

      {/* Table */}
      {showTable && (
        <div className="row">
          {/* <h3>Appointment Letter Report</h3> */}
          {/* {responses.length > 0 && ( */}
          <div className="table-container mt-3">
            <div className="table-wrapper">
              <table className="responsive-table">
                <thead className="">
                  <tr className="text-center border">
                    <th rowSpan={2} className="border">
                      Sr No
                    </th>
                    <th rowSpan={2} className="text-center border">
                      Name
                    </th>
                    <th colSpan={2} className="text-center border">
                      Whatsapp
                    </th>
                    <th colSpan={2} className="text-center border">
                      Mail
                    </th>
                    <th colSpan={2} className="text-center border">
                      Message
                    </th>
                    {/* <th rowSpan={2}>Lot No</th> */}
                    <th rowSpan={2} className="border">
                      Mobile No
                    </th>
                    <th rowSpan={2} className="border">
                      E-mail
                    </th>
                    <th rowSpan={2} className="border">
                      REFERENCE_NO
                    </th>
                  </tr>
                  <tr>
                    <th className="border">Delivery</th>
                    <th className="border">Read</th>
                    <th className="border">Delivery</th>
                    <th className="border">Read</th>
                    <th className="border">Delivery</th>
                    <th className="border">Read</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((response, index) => (
                    <tr key={index}>
                      <td className="border">{index + 1}</td>
                      <td>{response.Cust_name}</td>
                      <td
                        className={
                          response.wa_status === null
                            ? "statusPending border"
                            : "statusSend border"
                        }
                      >
                        {response.wa_status === null ? "Pending" : "Sent"}
                      </td>
                      <td
                        className={
                          response.Wa_read_datetime === null
                            ? "statusNotRead border"
                            : "statusDelivered border"
                          // response.Wa_read_datetime === "Read "
                          //   ? "statusDelivered border"
                          //   : response.Wa_read_datetime === "Not Read"
                          //   ? "statusNotRead border"
                          //   : "statusPending border"
                        }
                      >
                        {response.Wa_read_datetime === null
                          ? "Pending"
                          : "Read"}
                      </td>

                      <td
                        className={
                          response.mail_status === null
                            ? "statusPending border"
                            : "statusDelivered border"
                        }
                      >
                        {response.mail_status === null ? "Pending" : "Sent"}
                      </td>
                      <td
                        className={
                          response.Mail_read_datetime === null
                            ? "statusNotRead border"
                            : "statusPending border"
                            ? "statusDelivered border"
                            : response.mail_send_date === "Not Read"
                        }
                      >
                        {response.Mail_read_datetime === null
                          ? "Pending"
                          : "Read"}
                      </td>

                      {/* Sms service Report */}
                      <td
                        className={
                          response.DeliveryStatus === "Delivered"
                            ? "statusDelivered border"
                            : response.DeliveryStatus === "Rejected"
                            ? "statusRejected border"
                            : "statusPending border"
                        }
                      >
                        {response.DeliveryStatus === null
                          ? "Not Sent"
                          : response.DeliveryStatus === "Rejected"
                          ? "Rejected"
                          : response.DeliveryStatus === "Delivered"
                          ? "Delivered"
                          : response.DeliveryStatus}
                      </td>

                      <td
                        className={
                          response.Sms_read_datetime !== null
                            ? "statusDelivered border"
                            : "statusPending border"
                        }
                      >
                        {response.Sms_read_datetime !== null
                          ? "Read"
                          : "Pending"}
                      </td>

                      <td className="border">{response.Mobile_no}</td>
                      <td className="border">{response.Email_id}</td>
                      <td className="border">{response.Reference_no}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* {showTable && (
        <div className="table-container">
          <div className="table-wrapper">
            <table className="responsive-table">
              <thead>
                <tr className="text-center border">
                  <th>Sr No</th>
                  <th>Name</th>
                  <th>Whatsapp</th>
                  <th>Mail</th>
                  <th>SMS</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Reference No</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.Cust_name}</td>
                    <td>{item.wa_status ? "Sent" : "Not Sent"}</td>
                    <td>{item.mail_status ? "Sent" : "Not Sent"}</td>
                    <td>{item.DeliveryStatus || "Pending"}</td>
                    <td>{item.Mobile_no}</td>
                    <td>{item.Email_id}</td>
                    <td>{item.Reference_no}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default ServiceReports;
