import React, { useState, useEffect, useRef } from "react";
import { Table, Form, Button } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { API_BASE_URL } from "../utils/constants";
// import Banks from "./Banks";

const ProductInfo = () => {
  const [bankName, setBankName] = useState("");
  const [product, setProduct] = useState("");
  const [addBank, setAddBank] = useState(false);
  const [stamp, setStamp] = useState(null);
  const [data, setData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null); // Reference for the file input
  const [selectedClient, setSelectedClient] = useState([]); //the clients Data to populate dropdown

  // To fetch Clients Data
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await fetch(
          // "http://arb.resolutionexperts.in/api/Client"
          // "http://88.135.73.195/api/Client"
          `${API_BASE_URL}/api/Client`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const parsedClient = Array.isArray(result)
          ? result
          : JSON.parse(result); // Ensure parsedArbitrators is an array
        console.log(parsedClient);
        setSelectedClient(parsedClient);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchClient();
  }, []);

  // Load data from local storage on initial render
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("bankProducts")) || [];
    setData(savedData);
  }, []);

  // Save data to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("bankProducts", JSON.stringify(data));
  }, [data]);

  const handleBankChange = (e) => {
    const selectedID = e.target.value;
    // setSelectedClientID(selectedID);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!stamp) {
      setError("Stamp image is required.");
      return;
    }

    const newEntry = { bankName, product, stamp };

    // Check for duplicate product names
    if (data.some((item) => item.product === product && editIndex === null)) {
      setError("Product name must be unique.");
      return;
    }

    if (editIndex !== null) {
      const updatedData = data.map((item, index) =>
        index === editIndex ? newEntry : item
      );
      setData(updatedData);
      setEditIndex(null);
    } else {
      setData([...data, newEntry]);
    }

    setBankName("");
    setProduct("");
    setStamp(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input
    }
  };

  const handleEdit = (index) => {
    setBankName(data[index].bankName);
    setProduct(data[index].product);
    setStamp(data[index].stamp);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedData = data.filter((_, i) => i !== index);
    setData(updatedData);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size < 10240 || file.size > 51200) {
        setError("Stamp image size must be between 10KB and 50KB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setStamp(reader.result);
        setError(""); // Clear the error if the file is valid
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBank = () => {
    setAddBank(true);
  };

  return (
    <div className="container">
      <h2 className="mt-2">Bank Information</h2>
      <div className="row mt-3">
        <div className="col-md-12 mx-auto">
          <Form onSubmit={handleSubmit}>
            <div className="row mt-3">
              <div className="col-md-3">
                <Form.Group className="mb-3">
                  <Form.Select
                    aria-label="Default select example"
                    onChange={handleBankChange}
                    className="custom_input"
                    required
                  >
                    <option value="" disabled selected>
                      Choose a Bank
                    </option>
                    {selectedClient.map((item) => (
                      <option key={item.Client_id} value={item.Client_id}>
                        {item.client_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-1">
                <button
                  type="button"
                  className="custBtn"
                  onClick={handleAddBank}
                >
                  <FaPlus />
                </button>
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    required
                    placeholder="Enter Product Name "
                  />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    required
                    placeholder="Enter Authorized Person Name "
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label className="ps-1">Stamp</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef} // Add ref to the file input
                    required={!editIndex}
                  />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label className="ps-1">Signature</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef} // Add ref to the file input
                    required={!editIndex}
                  />
                </Form.Group>
              </div>
              <div className="col-md-4 text-center">
                <Form.Label className="d-block invisible">Submit</Form.Label>
                <button
                  type="submit"
                  variant="primary"
                  className="px-5 custBtn"
                >
                  {editIndex !== null ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </Form>
          {error && <div className="text-danger">{error}</div>}
        </div>
      </div>

      <div className="row">
        <div className="col-md-12 mx-auto">
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Bank Name</th>
                <th>Product</th>
                <th>Stamp</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.bankName}</td>
                  <td>{item.product}</td>
                  <td>
                    {item.stamp && (
                      <img
                        src={item.stamp}
                        alt="Stamp"
                        style={{ width: "50px", height: "50px" }}
                      />
                    )}
                  </td>
                  <td className="text-center">
                    <Button
                      variant="warning"
                      onClick={() => handleEdit(index)}
                      className="me-2 px-4"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(index)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      {/* {addBank && (
        <div className="row">
          <div className="col-md-12 mx-auto">
            <Banks />
          </div>
        </div>
      )} */}
    </div>
  );
};

export default ProductInfo;
