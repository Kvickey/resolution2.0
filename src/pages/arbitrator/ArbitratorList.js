import React from "react";
import Arbitrator1 from "../../assets/images/Arbitrator1.jpg";
import "./Arbitrator.css";

const ArbitratorList = ({ arbitrators, onAdd, onUpdate, onDelete }) => {
  return (
    <>
      <div className="row justify-content-end slideDown">
        <div className="col-12 col-md-4 col-lg-3">
          <button onClick={onAdd} className="custBtn text-nowrap px-4">
            Add Arbitrator
          </button>
        </div>
      </div>

      <div className="row justify-content-center my-3 cust-row-arb mt-4 slideUp gap-4">
        {arbitrators.map((arbitrator) => (
          <div
            className="col-md-10 border rounded customShadow hoverZoom"
            key={arbitrator.Arb_id}
          >
            <div className="row my-3">
              <div className="col-md-4">
                <img
                  loading="lazy"
                  src={`https://api.resolutionexperts.in/Content/Upload/Arbitrator/Photo/${arbitrator.PhotoURL}?t=${new Date().toISOString().slice(0,10).replace(/-/g,"")}`}
                  // src={Arbitrator1}
                  className="img-fluid rounded"
                  alt="Arbitrator"
                />
              </div>

              <div className="col-md-8 my-md-0 my-3">
                <div className="row">
                  <div className="col-md-5">
                    <h5 className="m-0 fw-bold" style={{ fontSize: "17px" }}>
                      {arbitrator.Arb_name}
                    </h5>
                    <p className="m-0" style={{ fontSize: "14px" }}>
                      {arbitrator.Designation}
                    </p>
                    <p className="cardContent mb-0">Phone - {arbitrator.Contact_no}</p>
                    <p className="cardContent mb-0">Mail Id - {arbitrator.Email_id}</p>
                  </div>
                  {window.innerWidth > 700 && (
                    <div className="col-md-7">
                      <div className="row justify-content-end row-cols-auto">
                        <div className="col">
                          <button
                            onClick={() => onUpdate(arbitrator)}
                            className="custBtn btn btn-sm text-nowrap"
                          >
                            Update
                          </button>
                        </div>
                        <div className="col">
                          <button
                            onClick={() => onDelete(arbitrator.Arb_id)}
                            className="custBtn btn btn-sm text-nowrap"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="row mb-4">
                  <div className="col dottedBorder">
                    <p className="m-0 cardTitle font-monospace">
                      Qualification :
                    </p>
                    <span className="cardContent">{arbitrator.Education}</span>
                  </div>
                  <div className="col dottedBorder">
                    <p className="m-0 cardTitle font-monospace">
                      Year Of Passing :
                    </p>
                    <span className="cardContent">{arbitrator.Passing_Year}</span>
                  </div>
                  <div className="col">
                    <p className="m-0 cardTitle font-monospace">Address :</p>
                    <p className="cardContent">{arbitrator.Address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ArbitratorList;
