import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported
import { Button, Form, Modal, Pagination } from "react-bootstrap";
import "./VirtualMeeting.css";
import { API_BASE_URL } from "../utils/constants";
import FileUploadForm from "../components/FileUploadForm";
import LoadingSpinner from "../components/LoadingSpinner";
import { MdDeleteForever } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { IoMdAdd } from "react-icons/io";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";
import { generateTimeOptions } from "../utils/timeUtils";
import { useAuth } from "../components/AuthProvider";
import ClearForm from "../components/Clearform";

const VirtualMeetingForThirdHearing = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDate2, setSelectedDate2] = useState(null);
  const [selectedDate3, setSelectedDate3] = useState(null);
  const [formattedDate, setFormattedDate] = useState(null);
  const [date2, setDate2] = useState(null);
  const [date3, setDate3] = useState(null);
  const [editValue, setEditValue] = useState(null);
  const [showDistributed, setShowDistributed] = useState(false);

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPage1, setCurrentPage1] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [addDetails, setAddDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileUploadCompleted, setFileUploadCompleted] = useState(false);
  const [show, setShow] = useState(false);
  const [comment, setComment] = useState("");
  const [videos, setVideos] = useState([]);
  const [files, setFiles] = useState([]);
  const [caseId, setCaseId] = useState(null);
  const [filteredData, setFilteredData] = useState([]); // For holding filtered data
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [showSecondModal, setShowSecondModal] = useState(false);
  const [arbId, setArbId] = useState(null);

  const videoInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // for time setting starts
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  // const [selectedDate, setSelectedDate] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [timeDifference, setTimeDifference] = useState(null);
  const [records, setRecords] = useState([]);
  const [distRecords, setDistRecords] = useState([]);
  // for time setting ends
  const [clearForm, setClearForm] = useState(false);

  const { user, logout } = useAuth();

  const defaultDummyLink = "";
  const [zoomMeetingLink, setZoomMeetingLink] = useState(defaultDummyLink);
  const defaultZoomID = ""; // Define your default Zoom meeting ID
  const [zoomMeetingId, setZoomMeetingId] = useState(defaultZoomID); // Initialize state with the default value
  const [zoomId, setZoomId] = useState(defaultZoomID); // Initialize state with the default value
  const [zoomMeetingPassword, setZoomMeetingPassword] = useState("");

  useEffect(() => {
    // console.log(user);
    setArbId(user[0].Ref_id);
  }, [user]);

  // Dummy function to fetch Zoom meeting ID based on the selected date
  const fetchZoomMeetingId = (date) => {
    const dummyZoomMeetingId = ""; // Example Zoom meeting ID
    return dummyZoomMeetingId;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      // const options = { year: "numeric", month: "short", day: "numeric" };
      const formatted = date.toLocaleDateString("en-US");
      // const formatted = date.toLocaleDateString("en-US", options);
      setFormattedDate(formatted);
    } else {
      setFormattedDate("");
    }
  };
  console.log(formattedDate);

  // handle Date 2
  const handleDateChange2 = (date) => {
    setSelectedDate2(date);
    if (date) {
      // const options = { year: "numeric", month: "short", day: "numeric" };
      const formatted = date.toLocaleDateString("en-US");
      // const formatted = date.toLocaleDateString("en-US", options);
      setDate2(formatted);
    } else {
      setDate2("");
    }
  };
  console.log(date2);

  // handle Date 3
  const handleDateChange3 = (date) => {
    setSelectedDate3(date);
    if (date) {
      // const options = { year: "numeric", month: "short", day: "numeric" };
      const formatted = date.toLocaleDateString("en-US");
      // const formatted = date.toLocaleDateString("en-US", options);
      setDate3(formatted);
    } else {
      setDate3("");
    }
  };
  console.log(date3);

  function formatDate(date) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Split the input date string by hyphens
    const parts = date.split("-");
    const year = parts[0];
    const month = months[parseInt(parts[1], 10) - 1];
    const day = parseInt(parts[2], 10);
    return console.log("${month} ${day}, ${year}");
  }

  const handleMeetingIdClick = () => {
    if (zoomMeetingId) {
      // Replace with your Zoom meeting URL or desired action
      window.open(`https://zoom.us/j/${zoomMeetingId}`, "_blank");
    }
  };

  // const handleAppointments = async () => {};

  const handleAppointments = async (date) => {
    const meetingId = fetchZoomMeetingId(date);

    const dataAppointments = {
      Hearing_date: formattedDate,
      Arb_id: arbId,
      Meeting_No: 3,
    };
    console.log(dataAppointments);
    // console.log(formattedDate);
    setLoading(true);
    console.log(loading);
    try {
      // setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/GetOppforNextHearing`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataAppointments),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to upload data: ${response.status} ${response.statusText} - ${errorText}`
        );
      }
      const result = await response.json(); // Process the response
      console.log("Upload response:", result);
      // const parsedData = JSON.parse(result);
      const parsedData = Array.isArray(result) ? result : JSON.parse(result);
      const updatedData = parsedData.map((item) => {
        const {
          Acc_id,
          Arb_Assign_id,
          Acc_date,
          Hearing_date,
          Video_link,
          Link_id,
          Password,
          No_of_cases,
          Rate,
          Hearing_Time_from,
          Hearing_Time_to,
          Meeting_No,
          Upload_date,
          Comment,
          File_path,
          Second_Hearing_Time_from,
          Reference_No,
          Case_id,
          FH_id,
          Present,
          Second_Hearing_Time_to,
          Cust_name,
          ...rest
        } = item;
        return {
          Case_id,
          Reference_No,
          Cust_name,
          ...rest,
        };
      });
      // setData(parsedData);
      setData(updatedData);
      setFilteredData(updatedData);
      setZoomMeetingId(meetingId);
      setLoading(false);
      // setZoomMeetingId(true);
    } catch (error) {
      console.error("Error uploading data:", error);
      // alert(`Error uploading data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  console.log(filteredData);

  if (loading) return <LoadingSpinner />;

  const handleClose = () => setShow(false);
  const handleAddDetails = (caseId) => {
    console.log(caseId);
    setShow(true);
    setCaseId(caseId);
  };

  // console.log(caseId);
  // for second Modal
  const handleCloseSecondModal = () => setShowSecondModal(false);
  const handleShowSecondModal = () => setShowSecondModal(true);

  const handleSubmit = () => {};

  const handleCommentChange = (e) => setComment(e.target.value);

  const handleVideoChange = (e) => {
    const selectedVideos = Array.from(e.target.files);
    setVideos((prevVideos) => [...prevVideos, ...selectedVideos]);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleRemoveFile = (index, type) => {
    if (type === "file") {
      setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    } else if (type === "video") {
      setVideos((prevVideos) => prevVideos.filter((_, i) => i !== index));
    }
  };

  const handleFileUploadCompletion = () => {
    setAddDetails(false);
    setFileUploadCompleted(true);
    window.location.reload();
    // setSelectedDate("")
  };

  const handleUpload = async () => {
    console.log(caseId);
    setLoading(true); // Set loading to true at the start

    const formData = new FormData();

    videos.forEach((video, index) => {
      formData.append(`videos[${index}]`, video);
    });

    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    try {
      toast.info("Uploading files, please wait...");

      // Construct the upload URL
      const url = `${API_BASE_URL}/api/FirstHearing?Case_id=${caseId}&Comment=${encodeURIComponent(
        comment
      )}&Second_Date=null&Second_date_time_from=null&Second_date_time_to=null&Video_link=null&Link_id=null&Password=null&Meeting_No=3`;
      // const url = `https://api.resolutionexperts.in/api/FirstHearing?Case_id=${caseId}&Comment=${encodeURIComponent(
      //   comment
      // )}&Second_Date=${encodeURIComponent(
      //   date2
      // )}&Second_date_time_from=${startTime}&Second_date_time_to=${endTime}&Video_link=${zoomMeetingLink}&Link_id=${zoomMeetingId}&Password=${zoomMeetingPassword}`;

      console.log(url);
      // Perform the upload request
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setTimeout(() => {
          toast.success("Record Uploaded Successfully", {
            // position: toast.POSITION.BOTTOM_RIGHT,
            theme: "colored",
          });
          // window.location.reload();
        }, 5);

        // Clear the form fields
        handleAppointments();
        setVideos([]);
        setFiles([]);
        setComment("");
        setCaseId(null);
        setShow(false);
      } else {
        toast.error("File upload failed.");
      }
    } catch (error) {
      // Handle any errors that occurred during the upload
      // toast.error("An error occurred during upload.");
      console.error(error);
    } finally {
      // Ensure loading is set to false when done, regardless of success or error
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  // for Pagination
  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  console.log(currentItems);

  const totalPagesToShow = 5; // Maximum number of page buttons to show

  const generatePaginationItems = () => {
    const pageItems = [];
    let startPage = Math.max(1, currentPage - Math.floor(totalPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + totalPagesToShow - 1);

    if (endPage - startPage + 1 < totalPagesToShow) {
      startPage = Math.max(1, endPage - totalPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageItems.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Pagination.Item>
      );
    }
    return pageItems;
  };
  // for Pagination

  const handleOnChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // If the search query is empty, show all data
    if (query === "") {
      setFilteredData(data);
    } else {
      // Filter data where 'Cust_name' column matches the query
      const filtered = data.filter((item) =>
        item["Cust_name"]?.toString().toLowerCase().includes(query)
      );
      setFilteredData(filtered); // Update filtered data
    }
  };

  const handleSave = async () => {
    const dataForAssign = data.map((item) => ({
      Case_id:  item.Case_id,
      Comment: null,
      Second_Hearing_date: null,
      Hearing_time_From: null,
      Hearing_time_To: null,
      Video_link: null,
      Link_id: null,
      Password: null,
      Meeting_No: 3,
    }));

    console.log(dataForAssign);

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/AssignThird_date`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataForAssign),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to upload data: ${response.status} ${response.statusText} - ${errorText}`
        );
      }
      const result = await response.json();
      console.log("Upload response:", result);
      setClearForm(true);
    } catch (error) {
      console.error("Error uploading data:", error);
      setTimeout(() => {
        toast.error(`Error: ${error.message}`, { theme: "colored" });
      }, 50);
    } finally {
      setLoading(false);
    }
  };

  // console.log(zoomMeetingPassword);

  // for Pagination for second table
  const headers1 = distRecords.length > 0 ? Object.keys(distRecords[0]) : [];
  // for Pagination for second table

  return (
    <div className="container mt-4">
      {!addDetails && !clearForm && <h2>Virtual Meeting For Third Hearing</h2>}

      <div className="form-group">
        {!addDetails && !clearForm && (
          <div className="row align-items-center my-5">
            <div className="col-md-2">
              <label htmlFor="datePicker" className="form-label">
                Select Date :-
              </label>
            </div>
            <div className="col-md-2">
              <DatePicker
                id="datePicker"
                selected={selectedDate}
                onChange={handleDateChange}
                placeholderText="Select a date"
                // dateFormat="MMMM d, yyyy"
                dateFormat="MM/dd/yyyy"
                className="form-control date-picker-sm" // Apply custom class for size adjustment
              />
            </div>
            <div className="col-md-2">
              {/* <button className="btn btn-primary" onClick={handleAppointments}> */}
              <button className="custBtn" onClick={handleAppointments}>
                Appointments
              </button>
            </div>
            <div className="col-md-3">
              {filteredData.length > 0 && (
                <button className="custBtn" onClick={handleSave}>
                  Save Third Hearing
                </button>
              )}
            </div>
          </div>
        )}

        {/* {filteredData.length > 0 && ( */}
        {/* <div className="row">
          <div className="col-md-2">Search By Name</div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              onChange={handleOnChange}
            />
          </div>
        </div> */}
        {/* )} */}

        {!addDetails && !clearForm && (
          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                {filteredData.length > 0 && (
                  <table className="table table-striped table-bordered table-hover mt-3 text-center">
                    <thead>
                      <tr>
                        <th>Action</th>
                        {headers.map((header) => (
                          <th key={header}>{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((item, index) => (
                        <tr
                          key={index}
                          style={{
                            maxHeight: "50px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          className="text-center custom_fz"
                        >
                          <td>
                            <button
                              className="custBtn"
                              onClick={() => handleAddDetails(item.Case_id)} // Pass the case ID
                            >
                              Add Details
                            </button>
                          </td>
                          {headers.map((header) => (
                            <td key={header}>{item[header]}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              {totalPages > 1 && (
                <Pagination className="justify-content-center">
                  <Pagination.Prev
                    onClick={() =>
                      setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
                    }
                  />
                  {generatePaginationItems()}
                  <Pagination.Next
                    onClick={() =>
                      setCurrentPage((prev) =>
                        prev < totalPages ? prev + 1 : prev
                      )
                    }
                  />
                </Pagination>
              )}
            </div>
          </div>
          // </div>
        )}

        {addDetails && (
          <div className="row justify-content-center">
            <div className="col-md-10">
              <FileUploadForm onCompletion={handleFileUploadCompletion} />
            </div>
          </div>
        )}

        {/* First Modal Starts Here  */}
        <Modal show={show} onHide={handleClose} className="modalWidth">
          <Modal.Header closeButton className="customModal">
            <Modal.Title className="mx-auto">
              Save Virtual Meeting Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit} className="">
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label htmlFor="comment" className="form-label">
                      Add Comment
                    </label>
                    <textarea
                      id="comment"
                      rows="2"
                      className="textarea"
                      placeholder="Write your comment here..."
                      value={comment}
                      onChange={handleCommentChange}
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group flex-container">
                    <label htmlFor="videoUpload" className="form-label">
                      Upload Videos
                    </label>
                    <IoMdAdd
                      className="fs-4 cstmIcon "
                      onClick={() => videoInputRef.current.click()}
                    />
                    <input
                      type="file"
                      id="videoUpload"
                      ref={videoInputRef}
                      accept="video/*"
                      multiple
                      className="hidden-input"
                      onChange={handleVideoChange}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  {videos.length > 0 && (
                    <div className="file-list">
                      <ul>
                        {videos.map((video, index) => (
                          <li key={index} className="file-item">
                            <span>{video.name}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(index, "video")}
                              className="remove-button"
                            >
                              <MdDeleteForever className="fs-4" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group flex-container">
                    <label htmlFor="fileUpload" className="form-label">
                      Upload PDF Files
                    </label>
                    <IoMdAdd
                      className="fs-4 cstmIcon "
                      onClick={() => fileInputRef.current.click()}
                    />
                    <input
                      type="file"
                      id="fileUpload"
                      ref={fileInputRef}
                      accept="application/pdf"
                      multiple
                      className="hidden-input"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  {files.length > 0 && (
                    <div className="file-list">
                      <ul>
                        {files.map((file, index) => (
                          <li key={index} className="file-item">
                            <span>{file.name}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(index, "file")}
                              className="remove-button"
                            >
                              <MdDeleteForever className="fs-4" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer className="mx-auto d-flex justify-content-center">
            <Button onClick={handleUpload} className="custBtn">
              Save Changes
            </Button>
            <Button onClick={handleClose} className="custBtn">
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        {/* First Modal Ends Here  */}
      </div>

      {clearForm && (
        <div className="row">
          <div className="col-md-12 d-flex justify-content-center ">
            <ClearForm
              message="Third Hearing Data In Bulk Saved Successfully!"
              redirectPath="/arbdashboard"
            />
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default VirtualMeetingForThirdHearing;
