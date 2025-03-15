import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home({ loggedOut }) {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file to upload");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/mentor/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        alert("File uploaded successfully");
      }
    } catch (error) {
      alert("File upload failed");
    }
  };

  const logout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/logout",
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        localStorage.removeItem("role");
        await loggedOut();
        navigate("/login");
      }
    } catch (error) {}
  };
  return (
    <div className="container">
      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
      <Link to="/admin-dashboard" className="redirect-lnk">
        Admin
      </Link>
      <Link to="/mentor-dashboard" className="redirect-lnk">
        Mentor
      </Link>
      <Link to="/student-dashboard" className="redirect-lnk">
        Student
      </Link>
      <br />
      <br />
      <input
        type="file"
        id="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <input
        type="file"
        id="file2"
        accept=".csv"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button type="button" onClick={() => handleFileUpload()}>
        Upload
      </button>
    </div>
  );
}
