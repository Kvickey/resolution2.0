import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/constants";
import LoadingSpinner from "../components/LoadingSpinner";
import ReusableTable from "../components/ReusableTable";
import { Form } from "react-bootstrap";
import ClearForm from "../components/Clearform";
import CustomStepper from "../components/CustomStepper";
import * as XLSX from "xlsx";

const AssignArbitrator = () => {
  const [arbitrators, setArbitrators] = useState([]);
  const [data, setData] = useState([]);
  const [unassignedLots, setUnassignedLots] = useState([]);
  const [unassignedData, setUnassignedData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showData, setShowData] = useState(false);
  const [firms, setFirms] = useState([]);
  const [selectedFirm, setSelectedFirm] = useState([]);
  const [selectedLotNo, setSelectedLotNo] = useState([]);
  const [selectedClientID, setSelectedClientID] = useState([]);
  const [selectedProductID, setSelectedProductID] = useState([]);
  const [selectedArbitrators, setSelectedArbitrators] = useState([]);
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

  // To fetch Firms
  useEffect(() => {
    const fetchFirms = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/Firms`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const parsedFirms = Array.isArray(result) ? result : JSON.parse(result); // Ensure parsedArbitrators is an array
        // console.log(parsedFirms);
        setFirms(parsedFirms);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchFirms();
  }, []);

  // console.log(firms);

  const handleFirmChange = (e) => {
    // const selectedID = e.target.value;
    setSelectedFirm(e.target.value);
    
    // setFirm(selectedID);
  };

  console.log(selectedFirm);

  // To fetch the arbitrators based on firm
  useEffect(() => {
    const fetchArbitrators = async () => {
      // setLoading(true);
      setError(null);
      const selectedFirmEncoded = encodeURIComponent(selectedFirm);
      console.log(selectedFirmEncoded);
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/arb?firm=${selectedFirmEncoded}`
          // `${API_BASE_URL}/api/products?client_id=${selectedFirm}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        const arbitrators = Array.isArray(result) ? result : JSON.parse(result);
        setSelectedArbitrators(arbitrators); // Set products data
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchArbitrators();
  }, [selectedFirm]);

  console.log(selectedArbitrators);

  // unassignedLots Fetch Code
  useEffect(() => {
    const fetchUnassignedLots = async () => {
      // setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/unassignLots`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const parsedUnassignedLots = Array.isArray(result)
          ? result
          : JSON.parse(result); // Ensure parsedArbitrators is an array
        // console.log(parsedUnassignedLots);
        setUnassignedLots(parsedUnassignedLots);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUnassignedLots();
  }, []);

  console.log(unassignedLots);

  if (loading) return <LoadingSpinner />;

  const handleGetUnassignedLots = async (item) => {
    console.log(item);
    setSelectedLotNo(item.Lot_no);
    setSelectedClientID(item.Client_id);
    setSelectedProductID(item.Product_id);
    // setSelectedArbitratorID(item.Arbitrator_id);
    setLoading(true); // Start loading
    try {
      const url = `${API_BASE_URL}/api/unassignLots?Lot_no=${item.Lot_no}&Client_id=${item.Client_id}&Product_id=${item.Product_id}`;
      console.log(url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      // console.log(result);
      const parsedUnassignedData = Array.isArray(result)
        ? result
        : JSON.parse(result);
      // const parsedUnassignedData = JSON.parse(result); // Ensure parsedArbitrators is an array
      setUnassignedData(parsedUnassignedData);
      // toast.success("Data Received Successfully", {
      //   position: toast.POSITION.BOTTOM_RIGHT,
      //   theme: "colored",
      //   autoClose: 1000,
      // });
      setShowData(true);
      handleStepChange(1);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };
  // console.log(unassignedData);

  // Pagination for unassigned Data starts
  const indexOfLastItem1 = currentPage1 * itemsPerPage;
  const indexOfFirstItem1 = indexOfLastItem1 - itemsPerPage;
  console.log(unassignedData);
  const updatedData = unassignedData.map((item, index) => {
    const {
      Case_id,
      Acc_no,
      Reference_no,
      Cust_name,
      LRN_Date,
      Lot_no,
      Cust_id,
      Client_id,
      Product_id,
      LRN_ref_no,
      Arb_id,
      Assign_date,
      Ref_date,
      Acc_date,
      Soc_date,
      Sec_17_app_date,
      First_hearing_date,
      Sec_17_order_date,
      Second_hearing_date,
      Pursis_date,
      Agreement_date,
      Award_date,
      Status,
      Is_terminate,
      Stage_id,
      Remark,
      Uploaded_date,
      ...rest
    } = item;

    const formattedLRN_Date = LRN_Date
      ? (() => {
          const [year, month, day] = LRN_Date.split("T")[0].split("-");
          return `${new Date(`${year}-${month}-${day}`).toLocaleString(
            "en-GB",
            { month: "short" }
          )} ${day}, ${year}`;
        })()
      : null;

    const formattedUploaded_Date = Uploaded_date
      ? (() => {
          const [year, month, day] = Uploaded_date.split("T")[0].split("-");
          return `${new Date(`${year}-${month}-${day}`).toLocaleString(
            "en-GB",
            { month: "short" }
          )} ${day}, ${year}`;
        })()
      : null;
    return {
      SrNo: index + 1,
      Reference_no,
      Cust_name,
      LRN_Date: formattedLRN_Date,
      Uploaded_date: formattedUploaded_Date,
      ...rest,
    };
  });
  const currentItems1 = updatedData.slice(indexOfFirstItem1, indexOfLastItem1);
  const totalPages1 = Math.ceil(updatedData.length / itemsPerPage);
  const pageNumbers1 = Array.from({ length: totalPages1 }, (_, i) => i + 1);
  // Pagination for unassigned Data ends

  if (loading) return <LoadingSpinner />;

  // the Arbitrator assignment function Starts here
  const handleAssign = () => {
    // Shuffle arbitrators array to ensure randomness
    const shuffledArbitrators = [...selectedArbitrators].sort(
      () => Math.random() - 0.5
    );

    const totalLots = unassignedData.length;
    const totalArbitrators = shuffledArbitrators.length;
    const lotsPerArbitrator = Math.floor(totalLots / totalArbitrators);
    const remainingLots = totalLots % totalArbitrators;

    // Create an array of arbitrators repeated 'lotsPerArbitrator' times
    let arbitratorPool = shuffledArbitrators.flatMap((arbitrator) =>
      Array(lotsPerArbitrator).fill(arbitrator)
    );

    // Distribute remaining lots to the arbitrators
    for (let i = 0; i < remainingLots; i++) {
      arbitratorPool.push(shuffledArbitrators[i]);
    }

    // Shuffle the arbitratorPool to randomize assignments
    arbitratorPool = arbitratorPool.sort(() => Math.random() - 0.5);

    // Object to track assignment counts
    const assignmentCounts = shuffledArbitrators.reduce((acc, arbitrator) => {
      acc[arbitrator.Arb_name] = 0;
      return acc;
    }, {});

    // Assign arbitrators randomly but equally distributed to the data
    const dataWithAssignments = unassignedData.map((item, index) => {
      const arbitrator = arbitratorPool[index]; // Randomized but equally distributed arbitrator
      // console.log(arbitrator);

      assignmentCounts[arbitrator.Arb_name] += 1;

      return {
        assignedArbitrator: arbitrator.Arb_name,
        assignedArbitratorId: arbitrator.Arb_id,
        ...item,
      };
    });

    console.log("Data with Assignments:", dataWithAssignments);
    // console.log("Assignment Counts:", assignmentCounts);

    const updatedData = dataWithAssignments.map((item, index) => {
      const {
        SR_No,
        LOT_NO,
        Acc_no,
        CUST_ID,
        assignedArbitrator,
        Reference_no,
        Cust_name,
        LRN_Date,
        Uploaded_date,
        Case_id,
        // Arb_id,
        assignedArbitratorId,
        ...rest
      } = item;

      const formattedLRN_Date = LRN_Date
        ? (() => {
            const [year, month, day] = LRN_Date.split("T")[0].split("-");
            return `${new Date(`${year}-${month}-${day}`).toLocaleString(
              "en-GB",
              { month: "short" }
            )} ${day}, ${year}`;
          })()
        : null;

      const formattedUploaded_Date = Uploaded_date
        ? (() => {
            const [year, month, day] = Uploaded_date.split("T")[0].split("-");
            return `${new Date(`${year}-${month}-${day}`).toLocaleString(
              "en-GB",
              { month: "short" }
            )} ${day}, ${year}`;
          })()
        : null;
      return {
        SrNo: index + 1,
        assignedArbitrator,
        Reference_no,
        Cust_name,
        LRN_Date: formattedLRN_Date,
        Uploaded_date: formattedUploaded_Date,
        Case_id,
        assignedArbitratorId,
        // Arb_id,
        // ...rest,
      };
    });
    setUpload(true);
    setData(updatedData);
    handleStepChange(2);

    // setFilteredDataForSelect(updatedData);
    // setAssignedData(dataWithAssignments);

    // toast.success("Arbitrator Assigned Successfully!", {
    //   position: toast.POSITION.BOTTOM_RIGHT,
    //   theme: "colored",
    //   autoClose: 1000,
    // });
    // setShowAssigned(true);
    // setShowTable(true);
    // setIsDisabled(true);
  };
  console.log(data);
  // console.log(upload);
  // the Arbitrator assignment function ends here

  // Pagination Logic for Assigned Data starts
  const totalPages2 = Math.ceil(data.length / itemsPerPage);
  const pageNumbers2 = Array.from({ length: totalPages2 }, (_, i) => i + 1);

  const indexOfLastItem2 = currentPage2 * itemsPerPage;
  const indexOfFirstItem2 = indexOfLastItem2 - itemsPerPage;
  // const updatedData = unassignedData.map((item, index) => {
  //   const { Case_id, UPLODED_DATE, ...rest } = item;
  //   return {
  //     ...rest,
  //   };
  // });
  const currentItems2 = data.slice(indexOfFirstItem2, indexOfLastItem2);
  // Pagination Logic for Assigned Data ends

  if (loading) return <LoadingSpinner />;

  const formattedData = data.map((item) => ({
    Case_id: item.Case_id,
    Arb_id: item.assignedArbitratorId,
  }));
  console.log(formattedData);

  // the data upload function starts here
  const handleUpload = async () => {
    const formattedData = data.map((item) => ({
      Case_id: item.Case_id,
      Arb_id: item.assignedArbitratorId,
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

  const handleExport = () => {
    const workbook = XLSX.utils.book_new();

    // Convert JSON data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Arbitration Data");

    // Write the workbook to a file
    XLSX.writeFile(workbook, "ArbitrationData.xlsx");
    setIsDisabled(true);
  };

  return (
    <div>
      <div className="row mb-3">
        <div className="col-md-12">
          <CustomStepper steps={steps} activeStep={activeStep} />
        </div>
      </div>

      {!unassignedLots.length > 0 && (
        <p className="text-center">No unassigned Lots Are Available</p>
      )}

      {showData && (
        <div className="row">
          <div className="col-md-4">
            {!upload && (
              <Form.Select
                aria-label="Default select example"
                onChange={handleFirmChange}
                className="custom_input"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  Choose Firm
                </option>
                {firms.map((item) => (
                  <option value={item.Firm_name}>{item.Firm_name}</option>
                ))}
              </Form.Select>
            )}
            {upload && !clearForm && (
              <button
                className="custBtn"
                onClick={handleExport}
                disabled={isDisabled}
              >
                Export To Excel
              </button>
            )}
          </div>
          <div className="col-md-3">
          </div>
          <div className="col-md-3 d-flex justify-content-end">
          </div>
          <div className="col-md-2">
            {!upload && selectedFirm.length > 0 && (
              <button className="custBtn" onClick={handleAssign}>
                Assign
              </button>
            )}
            {upload && !clearForm && (
              <button className="custBtn" onClick={handleUpload}>
                Upload
              </button>
            )}
          </div>
        </div>
      )}

      {!showData && unassignedLots.length > 0 && (
        <div className="row table-container mt-3">
          <div className="col-md-12 mx-auto table-wrapper">
            <table className="responsive-table my-3">
              <thead className="text-center">
                <tr className="table-info">
                  <th scope="col" className="text-center">
                    Sr No
                  </th>
                  <th scope="col" className="text-center">
                    Lots
                  </th>
                  <th scope="col" className="text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="">
                {unassignedLots.map((item, index) => (
                  <tr key={item.id}>
                    <td className="text-center">{index + 1}</td>
                    <td className="text-center">{item.Lots}</td>
                    <td className="text-center">
                      <button
                        onClick={() => handleGetUnassignedLots(item)}
                        variant="primary"
                        // disabled={isPending}
                        className="custBtn"
                      >
                        Show
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

export default AssignArbitrator;
