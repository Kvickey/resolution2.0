import React, { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported
import { Button, Modal, Pagination } from "react-bootstrap";
import "./VirtualMeeting.css";
import { API_BASE_URL } from "../utils/constants";
import FileUploadForm from "../components/FileUploadForm";
import LoadingSpinner from "../components/LoadingSpinner";
import { MdDeleteForever } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { IoMdAdd } from "react-icons/io";
import { toast } from "react-toastify";

const VirtualMeeting = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [formattedDate, setFormattedDate] = useState(null);
  const [editValue, setEditValue] = useState(null);
  const [zoomMeetingId, setZoomMeetingId] = useState(null);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
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

  const videoInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Dummy function to fetch Zoom meeting ID based on the selected date
  const fetchZoomMeetingId = (date) => {
    const dummyZoomMeetingId = "870 8879 5363"; // Example Zoom meeting ID
    return dummyZoomMeetingId;
  };

  const handleDateChange = (date) => {
    // const dateStr = date.toISOString().split("T")[0];
    // setEditValue(dateStr); // Update the state with the formatted date
    // setSelectedDate(date); // Update selectedDate state
    // const meetingId = fetchZoomMeetingId(date);
    // setZoomMeetingId(meetingId);
    // formatDate(editValue);
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

    const dataAppointments = { Hearing_date: formattedDate };
    console.log(dataAppointments);
    // console.log(formattedDate);
    setLoading(true);
    console.log(loading);
    try {
      // setLoading(true);
      const response = await fetch(
        // "http://arb.resolutionexperts.in/api/GetOpp",
        `${API_BASE_URL}/api/GetOpp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataAppointments),
        }
      );
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
          // SR_No,

          Acc_id,
          Arb_Assign_id,
          Acc_date,
          Hearing_date,
          Video_link,
          Link_id,
          Password,
          No_of_cases,
          Rate,
          ...rest
        } = item;
        return {
          // action: (
          //   <button className="custBtn" onClick={handleAddDetails}>
          //     Add Details
          //   </button>
          // ),
          ...rest,
        };
      });
      // setData(parsedData);
      setData(updatedData);
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

  // console.log(data);

  if (loading) return <LoadingSpinner />;

  // const handleAddDetails = () => {
  //   setAddDetails(true);
  // };

  const handleClose = () => setShow(false);
  const handleAddDetails = () => setShow(true);

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

  const handleUpload = async (file, index) => {
    setLoading(true);

    const formData = new FormData();

    videos.forEach((video, index) => {
      formData.append(`videos[${index}]`, video);
    });

    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    try {
      toast.info("Uploading files, please wait...");

      // Add your upload API endpoint and fetch logic here
      const url = `https://api.resolutionexperts.in/api/FirstHearing?Case_id=13&Comment=${encodeURIComponent(
        comment
      )}&Second_Date=${encodeURIComponent(formattedDate)}`;
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("Files uploaded successfully!");
      } else {
        toast.error("File upload failed.");
      }
    } catch (error) {
      toast.error("An error occurred during upload.");
      console.error(error);
    } finally {
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

  return (
    <div className="container mt-4">
      {!addDetails && <h2>Virtual Meeting</h2>}

      <div className="form-group">
        {!addDetails && (
          <div className="row align-items-center my-5">
            {/* <div className="col-auto">
            <label htmlFor="datePicker" className="form-label">Select Virtual Hearing Date</label>
          </div>
          <div className="col">
            <DatePicker
              id="datePicker"
              selected={selectedDate}
              onChange={handleDateChange}
              placeholderText="Select a date"
              dateFormat="MMMM d, yyyy"
              className="form-control date-picker-sm" // Apply custom class for size adjustment
            />
          </div> */}
            <div className="col-md-2">
              <label htmlFor="datePicker" className="form-label">
                Select Date :-
              </label>
            </div>
            <div className="col-md-3">
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
            <div className="col-md-3">
              {/* <button className="btn btn-primary" onClick={handleAppointments}> */}
              <button className="custBtn" onClick={handleAppointments}>
                Show Appointments
              </button>
            </div>
            {zoomMeetingId && (
              <div className="col-md-4">
                <button
                  // className="btn btn-primary"
                  className="custBtn"
                  onClick={handleMeetingIdClick}
                >
                  Join Zoom Meeting: {zoomMeetingId}
                </button>
              </div>
            )}
          </div>
        )}
        {!addDetails && (
          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                {data.length > 0 && (
                  <table className="table table-striped table-bordered table-hover mt-3 text-center">
                    <thead>
                      <tr>
                        {headers.map((header) => (
                          <th key={header}>{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item, index) => (
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
                          {headers.map((header) => (
                            <td key={header}>{item[header]}</td>
                          ))}
                          <td>
                            <button
                              className="custBtn"
                              onClick={() => handleAddDetails(item.Acc_id)} // Pass the case ID
                            >
                              Add Details
                            </button>
                          </td>
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
        )}

        {addDetails && (
          <div className="row justify-content-center">
            <div className="col-md-10">
              <FileUploadForm onCompletion={handleFileUploadCompletion} />
            </div>
          </div>
        )}

        <Modal show={show} onHide={handleClose} className="modalWidth">
          <Modal.Header closeButton className="customModal">
            <Modal.Title className="mx-auto">
              Save Virtual Meeting Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit} className="">
              {/* <form onSubmit={handleSubmit} className="form-container p-5"> */}
              {/* <h2 className="text-center mb-3">Add Files</h2> */}
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
                            {/* Display progress bar for each video */}
                            {/* {progress[index] !== undefined && (
                        <div className="progress-barr">
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${progress[index]}%` }}
                          >
                            {progress[index]}%
                          </div>
                        </div>
                      )} */}
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
                            {/* Display progress bar for each file */}
                            {/* {progress[index] !== undefined && (
                        <div className="progress-barr">
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${progress[index]}%` }}
                          >
                            {progress[index]}%
                          </div>
                        </div>
                      )} */}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="row mb-3 d-flex align-items-center">
                <div className="col-md-6">
                  <label htmlFor="datePicker" className="form-label">
                    Second Hearing Date :-
                  </label>
                </div>
                <div className="col-md-6">
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
              </div>

              {/* <button type="submit" className="submit-button">
                Save Details
              </button> */}
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
      </div>
    </div>
  );
};

export default VirtualMeeting;
