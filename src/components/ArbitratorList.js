import React, { useEffect, useState , useRef } from "react";
import Arbitrator1 from "../assets/images/Arbitrator1.jpg";
import Arbitrator2 from "../assets/images/Arbitrator2.jpg";
import Arbitrator3 from "../assets/images/Arbitrator3.jpg";
import { Button } from "react-bootstrap";
import "./Arbitrator.css";
import { API_BASE_URL as url } from "../utils/constants";
import LoadingSpinner from "../components/LoadingSpinner";
import "../components/animationStyle.css";

const ArbitratorList = () => {
  const [arbitrators, setArbitrators] = useState([]);
  const [error, setError] = useState(null);
  const [toggleForm, setToggleForm] = useState(false);
  const [updateForm, setUpdateForm] = useState("Update");
  const [loading, setLoading] = useState(false);
  const [apiRecall, setAPiRecall] = useState(false);
  const initialFormData = {
    Arb_name: "",
    Address: "",
    Pin: "",
    Contact_no: "",
    Email_id: "",
    Designation: "",
    Education: "",
    Firm_name: "",
    Passing_Year: "",
    Fees: "",
    Signature: null,
    Photo: null,
    Stamp: null,
    Status: 0,
    Created_by: null,
    experience_date: "",
    Arb_start_date: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [warnData, setWarnData] = useState(initialFormData);
  const photoRef = useRef("");
  const signatureRef = useRef("");
  const stampRef = useRef("");


  useEffect(() => {
    const fetchArbitrators = async () => {
      try {
        const response = await fetch(
<<<<<<< HEAD
          `${API_BASE_URL}/api/arbitrator`
=======
          // "http://arb.resolutionexperts.in/api/arbitrator"
          `${url}/api/arbitrator`
>>>>>>> 5d623531d290eacfd7b92ba137c4f09105880cbc
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const parsedArbitrators = Array.isArray(result)
          ? result
          : JSON.parse(result); // Ensure parsedArbitrators is an array
        setArbitrators(parsedArbitrators);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchArbitrators();
  }, [apiRecall]);
  const postData = async () => {
    try {
      const response = await fetch(url + "/api/Arb", {
        headers: { "Content-type": "application/json;charset=UTF-8" },
        method: updateForm === "Update" ? "PUT" : "POST",
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setToggleForm((preValue) => !preValue);
        if (updateForm !== "Update") setAPiRecall((prev) => !prev);
        else setArbitrators((prev) => ({ ...prev, formData }));
      }
    } catch (error) {
      console.error(error);
    }
  };
  const formValidation = () => {
    let warning = {
      Arb_name: "",
      Address: "",
      Pin: "",
      Contact_no: "",
      Email_id: "",
      Designation: "",
      Education: "",
      Firm_name: "",
      Passing_Year: "",
      Fees: "",
      Signature: null,
      Photo: null,
      Stamp: null,
    };
    const keys = Object.keys(warning);
    let valid = true;
    setWarnData({});
    keys.forEach((key) => {
      if (formData[key] === "" || formData[key] === null || !formData[key]) {
        warning = { ...warning, [key]: "*This field should not be empty!" };
        valid = false;
      }
    });
    if (!/^\d{10}$/.test(formData.Contact_no)) {
      warning = { ...warning, Contact_no: "*Invalid Phone Number" };
      valid = false;
    }
    if (!/^\d{6}$/.test(formData.Pin)) {
      warning = { ...warning, Pin: "*Invalid Pin Code" };
      setWarnData((prev) => ({
        ...prev,
      }));
      valid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email_id)) {
      warning = { ...warning, Email_id: "*Invalid Email" };
      valid = false;
    }
    if (!/^\d{4}$/.test(formData.Passing_Year)) {
      warning = { ...warning, Passing_Year: "*Invalid Year" };
      valid = false;
    }
    if (
      formData.Photo &&
      (formData.Photo.size > 0.5 * 1024 * 1024 ||
        (formData.Photo.type !== "image/jpg" &&
          formData.Photo.type !== "image/jpeg"))
    ) {
      warning = { ...warning, Photo: "*Invalid Image" };
      valid = false;
      photoRef.current.value = "";
    }

    if (
      formData.Signature &&
      (formData.Signature.size > 0.5 * 1024 * 1024 ||
        (formData.Signature.type !== "image/jpg" &&
          formData.Signature.type !== "image/jpeg"))
    ) {
      warning = { ...warning, Signature: "*Invalid Signature" };
      valid = false;
      signatureRef.current.value = "";
    }

    if (
      formData.Stamp &&
      (formData.Stamp.size > 0.5 * 1024 * 1024 ||
        (formData.Stamp.type !== "image/jpg" &&
          formData.Stamp.type !== "image/jpeg"))
    ) {
      warning = { ...warning, Stamp: "*Invalid Stamp" };
      valid = false;
      stampRef.current.value = "";
    }

    setWarnData(warning);
    return valid;
  };
  const handleUpdate = (data) => {
    setFormData(data);
    setToggleForm((preValue) => !preValue);
  };
  const handleChange = (e) => {
    let { name, value, files, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));

    setWarnData((prev) => ({ ...prev, [name]: "" }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormData((prev) => ({
      ...prev,
      Signature: null,
      Photo: null,
      Stamp: null,
    }));
    if (formValidation()) {
      setLoading(true);
      await postData();
      setLoading(false);
    }
  };

  const formComponent = () => {
    return (
      <div className="row justify-content-center py-3 customShadow fadeIn formHeight">
        <div className="col col-md-11 rounded">
          <h3 className="mt-2 mb-4" style={{ color: "var(--primary-color)" }}>
            {updateForm === "Update" ? "UPDATE" : "ADD"} ARBITRATOR
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="row my-2">
              <div className="col-12 col-md-4  ">
                <div className="form-floating ">
                  <input
                    placeholder="Name"
                    id="floatingInputGroup1"
                    className="form-control custom_input"
                    value={formData.Arb_name}
                    name="Arb_name"
                    onChange={handleChange}
                    autoFocus={updateForm !== "Update"}
                  />
                  <label htmlFor="floatingInputGroup1 ">Name</label>
                </div>
                <span
                  className={`${
                    window.innerWidth < 700 ? "ms-1" : ""
                  } text-danger`}
                  style={{ fontSize: "12px" }}
                >
                  {warnData.Arb_name}
                </span>
              </div>
              <div className="col-12 col-md ">
                <div className="form-floating">
                  <input
                    placeholder="Designation"
                    id="floatingInputGroup2"
                    className="form-control custom_input"
                    value={formData.Designation}
                    name="Designation"
                    onChange={handleChange}
                  />
                  <label htmlFor="floatingInputGroup2">Designation</label>
                </div>
                <span
                  className={`${
                    window.innerWidth < 700 ? "ms-1" : ""
                  } text-danger`}
                  style={{ fontSize: "12px" }}
                >
                  {warnData.Designation}
                </span>
              </div>
            </div>

            <div className="row my-2">
              <div className="col-12 col-md ">
                <div className="form-floating">
                  <input
                    placeholder="Firm Name"
                    className="form-control custom_input"
                    id="floatingInputGroup3"
                    value={formData.Firm_name}
                    name="Firm_name"
                    onChange={handleChange}
                  />
                  <label htmlFor="floatingInputGroup3">Firm Name</label>
                </div>
                <span
                  className={`${
                    window.innerWidth < 700 ? "ms-1" : ""
                  } text-danger`}
                  style={{ fontSize: "12px" }}
                >
                  {warnData.Firm_name}
                </span>
              </div>
              <div className="col-12 col-md-4 ">
                <div className="form-floating">
                  <input
                    type="number"
                    placeholder="Fees"
                    className="form-control custom_input"
                    id="floatingInputGroup4"
                    value={formData.Fees}
                    name="Fees"
                    onChange={handleChange}
                  />
                  <label htmlFor="floatingInputGroup4">Fees</label>
                </div>
                <span
                  className={`${
                    window.innerWidth < 700 ? "ms-1" : ""
                  } text-danger`}
                  style={{ fontSize: "12px" }}
                >
                  {warnData.Fees}
                </span>
              </div>
            </div>

            <div className="row my-2">
              <div className="col-12 col-md">
                <div className="form-floating">
                  <input
                    placeholder="Qualification"
                    className="form-control custom_input"
                    id="floatingInputGroup5"
                    value={formData.Education}
                    name="Education"
                    onChange={handleChange}
                  />
                  <label htmlFor="floatingInputGroup5">Qualification</label>
                </div>
                <span
                  className={`${
                    window.innerWidth < 700 ? "ms-1" : ""
                  } text-danger`}
                  style={{ fontSize: "12px" }}
                >
                  {warnData.Education}
                </span>
              </div>
              <div className="col-12 col-md">
                <div className="form-floating">
                  <input
                    placeholder="Year of Passing"
                    className="form-control custom_input"
                    id="floatingInputGroup6"
                    value={formData.Passing_Year}
                    name="Passing_Year"
                    onChange={handleChange}
                    type="number"
                  />
                  <label htmlFor="floatingInputGroup6">Year of Passing</label>
                </div>
                <span
                  className={`${
                    window.innerWidth < 700 ? "ms-1" : ""
                  } text-danger`}
                  style={{ fontSize: "12px" }}
                >
                  {warnData.Passing_Year}
                </span>
              </div>
              <div className="col-12 col-md ">
                <div className="form-floating">
                  <input
                    placeholder="Phone"
                    className="form-control custom_input"
                    id="floatingInputGroup7"
                    value={formData.Contact_no}
                    name="Contact_no"
                    onChange={handleChange}
                    type="number"
                  />
                  <label htmlFor="floatingInputGroup7">Phone</label>
                </div>
                <span
                  className={`${
                    window.innerWidth < 700 ? "ms-1" : ""
                  } text-danger`}
                  style={{ fontSize: "12px" }}
                >
                  {warnData.Contact_no}
                </span>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-md-5">
                <div className="form-floating">
                  <input
                    placeholder="Address"
                    className="form-control custom_input"
                    id="floatingInputGroup8"
                    value={formData.Address}
                    name="Address"
                    onChange={handleChange}
                  />
                  <label htmlFor="floatingInputGroup8">Address</label>
                </div>
                <span
                  className={`${
                    window.innerWidth < 700 ? "ms-1" : ""
                  } text-danger`}
                  style={{ fontSize: "12px" }}
                >
                  {warnData.Address}
                </span>
              </div>
              <div className="col-12 col-md">
                <div className="form-floating">
                  <input
                    type="number"
                    placeholder="Pincode"
                    className="form-control custom_input"
                    id="floatingInputGroup9"
                    value={formData.Pin}
                    name="Pin"
                    onChange={handleChange}
                  />
                  <label htmlFor="floatingInputGroup9">Pincode</label>
                </div>
                <span
                  className={`${
                    window.innerWidth < 700 ? "ms-1" : ""
                  } text-danger`}
                  style={{ fontSize: "12px" }}
                >
                  {warnData.Pin}
                </span>
              </div>
              <div className="col-12 col-md-4 ">
                <div className="form-floating">
                  <input
                    placeholder="Email"
                    className="form-control custom_input"
                    id="floatingInputGroup10"
                    value={formData.Email_id}
                    name="Email_id"
                    onChange={handleChange}
                  />
                  <label htmlFor="floatingInputGroup10">Email</label>
                </div>
                <span
                  className={`${
                    window.innerWidth < 700 ? "ms-1" : ""
                  } text-danger`}
                  style={{ fontSize: "12px" }}
                >
                  {warnData.Email_id}
                </span>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-md mt-3">
                <label
                  className="ms-1 my-1 text-white font-monospace rounded px-2 opacity-75"
                  style={{ backgroundColor: "var(--secondary-color)" }}
                  
                >
                  Photo
                </label>
                <input
                  type="file"
                  className="form-control custom_input m-0"
                  name="Photo"
                  onChange={handleChange}
                  ref={photoRef}
                />
                <span
                  className={`${
                    window.innerWidth < 700 ? "ms-1" : ""
                  } text-danger`}
                  style={{ fontSize: "12px" }}
                >
                  {warnData.Photo}
                </span>
              </div>
              <div className="col-12 col-md mt-3">
                <label
                  className="ms-1 my-1 text-white font-monospace rounded px-2 opacity-75"
                  style={{ backgroundColor: "var(--secondary-color)" }}
                >
                  Signature
                </label>
                <input
                  type="file"
                  className="form-control custom_input m-0"
                  name="Signature"
                  onChange={handleChange}
                />
                <span
                  className={`${
                    window.innerWidth < 700 ? "ms-1" : ""
                  } text-danger`}
                  style={{ fontSize: "12px" }}
                >
                  {warnData.Signature}
                </span>
              </div>
              <div className="col-12 col-md mt-3">
                <label
                  className="ms-1 my-1 text-white font-monospace rounded px-2 opacity-75"
                  style={{ backgroundColor: "var(--secondary-color)" }}
                >
                  Stamp
                </label>
                <input
                  type="file"
                  className="form-control custom_input m-0"
                  name="Stamp"
                  onChange={handleChange}
                />
                <span
                  className={`${
                    window.innerWidth < 700 ? "ms-1" : ""
                  } text-danger`}
                  style={{ fontSize: "12px" }}
                >
                  {warnData.Stamp}
                </span>
              </div>
            </div>
            <span className="text-secondary ms-2" style={{ fontSize: "12px" }}>
              *Image size should be less than{" "}
              <span className="fw-bold">500KB</span> and format should be{" "}
              <span className="fw-bold">JPG/JPEG</span>{" "}
            </span>
            <div className="row row-cols-auto mb-3 mt-3">
              <div className="col">
                <button className="custBtn text-nowrap px-5" type="submit">
                  {updateForm === "Update" ? "Update" : "Add"}
                </button>
              </div>
              <div className="col">
                <button
                  type="button"
                  onClick={() => setToggleForm((preValue) => !preValue)}
                  className="custBtn text-nowrap px-5"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };
  // Local form Component
  return (
    <div className="container ">
      {(loading || arbitrators.length === 0) && <LoadingSpinner />}
      {toggleForm ? (
        formComponent()
      ) : (
        <>
          <div className="row justify-content-end slideDown ">
            <div className="col-12 col-md-4 col-lg-3  ">
              <button
                onClick={() => {
                  setToggleForm((preValue) => !preValue);
                  setFormData(initialFormData);
                  setUpdateForm("");
                  setWarnData({});
                }}
                className="custBtn text-nowrap px-4"
              >
                {" "}
                Add Arbitrator
              </button>
            </div>
          </div>
          <div className="row justify-content-center my-3 cust-row-arb  mt-4 slideUp gap-4">
            {arbitrators.map((arbitrator) => (
              <div
                className="col-md-10 border rounded customShadow hoverZoom "
                key={arbitrator.Arb_id}
              >
                <div className="row my-3">
                  <div className="col-md-4">
                    <img
                      loading="lazy"
                      src={Arbitrator1}
                      className="img-fluid rounded "
                    />
                  </div>
                  <div className="col my-md-0 my-3">
                    <div className="row">
                      <div className="col-md-7">
                        <div className="row">
                          <h5
                            className=" m-0 fw-bold "
                            style={{
                              color: "var(--primary-color)",
                              fontSize: "17px",
                            }}
                          >
                            {arbitrator.Arb_name}
                          </h5>
                          <p className=" m-0 " style={{ fontSize: "14px" }}>
                            {arbitrator.Designation}
                          </p>
                          {/* <p className="m-0 cardTitle"> Mobile No :</p> */}
                          <span className="cardContent"> +91-9876543210</span>
                          {/* <p className="m-0 cardTitle"> E-mail :</p> */}
                          <span className="cardContent">
                            {" "}
                            {arbitrator.Email_id}
                          </span>
                        </div>
                      </div>
                      {window.innerWidth > 700 && (
                        <div className="col">
                          <div className="row justify-content-end row-cols-auto">
                            <div className="col">
                              <button
                                onClick={() => {
                                  setUpdateForm("Update");
                                  handleUpdate(arbitrator);
                                  setWarnData({});
                                }}
                                className="custBtn btn btn-sm text-nowrap"
                              >
                                {" "}
                                Update
                              </button>
                            </div>
                            <div className="col">
                              <button className="custBtn btn btn-sm text-nowrap">
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="row my-4">
                      <div className="col dottedBorder">
                        <div className="row ">
                          <p className="m-0 cardTitle font-monospace">
                            {" "}
                            Qualification :
                          </p>
                          <span className="cardContent">
                            {" "}
                            {arbitrator.Education}{" "}
                          </span>
                        </div>
                      </div>
                      <div className="col dottedBorder">
                        <div className="row">
                          <p className="m-0 cardTitle font-monospace">
                            {" "}
                            Year Of Passing :
                          </p>
                          <span className="cardContent">
                            {arbitrator.Passing_Year}
                          </span>
                        </div>
                      </div>
                      <div className="col ">
                        <div className="row">
                          {" "}
                          <p className="m-0 cardTitle font-monospace">
                            {" "}
                            Address :
                          </p>
                          <p className="cardContent">{arbitrator.Address}</p>
                        </div>
                      </div>
                    </div>
                    {window.innerWidth < 700 && (
                      <div className="col">
                        <div className="row justify-content-end row-cols-auto">
                          <div className="col">
                            <button
                              onClick={() => {
                                setUpdateForm("Update");
                                handleUpdate(arbitrator);
                                setWarnData({});
                              }}
                              className="custBtn btn btn-sm text-nowrap"
                            >
                              {" "}
                              Update
                            </button>
                          </div>
                          <div className="col">
                            <button className="custBtn btn btn-sm text-nowrap">
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* <div key={arbitrator.Arb_id} className="col-md-10 ">
                  <div className="row d-flex justify-content-center shadow-lg">
                    <div className="col-md-4 text-center my-5">
                      <img
                        loading="lazy"
                        src={Arbitrator1}
                        className="img-fluid rounded "
                      />
                      <h5
                        className="text-center pt-3 m-0 fw-bold"
                        style={{ color: "var(--primary-color)" }}
                      >
                        {arbitrator.Arb_name}
                      </h5>
                      <p
                        className="text-center m-0"
                        style={{ fontSize: "15px" }}
                      >
                        {arbitrator.Designation}
                      </p>
                    </div>
                    <div className="col-md-7 text-center my-5 ms-3">
                      <div className="row justify-content-evenly mt-2">
                        <div className="col-6 d-flex">
                          <p className="fw-bold"> Qualification :</p>
                          <span> {arbitrator.Education} </span>
                        </div>
                        <div className="col-6  d-flex">
                          <p className="fw-bold"> Year Of Passing :</p>
                          <span>{arbitrator.Passing_Year}</span>
                        </div>
                      </div>
                      <div className="row ">
                        <div className="col-12 d-flex">
                          <p className="fw-bold"> Designation :</p>
                          <span> {arbitrator.Designation}</span>
                        </div>
                      </div>
                      <div className="row justify-content-evenly ">
                        <div className="col-6 d-flex">
                          <p className="fw-bold"> Mobile No :</p>
                          <span> +91-9876543210</span>
                        </div>
                        <div className="col-6  d-flex">
                          <p className="fw-bold"> E-mail :</p>
                          <span> {arbitrator.Email_id}</span>
                        </div>
                      </div>
                      <div className="row justify-content-evenly ">
                        <div className="col-12 d-flex">
                          <p className="fw-bold"> Address:</p>
                          <p className="text-left">{arbitrator.Address}</p>
                        </div>
                      </div>
                      <div className="row justify-content-evenly mt-2">
                        <div className="col-12 d-flex justify-content-evenly">
                          <button
                            onClick={() => {
                              setUpdateForm("Update");
                              handleUpdate(arbitrator);
                              setWarnData({});
                            }}
                            className="custBtn text-nowrap"
                          >
                            {" "}
                            Update Arbitrator
                          </button>
                          <button className="custBtn text-nowrap">
                            Delete Arbitrator
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
          </div>
        </>
      )}
    </div>
  );
};

export default ArbitratorList;
