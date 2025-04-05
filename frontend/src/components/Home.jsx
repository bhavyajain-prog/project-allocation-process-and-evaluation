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
    <div className="max-w-xl mx-auto mt-12 p-8 bg-white shadow-lg rounded-2xl space-y-6">
  <div className="flex justify-between items-center">
    <button
      className="bg-red-500 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
      onClick={logout}
    >
      Logout
    </button>
    <div className="flex space-x-4">
      <Link
        to="/admin-dashboard"
        className="text-teal-500 hover:underline font-medium"
      >
        Admin
      </Link>
      <Link
        to="/mentor-dashboard"
        className="text-teal-500 hover:underline font-medium"
      >
        Mentor
      </Link>
      <Link
        to="/student-dashboard"
        className="text-teal-500 hover:underline font-medium"
      >
        Student
      </Link>
    </div>
  </div>

  <div>
    <label
      htmlFor="file"
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      Upload CSV File 1
    </label>
    <input
      type="file"
      id="file"
      accept=".csv"
      onChange={(e) => setFile(e.target.files[0])}
      className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-100 file:text-teal-700 hover:file:bg-teal-200 cursor-pointer"
    />
  </div>

  <div>
    <label
      htmlFor="file2"
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      Upload CSV File 2
    </label>
    <input
      type="file"
      id="file2"
      accept=".csv"
      onChange={(e) => setFile(e.target.files[0])}
      className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-100 file:text-teal-700 hover:file:bg-teal-200 cursor-pointer"
    />
  </div>

  <button
    type="button"
    onClick={handleFileUpload}
    className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
  >
    Upload
  </button>
</div>

  );
}
