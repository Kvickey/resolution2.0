import React, { useState, useRef } from 'react';
import './FileUploadForm.css';

function FileUploadForm() {
  const [comment, setComment] = useState('');
  const [videos, setVideos] = useState([]);
  const [files, setFiles] = useState([]);

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
    if (type === 'file') {
      setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    } else if (type === 'video') {
      setVideos((prevVideos) => prevVideos.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create a new FormData object
    const formData = new FormData();
  
    // Append comment
    formData.append('comment', comment);
  
    // Append all videos
    videos.forEach((video, index) => {
      formData.append(`videos[${index}]`, video);
    });
  
    // Append all PDF files
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });
  
    // Convert FormData to object for logging (optional)
    const formDataObj = {};
    formData.forEach((value, key) => {
      formDataObj[key] = value;
    });
    console.log('FormData Object:', formDataObj);
  
    try {
      // Upload to your backend API
      const response = await fetch(
        `https://api.resolutionexperts.in/api/FirstHearing?Case_id=13&Comment=${encodeURIComponent(comment)}`,
        {
          method: 'POST',
          body: formData,
        }
      );
  
      if (response.ok) {
        alert('Files uploaded successfully!');
      } else {
        alert('Failed to upload files.');
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  
    // Optionally, you can reset the form after submission
    // setComment('');
    // setVideos([]);
    // setFiles([]);
  };
  

  // const handleSubmit = async(e) => {
  //   e.preventDefault();
  //   console.log('Comment:', comment);
  //   console.log('Videos:', videos);
  //   console.log('Files:', files);
  //    const url = 'http://localhost:3000/uploadFile'
  //   // Handle the form submission logic
  //   const FileForUpload = {...videos ,...files}
  //   console.log(FileForUpload);
  
  //   const formData = new FormData();
  //   formData.append('video', videos[0]);
  //   // formData.append('video', videos);
  //   // formData.append('Files', files[0]);
  //   // formData.append('Files', files[1]);
  //   // formData.append('Files', files[2]);
  
  //   // Convert FormData to object and log it
  //   const formDataObj = {};
  //   formData.forEach((value, key) => {
  //     formDataObj[key] = value;
  //   });
  //   console.log('FormData Object:', formDataObj);

  //   try {
  //     // Upload to your backend API
  //     const response = await fetch(`https://api.resolutionexperts.in/api/FirstHearing?Case_id=13&Comment=this is a test data`, {
  //       method: 'POST',
  //       body: formData,
  //     });

  //     if (response.ok) {
  //       alert('Video uploaded successfully!');
  //     } else {
  //       alert('Failed to upload video.');
  //     }
  //   } catch (error) {
  //     console.error('Error uploading video:', error);
  //   }

  //   // window.location.reload();
  // };
  

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label htmlFor="comment" className="form-label">
          Add Comment
        </label>
        <textarea
          id="comment"
          rows="4"
          className="textarea"
          placeholder="Write your comment here..."
          value={comment}
          onChange={handleCommentChange}
        ></textarea>
      </div>

      <div className="form-group flex-container">
        <label htmlFor="videoUpload" className="form-label">
          Upload Videos
        </label>
        <button
          type="button"
        //   className="upload-button"
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

      {videos.length > 0 && (
        <div className="file-list">
          {/* <h4>Selected Videos:</h4> */}
          <ul>
            {videos.map((video, index) => (
              <li key={index} className="file-item">
                <span>{video.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index, 'video')}
                  className="remove-button"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="form-group flex-container">
        <label htmlFor="fileUpload" className="form-label">
          Upload PDF Files
        </label>
        <button
          type="button"
        //   className="upload-button"
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

      {files.length > 0 && (
        <div className="file-list">
          {/* <h4>Selected PDF Files:</h4> */}
          <ul>
            {files.map((file, index) => (
              <li key={index} className="file-item">
                <span>{file.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index, 'file')}
                  className="remove-button"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="submit"
        className="submit-button"
      >
        Save Details
      </button>
    </form>
  );
}

export default FileUploadForm;
