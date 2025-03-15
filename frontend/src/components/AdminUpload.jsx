import React, { useState } from "react";
import axios from "axios";

export default function AdminUpload() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [file3, setFile3] = useState(null);

  const handleFileChange = (event, setFile) => {
    setFile(event.target.files[0]);
  };

  const uploadFile = async (file, endpoint) => {
    if (!file) {
      alert("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", endpoint);

    try {
      const response = await axios.post(
        "http://localhost:5000/admin/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      alert(response.data.message || "File uploaded successfully.");
    } catch (error) {
      alert(
        "Error uploading file: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="container">
      <h2 className="title">Admin Uploads</h2>
      <div className="upload-section">
        <label>Student</label>
        <input type="file" onChange={(e) => handleFileChange(e, setFile1)} />
        <button className="btn" onClick={() => uploadFile(file1, "student")}>
          Upload Student File
        </button>
      </div>
      <div className="upload-section">
        <label>Mentor</label>
        <input type="file" onChange={(e) => handleFileChange(e, setFile2)} />
        <button className="btn" onClick={() => uploadFile(file2, "mentor")}>
          Upload Mentor File
        </button>
      </div>
      <div className="upload-section">
        <label>Project Bank</label>
        <input type="file" onChange={(e) => handleFileChange(e, setFile3)} />
        <button className="btn" onClick={() => uploadFile(file3, "project")}>
          Upload Project File
        </button>
      </div>
    </div>
  );
}
