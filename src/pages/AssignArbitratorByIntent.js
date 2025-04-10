import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/constants";
import LoadingSpinner from "../components/LoadingSpinner";
import ReusableTable from "../components/ReusableTable";
import { Form } from "react-bootstrap";
import ClearForm from "../components/Clearform";
import CustomStepper from "../components/CustomStepper";
import * as XLSX from "xlsx";

const AssignArbitratorByIntent = () => {
  const [arbitrators, setArbitrators] = useState([]);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [refNo, setRefNo] = useState("");
  const [data, setData] = useState([]);
  const [newdata, setNewData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showData, setShowData] = useState(false);
  const [assign, setAssign] = useState(false);
  const [arbitratorId, setArbitratorId] = useState(0);
  const [arbitratorName, setArbitratorName] = useState("");
  const [upload, setUpload] = useState(false);
  const [clearForm, setClearForm] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);

  // for unassigned Data
  const [currentPage1, setCurrentPage1] = useState(1);
  // const itemsPerPage = 10;
  // const [pageNumbers1, setPageNumbers1] = useState([]);
  // for assigned Data
  const [currentPage2, setCurrentPage2] = useState(1);
  const itemsPerPage = 10;
  // const [pageNumbers2, setPageNumbers2] = useState([]);

  // To fetch the arbitrators
  useEffect(() => {
    const fetchArbitrators = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/Arbitrator`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        const arbitrators = Array.isArray(result) ? result : JSON.parse(result);
        // console.log(products);
        setArbitrators(arbitrators); // Set products data
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchArbitrators();
  }, []);

  console.log(arbitrators);

  useEffect(() => {
    const fetchRefInfo = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/Case?Ref_no=${referenceNumber}`
        );
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to upload data: ${response.status} ${response.statusText} - ${errorText}`
          );
        }
        const result = await response.json(); // Process the response
        console.log(result);
        const parsedData = Array.isArray(result) ? result : JSON.parse(result); // Ensure parsedArbitrators is an array
        //   console.log(result);
        setData(parsedData);
      } catch (error) {
        console.error("Error uploading data:", error);
        alert(`Error uploading data: ${error.message}`);
      }
    };
    fetchRefInfo();
  }, [refNo]);

  console.log(data);

  if (loading) return <LoadingSpinner />;

  // const handleArbitratorChange = (e) => {
  //   setSelectedArbitrators(e.target.value);
  //   setAssign(true);
  // };

  // console.log(selectedArbitrators);

  // the Arbitrator assignment function Starts here
  const handleArbitratorChange = (e) => {
    const selectedArbitrator = JSON.parse(e.target.value); // Parse the stringified object
    // const arbitratorId = selectedArbitrator.id;
    // const arbitratorName = selectedArbitrator.name;
    setArbitratorId(selectedArbitrator.id);
    setArbitratorName(selectedArbitrator.name);
    setAssign(true);

    // Now, you can use arbitratorId and arbitratorName as needed
    // console.log(arbitratorId, arbitratorName); // Store them in your state or perform any other action
  };

  console.log(arbitratorId);
  console.log(arbitratorName);

  const handleAssign = () => {
    setNewData(
      data.map((item) => ({
        ...item, // Spread the existing object
        Arb_id: arbitratorId, // Update Arb_id
        Arb_name: arbitratorName, // Update Arb_name
      }))
    );
    setUpload(true);
  };

  console.log(newdata);

  const updatedData = newdata.map((item, index) => {
    const { SR_No, Lot_no, Cust_name, Arb_name, ...rest } = item;
    return {
      SrNo: index + 1,
      Lot_no,
      Cust_name,
      Arb_name,
      ...rest,
    };
  });
  // const dataFortable = newData
  // console.log(upload);
  // the Arbitrator assignment function ends here

  // Pagination Logic for Assigned Data starts
  const totalPages1 = Math.ceil(data.length / itemsPerPage);
  const pageNumbers1 = Array.from({ length: totalPages1 }, (_, i) => i + 1);

  const indexOfLastItem1 = currentPage1 * itemsPerPage;
  const indexOfFirstItem1 = indexOfLastItem1 - itemsPerPage;
  // const updatedData = unassignedData.map((item, index) => {
  //   const { Case_id, UPLODED_DATE, ...rest } = item;
  //   return {
  //     ...rest,
  //   };
  // });
  const currentItems1 = data.slice(indexOfFirstItem1, indexOfLastItem1);
  // Pagination Logic for Assigned Data ends

  // Pagination Logic for Assigned Data starts
  const totalPages2 = Math.ceil(updatedData.length / itemsPerPage);
  const pageNumbers2 = Array.from({ length: totalPages2 }, (_, i) => i + 1);

  const indexOfLastItem2 = currentPage2 * itemsPerPage;
  const indexOfFirstItem2 = indexOfLastItem2 - itemsPerPage;
  // const updatedData = unassignedData.map((item, index) => {
  //   const { Case_id, UPLODED_DATE, ...rest } = item;
  //   return {
  //     ...rest,
  //   };
  // });
  const currentItems2 = updatedData.slice(indexOfFirstItem2, indexOfLastItem2);
  // Pagination Logic for Assigned Data ends

  if (loading) return <LoadingSpinner />;

  // const formattedData = data.map((item) => ({
  //   Case_id: item.Case_id,
  //   Arb_id: item.assignedArbitratorId,
  // }));
  // console.log(formattedData);

  // the data upload function starts here
  const handleUpload = async () => {
    const formattedData = updatedData.map((item) => ({
      Case_id: item.Case_id,
      Arb_id: arbitratorId,
    }));

    console.log(formattedData);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/assignArb`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        throw new Error(` Response is not OK Error: ${response.status}`);
      }
      const result = await response.json();
      console.log("Success:", result);
      // toast("Arbitrator assigned Successfully");
      handleStepChange(3);
      setClearForm(true);
    } catch (error) {
      console.error("Error uploading data:", error);
      alert(`Error uploading data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  // the data upload function ends here

  // For the customStepper starts Here
  const steps = ["Select Lot", "Assign Arbitrator", "Upload Data"];

  // Function to move to a specific step in Stepper Component
  const handleStepChange = (step) => {
    setActiveStep(step);
  };
  // For the customStepper ends Here

  const handleRefNoChange = (event) => {
    setReferenceNumber(event.target.value);
  };

  console.log(referenceNumber);

  const handleClick = () => {
    // alert("Clicked")
    setRefNo(referenceNumber);
    setShowData(true);
  };

  return (
    <div>
      <div className="row mb-3">
        <div className="col-md-12">
          <CustomStepper steps={steps} activeStep={activeStep} />
        </div>
      </div>

      {!showData && (
        <div className="row  ms-3">
          <div className="col-md-4">
            <Form.Control
              type="text"
              className="custom_input"
              placeholder="Enter Reference No"
              onChange={handleRefNoChange}
            />
          </div>
          <div className="col-md-2 ms-3">
            <button
              className=" btn btn-primary px-5 getDataBtn"
              onClick={handleClick}
            >
              Show
            </button>
          </div>
        </div>
      )}

      {showData && (
        <div className="row  ms-3">
          <div className="col-md-4">
            {!upload && (
              <Form.Select
                aria-label="Default select example"
                onChange={handleArbitratorChange}
                className="custom_input"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  Choose Arbitrator
                </option>
                {arbitrators.map((item) => (
                  <option
                    key={item.Arb_id}
                    value={JSON.stringify({
                      id: item.Arb_id,
                      name: item.Arb_name,
                    })}
                  >
                    {item.Arb_name}
                  </option>
                ))}
              </Form.Select>
            )}
          </div>
          <div className="col-md-4"></div>
          <div className="col-md-2"></div>
          <div className="col-md-2">
            {assign && !upload && (
              <button className="custBtn" onClick={handleAssign}>
                Assign
              </button>
            )}
            {upload && (
              <button className="custBtn" onClick={handleUpload}>
                Upload
              </button>
            )}
          </div>
        </div>
      )}

      {showData && !upload && (
        <div className="row">
          <div className="col-md-12">
            <ReusableTable
              data={currentItems1}
              currentPage={currentPage1}
              pageNumbers={pageNumbers1}
              setCurrentPage={setCurrentPage1}
            />
          </div>
        </div>
      )}

      {upload && !clearForm && (
        <div className="row">
          <div className="col-md-12">
            <ReusableTable
              data={currentItems2}
              currentPage={currentPage2}
              pageNumbers={pageNumbers2}
              setCurrentPage={setCurrentPage2}
            />
          </div>
        </div>
      )}

      {clearForm && (
        <div className="row">
          <div className="col-md-12 d-flex justify-content-center ">
            <ClearForm
              message="Arbitrator Assigned Successfully!"
              redirectPath="/instdashboard"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignArbitratorByIntent;
