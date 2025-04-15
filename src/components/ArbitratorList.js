import React, { useEffect, useState } from "react";
import Arbitrator1 from "../assets/images/Arbitrator1.jpg";
import Arbitrator2 from "../assets/images/Arbitrator2.jpg";
import Arbitrator3 from "../assets/images/Arbitrator3.jpg";
import { Button } from "react-bootstrap";
import  "./Arbitrator.css"
import { API_BASE_URL } from "../utils/constants";

const ArbitratorList = () => {
  const [arbitrators, setArbitrators] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArbitrators = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/arbitrator`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        console.log("Fetched Arbitrators:", result); // Debugging line
        const parsedArbitrators = Array.isArray(result)
          ? result
          : JSON.parse(result); // Ensure parsedArbitrators is an array
        setArbitrators(parsedArbitrators);
        console.log(parsedArbitrators);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchArbitrators();
  }, []);

  return (
    <div className="container mt-4">
      <div className="row justify-content-center my-3 cust-row-arb  mt-3">
        {arbitrators.map((arbitrator) => (
          <div key={arbitrator.id} className="col-md-10 ">
            <div className="row d-flex justify-content-center shadow-lg">
              <div className="col-md-4 text-center my-5">
                <img src={Arbitrator1} className="img-fluid rounded " />
                <h5 className="text-center pt-3 m-0 fw-bold">
                  {arbitrator.Arb_name}
                </h5>
                <p className="text-center m-0">{arbitrator.Designation}</p>
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
                    <p className="text-left">
                    {arbitrator.Address}
                    </p>
                  </div>
                </div>
                <div className="row justify-content-evenly mt-2">
                  <div className="col-12 d-flex justify-content-evenly">
                    <button className="custBtn"> Update Arbitrator</button>
                    <button className="custBtn">
                      Delete Arbitrator
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArbitratorList;
