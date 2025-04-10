import React, { useState, useRef } from "react";
import "./FileUploadForm.css";
import { MdDeleteForever } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import DatePicker from "react-datepicker";

function FileUploadForm({ onCompletion }) {
  const [comment, setComment] = useState("");
  const [videos, setVideos] = useState([]);
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState({}); // Track upload progress
  const [selectedDate, setSelectedDate] = useState(null);
  const [formattedDate, setFormattedDate] = useState(null);

  const videoInputRef = useRef(null);
  const fileInputRef = useRef(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("comment", comment);

    // Append videos to formData
    videos.forEach((video, index) => {
      formData.append(`videos[${index}]`, video);
    });

    // Append files to formData
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    // Upload each file with progress tracking
    [...videos, ...files].forEach((file, index) => {
      uploadFileWithProgress(file, index);
    });
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


  // Function to upload each file with progress tracking
  const uploadFileWithProgress = (file, index) => {
    const xhr = new XMLHttpRequest();
    const url = `https://api.resolutionexperts.in/api/FirstHearing?Case_id=13&Comment=${encodeURIComponent(
      comment)}&SecondHearingDate=${encodeURIComponent(formattedDate)}`;
    xhr.open("POST", url, true);

    // Create a new FormData for each file
    const formData = new FormData();
    formData.append(file.type.startsWith("video") ? "video" : "file", file);

    // Track the progress of the upload
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percentComplete = Math.round((e.loaded / e.total) * 100);
        setProgress((prevProgress) => ({
          ...prevProgress,
          [index]: percentComplete,
        }));
      }
    };

    // Handle upload completion
    xhr.onload = () => {
      if (xhr.status === 200) {
        alert(`${file.name} uploaded successfully!`);
        // toast.success(`${file.name} Uploaded successfully!`);
        // setTimeout(() => {

        // }, 2000);
        onCompletion();
        setComment("");
        setVideos([]);
        setFiles([]);
        setProgress({});

        // Reset the input fields
        videoInputRef.current.value = null;
        fileInputRef.current.value = null;
      } else {
        alert(`Failed to upload ${file.name}.`);
      }
    };

    // Handle upload error
    xhr.onerror = () => {
      alert(`Error uploading ${file.name}.`);
    };

    // Send the form data
    xhr.send(formData);
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form-container p-5">
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
              <button
                type="button"
                className="custBtn"
                onClick={() => videoInputRef.current.click()}
              >
                Add Videos
              </button>
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
              <button
                type="button"
                className="custBtn"
                onClick={() => fileInputRef.current.click()}
              >
                Add PDF Files
              </button>
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
          <div className="col-md-4">
            <label htmlFor="datePicker" className="form-label">
              Second Hearing Date :-
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
        </div>

        <button type="submit" className="submit-button">
          Save Details
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default FileUploadForm;
