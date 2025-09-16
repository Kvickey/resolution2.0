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
    Pin: "",
    Contact_no: "",
    Email_id: "",
    Photo: null,
    Sign: null,
    Stamp: null,
    Post_qualification: "",
    experience_date: "",
    Arb_start_date: "",
    Created_by: 1,
  });
  const [errors, setErrors] = useState({});

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
  }, [initialData]);

  // useEffect(() => {
  //   console.log("Initial Data:", initialData);
  //   console.log("Updated formData:", formData);
  // }, [formData]);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  // Handle Validation Part
  const validateForm = () => {
    let newErrors = {};

    if (!formData.Arb_name.trim()) newErrors.Arb_name = "Name is required";
    if (!formData.Designation.trim())
      newErrors.Designation = "Designation is required";
    if (!formData.Education.trim())
      newErrors.Education = "Education is required";

    if (!formData.Passing_Year) {
      newErrors.Passing_Year = "Passing Year is required";
    } else if (
      isNaN(formData.Passing_Year) ||
      String(formData.Passing_Year).length !== 4
    ) {
      newErrors.Passing_Year = "Enter a valid 4-digit year";
    }

    if (!formData.Fees) {
      newErrors.Fees = "Fees is required";
    } else if (isNaN(formData.Fees) || Number(formData.Fees) <= 0) {
      newErrors.Fees = "Enter a valid fee amount";
    }

    if (!formData.Firm_name.trim())
      newErrors.Firm_name = "Firm name is required";
    if (!formData.Address.trim()) newErrors.Address = "Address is required";

    if (!formData.Pin) {
      newErrors.Pin = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.Pin)) {
      newErrors.pin = "Enter a valid 6-digit pincode";
    }

    if (!formData.Contact_no) {
      newErrors.Contact_no = "Contact number is required";
    } else if (!/^\d{10}$/.test(formData.Contact_no)) {
      newErrors.Contact_no = "Enter a valid 10-digit contact number";
    }

    if (!formData.Email_id.trim()) {
      newErrors.Email_id = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.Email_id)
    ) {
      newErrors.Email_id = "Enter a valid email";
    }

    setErrors(newErrors);
    console.log(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Handle Save
  const handleSave = () => {
    const isValid = validateForm();

    if (!isValid) {
      return;
    }
    // alert("clicked");

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      const value = formData[key];

      //Remove Fields
      if (
        key === "Created_date" ||
        key === "PhotoURL" ||
        key === "SignatureURL" ||
        key === "Status"
      ) {
        return;
      }

      //  set these fields to empty
      if (key === "Photo" || key === "Sign" || key === "Stamp") {
        data.append(key, "");
        return;
      }

      // date formating
      if (value !== null && value !== "" && value !== "0001-01-01T00:00:00") {
        if (key === "experience_date" || key === "Arb_start_date") {
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();
            const formattedDate = `${month}/${day}/${year}`;
            data.append(key, formattedDate);
          }
        } else if (key === "Contact_no") {
          data.append("Contact", value);
        } else {
          data.append(key, value);
        }
      }
    });

    data.append("Post_qualification", "");


    for (let pair of data.entries()) {
      console.log(pair[0], pair[1]);
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
      Pin: "",
      Contact_no: "",
      Email_id: "",
      Photo: null,
      Sign: null,
      Stamp: null,
      Post_qualification: "",
      experience_date: "",
      Arb_start_date: "",
      Created_by: 1,
    });

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
          {errors.Arb_name && (
            <small className="text-danger">{errors.Arb_name}</small>
          )}
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
          {errors.Designation && (
            <small className="text-danger">{errors.Designation}</small>
          )}
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
          {errors.Education && (
            <small className="text-danger">{errors.Education}</small>
          )}
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
          {errors.Passing_Year && (
            <small className="text-danger">{errors.Passing_Year}</small>
          )}
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
          {errors.Fees && <small className="text-danger">{errors.Fees}</small>}
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
          {errors.Firm_name && (
            <small className="text-danger">{errors.Firm_name}</small>
          )}
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
          {errors.Address && (
            <small className="text-danger">{errors.Address}</small>
          )}
        </div>
      </div>

      <div className="row px-3">
        <div className="col-md-4 mb-3">
          <input
            placeholder="Pincode"
            className="form-control custom_input"
            id="Pin"
            value={formData.Pin}
            name="Pin"
            onChange={handleChange}
          />
          {errors.pin && <small className="text-danger">{errors.Pin}</small>}
        </div>
        <div className="col-md-4 mb-3">
          <input
            type="number"
            placeholder="Contact"
            className="form-control custom_input"
            id="Contact_no"
            value={formData.Contact_no}
            name="Contact_no"
            onChange={handleChange}
          />
          {errors.Contact && (
            <small className="text-danger">{errors.Contact_no}</small>
          )}
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
          {errors.Email_id && (
            <small className="text-danger">{errors.Email_id}</small>
          )}
        </div>
      </div>

      {/* File uploads */}
      <div className="row px-3">
        <div className="col-md-4 mb-3">
          <label htmlFor="Photo" className="form-label">
            Photo
          </label>
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
          <label htmlFor="Sign" className="form-label">
            Signature
          </label>
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
          <label htmlFor="Stamp" className="form-label">
            Stamp
          </label>
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
          <button
            type="button"
            className="btn btn-success"
            onClick={handleSave}
          >
            {initialData ? "Update" : "Save"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddArbitrator;
