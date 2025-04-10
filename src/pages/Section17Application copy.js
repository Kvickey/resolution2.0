import React, { useEffect, useState } from "react";
import { Button, Form, Pagination } from "react-bootstrap";
import "./UploadExcel.css";
import { toast, ToastContainer } from "react-toastify";

const Section17Application = () => {
  const [data, setData] = useState([]);
  const [selectedClient, setSelectedClient] = useState([]); //the clients Data to populate dropdown
  const [selectedProduct, setSelectedProduct] = useState([]); //to add the product from the dropdown
  const [arbitrator, setArbitrator] = useState([]); //to add the product from the dropdown
  const [whatsappStatus, setWhatsappStatus] = useState([]); //to add the product from the dropdown
  const [error, setError] = useState(null);
  const [error1, setError1] = useState(null);
  const [error2, setError2] = useState(null);
  const [selectedProductID, setSelectedProductID] = useState(null);
  const [selectedClientID, setSelectedClientID] = useState(null);
  const [selectedLotNo, setSelectedLotNo] = useState(null);
  const [selectedArbitratorID, setSelectedArbitratorID] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [status, setStatus] = useState(false);
  const [showPDF, setShowPDF] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  // To fetch Clients DaTA
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(
          "http://arb.resolutionexperts.in/api/Client"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const parsedClient = Array.isArray(result)
          ? result
          : JSON.parse(result); // Ensure parsedArbitrators is an array
        // console.log(parsedClient);
        setSelectedClient(parsedClient);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  console.log(selectedClient);

  // API Call for Product data
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null); // Reset error state
      try {
        const response = await fetch(
          `http://arb.resolutionexperts.in/api/products?client_id=${selectedClientID}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        const parsedProducts = Array.isArray(result)
          ? result
          : JSON.parse(result); // Ensure parsedArbitrators is an array
        console.log(parsedProducts);
        setSelectedProduct(parsedProducts); // Set products data
      } catch (error) {
        setError1(error);
      } finally {
        setLoading1(false);
      }
    };

    fetchProduct();
  }, [selectedClientID]);

  // API Call for Arbitrator
  useEffect(() => {
    const fetchArbitrator = async () => {
      setLoading(true);
      setError(null); // Reset error state
      try {
        const response = await fetch(
          "http://arb.resolutionexperts.in/api/arbitrator"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        const parsedArbitrators = Array.isArray(result)
          ? result
          : JSON.parse(result); // Ensure parsedArbitrators is an array
        console.log(parsedArbitrators);
        setArbitrator(parsedArbitrators); // Set products data
      } catch (error) {
        setError1(error);
      } finally {
        setLoading(false);
      }
    };

    fetchArbitrator();
  }, []);

  console.log(arbitrator);

  // OnChange Events

  const handleSelectChange = (e) => {
    const selectedID = e.target.value;
    setSelectedClientID(selectedID);
  };

  const handleProductChange = (e) => {
    const selectedID = e.target.value;
    setSelectedProductID(selectedID);
  };

  const handleArbitratorChange = (e) => {
    const selectedID = e.target.value;
    setSelectedArbitratorID(selectedID);
  };

  const handleLotNoChange = (e) => {
    const selectedID = e.target.value;
    setSelectedLotNo(selectedID);
  };

  console.log(selectedProductID);
  console.log(selectedClientID);
  console.log(selectedLotNo);
  console.log(selectedArbitratorID);

  // Show Data Logic Goes here
  const handleData = async () => {
    setLoading(true); // Start loading before fetching data
    try {
      const response = await fetch(
        `http://arb.resolutionexperts.in/api/RefLots?Lot_no=${selectedLotNo}&Client_id=${selectedClientID}&Product_id=${selectedProductID}&Arb_id=${selectedArbitratorID}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      const parsedData = Array.isArray(result) ? result : JSON.parse(result);
      // const updatedData = parsedData.map((item) => {
      //   const { assign_id, Arbitrator_id, Case_id, UPLODED_DATE, ...rest } =
      //     item;
      //   return {
      //     ...rest,
      //   };
      // });
      // console.log(updatedData);
      setData(parsedData);
      setTotalPages(Math.ceil(parsedData.length / itemsPerPage));
      // setShowTable(true);
      // handleStepChange(1)
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  console.log(data);
  const headers = data.length > 0 ? Object.keys(data[0]) : [];
  console.log(headers);

  // Function for generate thr SOC
  const handleGenerateSec17appl = async () => {
    setLoading(true); // Start loading before fetching data
    try {
      // Fetch the PDF file from the API
      const response = await fetch(
        `http://97.74.80.85/api/Refletter?Lot_no=${selectedLotNo}&Client_id=${selectedClientID}&Product_id=${selectedProductID}&Arb_id=${selectedArbitratorID}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Convert the response to a Blob
      const pdfBlob = await response.blob();
      console.log(pdfBlob);
      // Create a URL for the Blob
      const pdfUrl1 = URL.createObjectURL(pdfBlob);
      console.log(pdfUrl);
      // Set the PDF URL to the state
      setPdfUrl(pdfUrl1);
      // setPdfUrl(pdfUrl);
      setShowPDF(true);
      // handleStepChange(2);
    } catch (error) {
      console.error("Error fetching and displaying the PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function for upload thr SOC
  const handleUploadSec17appl = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        // "http://192.168.9.135:8000/api/SaveRef?Lot_no=1&Client_id=1&Product_id=2&Arb_id=1"
        // `http://192.168.9.135:8000/api/SaveRef?Lot_no=${selectedLotNo}&Client_id=${selectedClientID}&Product_id=${selectedProductID}&Arb_id=${selectedArbitratorID}`
        // `http://192.168.43.135:8000/api/SaveRefCase?Lot_no=${selectedLotNo}&Client_id=${selectedClientID}&Product_id=${selectedProductID}&Arb_id=${selectedArbitratorID}`
        `http://localhost:8000/api/SaveRefCase?Lot_no=${selectedLotNo}&Client_id=${selectedClientID}&Product_id=${selectedProductID}&Arb_id=${selectedArbitratorID}`
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to upload data: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const result = await response.json(); // Process the response
      // console.log(result);
      // setShowServices(true);
      // setClearForm(true);
      // handleStepChange(3);
      // handleStepChange(4);
    } catch (error) {
      console.error("Error uploading data:", error);
      alert(`Error uploading data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // // Data to be sent for detail
  // const dataToBeSent = {
  //   Client_id: selectedClientID,
  //   Product_id: selectedProductID,
  //   Lot_No: selectedLotNo,
  //   Arbitrator_id: selectedArbitratorID,
  // };

  // Logic For Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPagesToShow = 5; // Maximum number of page buttons to show

  const generatePaginationItems = () => {
    const pageItems = [];
    let startPage = Math.max(1, currentPage - Math.floor(totalPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + totalPagesToShow - 1);

    if (endPage - startPage + 1 < totalPagesToShow) {
      startPage = Math.max(1, endPage - totalPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageItems.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Pagination.Item>
      );
    }
    return pageItems;
  };

  return (
    <>
      <div className="container">
        {/* Top Lable */}
        <div className="row">
          {/* {!clearForm && ( */}
          <div className="col-md-6">
            <h4 className="my-3 ms-1">Section 17 Application</h4>
          </div>
          {/* )} */}
          {/* <div className="col-md-6 mt-3">
            {showTable && !showPDF && (
              <Button
                className="btn btn-primary getDataBtn"
                onClick={handleGenerateSOC}
              >
                Generate RD
              </Button>
            )}
            {showTable && showPDF && !showServices && (
              <Button
                className="btn btn-primary getDataBtn"
                onClick={handleUploadSOC}
              >
                Upload RD
              </Button>
            )} */}
          {/* {showServices && (
              <Button
                className="btn btn-primary getDataBtn"
                onClick={handleServices}
              >
                Services
              </Button>
            )} */}
        </div>

        <div className="row align-items-center justify-content-evenly">
          {/* To Select The Client Bank */}
          <div className="col-md-5">
            <div className="row">
              <div className="col-md-6">
                <Form.Select
                  aria-label="Default select example"
                  onChange={handleSelectChange}
                  className="custom_input"
                >
                  <option value="" selected>
                    Choose a Bank
                  </option>
                  {selectedClient.map((item) => (
                    <option key={item.Client_id} value={item.Client_id}>
                      {item.client_name}
                    </option>
                  ))}
                </Form.Select>
              </div>

              {/* To Select The pRoduct Of the Bank */}
              <div className="col-md-6">
                <Form.Select
                  aria-label="Default select example"
                  onChange={handleProductChange}
                  className="custom_input"
                >
                  <option value="" selected>
                    Choose a Product
                  </option>
                  {selectedProduct.map((item) => (
                    <option key={item.Product_id} value={item.Product_id}>
                      {item.Product_name}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </div>
          </div>

          {/* To enter the Lot No */}
          <div className="col-md-2">
            <Form.Control
              type="number"
              className="custom_input"
              placeholder="Enter Lot No"
              onChange={handleLotNoChange}
            />
          </div>

          {/* To Get The arbitrator */}
          <div className="col-md-3">
            <Form.Select
              aria-label="Default select example"
              onChange={handleArbitratorChange}
              className="custom_input"
            >
              <option value="" selected>
                Choose Arbitrator
              </option>
              {arbitrator.map((item) => (
                <option key={item.Arb_id} value={item.Arb_id}>
                  {item.Arb_name}
                </option>
              ))}
            </Form.Select>
          </div>

          {/* For Button */}
          <div className="col-md-2">
            <Button className="btn btn-primary getDataBtn" onClick={handleData}>
              GetData
            </Button>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 mt-3">
            <div className="table-responsive">
              {data.length > 0 && !showPDF && (
                <table className="table table-striped table-bordered table-hover mt-3 text-center">
                  <thead>
                    <tr>
                      {headers.map((header) => (
                        <th key={header}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item, index) => (
                      <tr
                        key={index}
                        style={{
                          maxHeight: "50px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        className="text-center custom_fz"
                      >
                        {headers.map((header) => (
                          <td key={header}>{item[header]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {totalPages > 1 && (
              <Pagination className="justify-content-center">
                <Pagination.Prev
                  onClick={() =>
                    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
                  }
                />
                {generatePaginationItems()}
                <Pagination.Next
                  onClick={() =>
                    setCurrentPage((prev) =>
                      prev < totalPages ? prev + 1 : prev
                    )
                  }
                />
              </Pagination>
            )}
          </div>
        </div>

        <ToastContainer />
      </div>
    </>
  );
};

export default Section17Application;
