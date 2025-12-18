import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../utils/constants";
import { Form } from "react-bootstrap";
import "../ReferenceDraftReports.css";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../components/AuthProvider";

const AwardReports = () => {
  const [data, setData] = useState([]);
  const [selectedClient, setSelectedClient] = useState([]); //the clients Data to populate dropdown
  const [selectedProduct, setSelectedProduct] = useState([]); //to add the product from the dropdown
  const [selectedProductID, setSelectedProductID] = useState(null);
  const [selectedClientID, setSelectedClientID] = useState(null);
  const [selectedLotNo, setSelectedLotNo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [clearForm, setClearForm] = useState(false);
    const { user} = useAuth();
    const [arbId, setArbId] = useState("");
  
    useEffect(() => {
      // console.log(user);
      setArbId(user[0].Ref_id);
    }, [user]);
  
    console.log(arbId);

  // To fetch Clients(Bank) DaTA
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/Client`);
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

  // console.log(selectedClient);

  // API Call for Product data
  useEffect(() => {
    const fetchProduct = async () => {
      setError(null); // Reset error state
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/products?client_id=${selectedClientID}`
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
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [selectedClientID]);

  const handleSelectChange = (e) => {
    const selectedID = e.target.value;
    setSelectedClientID(selectedID);
  };

  const handleProductChange = (e) => {
    const selectedID = e.target.value;
    setSelectedProductID(selectedID);
  };

  const handleLotNoChange = (e) => {
    const selectedID = e.target.value;
    setSelectedLotNo(selectedID);
  };

  console.log(selectedClientID);
  console.log(selectedProductID);
  console.log(selectedLotNo);

  const handleData = async () => {
    setLoading(true); // Start loading before fetching data

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/ServiceData?Lot_no=${selectedLotNo}&Client_id=${selectedClientID}&Product_id=${selectedProductID}&Process_id=8&Arb_id=${arbId}`
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
      // setAllData(parsedData);
      // setData(updatedData);
      setData(parsedData);
      // setTotalPages(Math.ceil(updatedData.length / itemsPerPage));
      setShowTable(true);
      // handleStepChange(1)
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  console.log(data);
  if (loading) return <LoadingSpinner />;

  return (
    <div className="container">
      {!clearForm && !showTable && (
        <>
          <h3 className="ps-3 pt-3">Award Report</h3>
          <div className="row align-items-center justify-content-evenly my-3">
            {/* To Select The Client Bank */}
            <div className="col-md-3">
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
            <div className="col-md-3">
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

            {/* To enter the Lot No */}
            <div className="col-md-3">
              <Form.Control
                type="number"
                className="custom_input"
                placeholder="Enter Lot No"
                onChange={handleLotNoChange}
              />
            </div>

            {/* For Button */}
            <div className="col-md-3">
              {/* {!showTable && ( */}
              <button className="custBtn" onClick={handleData}>
                Show Data
              </button>
              {/* )} */}
            </div>
          </div>
        </>
      )}

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
                        // className={
                        //   response.mail_status === "Read"
                        //     ? "statusDelivered border"
                        //     : "statusPending border"
                        // }
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
    </div>
  );
};

export default AwardReports;

