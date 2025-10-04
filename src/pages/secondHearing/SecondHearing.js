import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported
import { Button, Form, Modal, Pagination } from "react-bootstrap";
import "../VirtualMeeting.css";
import { API_BASE_URL } from "../../utils/constants";
import { useAuth } from "../../components/AuthProvider";
// import { Button, Form, Modal, Pagination } from "react-bootstrap";
import { IoMdAdd } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import ReusableTable from "../../components/ReusableTable";
import LoadingSpinner from "../../components/LoadingSpinner";
import ThirdHearingModal from "../ThirdHearingModal";
import { formatDate } from "../../utils/FormatDate";
import VirtualMeetingModalForTH from "../VirtualMeetingModalForTH";
import { generateTimeOptions } from '../../utils/timeUtils';

const SecondHearing = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDate2, setSelectedDate2] = useState(null);
  const [selectedDate3, setSelectedDate3] = useState(null);
  const [date2, setDate2] = useState(null);
  const [date3, setDate3] = useState(null);
  const [formattedDate, setFormattedDate] = useState(null);
  const { user, logout } = useAuth();
  const [arbId, setArbId] = useState(null);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [show, setShow] = useState(false);
  const [caseId, setCaseId] = useState(null);
  const [comment, setComment] = useState("");
  const [videos, setVideos] = useState([]);
  const [files, setFiles] = useState([]);
  const [addDetails, setAddDetails] = useState(false);
  const [fileUploadCompleted, setFileUploadCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [timeDifference, setTimeDifference] = useState(null);
  const [distRecords, setDistRecords] = useState([]);
  const [accessTokenArray, setAccessTokenArray] = useState([]);
  const [accessToken, setAccessToken] = useState([]);
  const [refreshToken, setRefreshToken] = useState([]);
  const [zoomResponse, setZoomResponse] = useState([]);
  const [zoomMeet, setZoomMeet] = useState(false);
  const [joinUrl, setJoinUrl] = useState("");
  const [custZoomId, setCustZoomId] = useState("");
  const [custPassword, setCustPassword] = useState("");
  const [custStartTime, setCustStartTime] = useState("");
  const [updateList, setUpdateList] = useState(false);

  const videoInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [thirdHearing, setThirdHearing] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [showSecondModal, setShowSecondModal] = useState(false);

  const [startTimeBulk, setStartTimeBulk] = useState("");
  const [endTimeBulk, setEndTimeBulk] = useState("");

  const [showDistributed, setShowDistributed] = useState(false);

  const [meeting, setMeeting] = useState([]);
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [meetingId, setMeetingId] = useState(null);
  const [currentPage1, setCurrentPage1] = useState(1);

  // the logic of assigning time slot start here

  const timeOptions = generateTimeOptions();

  useEffect(() => {
    // console.log(user);
    setArbId(user[0].Ref_id);
  }, [user]);

  // console.log(arbId);

  // useEffect(() => {
  //   const thirdDate = formatDate(custStartTime)
  //   setThirdHearing(thirdDate);
  // }, [custStartTime]);

  // console.log(thirdHearing);

  // To get the access token start here
  useEffect(() => {
    const fetchAccessToken = async () => {
      if (!arbId) return;
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/ZoomAccess?Arb_id=${arbId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        // console.log(result);

        const parsedAccessTokenArray = Array.isArray(result)
          ? result
          : JSON.parse(result); // Ensure parsedArbitrators is an array
        setAccessTokenArray(parsedAccessTokenArray);
        setAccessToken(parsedAccessTokenArray.access_token);
        setRefreshToken(parsedAccessTokenArray.refresh_token);
      } catch (error) {
        // setError1(error.message);
      }
    };

    fetchAccessToken();
  }, [arbId]);

  // console.log(accessTokenArray);
  // console.log(accessToken);
  // console.log(refreshToken);
  // To get the access token Ends here

  // To get the access Meeting start here
  useEffect(() => {
    const fetchMeetings = async () => {
      if (!arbId) return;
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/Meetings?Arb_id=${arbId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const parsedMeetings = Array.isArray(result)
          ? result
          : JSON.parse(result); // Ensure parsedArbitrators is an array
        setMeeting(parsedMeetings);
        // console.log(parsedAccessTokenArray);
      } catch (error) {
        // setError1(error.message);
      }
    };

    fetchMeetings();
  }, [arbId]);

  // console.log(meeting);

  // For Selecting Date For the Appointments
  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      setFormattedDate(formatDate(date));
    } else {
      setFormattedDate("");
    }
  };

  // console.log(formattedDate);

  if (loading) return <LoadingSpinner />;

  // Function To handle the appointments
  const handleAppointments = async (date) => {
    const dataAppointments = {
      Hearing_date: formattedDate,
      Arb_id: arbId,
      Meeting_No: 2,
    };
    console.log(dataAppointments);
    // console.log(formattedDate);
    setLoading(true);
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
      const result = await response.json();
      console.log("Upload response:", result);
      const parsedData = Array.isArray(result) ? result : JSON.parse(result);
      const updatedData = parsedData.map((item) => {
        const {
          // SR_No,
          Case_id,
          Reference_No,
          Second_Hearing_date,
          Cust_name,
          ...rest
        } = item;
        return {
          Case_id,
          Reference_No,
          Second_Hearing_date,
          Cust_name,
        };
      });
      setData(updatedData);
      setFilteredData(updatedData);
      // setZoomMeetingId(meetingId);
      // setLoading(false);
      // setZoomMeetingId(true);
    } catch (error) {
      console.error("Error uploading data:", error);
      // alert(`Error uploading data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  console.log(data);

  // Pagination For the Main Table Starts Here
  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const totalPagesToShow = 5; // Maximum number of page buttons to show

  const generatePaginationItems = () => {
    const items = [];
    const pageWindow = 5;
    let startPage = Math.max(currentPage - Math.floor(pageWindow / 2), 1);
    let endPage = startPage + pageWindow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - pageWindow + 1, 1);
    }

    for (let number = startPage; number <= endPage; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => setCurrentPage(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    return items;
  };
  // Pagination For the Main Table Ends Here

  const handleAddDetails = (caseId) => {
    console.log(caseId);
    setShow(true);
    setCaseId(caseId);
  };

  const handleClose = () => {
    setSelectedDate2(null);
    setStartTime(null);
    setEndTime(null);
    setShow(false);
    ClearZoomDetails();
  };

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
  // console.log(date2);

  // to handle Start Time starts here
  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
    setErrorMessage("");
    setTimeDifference(null);
    setDistRecords([]);
  };
  // console.log(startTime);
  // to handle Start Time Ends here

  // to handle End Time Starts here
  const handleEndTimeChange = (e) => {
    const selectedEndTime = e.target.value;
    setEndTime(selectedEndTime);
    setErrorMessage("");
  };
  // console.log(endTime);
  // to handle End Time Ends here

  // Function to format date and time together
  const formatDateTime = (date, time) => {
    const [hour, minute] = time.match(/\d+/g).map(Number);

    let formattedHour = hour;
    if (time.includes("PM") && formattedHour !== 12) formattedHour += 12;
    if (time.includes("AM") && formattedHour === 12) formattedHour = 0;

    // Create a new Date object to prevent modifying the original date
    const newDate = new Date(date);

    // Set hours and minutes in local time
    newDate.setHours(formattedHour, minute, 0, 0);

    // Format the date and time manually in YYYY-MM-DDTHH:MM (local time)
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, "0");
    const day = String(newDate.getDate()).padStart(2, "0");
    const hours = String(newDate.getHours()).padStart(2, "0");
    const minutes = String(newDate.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${minutes}Z`;
  };



  const handleUpload = async () => {
    // console.log(caseId);
    setLoading(true); // Set loading to true at the start

    const formData = new FormData();

    videos.forEach((video, index) => {
      formData.append(`videos[${index}]`, video);
    });

    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    try {
      if (startTime && endTime) {
        toast.info("Uploading files, please wait...");

        // Construct the upload URL
        const url = `${API_BASE_URL}/api/FirstHearing?Case_id=${caseId}&Comment=${encodeURIComponent(
          comment
        )}&Second_Date=${encodeURIComponent(
          custStartTime
        )}&Second_date_time_from=${startTime}&Second_date_time_to=${endTime}&Video_link=${joinUrl}&Link_id=${custZoomId}&Password=${custPassword}&Meeting_No=2`;

        // console.log(url);
        // console.log(formData);

        // Perform the upload request
        const response = await fetch(url, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          // Clear the form fields
          handleAppointments();
          setVideos([]);
          setFiles([]);
          setComment("");
          setCaseId(null);
          setShow(false);
          setSelectedDate2(null);
          setStartTime(null);
          setEndTime(null);
          ClearZoomDetails();
          toast.success("Record Uploaded Successfully");
        } else {
          toast.error("File upload failed.");
        }
      } else {
        toast.warning("Start time and End time are required.");
        alert("Start time and End time are required.");
      }
    } catch (error) {
      toast.error("An error occurred during upload.");
      // console.error(error);
    } finally {
      setLoading(false); // Always turn off loading
    }
  };

  // for second Modal
  const handleCloseSecondModal = () => {
    setShowSecondModal(false);
  };
  const handleShowSecondModal = () => setShowSecondModal(true);

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
  // console.log(date3);

  // to handle Start Time For Bulk Upload starts here
  const handleBulkStartTimeChange = (e) => {
    setStartTimeBulk(e.target.value);
    setErrorMessage("");
    setTimeDifference(null);
    setDistRecords([]);
  };

  // to handle End Time Starts here
  const handleBulkEndTimeChange = (e) => {
    const selectedEndTime = e.target.value;
    setEndTimeBulk(selectedEndTime);
    setErrorMessage("");
    if (startTimeBulk) {
      calculateTimeDifference(startTimeBulk, selectedEndTime);
    }
  };
  // console.log(endTimeBulk);
  // to handle End Time Ends here

  //  Calcualte the time difference between the start time & end time starts here
  const calculateTimeDifference = (start, end) => {
    const startDate = parseTimeStringToDate(start);
    const endDate = parseTimeStringToDate(end);

    if (endDate <= startDate) {
      setErrorMessage("The end time must be greater than the start time.");
      setTimeDifference(null);
      setDistRecords([]);
    } else {
      const differenceInMilliseconds = endDate - startDate;
      const differenceInMinutes = differenceInMilliseconds / (1000 * 60);
      const differenceInHours = differenceInMinutes / 60;
      console.log(differenceInHours);
      setTimeDifference(differenceInHours);
    }
  };
  // console.log(timeDifference);
  //  Calcualte the time difference between the start time & end  time starts here

  // to handle ParsedTimestring Time Starts here
  const parseTimeStringToDate = (timeString) => {
    const [time, modifier] = timeString.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    } else if (modifier === "AM" && hours === 12) {
      hours = 0;
    }
    return new Date(1970, 0, 1, hours, minutes);
  };
  // to handle ParsedTimestring Time Starts here

  // const createZoomMeet =()=>{}

  const ClearZoomDetails = () => {
    setMeetingId(null);
    setCustZoomId(null);
    setCustPassword(null);
    setCustStartTime(null);
    setJoinUrl(null);
  }; 

  const handleSelectZoomMeet = () => {
    setShowSelectModal(true);
  };

  const handleCloseSelectModal = () => {
    setShowSelectModal(false);
  };

  const handleSelect = (record) => {
    console.log(record);
    // you can do whatever you want with meetingId here
    setMeetingId(record.Meeting_id);
    setCustZoomId(record.Link_id);
    setCustPassword(record.Password);
    const thirdDate = formatDate(record.Date);
    setCustStartTime(thirdDate);
    setJoinUrl(record.Link);
    setShowSelectModal(false);
    setZoomMeet(true);
  };

  console.log(custStartTime);
  // const 

  
  
  // Pagination For the Main Table Starts Here
  const headers1 = meeting.length > 0 ? Object.keys(meeting[0]) : [];

  // console.log(headers1);

  const indexOfLastItem1 = currentPage * itemsPerPage;
  const indexOfFirstItem1 = indexOfLastItem1 - itemsPerPage;
  //   const currentItems = 1;
  const currentItems3 = meeting.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // console.log(currentItems3);

  const totalPages3 = Math.ceil(meeting.length / itemsPerPage);

  const totalPagesToShow1 = 5; // Maximum number of page buttons to show

  const generatePaginationItems1 = () => {
    const items = [];
    const pageWindow = 5;
    let startPage = Math.max(currentPage1 - Math.floor(pageWindow / 2), 1);
    let endPage = startPage + pageWindow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - pageWindow + 1, 1);
    }

    for (let number = startPage; number <= endPage; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => setCurrentPage1(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    return items;
  };
  // Pagination For the Main Table Ends Here

  return (
    <div className="container mt-2">
      <h4>Virtual Meeting For Second Hearing</h4>
      <div className="row align-items-center my-2">
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
            dateFormat="MM/dd/yyyy"
            className="form-control date-picker-sm"
          />
        </div>
        <div className="col-md-2">
          <button className="custBtn" onClick={handleAppointments}>
            Appointments
          </button>
        </div>
        {/* {zoomMeetingId && (
          <div className="col-md-3">
            <button
              className="custBtn"
              onClick={handleMeetingIdClick}
            >
              Join Zoom Meeting
            </button>
          </div>
        )} */}
        <div className="col-md-3">
          {filteredData.length > 0 && (
            <button
              className="custBtn"
              onClick={() => {
                // handleAssign();
                handleShowSecondModal();
              }}
            >
              Assign Third Hearing
            </button>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="table-responsive">
            {currentItems.length > 0 && (
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
                  {currentItems.map((item, index) => (
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

      {/* First Modal Starts Here  */}
      <Modal show={show} onHide={handleClose} className="modalWidth">
        <Modal.Header closeButton className="customModal">
          <Modal.Title className="mx-auto">
            Save Virtual Meeting Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="">
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

            {/* To assign StartTime and End Time Starts here */}
            <div className="row mb-3 d-flex align-items-center">
              <div className="col-md-3">
                <label htmlFor="datePicker" className="form-label">
                  Start Time
                </label>
              </div>
              {/* The Start time Picker */}
              <div className="col-md-3">
                <Form.Control
                  as="select"
                  value={startTime}
                  onChange={handleStartTimeChange}
                >
                  <option value="">Start Time</option>
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </Form.Control>
              </div>

              <div className="col-md-3">
                <label htmlFor="datePicker" className="form-label">
                  End Time
                </label>
              </div>
              {/* the end time picker */}
              <div className="col-md-3">
                <Form.Control
                  as="select"
                  value={endTime}
                  onChange={handleEndTimeChange}
                  disabled={!startTime}
                >
                  <option value="">End time</option>
                  {timeOptions.map((time, index) => (
                    <option key={index} value={time}>
                      {time}
                    </option>
                  ))}
                </Form.Control>
              </div>
            </div>
            {/* To assign StartTime and End Time Ends here */}

            <div className="row">
              <div className="col-md-6 mx-auto">
                <Button
                  className="custBtn"
                  onClick={handleSelectZoomMeet}
                  disabled={!(startTime && endTime)}
                >
                  Select Zoom Meet
                </Button>
              </div>
            </div>

            <div className="customBorder">
              {zoomMeet && (
                <>
                  <div className="row ms-3 mt-2">
                    <div className="col-md-3">
                      <h5>Zoom Join Url</h5>
                    </div>
                    <div className="col-md-8">
                      <span>{joinUrl}</span>
                    </div>
                  </div>
                  <div className="row ms-3">
                    <div className="col-md-3">
                      <h5>Zoom Meeting Id</h5>
                    </div>
                    <div className="col-md-5">
                      <span>{custZoomId}</span>
                    </div>
                  </div>
                  <div className="row ms-3">
                    <div className="col-md-3">
                      <h5>Zoom Password</h5>
                    </div>
                    <div className="col-md-5">
                      <span>{custPassword}</span>
                    </div>
                  </div>
                  <div className="row ms-3">
                    <div className="col-md-3">
                      <h5>Zoom Start Time</h5>
                    </div>
                    <div className="col-md-5">
                      <span>{custStartTime}</span>
                    </div>
                  </div>
                </>
              )}
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

      <ToastContainer />

      {/* Second Modal starts here */}
      <Modal
        show={showSecondModal}
        onHide={handleCloseSecondModal}
        className="modal-xl"
      >
        <Modal.Header className="customModal" style={{ position: "relative" }}>
          <Modal.Title className="">Assign Second Hearing Date</Modal.Title>
          <Button
            style={{
              position: "absolute",
              right: "15px",
              color: "orange",
              backgroundColor: "transparent",
              border: "none",
              fontSize: "40px",
            }}
            aria-label="Close"
            onClick={handleCloseSecondModal}
          >
            &times;
          </Button>
        </Modal.Header>
        <Modal.Body>
          <VirtualMeetingModalForTH
            appointments={data}
            accessToken={accessToken}
            refreshToken={refreshToken}
            arbId={arbId}
            setShowSecondModal={setShowSecondModal}
          />
        </Modal.Body>
      </Modal>
      {/* Second Modal ends here */}

      {/*Modal starts here */}
      <Modal
        show={showSelectModal}
        onHide={handleCloseSelectModal}
        className="modal-xl"
      >
        <Modal.Header className="customModal" style={{ position: "relative" }}>
          <Modal.Title className="">Select The Zoom Meeting</Modal.Title>
          <Button
            style={{
              position: "absolute",
              right: "15px",
              color: "orange",
              backgroundColor: "transparent",
              border: "none",
              fontSize: "40px",
            }}
            aria-label="Close"
            onClick={handleCloseSelectModal}
          >
            &times;
          </Button>
        </Modal.Header>
        <Modal.Body>
          <div className="table-responsive">
            {currentItems3.length > 0 && (
              <table className="table table-striped table-bordered table-hover mt-3 text-center">
                <thead>
                  <tr>
                    <th>Select</th>
                    {headers1.map((header) => (
                      <th key={header}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentItems3.map((item, index) => (
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
                          className="btn btn-primary btn-sm"
                          onClick={() => handleSelect(item)}
                        >
                          Select
                        </button>
                      </td>

                      {headers1.map((header) => (
                        <td key={header}>{item[header]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Modal.Body>
      </Modal>
      {/*Modal ends here */}
    </div>
  );
};

export default SecondHearing;

