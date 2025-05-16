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
import { useAuth } from "../components/AuthProvider";
import ReusableTable from "../components/ReusableTable";

const VirtualMeeting = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDate2, setSelectedDate2] = useState(null);
  const [selectedDate3, setSelectedDate3] = useState(null);
  const [formattedDate, setFormattedDate] = useState(null);
  const [date2, setDate2] = useState(null);
  const [date3, setDate3] = useState(null);
  const [showDistributed, setShowDistributed] = useState(false);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPage1, setCurrentPage1] = useState(1);
  const [itemsPerPage] = useState(10);
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

  const videoInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const [accessTokenArray, setAccessTokenArray] = useState([]);
  const [accessToken, setAccessToken] = useState([]);
  const [refreshToken, setRefreshToken] = useState([]);

  // for time setting starts
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [startTimeBulk, setStartTimeBulk] = useState("");
  const [endTimeBulk, setEndTimeBulk] = useState("");
  // const [selectedDate, setSelectedDate] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [timeDifference, setTimeDifference] = useState(null);
  const [records, setRecords] = useState([]);
  const [distRecords, setDistRecords] = useState([]);
  // for time setting ends
  const { user, logout } = useAuth();
  const [arbId, setArbId] = useState("");
  const [zoomResponse, setZoomResponse] = useState([]);
  const [zoomBulkResponse, setZoomBulkResponse] = useState([]);
  const [zoomMeet, setZoomMeet] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [joinUrl, setJoinUrl] = useState("");
  const [bulkJoinUrl, setBulkJoinUrl] = useState("");
  const [bulkZoomId, setBulkZoomId] = useState("");
  const [bulkPassword, setBulkPassword] = useState("");
  const [bulkStartDate, setBulkStartDate] = useState("");
  const [custZoomId, setCustZoomId] = useState("");
  const [password, setPassword] = useState("");
  const [custPassword, setCustPassword] = useState("");
  const [custStartTime, setCustStartTime] = useState("");
  const [meetStartTime, setMeetStartTime] = useState("");
  const [currentPage2, setCurrentPage2] = useState(1); // Current page for ReusableTable

  useEffect(() => {
    // console.log(user);
    setArbId(user[0].Ref_id);
  }, [user]);

  // console.log(arbId);

  const defaultDummyLink =
    "https://us05web.zoom.us/j/82064910816?pwd=irnBsMk470Z2Uws7dxxZri8jrhdUG3.1";
  const [zoomMeetingLink, setZoomMeetingLink] = useState(defaultDummyLink);
  const defaultZoomID = " 820 6491 0816"; // Define your default Zoom meeting ID
  const [zoomMeetingId, setZoomMeetingId] = useState(defaultZoomID); // Initialize state with the default value
  const [zoomId, setZoomId] = useState(defaultZoomID); // Initialize state with the default value
  const [zoomMeetingPassword, setZoomMeetingPassword] = useState("4ExYPe");

  // Dummy function to fetch Zoom meeting ID based on the selected date
  const fetchZoomMeetingId = (date) => {
    const dummyZoomMeetingId = "870 8879 5363"; // Example Zoom meeting ID
    return dummyZoomMeetingId;
  };

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
        console.log(result);

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
  // To get the access token start here
  
  useEffect(() => {
    // console.log("Updated zoomResponse:", zoomResponse);
    let parsedResponse;

    if (typeof zoomBulkResponse === "string") {
      try {
        parsedResponse = JSON.parse(zoomBulkResponse);
        console.log("Parsed Response:", parsedResponse);
      } catch (error) {
        console.error("Error parsing zoomBulkResponse:", error);
        return;
      }
    } else if (zoomBulkResponse && typeof zoomBulkResponse === "object") {
      parsedResponse = zoomBulkResponse;
    } else {
      console.log("zoomBulkResponse is undefined or not an object!");
      return;
    }
    setBulkZoomId(parsedResponse.id);
    setBulkJoinUrl(parsedResponse.join_url);
    setBulkPassword(parsedResponse.password);
    setBulkStartDate(parsedResponse.start_time);
  }, [zoomBulkResponse, showDistributed]);

  console.log(bulkZoomId);
  console.log(bulkJoinUrl);
  console.log(bulkPassword);
  console.log(bulkStartDate);

  const handleZoomMeet = async () => {
    // console.log(selectedDate);
    // console.log(startTime);
    const formattedDateTime = formatDateTime(selectedDate, startTime);
    // console.log(formattedDateTime);
    const dataToGenerateZoomMeet = {
      accessToken: accessToken,
      refreshToken: refreshToken,
      topic: "Zoom Meeting",
      start_time: formattedDateTime,
      duration: "720",
      timezone: "Asia/Kolkata",
      agenda: "The Resolution Metting for dispute resolving",
      Arb_id: arbId,
    };
    console.log(dataToGenerateZoomMeet);
    handleStepChange(3);
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/Zoom`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToGenerateZoomMeet),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to upload data: ${response.status} ${response.statusText} - ${errorText}`
        );
      }
      const result = await response.json(); // Process the response
      // console.log("Upload response:", result);
      const parsedZoomMeet = Array.isArray(result)
        ? result
        : JSON.parse(result);
      // console.log(parsedZoomMeet);

      toast.success("Data Uploaded Successfully", {
        theme: "colored",
        autoClose: 1000,
      });
      setZoomMeet(true);
      // console.log(save);
    } catch (error) {
      console.error("Error uploading data:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log(zoomResponse);
  // console.log(joinUrl);

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

  // Function to move to a specific step in Stepper Component
  const handleStepChange = (step) => {
    setActiveStep(step);
  };
  // For the customStepper ends Here

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

  const handleMeetingIdClick = () => {
    if (zoomMeetingId) {
      // Replace with your Zoom meeting URL or desired action
      window.open(`https://zoom.us/j/${zoomMeetingId}`, "_blank");
    }
  };

  // const handleAppointments = async () => {};

  const handleAppointments = async (date) => {
    const meetingId = fetchZoomMeetingId(date);
    const dataAppointments = { Hearing_date: formattedDate, Arb_id: arbId };
    console.log(dataAppointments);
    // console.log(formattedDate);
    setLoading(true);
    try {
      // setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/GetOppforSecondHearing`,
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
          Hearing_Time_from,
          Hearing_Time_to,
          ...rest
        } = item;
        return {
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

  // console.log(filteredData);

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
      const url = `https://api.resolutionexperts.in/api/FirstHearing?Case_id=${caseId}&Comment=${encodeURIComponent(
        comment
      )}&Second_Date=${encodeURIComponent(
        formattedDate
      )}&Second_date_time_from=${startTime}&Second_date_time_to=${endTime}&Video_link=${zoomMeetingLink}&Link_id=${zoomMeetingId}&Password=${zoomMeetingPassword}&Meeting_No=1`;

      console.log(url);
      console.log(formData);
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
        setVideos([]);
        setFiles([]);
        setComment("");
        setCaseId(null);
        setShow(false);
      } else {
        toast.error("File upload failed.");
      }
    } catch (error) {
      toast.error("An error occurred during upload.");
      // console.error(error);
    } finally {
      // Ensure loading is set to false when done, regardless of success or error
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  // for Pagination for the appointments
  const headers = filteredData.length > 0 ? Object.keys(data[0]) : [];
  // const headers = data.length > 0 ? Object.keys(data[0]) : [];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  // const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // console.log(currentItems);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
  // for Pagination ends here

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

  // the logic of assigning time slot start here
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minutes = 0; minutes <= 30; minutes += 30) {
        const hour12 = hour % 12 === 0 ? 12 : hour % 12;
        const ampm = hour < 12 ? "AM" : "PM";
        const hourStr = hour12 < 10 ? `0${hour12}` : `${hour12}`;
        const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
        times.push(`${hourStr}:${minutesStr} ${ampm}`);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();
  // the logic of assigning time slot ends here

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

  // to handle Start Time For Bulk Upload starts here
  const handleBulkStartTimeChange = (e) => {
    setStartTimeBulk(e.target.value);
    setErrorMessage("");
    setTimeDifference(null);
    setDistRecords([]);
  };

  // console.log(startTimeBulk);
  // to handle Start Time For Bulk Upload Ends here

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
  console.log(timeDifference);
  //  Calcualte the time difference between the start time & end  time starts here

  const ZoomMeet = async (formattedDateTime) => {
    const dataToGenerateZoomMeet = {
      accessToken: accessToken,
      refreshToken: refreshToken,
      topic: "Zoom Meeting",
      // start_time: "2025-05-08T15:00:00Z",
      start_time: formattedDateTime,
      duration: "720",
      timezone: "Asia/Kolkata",
      agenda: "The Resolution Metting for dispute resolving",
      Arb_id: arbId,
    };
    console.log(dataToGenerateZoomMeet);
    handleStepChange(3);
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/Zoom`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToGenerateZoomMeet),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to upload data: ${response.status} ${response.statusText} - ${errorText}`
        );
      }
      const result = await response.json(); // Process the response
      console.log("Upload response:", result);
      const parsedZoomMeet = Array.isArray(result)
        ? result
        : JSON.parse(result);
      setZoomBulkResponse(result);
      setZoomResponse(parsedZoomMeet);
      setJoinUrl(parsedZoomMeet.join_url);
      setCustZoomId(parsedZoomMeet.id);
      setCustPassword(parsedZoomMeet.password);
      setCustStartTime(parsedZoomMeet.start_time);
      // toast.success("Data Uploaded Successfully", {
      //   // position: toast.POSITION.BOTTOM_RIGHT,
      //   theme: "colored",
      //   autoClose: 1000,
      // });
      // setZoomMeet(true);
      // console.log(save);
    } catch (error) {
      console.error("Error uploading data:", error);
      // alert(`Error uploading data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  // console.log(zoomBulkResponse[0].join_url);

  // To distribute records starts here
  const distributeRecords = () => {
    if (
      !startTimeBulk ||
      !endTimeBulk ||
      !selectedDate3 ||
      timeDifference <= 0 ||
      filteredData.length === 0
    ) {
      setErrorMessage("All fields are required and must be valid.");
      setDistRecords([]);
      return;
    }

    const formattedDateTime = formatDateTime(selectedDate3, startTimeBulk);

    

    // console.log(startTimeBulk);
    // console.log(endTimeBulk);

    const totalRecords = filteredData.length;
    const fullHours = Math.floor(timeDifference); // Full hours
    const fractionalHour = timeDifference % 1; // Fractional part of the hour

    const recordsPerFullHour = Math.floor(
      totalRecords / (fullHours + fractionalHour)
    );

    const recordsForFractionalHour = Math.floor(
      recordsPerFullHour * fractionalHour
    );

    let assignedRecordsCount = 0; // Counter to track assigned records
    const distributed = [];
    let currentStartTime = parseTimeStringToDate(startTimeBulk);
    const formattedDate = format(selectedDate3, "MM/dd/yyyy");

    for (let hour = 0; hour < fullHours; hour++) {
      const slotStartTime = new Date(currentStartTime.getTime());
      const slotEndTime = new Date(currentStartTime.getTime());
      slotEndTime.setHours(slotEndTime.getHours() + 1);

      for (let i = 0; i < recordsPerFullHour; i++) {
        const recordIndex = hour * recordsPerFullHour + i;
        if (recordIndex < totalRecords) {
          const formattedStartTime = format(slotStartTime, "hh:mm a");
          const formattedEndTime = format(slotEndTime, "hh:mm a");

          distributed.push({
            ...filteredData[recordIndex],
            Hearing_date: formattedDate,
            Hearing_time_From: formattedStartTime,
            Hearing_time_To: formattedEndTime,
            Video_link: bulkJoinUrl,
            Link_ID: bulkZoomId,
            Password: bulkPassword,
          });
          assignedRecordsCount++;
        }
      }
      currentStartTime.setHours(currentStartTime.getHours() + 1);
    }

    if (fractionalHour > 0) {
      const slotStartTime = new Date(currentStartTime.getTime());
      const slotEndTime = new Date(currentStartTime.getTime());
      slotEndTime.setMinutes(Math.floor(60 * fractionalHour));

      for (let i = 0; i < recordsForFractionalHour; i++) {
        const recordIndex = fullHours * recordsPerFullHour + i;
        if (recordIndex < totalRecords) {
          const formattedStartTime = format(slotStartTime, "hh:mm a");
          const formattedEndTime = format(slotEndTime, "hh:mm a");

          distributed.push({
            ...filteredData[recordIndex],
            Hearing_date: formattedDate,
            Hearing_time_From: formattedStartTime,
            Hearing_time_To: formattedEndTime,
            Video_link: bulkJoinUrl,
            Link_ID: bulkZoomId,
            Password: bulkPassword,
          });
          assignedRecordsCount++;
        }
      }
    }

    if (assignedRecordsCount < totalRecords) {
      const remainingRecordsCount = totalRecords - assignedRecordsCount;
      const lastSlotStartTime =
        distributed[distributed.length - 1]?.Virtual_Hearing_Time_From ||
        startTime;
      const lastSlotEndTime =
        distributed[distributed.length - 1]?.Virtual_Hearing_Time_To || endTime;

      for (let i = 0; i < remainingRecordsCount; i++) {
        const recordIndex = assignedRecordsCount + i;

        distributed.push({
          ...records[recordIndex],
          Hearing_date: formattedDate,
          Hearing_time_From: lastSlotStartTime,
          Hearing_time_To: lastSlotEndTime,
          Video_link: bulkJoinUrl,
          Link_ID: bulkZoomId,
          Password: bulkPassword,
          // No_of_cases: noOfCases,
          // Rate: rate,
        });
      }
    }

    console.log(`Total Records Assigned: ${assignedRecordsCount}`);

    setShowDistributed(true);
    setDistRecords(distributed);
  };

  // console.log(distributedRecords);

  console.log(distRecords);
  // To distribute records starts here

  // For the distributed record tables starts here
  const totalItems2 = distRecords.length;
  const totalPages2 = Math.ceil(totalItems2 / itemsPerPage);

  const startIndex2 = (currentPage2 - 1) * itemsPerPage;
  const currentItems2 = distRecords.slice(
    startIndex2,
    startIndex2 + itemsPerPage
  );

  const pageNumbers2 = Array.from({ length: totalPages2 }, (_, i) => i + 1);
  // For the distributed record tables ends here

  // for Pagination for second table
  const headers1 = distRecords.length > 0 ? Object.keys(distRecords[0]) : [];

  const indexOfLastItem1 = currentPage * itemsPerPage;
  const indexOfFirstItem1 = indexOfLastItem - itemsPerPage;
  const currentItems1 = distRecords.slice(indexOfFirstItem, indexOfLastItem);

  // console.log(currentItems);

  const totalPagesToShow1 = 5; // Maximum number of page buttons to show

  const generatePaginationItems1 = () => {
    const pageItems = [];
    let startPage = Math.max(1, currentPage - Math.floor(totalPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + totalPagesToShow1 - 1);

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
  // for Pagination for second table

  // function for bulk second date assign starts here
  const handleBulkSecHearing = async () => {
    // console.log(distRecords);
    const dataForAssign = distRecords.map((item) => ({
      Case_id: item.Case_id,
      Reference_No: item.Reference_No,
      Cust_name: item.Cust_name,
      Second_Hearing_date: formattedDate,
      Hearing_time_From: startTime,
      Hearing_time_To: endTime,
      Video_link: zoomMeetingLink,
      Link_ID: zoomId,
      Password: zoomMeetingPassword,
      No_of_cases: "1810",
      Rate: "1000",
    }));
    console.log(dataForAssign);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/AssignSecond_date`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      // setMailDone(true);
      setShowSecondModal(false);
      setTimeout(() => {
        toast.success("Second Hearing Date Assigned Successfully", {
          // position: toast.POSITION.BOTTOM_RIGHT,
          theme: "colored",
        });
        // window.location.reload();
      }, 5);
    } catch (error) {
      console.error("Error uploading data:", error);
      setTimeout(() => {
        toast.error(`Error: ${error.message}`, { theme: "colored" });
      }, 50);
    } finally {
      setLoading(false);
    }
  };
  // function for bulk second date assign Ends here

  return (
    <div className="container mt-4">
      {!addDetails && <h2>Virtual Meeting For First Hearing</h2>}

      <div className="form-group">
        {!addDetails && (
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
            {zoomMeetingId && (
              <div className="col-md-3">
                <button
                  // className="btn btn-primary"
                  className="custBtn"
                  onClick={handleMeetingIdClick}
                >
                  Join Zoom Meeting
                  {/* : {zoomMeetingId} */}
                </button>
              </div>
            )}
            <div className="col-md-3">
              {filteredData.length > 0 && (
                <button
                  className="custBtn"
                  onClick={() => {
                    // handleAssign();
                    handleShowSecondModal();
                  }}
                >
                  Assign Second Hearing
                </button>
              )}
            </div>
          </div>
        )}

        {/* {filteredData.length > 0 && ( */}
        <div className="row">
          <div className="col-md-2">Search By Name</div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              onChange={handleOnChange}
            />
          </div>
        </div>
        {/* )} */}

        {!addDetails && (
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

              <div className="row mb-3 d-flex align-items-center">
                <div className="col-md-6">
                  <label htmlFor="datePicker" className="form-label">
                    Second Hearing Date :-
                  </label>
                </div>
                <div className="col-md-6">
                  <DatePicker
                    id="datePicker"
                    selected={selectedDate2}
                    onChange={handleDateChange2}
                    placeholderText="Select a date"
                    dateFormat="MMMM d, yyyy"
                    // dateFormat="MM/dd/yyyy"
                    className="form-control date-picker-sm" // Apply custom class for size adjustment
                  />
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
                  <Button className="custBtn" onClick={handleZoomMeet}>
                    Create Zoom Meet
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

        {/* Second Modal starts here */}
        <Modal
          show={showSecondModal}
          onHide={handleCloseSecondModal}
          className="modal-lg"
        >
          <Modal.Header
            className="customModal"
            style={{ position: "relative" }}
          >
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
            {!showDistributed && (
              <div className="row mt-3">
                {/* the date picker */}
                <div className="col-md-3">
                  <DatePicker
                    selected={selectedDate3}
                    onChange={handleDateChange3}
                    placeholderText="Select a date"
                    dateFormat="MM/dd/yyyy"
                    className="form-control custom_input" // Smaller size
                    id="datePicker"
                    style={{
                      width: "100%",
                      height: "calc(1.5em + .75rem + 2px)",
                      padding: ".375rem .75rem",
                      fontSize: "1rem",
                      borderRadius: ".25rem",
                      border: "1px solid #ced4da",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                {/* The Start time Picker */}
                <div className="col-md-3">
                  <Form.Control
                    as="select"
                    value={startTimeBulk}
                    onChange={handleBulkStartTimeChange}
                  >
                    <option value="">Select Start Time</option>
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </Form.Control>
                </div>

                {/* the end time picker */}
                <div className="col-md-3">
                  <Form.Control
                    as="select"
                    value={endTimeBulk}
                    onChange={handleBulkEndTimeChange}
                    disabled={!startTimeBulk}
                  >
                    <option value="">Select end time</option>
                    {timeOptions.map((time, index) => (
                      <option key={index} value={time}>
                        {time}
                      </option>
                    ))}
                  </Form.Control>
                </div>

                {/* button Goes here */}
                <div className="col-md-3">
                  <Button className="custBtn" onClick={distributeRecords}>
                    Assign Time Slot
                  </Button>
                  {/* <Button className="custBtn" onClick={distributeRecords}>
                    Assign Time Slot
                  </Button> */}
                </div>
              </div>
            )}

            {showDistributed && (
              <div className="row">
                <div className="col-md-3"></div>
                <div className="col-md-3"></div>
                <div className="col-md-3"></div>
                <div className="col-md-3">
                  <Button className="custBtn" onClick={handleBulkSecHearing}>
                    Assign
                  </Button>
                </div>
              </div>
            )}

            <div className="row">
              {!showDistributed && (
                <div className="col-md-12">
                  <div className="table-responsive">
                    {filteredData.length > 0 && (
                      <table className="table table-striped table-bordered table-hover mt-3 text-center">
                        <thead>
                          <tr>
                            {/* <th>Action</th> */}
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
              )}

              {showDistributed && (
                <div className="col-md-12">
                  <ReusableTable
                    data={currentItems2}
                    currentPage={currentPage2}
                    pageNumbers={pageNumbers2}
                    setCurrentPage={setCurrentPage2}
                  />
                </div>
              )}
            </div>
          </Modal.Body>
        </Modal>
        {/* Second Modal ends here */}
      </div>
      <ToastContainer />
    </div>
  );
};

export default VirtualMeeting;
