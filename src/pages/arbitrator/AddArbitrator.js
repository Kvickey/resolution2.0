import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../utils/constants";

const AddArbitrator = ({ onSave, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    Arb_name: "",
    Designation: "",
    Education: "",
    Passing_Year: "",
    Fees: "",
    Firm_name: "",
    Address: "",
    pin: "",
    Contact: "",
    Email_id: "",
    Photo: null,
    Sign: null,
    Stamp: null,
    Post_qualification: "",
    experience_date: "",
    Arb_start_date: "",
    Created_by: 1,
  });

  // ✅ Fill form if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        ...initialData, // pre-fill existing fields
        Photo: null, // keep file inputs empty (user can re-upload if needed)
        Sign: null,
        Stamp: null,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0], // store first selected file
    }));
  };

  // Handle Save - Create multipart FormData
  const handleSave = () => {
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== "") {
        data.append(key, formData[key]);
      }
    });

    // ✅ If editing, include Arb_id
    if (initialData?.Arb_id) {
      data.append("Arb_id", initialData.Arb_id);
    }

    const endpoint = initialData?.Arb_id
      ? `${API_BASE_URL}/api/UpArb` // update API
      : `${API_BASE_URL}/api/Arb`; // add API

    fetch(endpoint, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("Saved successfully:", result);
        alert(
          initialData?.Arb_id
            ? "Arbitrator updated successfully!"
            : "Arbitrator added successfully!"
        );
        if (onSave) onSave(result);
      })
      .catch((err) => {
        console.error("Error saving arbitrator:", err);
        alert("Failed to save arbitrator");
      });
  };

  // Handle Cancel - Reset + go back
  const handleCancel = () => {
    setFormData({
      Arb_name: "",
      Designation: "",
      Education: "",
      Passing_Year: "",
      Fees: "",
      Firm_name: "",
      Address: "",
      pin: "",
      Contact: "",
      Email_id: "",
      Photo: null,
      Sign: null,
      Stamp: null,
      Post_qualification: "",
      experience_date: "",
      Arb_start_date: "",
      Created_by: 1,
    });

    // clear file inputs visually
    ["Photo", "Sign", "Stamp"].forEach((id) => {
      const input = document.getElementById(id);
      if (input) input.value = "";
    });

    if (onCancel) onCancel();
  };

  return (
    <div className="container-fluid shadow-lg">
      <div className="row p-3">
        <h3 className="mt-2" style={{ color: "var(--primary-color)" }}>
          {initialData ? "EDIT ARBITRATOR" : "ADD ARBITRATOR"}
        </h3>
      </div>

      {/* Form fields */}
      <div className="row px-3">
        <div className="col-md-6 mb-3">
          <input
            placeholder="Name"
            id="Arb_name"
            className="form-control custom_input"
            value={formData.Arb_name}
            name="Arb_name"
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6 mb-3">
          <input
            placeholder="Designation"
            id="Designation"
            className="form-control custom_input"
            value={formData.Designation}
            name="Designation"
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="row px-3">
        <div className="col-md-4 mb-3">
          <input
            placeholder="Education"
            className="form-control custom_input"
            id="Education"
            value={formData.Education}
            name="Education"
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4 mb-3">
          <input
            type="number"
            placeholder="Passing Year"
            className="form-control custom_input"
            id="Passing_Year"
            value={formData.Passing_Year}
            name="Passing_Year"
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4 mb-3">
          <input
            type="number"
            placeholder="Fees"
            className="form-control custom_input"
            id="Fees"
            value={formData.Fees}
            name="Fees"
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="row px-3">
        <div className="col-md-6 mb-3">
          <input
            placeholder="Firm Name"
            className="form-control custom_input"
            id="Firm_name"
            value={formData.Firm_name}
            name="Firm_name"
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6 mb-3">
          <input
            placeholder="Address"
            className="form-control custom_input"
            id="Address"
            value={formData.Address}
            name="Address"
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="row px-3">
        <div className="col-md-4 mb-3">
          <input
            placeholder="Pincode"
            className="form-control custom_input"
            id="pin"
            value={formData.pin}
            name="pin"
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4 mb-3">
          <input
            type="number"
            placeholder="Contact"
            className="form-control custom_input"
            id="Contact"
            value={formData.Contact}
            name="Contact"
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4 mb-3">
          <input
            type="email"
            placeholder="Email"
            className="form-control custom_input"
            id="Email_id"
            value={formData.Email_id}
            name="Email_id"
            onChange={handleChange}
          />
        </div>
      </div>

      {/* File uploads */}
      <div className="row px-3">
        <div className="col-md-4 mb-3">
          <label htmlFor="Photo" className="form-label">Photo</label>
          <input
            type="file"
            accept="image/*"
            className="form-control custom_input"
            id="Photo"
            name="Photo"
            onChange={handleFileChange}
          />
        </div>

        <div className="col-md-4 mb-3">
          <label htmlFor="Sign" className="form-label">Signature</label>
          <input
            type="file"
            accept="image/*"
            className="form-control custom_input"
            id="Sign"
            name="Sign"
            onChange={handleFileChange}
          />
        </div>

        <div className="col-md-4 mb-3">
          <label htmlFor="Stamp" className="form-label">Stamp</label>
          <input
            type="file"
            accept="image/*"
            className="form-control custom_input"
            id="Stamp"
            name="Stamp"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="row py-3">
        <div className=" d-flex justify-content-center gap-2">
        {/* <div className="col-md-12 d-flex justify-content-end gap-2"> */}
          <button type="button" className="btn btn-success" onClick={handleSave}>
            {initialData ? "Update" : "Save"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddArbitrator;
