import React, { useEffect, useState } from "react";
import { Button, Form, Pagination, Modal } from "react-bootstrap";
import { FaFilePdf } from "react-icons/fa";
import { API_BASE_URL } from "../../utils/constants";
import "./CaseTrackCasewise1.css";

const CaseTrackingLotWise1 = () => {
  const [data, setData] = useState([]);
  const [selectedClient, setSelectedClient] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [selectedClientID, setSelectedClientID] = useState(null);
  const [selectedProductID, setSelectedProductID] = useState(null);
  const [selectedLotNo, setSelectedLotNo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // ✅ PDF MODAL STATE
  const [showModal, setShowModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  const handleOpenPDF = (url) => {
    setPdfUrl(url);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setPdfUrl("");
  };

  // -----------------------------
  // FETCH CLIENTS
  // -----------------------------
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/Client`)
      .then((res) => res.json())
      .then((result) => {
        const parsed = Array.isArray(result) ? result : JSON.parse(result);
        setSelectedClient(parsed);
      });
  }, []);

  // -----------------------------
  // FETCH PRODUCTS
  // -----------------------------
  useEffect(() => {
    if (!selectedClientID) return;

    fetch(`${API_BASE_URL}/api/products?client_id=${selectedClientID}`)
      .then((res) => res.json())
      .then((result) => {
        const parsed = Array.isArray(result) ? result : JSON.parse(result);
        setSelectedProduct(parsed);
      });
  }, [selectedClientID]);

  // -----------------------------
  // FETCH LOT DATA
  // -----------------------------
  const handleData = async () => {
    const response = await fetch(
      `${API_BASE_URL}/api/Lot?Lot_no=${selectedLotNo}&Client_id=${selectedClientID}&Product_id=${selectedProductID}`
    );

    const result = await response.json();
    const parsed = Array.isArray(result) ? result : JSON.parse(result);

    setData(parsed);
  };

  console.log(data);
  

  const formatDate = (dateTimeString) => {
    const dateString = dateTimeString.split("T")[0];
    const [year, month, day] = dateString.split("-");
    return `${month}/${day}/${year}`;
  };

  // -----------------------------
  // INLINE DATE + PDF ICON UI
  // -----------------------------
  const renderDateWithPDF = (date, folder, refNo) => {
    if (!date) return "N/A";

    return (
      <div className="d-flex justify-content-center align-items-center gap-2">
        <span>{formatDate(date)}</span>
        <FaFilePdf
          className="pdf-table-icon"
          onClick={() =>
            handleOpenPDF(
              `${API_BASE_URL}/Content/Cases/${folder}/${refNo}.pdf`
            )
          }
        />
      </div>
    );
  };

  // -----------------------------
  // PREPARE TABLE DATA
  // -----------------------------
  const updatedData = data.map((item, index) => ({
    Sr_No: index + 1,
    CUST_NAME: item.Cust_name,
    REFERENCE_NO: item.Reference_no,
    Appointment_Letter: renderDateWithPDF(
      item.Ref_date,
      "Ref",
      item.Reference_no
    ),
    Acceptance_Letter: renderDateWithPDF(
      item.Acc_date,
      "Acc",
      item.Reference_no
    ),
    First_Hearing: renderDateWithPDF(
      item.First_hearing_date,
      "Acc",
      item.Reference_no
    ),
    Second_Hearing: renderDateWithPDF(
      item.Second_hearing_date,
      "SecondHearing",
      item.Reference_no
    ),
    Third_Hearing: renderDateWithPDF(
      item.third_hearing_date,
      "ThirdHearing",
      item.Reference_no
    ),
    SOC: renderDateWithPDF(item.Soc_date, "SOC", item.Reference_no),
    Section17_Application: renderDateWithPDF(
      item.Sec_17_app_date,
      "SEC_17_App",
      item.Reference_no
    ),
    Award_Pass: renderDateWithPDF(
      item.Award_date,
      "AwardPass",
      item.Reference_no
    ),
  }));

  const headers = updatedData.length > 0 ? Object.keys(updatedData[0]) : [];

  // -----------------------------
  // PAGINATION
  // -----------------------------
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = updatedData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div className="container">
      <h4 className="my-3">Case Tracking Lotwise</h4>

      <div className="row align-items-center mb-3">
        <div className="col-md-3">
          <Form.Select onChange={(e) => setSelectedClientID(e.target.value)}>
            <option value="">Choose Bank</option>
            {selectedClient.map((item) => (
              <option key={item.Client_id} value={item.Client_id}>
                {item.client_name}
              </option>
            ))}
          </Form.Select>
        </div>

        <div className="col-md-3">
          <Form.Select onChange={(e) => setSelectedProductID(e.target.value)}>
            <option value="">Choose Product</option>
            {selectedProduct.map((item) => (
              <option key={item.Product_id} value={item.Product_id}>
                {item.Product_name}
              </option>
            ))}
          </Form.Select>
        </div>

        <div className="col-md-3">
          <Form.Control
            type="number"
            placeholder="Enter Lot No"
            onChange={(e) => setSelectedLotNo(e.target.value)}
          />
        </div>

        <div className="col-md-2">
          <Button onClick={handleData}>Track</Button>
        </div>
      </div>

      {/* TABLE */}
      {updatedData.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered text-center">
            <thead className="table-warning">
              <tr>
                {headers.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((row, i) => (
                <tr key={i}>
                  {headers.map((header) => (
                    <td key={header}>{row[header]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINATION */}
      {updatedData.length > 0 && (
        <Pagination className="justify-content-center mt-3">
          <Pagination.Prev
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          />

          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index}
              active={currentPage === index + 1}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}

          <Pagination.Next
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          />
        </Pagination>
      )}

      {/* PDF MODAL */}
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
    </div>
  );
};

export default CaseTrackingLotWise1;
