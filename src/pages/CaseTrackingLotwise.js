import React, { useState } from "react";

const CaseTrackingLotWise = () => {
  const [meetingDetails, setMeetingDetails] = useState({
    topic: "",
    start_time: "",
    duration: "",
    agenda: "",
  });

  // Replace with your actual Zoom OAuth access token during testing
  const accessToken =
 "eyJzdiI6IjAwMDAwMiIsImFsZyI6IkhTNTEyIiwidiI6IjIuMCIsImtpZCI6IjZkNmFiMmYyLTFkYWItNGZkZi1iMDRlLWIxODA3MDU4NTI3ZSJ9.eyJ2ZXIiOjEwLCJhdWlkIjoiYTYyYTg4NWUxMTkyNzFkMWM5NmU4ZGQ4NzllY2I2MGE0MDZmOTMzNjE2MmM2MjY0NGFkMmVjY2UwNDIwNGIxNSIsImNvZGUiOiJxRG5MNzBwOEFtdTFWSERGMFowU2hhMG1ESjNoUzJlcmciLCJpc3MiOiJ6bTpjaWQ6RnB4TEVCSGJSVWlQdnFhTWNOWGx6ZyIsImdubyI6MCwidHlwZSI6MCwidGlkIjowLCJhdWQiOiJodHRwczovL29hdXRoLnpvb20udXMiLCJ1aWQiOiJTNnZlRjZDZFN2R28yNG1FUnQ3WjRnIiwibmJmIjoxNzM5NDM4NTA0LCJleHAiOjE3Mzk0NDIxMDQsImlhdCI6MTczOTQzODUwNCwiYWlkIjoiSmZHYjdzSjVTOUd5dWE4TndWWTVyQSJ9.PN8kAIS_CETKWpuPEeOwhWS5tNCpMiRkdA7k5Sw5AhaR3aHbTbN0eMZ4BrbQfGVj0fEhNcVG9IfYisHIvEWqzQ"


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMeetingDetails({ ...meetingDetails, [name]: value });
  };

  const createZoomMeeting = async () => {
    if (!accessToken) {
      alert("Access token is missing. Please configure it.");
      return;
    }

    try {
      const response = await fetch("https://api.zoom.us/v2", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meetingDetails,
        }),
      });

      if (!response) {
        alert("Request sent, but no response .");
        return;
      }

      console.log(
        "Response sent, but you won't see detailed response due to 'no-cors'."
      );
    } catch (error) {
      console.error("Error creating Zoom meeting:", error);
    }
  };

  return (
    <div>
      <h2>Create Zoom Meeting</h2>
      <form>
        <div>
          <label>Topic: </label>
          <input
            type="text"
            name="topic"
            value={meetingDetails.topic}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Start Time: </label>
          <input
            type="datetime-local"
            name="start_time"
            value={meetingDetails.start_time}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Duration (in minutes): </label>
          <input
            type="number"
            name="duration"
            value={meetingDetails.duration}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Agenda: </label>
          <input
            type="text"
            name="agenda"
            value={meetingDetails.agenda}
            onChange={handleInputChange}
          />
        </div>
        <button type="button" onClick={createZoomMeeting}>
          Create Meeting
        </button>
      </form>
    </div>
  );
};

export default CaseTrackingLotWise;
