import React, { useEffect, useState } from "react";
import { Button, Form, Pagination, Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { API_BASE_URL } from "../../utils/constants";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ReusableTable from "../../components/ReusableTable";
import ClearForm from "../../components/Clearform";
import LoadingSpinner from "../../components/LoadingSpinner";

const VirtualMeetModalForTH = ({
  appointments,
  accessToken,
  refreshToken,
  arbId,
  setShowSecondModal,
}) => {
  const [records, setRecords] = useState([]);
  const [selectedDate3, setSelectedDate3] = useState(null);
  const [date3, setDate3] = useState(null);
  const [startTimeBulk, setStartTimeBulk] = useState("");
  const [endTimeBulk, setEndTimeBulk] = useState("");
  const [timeDifference, setTimeDifference] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [distRecords, setDistRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [zoomMeet, setZoomMeet] = useState(false);
  const [joinUrl, setJoinUrl] = useState("");
  const [custZoomId, setCustZoomId] = useState("");
  const [custPassword, setCustPassword] = useState("");
  const [custStartTime, setCustStartTime] = useState("");
  const [showDistributed, setShowDistributed] = useState(false);
  const [meeting, setMeeting] = useState([]);

  // const [meetStartTime, setMeetStartTime] = useState("");
  // const [zoomId, setZoomId] = useState("");
  // const [password, setPassword] = useState("");
  const [meetingId, setMeetingId] = useState(null);

  const [showSelectModal, setShowSelectModal] = useState(false);
  const [closeSelectModal, setCloseSelectModal] = useState(false);

  //   for pagination of reusable table starts
  const [currentPage1, setCurrentPage1] = useState(1); // Current page for ReusableTable
  const totalItems1 = distRecords.length;
  const totalPages1 = Math.ceil(totalItems1 / itemsPerPage);
  const startIndex1 = (currentPage1 - 1) * itemsPerPage;
  const currentItems1 = distRecords.slice(
    startIndex1,
    startIndex1 + itemsPerPage
  );
  const pageNumbers1 = Array.from({ length: totalPages1 }, (_, i) => i + 1);
  //   for pagination of reusable table ends

  const [clearForm, setClearForm] = useState(false);

  useEffect(() => {
    setRecords(appointments);
  }, [appointments]);

  // console.log(accessToken);

  // To get the access Meeting start here
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
        setMeeting(parsedAccessTokenArray);
        // console.log(parsedAccessTokenArray);
      } catch (error) {
        // setError1(error.message);
      }
    };

    fetchAccessToken();
  }, [arbId]);

  // console.log(meeting);

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
  //   console.log(date3);

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
  //   console.log(timeDifference);
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

  // Pagination For the Main Table Starts Here
  const headers = records.length > 0 ? Object.keys(records[0]) : [];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  //   const currentItems = 1;
  const currentItems = records.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(records.length / itemsPerPage);

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

  // To distribute records starts here
  const distributeRecords = () => {
    if (
      !startTimeBulk ||
      !endTimeBulk ||
      // !selectedDate3 ||
      timeDifference <= 0 ||
      appointments.length === 0
    ) {
      setErrorMessage("All fields are required and must be valid.");
      setDistRecords([]);
      return;
    }

    const formattedDateTime = formatDateTime(selectedDate3, startTimeBulk);

    // console.log(startTimeBulk);
    // console.log(endTimeBulk);

    const totalRecords = appointments.length;
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
    const formattedDate = format(custStartTime, "MM-dd-yyyy");

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
            ...appointments[recordIndex],
            Hearing_date: formattedDate,
            Hearing_time_From: formattedStartTime,
            Hearing_time_To: formattedEndTime,
            Video_link: joinUrl,
            Link_ID: custZoomId,
            Password: custPassword,
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
            ...appointments[recordIndex],
            Hearing_date: formattedDate,
            Hearing_time_From: formattedStartTime,
            Hearing_time_To: formattedEndTime,
            Video_link: joinUrl,
            Link_ID: custZoomId,
            Password: custPassword,
          });
          assignedRecordsCount++;
        }
      }
    }

    if (assignedRecordsCount < totalRecords) {
      const remainingRecordsCount = totalRecords - assignedRecordsCount;
      const lastSlotStartTime =
        distributed[distributed.length - 1]?.Virtual_Hearing_Time_From ||
        startTimeBulk;
      const lastSlotEndTime =
        distributed[distributed.length - 1]?.Virtual_Hearing_Time_To ||
        endTimeBulk;

      for (let i = 0; i < remainingRecordsCount; i++) {
        const recordIndex = assignedRecordsCount + i;

        distributed.push({
          ...records[recordIndex],
          Hearing_date: formattedDate,
          Hearing_time_From: lastSlotStartTime,
          Hearing_time_To: lastSlotEndTime,
          Video_link: joinUrl,
          Link_ID: custZoomId,
          Password: custPassword,
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
    console.log(showDistributed);
    
  // To distribute records starts here

  if (loading) return <LoadingSpinner />;

  // function for bulk second date assign starts here
  const handleBulkSecHearing = async () => {
    // console.log(distRecords);
    const dataForAssign = distRecords.map((item) => ({
      Case_id: item.Case_id,
      Reference_No: item.Reference_No,
      Cust_name: item.Cust_name,
      Second_Hearing_date: item.Hearing_date,
      Second_Hearing_time_From: item.Hearing_time_From,
      Second_Hearing_time_To: item.Hearing_time_To,
      Video_link: item.Video_link,
      Link_ID: item.Link_ID,
      Password: item.Password,
      Meeting_No: 2,
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
  // function for bulk second date assign Ends here

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
    setCustStartTime(record.Date);
    setJoinUrl(record.Link);
    setShowSelectModal(false);
    setZoomMeet(true);
  };

  // console.log(custStartTime);
  

  // Pagination For the Main Table Starts Here
  const headers1 = meeting.length > 0 ? Object.keys(meeting[0]) : [];

  console.log(headers1);

  const indexOfLastItem1 = currentPage * itemsPerPage;
  const indexOfFirstItem1 = indexOfLastItem1 - itemsPerPage;

  const today = new Date();
  const upcomingMeetings = meeting.filter(
    (item) => new Date(item.Date) > today
  );
  //   const currentItems = 1;
  const currentItems3 = upcomingMeetings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // console.log(currentItems3);

  const totalPages3 = Math.ceil(upcomingMeetings.length / itemsPerPage);

  const totalPagesToShow1 = 5; // Maximum number of page buttons to show

  const generatePaginationItems1 = () => {
    const items = [];
    const pageWindow = 5;
    let startPage = Math.max(currentPage1 - Math.floor(pageWindow / 2), 1);
    let endPage = startPage + pageWindow - 1;

    if (endPage > totalPages3) {
      endPage = totalPages3;
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
    <div className="container">
      {!zoomMeet && !clearForm && (
        <div className="row mt-3">
          {/* the date picker */}
          {/* <div className="col-md-3">
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
          </div> */}

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

          <div className="col-md-3"></div>

          {/* button Goes here */}
          <div className="col-md-3">
            <Button className="custBtn" onClick={handleSelectZoomMeet}>
              Select Zoom Meet
            </Button>
            {/* <Button className="custBtn" onClick={handleZoomMeet}>
              Create Zoom Meeting
            </Button> */}
          </div>
        </div>
      )}

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

          {totalPages3 > 1 && (
            <Pagination className="justify-content-center">
              <Pagination.Prev
                onClick={() =>
                  setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
                }
              />
              {generatePaginationItems1()}
              <Pagination.Next
                onClick={() =>
                  setCurrentPage((prev) =>
                    prev < totalPages ? prev + 1 : prev
                  )
                }
              />
            </Pagination>
          )}
        </Modal.Body>
      </Modal>
      {/*Modal ends here */}

      {zoomMeet && !showDistributed && !clearForm && (
        <div className="row">
          <div className="col-md-9"></div>
          <div className="col-md-3">
            <Button className="custBtn" onClick={distributeRecords}>
              Assign Time
            </Button>
          </div>
        </div>
      )}

      {!showDistributed && !clearForm && (
        <div className="row mt-3">
          <div className="col-md-12">
            <div className="table-responsive">
              {currentItems.length > 0 && (
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
      )}

      {showDistributed && !clearForm && (
        <>
          <div className="row">
            <div className="col-md-9"></div>
            <div className="col-md-3">
              <Button className="custBtn" onClick={handleBulkSecHearing}>
                Assign
              </Button>
            </div>
          </div>
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
        </>
      )}

      {clearForm && (
        <div className="row">
          <div className="col-md-12 d-flex justify-content-center ">
            <ClearForm
              message="Third Hearing Date In Bulk Assigned Successfully!"
              redirectPath="/arbdashboard"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualMeetModalForTH;
