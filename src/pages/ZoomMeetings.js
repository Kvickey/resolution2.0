import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { useAuth } from "../components/AuthProvider";
import { API_BASE_URL } from "../utils/constants";
import { toast } from "react-toastify";
import ClearForm from "../components/Clearform";

const ZoomMeetings = () => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [accessTokenArray, setAccessTokenArray] = useState([]);
  const [accessToken, setAccessToken] = useState([]);
  const [refreshToken, setRefreshToken] = useState([]);
  const [arbId, setArbId] = useState("");
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [zoomResponse, setZoomResponse] = useState([]);
  const [zoomMeet, setZoomMeet] = useState(false);
  const [joinUrl, setJoinUrl] = useState("");
  const [meetStartTime, setMeetStartTime] = useState("");
  const [zoomId, setZoomId] = useState("");
  const [password, setPassword] = useState("");
  const [clearForm, setClearForm] = useState(false);

  useEffect(() => {
    // console.log(user);
    setArbId(user[0].Ref_id);
  }, [user]);

  // console.log(arbId);

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
  console.log(accessToken);
  console.log(refreshToken);
  // To get the access token start here

  // for meetings starts here
  useEffect(() => {
    const fetchAccessToken = async () => {
      if (!arbId) return;
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/Meetings?Arb_id=${arbId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const parsedAccessTokenArray = Array.isArray(result)
          ? result
          : JSON.parse(result); // Ensure parsedArbitrators is an array
        console.log(parsedAccessTokenArray);
      } catch (error) {
        // setError1(error.message);
      }
    };

    fetchAccessToken();
  }, [arbId]);

  // for meetings ends here

  useEffect(() => {
    // console.log("Updated zoomResponse:", zoomResponse);
    let parsedResponse;

    if (typeof zoomResponse === "string") {
      try {
        parsedResponse = JSON.parse(zoomResponse);
        console.log("Parsed Response:", parsedResponse);
      } catch (error) {
        console.error("Error parsing zoomResponse:", error);
        return;
      }
    } else if (zoomResponse && typeof zoomResponse === "object") {
      parsedResponse = zoomResponse;
    } else {
      console.log("zoomResponse is undefined or not an object!");
      return;
    }
    setZoomId(parsedResponse.id);
    setPassword(parsedResponse.password);
    setMeetStartTime(parsedResponse.start_time);
    if (parsedResponse?.join_url) {
      console.log("Join URL:", parsedResponse.join_url);
      setJoinUrl(parsedResponse.join_url); // Store join_url in state
    } else {
      // console.log("join_url not found in parsed response!");
    }
  }, [zoomResponse]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    // const getDate = date.toLocaleDateString('en-GB', options);
    const getDate = date.toLocaleDateString("en-US");
    // console.log(getDate); // Outputs in MM/dd/yyyy format
    return;
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

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
    // setErrorMessage("");
    // setTimeDifference(null);
    // setDistRecords([]);
  };

  const handleEndTimeChange = (e) => {
    const selectedEndTime = e.target.value;
    setEndTime(selectedEndTime);
    // setErrorMessage("");

    // if (startTime) {
    //   calculateTimeDifference(startTime, selectedEndTime);
    // }
  };

  // Function to format date and time together
  const formatDateTime = (date, time) => {
    console.log(time);

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

  const handleZoomMeet = async () => {
    // console.log(selectedDate);
    // console.log(startTime);
    const formattedDateTime = formatDateTime(selectedDate, startTime);
    // console.log(formattedDateTime);
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
    // handleStepChange(3);
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
      setZoomResponse(result);
      setJoinUrl(result.join_url);
      toast.success("Data Uploaded Successfully", {
        // position: toast.POSITION.BOTTOM_RIGHT,
        theme: "colored",
        autoClose: 1000,
      });
      setZoomMeet(true);
      // console.log(save);
    } catch (error) {
      console.error("Error uploading data:", error);
      // alert(`Error uploading data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // console.log(zoomResponse);

  const SaveZoomMeet = async () => {
    // console.log(zoomResponse);
    const dataToGenerateZoomMeet = {
      Arb_id: arbId,
      topic: "Zoom Meeting",
      Date: meetStartTime,
      start_time: "10 AM",
      duration: "720",
      Link: joinUrl,
      Link_id: zoomId,
      password: password,
      agenda: "The Resolution Metting for dispute resolving",
      Topic: "adasdasdasdas",
    };

    console.log(dataToGenerateZoomMeet);
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/Meetings`, {
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
      toast.success("Data Saved Successfully", {
        // position: toast.POSITION.BOTTOM_RIGHT,
        theme: "colored",
        autoClose: 1000,
      });
      // console.log(save);
      setClearForm(true);
    } catch (error) {
      console.error("Error uploading data:", error);
      // alert(`Error uploading data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {!clearForm && !zoomMeet && <h5>Generate Zoom Meeting</h5>}
      <div className="row mt-3">
        {!zoomMeet && (
          <>
            {/* the date picker */}
            <div className="col-md-3">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
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
                value={startTime}
                onChange={handleStartTimeChange}
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
                value={endTime}
                onChange={handleEndTimeChange}
                disabled={!startTime}
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
              <Button className="custBtn" onClick={handleZoomMeet}>
                Create Zoom Meet
              </Button>
            </div>
          </>
        )}
        {zoomMeet && !clearForm && (
          <>
            <div className="col-md-9"></div>
            <div className="col-md-3">
              <Button className="custBtn" onClick={SaveZoomMeet}>
                Save Zoom Meet
              </Button>
            </div>
          </>
        )}
      </div>
      <div className="row mt-3">
        {zoomMeet && !clearForm && (
          <div className="other-container">
            <div className="row">
              <div className="col-md-4"></div>
              <div className="col-md-4">
                <h4>Zoom Meeting Details</h4>
              </div>
              <div className="col-md-4"></div>
            </div>
            <div className="row ms-3 mt-2 mb-2">
              <div className="col-md-3">
                <h5>Zoom Join Url</h5>
              </div>
              <div className="col-md-9">
                <span>:&nbsp;&nbsp;&nbsp;{joinUrl}</span>
              </div>
            </div>
            <div className="row ms-3 mb-2">
              <div className="col-md-3">
                <h5>Zoom Meeting Id</h5>
              </div>
              <div className="col-md-5">
                <span>:&nbsp;&nbsp;&nbsp;{zoomId}</span>
              </div>
            </div>
            <div className="row ms-3 mb-2">
              <div className="col-md-3">
                <h5>Zoom Password</h5>
              </div>
              <div className="col-md-5">
                <span>:&nbsp;&nbsp;&nbsp;{password}</span>
              </div>
            </div>
            <div className="row ms-3 mb-2">
              <div className="col-md-3">
                <h5>Zoom Start Time</h5>
              </div>
              <div className="col-md-5">
                <span>:&nbsp;&nbsp;&nbsp;{meetStartTime}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {clearForm && (
        <div className="row">
          <div className="col-md-12 d-flex justify-content-center ">
            <ClearForm
              message="Zoom Meeting Created Successfully!"
              redirectPath="/arbdashboard"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ZoomMeetings;
