import React, { useState } from "react";
import axios from "axios";

export default function Home() {
  const [file, setFile] = useState(null);

  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file to upload");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      formData.append("type", "student");
      const response = await axios.post(
        "http://localhost:5000/admin/upload",
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
      console.log(error);
      alert("File upload failed");
    }
  };
  return (
    <div className="dev-container">
      <input
        type="file"
        id="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button type="button" onClick={() => handleFileUpload()}>
        Upload
      </button>
    </div>
  );
}
