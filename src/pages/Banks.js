import React, { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import "./Bank.css";

const Banks = () => {
  const [arbInfo, setArbInfo] = useState([]);

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    pin: "",
    mobileNo: "",
    email: "",
    designation: "",
    qualification: "",
    yearOfPassing: "",
    signature: null,
    stamp: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setArbInfo((prevData) => {
  //     const updatedData = [...prevData, formData];
  //     // Example: Save data to localStorage
  //     localStorage.setItem("arbInfo", JSON.stringify(updatedData));
  //     return updatedData;
  //     console.log(updatedData);
  //   });
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  //   setFormData({
  //     fullName: "",
  //     address: "",
  //     pin: "",
  //     mobileNo: "",
  //     email: "",
  //     designation: "",
  //     qualification: "",
  //     yearOfPassing: "",
  //     signature: null,
  //     stamp: null,
  //   });

  return (
    <div>
      <div className="col-md-12 mx-auto mt-3">
        <Form onSubmit={handleSubmit} className="form-container">
          <h3 className="text-center mb-3">Add Bank Information</h3>
          <Row className="mb-3">
            <Col xs={12} sm={12}>
              <Form.Group controlId="firstName">
                {/* <Form.Label>Full Name</Form.Label> */}
                <Form.Control
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12}>
              <Form.Group controlId="address">
                {/* <Form.Label>Address</Form.Label> */}
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={6} sm={3} md={4}>
              <Form.Group controlId="pin">
                {/* <Form.Label>PIN</Form.Label> */}
                <Form.Control
                  type="number"
                  placeholder="Enter PIN code"
                  name="pin"
                  value={formData.pin}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Form.Group controlId="mobile">
                {/* <Form.Label>Mobile</Form.Label> */}
                <Form.Control
                  type="number"
                  placeholder="Enter mobile number"
                  name="mobileNo"
                  value={formData.mobileNo}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Form.Group controlId="email">
                {/* <Form.Label>Email address</Form.Label> */}
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="text-center mt-4">
            <Col xs={12} sm={12}>
              <button type="submit" className="custBtn">
                Submit
              </button>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default Banks;
